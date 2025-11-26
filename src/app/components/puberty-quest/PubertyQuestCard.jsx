'use client';

import Image from "next/image";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function PubertyQuestCard() {
  const handleCardClick = (e) => {
    e.preventDefault();
    // const nav = document.querySelector("nav");
    // const footer = document.querySelector("footer");
    // if (nav) nav.style.display = "none";
    // if (footer) footer.style.display = "none";
    window.location.href = "/mini-game/puberty-quest";
  };

  return (
    <Link href="/mini-game/puberty-quest" onClick={handleCardClick}>
      <div
        className="relative p-4 bg-gradient-to-br from-pink-50 to-yellow-100 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {/* Layer 3D bawah untuk kedalaman */}
        <div className="absolute inset-0 bg-pink-100 rounded-2xl transform translate-z-0 opacity-50"></div>

        {/* Header */}
        <div className="relative bg-pink-200 py-2 px-3 text-pink-700 font-bold text-xs uppercase rounded-t-xl flex items-center z-10">
          <Rocket size={14} className="mr-2 text-yellow-400" />
          Puberty Quest
        </div>

        {/* Body */}
        <div className="relative bg-white p-4 rounded-b-xl border-t-2 border-yellow-200 z-10">
          <div className="flex items-center mb-3">
            <Image
              src="https://img.icons8.com/officel/80/quest.png"
              alt="Puberty Quest"
              width={80}
              height={80}
              className="rounded-full border-2 border-pink-200 shadow-md"
            />
            <h3 className="ml-3 text-lg font-bold text-pink-700 leading-tight">
              Puberty Quest
            </h3>
          </div>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Perjalanan seru mengenal tubuhmu! Selesaikan 5 chapter menarik dan pelajari tentang pubertas dengan cara yang fun dan interaktif.
          </p>

          <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-pink-800 font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center text-sm cursor-pointer">
            <Rocket size={16} className="mr-2" /> Mulai Petualangan
          </button>
        </div>
      </div>
    </Link>
  );
}
