'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import CustomButton from "../components/ui/CustomButton";
import Link from "next/link";
import useStickers from '../store/useStickers';
import useMissions from '../store/useMissions';

export default function MissionPage() {
  const { stickers, addStickers, initStickers } = useStickers();
  const { missions, startMission } = useMissions();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    initStickers();
  }, [initStickers]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const difference = tomorrow - now;
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMissionClick = (mission) => {
    if (mission.status === 'idle') {
      startMission(mission.id);
      
      // Redirect based on mission type
      if (mission.id === 1) { // Baca Artikel
        window.location.href = '/article';
      } else if (mission.id === 4) { // Share ke Teman
        window.location.href = '/article';
      } else if (mission.id === 5) { // Beri Komentar
        window.location.href = '/article';
      }
    }
  };
  
  const getButtonText = (mission) => {
    if (mission.completed) return 'Selesai';
    if (mission.status === 'in-progress') return 'Dikerjakan';
    return 'Mulai';
  };
  
  const getButtonClass = (mission) => {
    if (mission.completed) return 'bg-green-500 text-white';
    if (mission.status === 'in-progress') return 'bg-transparent border-2 border-pink-500 text-pink-500';
    return 'bg-pink-500 text-white hover:shadow-lg hover:scale-105';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section 1: Sticker Count & Exchange */}
        <section className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-pink-200">
          <div>
            <div className="flex items-center justify-center gap-2 md:gap-6 mb-2 md:mb-4">
              <Image 
                src='/image/stiker-digital.png'
                alt="stiker digital RISA"
                width={120}
                height={120}
                className="drop-shadow-lg"
                priority={true}
              />
              <h1 className="text-xl md:text-3xl font-bold">
                {stickers} Stiker
              </h1>
            </div>
            <p className="text-gray-600 mb-3 md:mb-6 text-center">Kumpulkan lebih banyak stiker dengan menyelesaikan misi!</p>
            <Link
             href='/reward'
             className="mx-auto w-fit block">
                <CustomButton
                title='Tukar Stiker' 
                className="px-6 py-3" />
            </Link>
          </div>
        </section>

        {/* Section 2: Daily Missions */}
        <section className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-200">
            <h2 className="text-center text-3xl font-bold text-[#382b22] mb-6">Misi Hari Ini</h2>
          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 border border-pink-200 mb-8 text-center">
            <p className="text-gray-600 mb-4">Waktu tersisa untuk menyelesaikan misi:</p>
            <div className="flex justify-center gap-4">
              {[{value: timeLeft.hours, label: 'JAM'}, {value: timeLeft.minutes, label: 'MENIT'}, {value: timeLeft.seconds, label: 'DETIK'}].map((time, index) => (
                <div key={index} className="bg-white rounded-xl px-4 py-3 shadow-md border border-pink-200">
                  <div className="text-2xl font-bold text-pink-600">{String(time.value).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-500">{time.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission List */}
          <div className="grid gap-4">
            {missions.map((mission) => (
              <div key={mission.id} className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                mission.completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 hover:shadow-lg'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Image width="48" height="48" src={mission.icon} alt={mission.title} />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#382b22] text-sm sm:text-lg">{mission.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="bg-white rounded-full px-2 sm:px-3 py-1 border border-pink-200">
                          <span className="text-xs sm:text-sm text-pink-600 font-medium">
                            {mission.progress}/{mission.target}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          + {mission.reward} stiker
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleMissionClick(mission)}
                    disabled={mission.completed}
                    className={`${getButtonClass(mission)} px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-base disabled:cursor-not-allowed`}
                  >
                    {getButtonText(mission)}
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3 sm:mt-4">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-pink-400 h-full transition-all duration-500 ease-out"
                      style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>
      </div>
    </div>
  );
}
