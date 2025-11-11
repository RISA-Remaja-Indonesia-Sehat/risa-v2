"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import CustomButton from "../components/ui/CustomButton";
import Link from "next/link";
import useStickers from "../store/useStickers";
import useMissions from "../store/useMissions";
import useAuthStore from "../store/useAuthStore";

export default function MissionPage() {
  const { stickers, initStickers } = useStickers();
  const { isLoggedIn, token, user } = useAuthStore();

  useEffect(() => {
    initStickers();
  }, [initStickers]);

  const { initMissions, startMission } = useMissions();

  const missionLogs = useMissions((state) => state.missionLogs);

  const missions = useMemo(
    () =>
      missionLogs.map((log) => ({
        id: log.mission.id,
        title: log.mission.title,
        reward: log.mission.reward,
        target: log.mission.target,
        icon: log.mission.icon,
        progress: log.progress,
        completed: log.completed,
        status: log.status,
        logId: log.id,
      })),
    [missionLogs]
  );

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log("Loading mission data");
      setLoading(true);
      await initMissions(); // Load daily logs (sudah include mission data)
      setLoading(false);
    };

    if (isLoggedIn && token && user) {
      loadData();
    }
  }, [initMissions, isLoggedIn, token, user]);

  // Countdown timer (unchanged)
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
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMissionClick = async (mission) => {
    if (mission.status === "idle") {
      await startMission(mission.id); // Update status
      // Redirect based on mission
      if (mission.id === 1) window.location.href = "/article";
      if (mission.id === 2) window.location.href = "/mini-game";
      if (mission.id === 3) window.location.href = "/article";
      if (mission.id === 4) window.location.href = "/article";
      // ... (add others as needed)
    }
  };

  // Button helpers (unchanged)
  const getButtonText = (mission) => {
    if (mission.completed) return "Selesai";
    if (mission.status === "in_progress") return "Dikerjakan";
    return "Mulai";
  };
  const getButtonClass = (mission) => {
    if (mission.completed) return "bg-green-500 text-white";
    if (mission.status === "in_progress")
      return "bg-transparent border-2 border-pink-500 text-pink-500";
    return "bg-pink-500 text-white hover:shadow-lg hover:scale-105";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section 1: Sticker Count & Exchange */}
        <section className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-pink-200">
          <div>
            <div className="flex items-center justify-center gap-2 md:gap-6 mb-2 md:mb-4">
              <Image
                src="/image/stiker-digital.png"
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
            <p className="text-gray-600 mb-3 md:mb-6 text-center">
              Kumpulkan lebih banyak stiker dengan menyelesaikan misi!
            </p>
            <Link href="/reward" className="mx-auto w-fit block">
              <CustomButton title="Tukar Stiker" className="px-6 py-3" />
            </Link>
          </div>
        </section>

        {/* Section 2: Daily Missions */}
        {isLoggedIn ? (
          <section className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-200">
            <h2 className="text-center text-3xl font-bold text-[#382b22] mb-6">
              Misi Hari Ini
            </h2>
            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-pink-50 via-white to-yellow-50 rounded-2xl p-6 border border-pink-200 mb-8 text-center">
              <p className="text-gray-600 mb-4">
                Waktu tersisa untuk menyelesaikan misi:
              </p>
              <div className="flex justify-center gap-4">
                {[
                  { value: timeLeft.hours, label: "JAM" },
                  { value: timeLeft.minutes, label: "MENIT" },
                  { value: timeLeft.seconds, label: "DETIK" },
                ].map((time, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl px-4 py-3 shadow-md border border-pink-200"
                  >
                    <div className="text-2xl font-bold text-pink-600">
                      {String(time.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">{time.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission List */}
            <div className="grid gap-4">
              {loading
                ? // Loading skeleton
                  Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="p-4 sm:p-6 rounded-2xl border-2 bg-gray-100 animate-pulse"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 bg-gray-300 rounded"></div>
                          <div>
                            <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="w-16 h-3 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="w-16 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))
                : missions.map((mission) => (
                    <div
                      key={mission.id}
                      className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                        mission.completed
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Image
                            width="48"
                            height="48"
                            src={mission.icon}
                            alt={mission.title}
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-[#382b22] text-sm sm:text-lg">
                              {mission.title}
                            </h3>
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
                          className={`${getButtonClass(
                            mission
                          )} px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-base disabled:cursor-not-allowed`}
                        >
                          {getButtonText(mission)}
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 sm:mt-4">
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-pink-400 h-full transition-all duration-500 ease-out"
                            style={{
                              width: `${
                                (mission.progress / mission.target) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Login untuk Melihat Misi Harian
            </h2>
            <p className="text-gray-600 mb-8">
              Dapatkan stiker dan tukarkan dengan hadiah menarik dari RISA
            </p>
            <Link href="/login">
              <CustomButton className="px-8 py-3" title="Login Sekarang" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
