'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Apa itu vaksin HPV?",
      answer: "Vaksin HPV (Human Papillomavirus) adalah vaksin yang melindungi dari infeksi virus HPV penyebab kanker serviks, kanker vulva, kanker vagina, kanker anus, dan kutil kelamin. Vaksin ini sangat efektif mencegah hingga 90% kasus kanker serviks."
    },
    {
      question: "Apa manfaat imunisasi HPV?",
      answer: "Manfaat utama vaksin HPV adalah mencegah kanker serviks dan kanker lainnya yang disebabkan HPV. Vaksin ini juga melindungi dari kutil kelamin dan mengurangi risiko penularan HPV ke pasangan. Perlindungan terbaik didapat jika vaksin diberikan sebelum terpapar virus HPV."
    },
    {
      question: "Siapa yang perlu mendapat vaksin HPV?",
      answer: "Vaksin HPV direkomendasikan untuk remaja perempuan dan laki-laki usia 9-26 tahun. Idealnya diberikan sebelum aktif secara seksual. Dewasa hingga usia 45 tahun juga bisa mendapat vaksin setelah konsultasi dengan dokter."
    },
    {
      question: "Apakah vaksin HPV aman?",
      answer: "Ya, vaksin HPV sangat aman dan telah digunakan di seluruh dunia. Efek samping yang umum hanya berupa nyeri ringan di tempat suntikan, demam ringan, atau pusing. Vaksin ini telah melalui uji klinis ketat dan disetujui oleh BPOM."
    },
    {
      question: "Berapa kali harus vaksin HPV?",
      answer: "Jadwal vaksin HPV tergantung usia: untuk usia 9-14 tahun cukup 2 dosis dengan jarak 6-12 bulan. Untuk usia 15 tahun ke atas diperlukan 3 dosis dengan jadwal 0, 1-2, dan 6 bulan."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block animate-bounce mb-4">❓</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#382b22] mb-4">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-gray-600 text-base sm:text-lg px-4">
            Temukan jawaban untuk pertanyaan umum seputar vaksin HPV
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md border-2 border-pink-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center hover:bg-pink-50 transition-colors duration-200"
              >
                <h3 className="font-semibold text-[#382b22] text-base sm:text-lg pr-2 sm:pr-4">
                  {faq.question}
                </h3>
                <span 
                  className={`text-2xl text-pink-500 transform transition-transform duration-300 ${
                    openIndex === index ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 sm:px-6 pb-3 sm:pb-4 pt-2">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}