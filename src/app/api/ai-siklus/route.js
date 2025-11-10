import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { type, data, date } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";

    if (type === "daily_insight") {
      prompt = `
        Sebagai AI asisten kesehatan remaja perempuan, berikan insight harian yang ramah, edukatif, dan mendukung berdasarkan data berikut:
        
        Tanggal: ${date}
        Status Menstruasi: ${data.isPeriod ? `Ya (${data.flowLevel})` : "Tidak"}
        Gejala: ${data.gejala.join(", ") || "Tidak ada"}
        Mood: ${data.mood}
        Level Energi: ${data.levelEnergy}
        Cerita: ${data.cerita || "Tidak ada cerita"}
        
        Berikan insight dalam 1-2 kalimat yang:
        1. Bertindak seperti sahabat dekat remaja perempuan
        2. Gunakan kata "kamu" bukan "Anda" agar terasa akrab
        3. Edukatif tentang siklus menstruasi
        4. Memberikan tips praktis dengan bahasa santai
        5. Gunakan emoji yang sesuai untuk remaja
        
        Contoh tone: "Mood swing saat menstruasi itu normal banget! Coba minum air hangat dan istirahat yang cukup ya 💕"
      `;
    } else if (type === "phase_analysis") {
      const sortedEntries = Object.entries(data.dailyNotes)
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .slice(0, 10); // Ambil 10 hari terakhir

      const recentPeriodDays = sortedEntries.filter(
        ([_, note]) => note && note.isPeriod
      ).length;
      const lastPeriodDate = sortedEntries.find(
        ([_, note]) => note && note.isPeriod
      )?.[0];
      const daysSinceLastPeriod = lastPeriodDate
        ? Math.floor(
            (new Date() - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24)
          )
        : null;

      prompt = `
        Analisis siklus menstruasi berdasarkan data 10 hari terakhir:
        
        ${sortedEntries
          .map(
            ([date, note]) =>
              `${date}: ${
                note
                  ? (note.isPeriod ? "Menstruasi" : "Tidak menstruasi") +
                    ", mood: " +
                    note.mood
                  : "Tidak ada data"
              }`
          )
          .join("\n")}
        
        Informasi tambahan:
        - Hari menstruasi dalam 10 hari terakhir: ${recentPeriodDays}
        - Hari terakhir menstruasi: ${lastPeriodDate || "Tidak ada data"}
        - Hari sejak menstruasi terakhir: ${
          daysSinceLastPeriod || "Tidak diketahui"
        }
        
        Tentukan fase siklus saat ini berdasarkan logika:
        - Jika sedang menstruasi (hari 1-7): "menstruasi"
        - Jika 1-6 hari setelah menstruasi selesai: "folikular" 
        - Jika 12-16 hari setelah menstruasi terakhir: "ovulasi"
        - Jika 17-28 hari setelah menstruasi terakhir: "luteal"
        - Jika tidak ada data menstruasi: "unknown"
        
        Artikel tersedia:
        - menstruasi: [3, 7] - tentang menstruasi dan perawatan
        - folikular: [10] - tentang fase folikular dan energi
        - ovulasi: [9] - tentang fase ovulasi dan kesuburan
        - luteal: [8] - tentang fase luteal dan PMS
        - unknown: [3, 6, 10] - artikel umum kesehatan reproduksi
        
        Berikan respons JSON:
        {
          "phase": "fase_yang_terdeteksi",
          "insight": "insight 1-2 kalimat dengan tone sahabat dekat (gunakan 'kamu', bukan 'Anda')",
          "recommendedArticles": [array_id_sesuai_fase]
        }
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (type === "daily_insight") {
      return NextResponse.json({ insight: text.trim() });
    } else if (type === "phase_analysis") {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisResult = JSON.parse(jsonMatch[0]);
          return NextResponse.json(analysisResult);
        } else {
          // Fallback berdasarkan data yang ada
          const hasRecentPeriod = Object.values(data.dailyNotes || {}).some(
            (note) => note && note.isPeriod
          );

          return NextResponse.json({
            phase: hasRecentPeriod ? "menstruasi" : "unknown",
            insight: hasRecentPeriod
              ? "Kamu sedang dalam fase menstruasi. Jaga kesehatan dan istirahat yang cukup ya!"
              : "Terus catat siklus menstruasimu untuk analisis yang lebih akurat!",
            recommendedArticles: hasRecentPeriod ? [3, 7] : [3, 6, 10],
          });
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);

        // Fallback dengan analisis sederhana
        const notes = Object.values(data.dailyNotes || {}).filter(
          (note) => note
        );
        const recentPeriod = notes.find((note) => note.isPeriod);

        if (recentPeriod) {
          return NextResponse.json({
            phase: "menstruasi",
            insight:
              "Kamu sedang dalam fase menstruasi. Jaga kesehatan dan istirahat yang cukup!",
            recommendedArticles: [3, 7],
          });
        } else {
          return NextResponse.json({
            phase: "folikular",
            insight:
              "Fase folikular adalah waktu yang tepat untuk memulai aktivitas baru!",
            recommendedArticles: [10, 6],
          });
        }
      }
    }
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis data" },
      { status: 500 }
    );
  }
}
