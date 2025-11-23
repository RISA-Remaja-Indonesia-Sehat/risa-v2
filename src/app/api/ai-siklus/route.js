import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to parse gejala safely
const parseGejala = (gejala) => {
  if (Array.isArray(gejala)) return gejala;
  if (typeof gejala === "string") {
    try {
      return JSON.parse(gejala);
    } catch {
      return [];
    }
  }
  return [];
};

// Article mapping by phase
const articlesByPhase = {
  menstruasi: [3, 7],
  folikular: [10],
  ovulasi: [9],
  luteal: [8],
  unknown: [3, 5, 10],
};

export async function POST(request) {
  try {
    const { type, data, date } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";

    if (type === "daily_insight") {
      const sortedEntries = Object.entries(data.dailyNotes || {})
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .slice(0, 60);

      const lastPeriodDate = sortedEntries.find(
        ([_, note]) => note && note.isPeriod
      )?.[0];
      const daysSinceLastPeriod = lastPeriodDate
        ? Math.floor(
            (new Date() - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24)
          )
        : null;

      const periodCount = sortedEntries.filter(
        ([_, note]) => note && note.isPeriod
      ).length;

      const gejalaList = parseGejala(data.gejala);

      // Tentukan fase berdasarkan data
      let currentPhase = "unknown";
      if (data.isPeriod) {
        currentPhase = "menstruasi";
      } else if (daysSinceLastPeriod !== null) {
        if (daysSinceLastPeriod <= 6) currentPhase = "folikular";
        else if (daysSinceLastPeriod >= 12 && daysSinceLastPeriod <= 16)
          currentPhase = "ovulasi";
        else if (daysSinceLastPeriod >= 17 && daysSinceLastPeriod <= 28)
          currentPhase = "luteal";
      }

      prompt = `
        Sebagai dokter kandungan yang perhatian dan profesional, berikan rekomendasi kesehatan harian untuk remaja perempuan berdasarkan data berikut:
        
        Tanggal: ${date}
        Fase Siklus: ${currentPhase}
        Status Menstruasi: ${data.isPeriod ? `Ya (${data.flowLevel})` : "Tidak"}
        Gejala: ${gejalaList.join(", ") || "Tidak ada"}
        Mood: ${data.mood || "Tidak ada"}
        Level Energi: ${data.levelEnergy || "Tidak ada"}
        Cerita: ${data.cerita || "Tidak ada cerita"}
        
        Berikan respons JSON dengan struktur:
        {
          "insight": "insight personal 2-3 kalimat dengan tone sahabat dekat (gunakan 'kamu')",
          "activities": ["aktivitas 1 sesuai fase", "aktivitas 2 sesuai fase", "aktivitas 3 sesuai fase"],
          "foods": ["makanan 1 sesuai fase", "makanan 2 sesuai fase", "makanan 3 sesuai fase"],
          "symptomTips": "tips detail menghadapi gejala spesifik yang dialami user (3-4 kalimat)"
        }
        
        PENTING: Rekomendasi HARUS sesuai dengan fase siklus ${currentPhase}:
        
        Jika fase MENSTRUASI:
        - Activities: istirahat, yoga ringan, meditasi, jalan santai, membaca, menonton film favorit
        - Foods: daging merah, telur, kacang-kacangan, sayuran hijau, cokelat, buah-buahan kaya zat besi
        - Tips: Fokus pada istirahat dan self-care. Hindari olahraga berat. Minum air hangat dan gunakan bantal pemanas untuk nyeri. Konsumsi makanan kaya zat besi untuk mengganti darah yang hilang.
        
        Jika fase FOLIKULAR:
        - Activities: olahraga intensif, lari, gym, aktivitas sosial, belajar hal baru, eksperimen
        - Foods: buah-buahan segar, sayuran berwarna, biji-bijian, ikan, protein tinggi
        - Tips: Manfaatkan energi tinggimu di fase ini! Ini waktu terbaik untuk olahraga intensif dan aktivitas sosial. Konsumsi makanan bergizi untuk mendukung energimu.
        
        Jika fase OVULASI:
        - Activities: networking, presentasi, aktivitas yang butuh energi tinggi, olahraga, meeting penting
        - Foods: protein tinggi, sayuran berwarna, ikan, telur, kacang-kacangan
        - Tips: Energimu sedang puncak! Ini waktu terbaik untuk hal-hal penting seperti presentasi atau meeting. Tetap terhidrasi dan konsumsi protein cukup untuk performa maksimal.
        
        Jika fase LUTEAL:
        - Activities: self-care, yoga, meditasi, aktivitas tenang, refleksi diri, journaling, tidur lebih awal
        - Foods: karbohidrat kompleks, makanan kaya magnesium, omega-3, cokelat, kacang-kacangan
        - Tips: Fase ini adalah waktu untuk self-care dan introspeksi. Energimu mulai menurun, jadi prioritaskan istirahat. Konsumsi makanan kaya magnesium untuk mengurangi PMS.
        
        Jika fase UNKNOWN:
        - Activities: aktivitas ringan, jalan santai, yoga, meditasi
        - Foods: makanan sehat seimbang, buah-buahan, sayuran, protein
        - Tips: Terus catat siklus menstruasimu agar kami bisa memberikan rekomendasi yang lebih akurat. Setiap fase memiliki kebutuhan berbeda.
      `;
    } else if (type === "phase_analysis") {
      const sortedEntries = Object.entries(data.dailyNotes || {})
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .slice(0, 60);

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

      let currentPeriodStart = null;
      let periodCount = 0;

      sortedEntries.reverse().forEach(([date, note]) => {
        if (note && note.isPeriod) {
          if (!currentPeriodStart) {
            currentPeriodStart = date;
            periodCount++;
          }
        } else {
          currentPeriodStart = null;
        }
      });

      const gejalaList = parseGejala(data.gejala);

      // Tentukan fase untuk rekomendasi artikel
      let currentPhase = "unknown";
      if (daysSinceLastPeriod !== null) {
        if (daysSinceLastPeriod <= 7) currentPhase = "menstruasi";
        else if (daysSinceLastPeriod <= 6) currentPhase = "folikular";
        else if (daysSinceLastPeriod >= 12 && daysSinceLastPeriod <= 16)
          currentPhase = "ovulasi";
        else if (daysSinceLastPeriod >= 17 && daysSinceLastPeriod <= 28)
          currentPhase = "luteal";
      }

      prompt = `
        Analisis siklus menstruasi berdasarkan data 60 hari terakhir:
        
        Informasi:
        - Hari menstruasi dalam 60 hari terakhir: ${recentPeriodDays}
        - Hari terakhir menstruasi: ${lastPeriodDate || "Tidak ada data"}
        - Hari sejak menstruasi terakhir: ${daysSinceLastPeriod || "Tidak diketahui"}
        - Gejala saat ini: ${gejalaList.join(", ") || "Tidak ada"}
        - Mood: ${data.mood || "Tidak ada"}
        - Level Energi: ${data.levelEnergy || "Tidak ada"}
        
        Tentukan fase siklus saat ini:
        - Jika sedang menstruasi (hari 1-7): "menstruasi"
        - Jika 1-6 hari setelah menstruasi selesai: "folikular" 
        - Jika 12-16 hari setelah menstruasi terakhir: "ovulasi"
        - Jika 17-28 hari setelah menstruasi terakhir: "luteal"
        - Jika tidak ada data menstruasi: "unknown"
        
        Berikan respons JSON dengan struktur:
        {
          "phase": "fase_yang_terdeteksi",
          "insight": "insight dengan tone sahabat dekat (gunakan 'kamu', bukan 'Anda')",
          "activities": ["kegiatan 1", "kegiatan 2", "kegiatan 3"],
          "foods": ["makanan 1", "makanan 2", "makanan 3"],
          "symptomTips": "tips menghadapi gejala yang dialami"
        }
        
        Rekomendasi berdasarkan fase:
        - Menstruasi: istirahat, yoga ringan, hindari olahraga berat
        - Folikular: olahraga intensif, aktivitas sosial, eksperimen baru
        - Ovulasi: networking, presentasi, aktivitas yang butuh energi tinggi
        - Luteal: self-care, aktivitas tenang, refleksi diri
        
        Makanan berdasarkan fase:
        - Menstruasi: daging merah, cokelat, kacang-kacangan, sayuran hijau
        - Folikular: buah-buahan segar, sayuran, biji-bijian
        - Ovulasi: protein tinggi, sayuran berwarna, ikan
        - Luteal: karbohidrat kompleks, magnesium, omega-3
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (type === "daily_insight") {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const dailyResult = JSON.parse(jsonMatch[0]);
          const sortedEntries = Object.entries(data.dailyNotes || {})
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .slice(0, 60);

          const lastPeriodDate = sortedEntries.find(
            ([_, note]) => note && note.isPeriod
          )?.[0];
          const daysSinceLastPeriod = lastPeriodDate
            ? Math.floor(
                (new Date() - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24)
              )
            : null;

          const periodCount = sortedEntries.filter(
            ([_, note]) => note && note.isPeriod
          ).length;

          const gejalaList = parseGejala(data.gejala);

          const needsConsultation =
            (daysSinceLastPeriod && daysSinceLastPeriod > 60) ||
            periodCount > 2 ||
            (gejalaList &&
              (gejalaList.includes("Pendarahan berat") ||
                gejalaList.includes("Nyeri parah") ||
                gejalaList.includes("Pusing berat")));

          return NextResponse.json({
            ...dailyResult,
            needsConsultation,
            consultationReason:
              daysSinceLastPeriod && daysSinceLastPeriod > 60
                ? "Tidak haid selama 2 bulan"
                : periodCount > 2
                ? "Menstruasi lebih dari 2 kali dalam 2 bulan"
                : gejalaList &&
                  (gejalaList.includes("Pendarahan berat") ||
                    gejalaList.includes("Nyeri parah") ||
                    gejalaList.includes("Pusing berat"))
                ? "Gejala yang memerlukan perhatian medis"
                : null,
          });
        } else {
          return NextResponse.json({
            insight: text.trim(),
            activities: data.isPeriod
              ? ["Istirahat", "Yoga ringan", "Membaca"]
              : ["Olahraga", "Aktivitas sosial", "Eksperimen baru"],
            foods: data.isPeriod
              ? ["Daging merah", "Cokelat", "Sayuran hijau"]
              : ["Buah segar", "Sayuran", "Biji-bijian"],
            symptomTips:
              "Dengarkan tubuhmu dan berikan yang terbaik untuk diri sendiri",
            needsConsultation: false,
          });
        }
      } catch (parseError) {
        return NextResponse.json({
          insight: text.trim(),
          activities: data.isPeriod
            ? ["Istirahat", "Yoga ringan", "Membaca"]
            : ["Olahraga", "Aktivitas sosial", "Eksperimen baru"],
          foods: data.isPeriod
            ? ["Daging merah", "Cokelat", "Sayuran hijau"]
            : ["Buah segar", "Sayuran", "Biji-bijian"],
          symptomTips:
            "Dengarkan tubuhmu dan berikan yang terbaik untuk diri sendiri",
          needsConsultation: false,
        });
      }
    } else if (type === "phase_analysis") {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisResult = JSON.parse(jsonMatch[0]);

          const sortedEntries = Object.entries(data.dailyNotes || {})
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .slice(0, 60);

          const lastPeriodDate = sortedEntries.find(
            ([_, note]) => note && note.isPeriod
          )?.[0];
          const daysSinceLastPeriod = lastPeriodDate
            ? Math.floor(
                (new Date() - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24)
              )
            : null;

          const periodCount = sortedEntries.filter(
            ([_, note]) => note && note.isPeriod
          ).length;

          const gejalaList = parseGejala(data.gejala);

          const needsConsultation =
            (daysSinceLastPeriod && daysSinceLastPeriod > 60) ||
            periodCount > 2 ||
            (gejalaList &&
              (gejalaList.includes("Pendarahan berat") ||
                gejalaList.includes("Nyeri parah") ||
                gejalaList.includes("Pusing berat")));

          // Get recommended articles based on phase
          const recommendedArticles =
            articlesByPhase[analysisResult.phase] || articlesByPhase.unknown;

          return NextResponse.json({
            ...analysisResult,
            recommendedArticles,
            needsConsultation,
            consultationReason:
              daysSinceLastPeriod && daysSinceLastPeriod > 60
                ? "Tidak haid selama 2 bulan"
                : periodCount > 2
                ? "Menstruasi lebih dari 2 kali dalam 2 bulan"
                : gejalaList &&
                  (gejalaList.includes("Pendarahan berat") ||
                    gejalaList.includes("Nyeri parah") ||
                    gejalaList.includes("Pusing berat"))
                ? "Gejala yang memerlukan perhatian medis"
                : null,
          });
        } else {
          const hasRecentPeriod = Object.values(data.dailyNotes || {}).some(
            (note) => note && note.isPeriod
          );

          const phase = hasRecentPeriod ? "menstruasi" : "unknown";

          return NextResponse.json({
            phase,
            insight: hasRecentPeriod
              ? "Kamu sedang dalam fase menstruasi. Jaga kesehatan dan istirahat yang cukup ya!"
              : "Terus catat siklus menstruasimu untuk analisis yang lebih akurat!",
            activities: hasRecentPeriod
              ? ["Istirahat", "Yoga ringan", "Membaca"]
              : ["Olahraga", "Aktivitas sosial", "Eksperimen baru"],
            foods: hasRecentPeriod
              ? ["Daging merah", "Cokelat", "Sayuran hijau"]
              : ["Buah segar", "Sayuran", "Biji-bijian"],
            symptomTips: "Dengarkan tubuhmu dan berikan yang terbaik untuk diri sendiri",
            recommendedArticles: articlesByPhase[phase],
            needsConsultation: false,
          });
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);

        const notes = Object.values(data.dailyNotes || {}).filter(
          (note) => note
        );
        const recentPeriod = notes.find((note) => note.isPeriod);

        const phase = recentPeriod ? "menstruasi" : "folikular";

        return NextResponse.json({
          phase,
          insight: recentPeriod
            ? "Kamu sedang dalam fase menstruasi. Jaga kesehatan dan istirahat yang cukup!"
            : "Fase folikular adalah waktu yang tepat untuk memulai aktivitas baru!",
          activities: recentPeriod
            ? ["Istirahat", "Yoga ringan", "Membaca"]
            : ["Olahraga", "Aktivitas sosial", "Eksperimen baru"],
          foods: recentPeriod
            ? ["Daging merah", "Cokelat", "Sayuran hijau"]
            : ["Buah segar", "Sayuran", "Biji-bijian"],
          symptomTips: recentPeriod
            ? "Minum air hangat dan gunakan bantal pemanas untuk nyeri"
            : "Nikmati energi tinggimu di fase ini!",
          recommendedArticles: articlesByPhase[phase],
          needsConsultation: false,
        });
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
