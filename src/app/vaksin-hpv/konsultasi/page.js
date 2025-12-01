"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Send, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function KonsultasiDokterPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "doctor",
      text: "Halo! Saya dr. Dina Erasvina, Sp.OG, M.Kes. Senang bisa membantu kamu hari ini! 😊",
      time: "10:00",
    },
    {
      id: 2,
      sender: "doctor",
      text: "Saya siap membantu kamu memilih jenis vaksin HPV yang tepat sesuai usia dan kebutuhanmu.",
      time: "10:00",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(false);

  const quickReplies = [
    "Vaksin HPV untuk usia berapa?",
    "Berapa dosis yang dibutuhkan?",
    "Apakah vaksin HPV aman?",
    "Efek samping vaksin HPV?",
  ];

  useEffect(() => {
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";

    return () => {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    setTimeout(() => {
      const doctorResponse = getDoctorResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "doctor",
          text: doctorResponse,
          time: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      if (
        text.toLowerCase().includes("rekomendasi") ||
        text.toLowerCase().includes("surat")
      ) {
        setTimeout(() => {
          setShowRecommendation(true);
        }, 1000);
      }
    }, 1000);
  };

  const getDoctorResponse = (userText) => {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes("usia") || lowerText.includes("umur")) {
      return "Vaksin HPV direkomendasikan untuk anak perempuan dan laki-laki mulai usia 9 tahun. Paling efektif diberikan sebelum aktif secara seksual, idealnya usia 9-14 tahun.";
    } else if (lowerText.includes("dosis")) {
      return "Untuk usia 9-14 tahun: 2 dosis dengan jarak 6-12 bulan. Untuk usia 15 tahun ke atas: 3 dosis (bulan ke-0, 1-2, dan 6).";
    } else if (lowerText.includes("aman")) {
      return "Ya, vaksin HPV sangat aman! Sudah digunakan di lebih dari 100 negara dan terbukti efektif mencegah kanker serviks hingga 90%. Efek samping umumnya ringan seperti nyeri di area suntikan.";
    } else if (lowerText.includes("efek samping")) {
      return "Efek samping umumnya ringan: nyeri/kemerahan di area suntikan, pusing ringan, atau demam ringan. Biasanya hilang dalam 1-2 hari.";
    } else if (
      lowerText.includes("rekomendasi") ||
      lowerText.includes("surat")
    ) {
      return "Baik, saya akan berikan surat rekomendasi dokter untuk kamu. Surat ini bisa kamu lampirkan saat pendaftaran.";
    } else {
      return "Terima kasih atas pertanyaannya! Untuk informasi lebih detail, saya sarankan kamu membaca surat rekomendasi yang saya berikan. Jika ada pertanyaan lain, jangan ragu untuk bertanya ya! 😊";
    }
  };

  const handleDownloadRecommendation = () => {
    const link = document.createElement("a");
    link.href = "/document/surat-dokter.pdf";
    link.download = "surat-rekomendasi-dokter-vaksin-hpv.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50">
      <div className="bg-white border-b-2 border-pink-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/vaksin-hpv"
              className="text-pink-600 hover:text-pink-700"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                DE
              </div>
              <div>
                <h1 className="font-bold text-gray-900">
                  dr. Dina Erasvina, Sp.OG, M.Kes
                </h1>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white"
                    : "bg-white border-2 border-pink-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-pink-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}

          {showRecommendation && (
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-gradient-to-br from-yellow-50 to-pink-50 border-2 border-pink-300 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">
                      📄 Surat Rekomendasi Dokter
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Surat rekomendasi untuk vaksinasi HPV sudah siap! Silakan
                      download dan bawa saat kunjungan ke klinik.
                    </p>
                    <button
                      onClick={handleDownloadRecommendation}
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Surat Rekomendasi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!showRecommendation && (
          <div className="mt-6">
            <p className="text-xs text-gray-600 mb-2 text-center">
              Pertanyaan yang sering ditanyakan:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(reply)}
                  className="px-3 py-2 bg-white border-2 border-pink-200 text-pink-600 text-xs rounded-full hover:bg-pink-50 hover:border-pink-300 transition-all"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pink-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleSendMessage(inputMessage)
              }
              placeholder="Ketik pertanyaanmu di sini..."
              className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim()}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-full hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            💡 Tip: Ketik &quot;rekomendasi&quot; untuk mendapatkan surat dokter
          </p>
        </div>
      </div>
    </div>
  );
}
