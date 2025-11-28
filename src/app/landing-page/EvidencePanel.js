'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChartColumnBig, ChartLine, Gamepad2, Star } from 'lucide-react';

export default function EvidencePanel() {
  const panelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const statCards = panelRef.current.querySelectorAll('.stat-card');
      
      statCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            delay: index * 0.1,
            ease: 'power2.out'
          }
        );
      });
    }, panelRef);

    return () => ctx.revert();
  }, []);

  const evidence = [
    {
      icon: ChartColumnBig,
      title: 'Survei Pengguna',
      stat: '87%',
      description: 'remaja perempuan merasa lebih percaya diri setelah menggunakan RISA',
      isDummy: true
    },
    {
      icon: ChartLine,
      title: 'Peningkatan Pemahaman',
      stat: '+42%',
      description: 'rata-rata peningkatan skor pemahaman kesehatan reproduksi dalam pilot 8 minggu',
      isDummy: true
    },
    {
      icon: Gamepad2,
      title: 'Engagement Rate',
      stat: '76%',
      description: 'pengguna aktif menyelesaikan mini-games dan membaca artikel rekomendasi',
      isDummy: true
    },
    {
      icon: Star,
      title: 'Kepuasan Pengguna',
      stat: '4.8/5',
      description: 'rating dari 500+ pengguna beta di Jakarta, Bandung, dan Surabaya',
      isDummy: true
    }
  ];

  return (
    <section ref={panelRef} className="container my-16 mx-auto" id="evidence-section">
      <div className="mb-12">
        <h2 className="font-semibold text-center text-3xl text-gray-800 mb-3">
          Didukung oleh Data & Riset
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Pendekatan inovatif RISA telah divalidasi melalui studi pengguna dan pilot program dengan hasil yang signifikan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {evidence.map((item, idx) => (
          <div 
            key={idx}
            className="stat-card bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow relative"
          >
            {item.isDummy && (
              <div className="absolute top-2 right-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded font-semibold">
                Perkiraan
              </div>
            )}
            <div className="mb-3"><item.icon className="w-10 h-10 mx-auto text-pink-600" /></div>
            <div className="text-3xl font-bold text-pink-600 mb-2">{item.stat}</div>
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">{item.title}</h4>
            <p className="text-gray-600 text-xs leading-5">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">⚠️ Penting:</span> Data di atas adalah <span className="font-semibold text-yellow-700">dummy/perkiraan</span> untuk demonstrasi. Ganti dengan data riil dari hasil survei, UX testing, dan pilot program Anda. Studi lengkap akan tersedia untuk peneliti dan stakeholder kesehatan.
        </p>
      </div>
    </section>
  );
}
