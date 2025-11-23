"use client";
import Image from "next/image";
import useAuthStore from "../../store/useAuthStore";
import useSiklusStore from "../../store/useSiklusStore";
import { Heart, Calendar, Sparkles } from "lucide-react";
import CustomButton from "@/app/components/ui/CustomButton";
<<<<<<< HEAD
import DailyInsightDisplay from "./DailyInsightDisplay";
=======
>>>>>>> 4c4a858a9da019452c26572145ebd2d41fc35147

const HeroSection = () => {
  const { user, isLoggedIn } = useAuthStore();
  const { currentPhase, phaseInsight } = useSiklusStore();

  const phaseConfig = {
    menstruasi: {
      color: "from-red-200 to-pink-200",
      icon: "🌙",
      title: "Fase Menstruasi",
      image: "/image/phase-menstruation.png",
    },
    folikular: {
      color: "from-green-200 to-emerald-200",
      icon: "🌱",
      title: "Fase Folikular",
      image: "/image/phase-follicular.png",
    },
    ovulasi: {
      color: "from-yellow-200 to-orange-200",
      icon: "🌟",
      title: "Fase Ovulasi",
      image: "/image/phase-ovulation.png",
    },
    luteal: {
      color: "from-purple-200 to-indigo-200",
      icon: "🌸",
      title: "Fase Luteal",
      image: "/image/phase-luteal.png",
    },
    unknown: {
      color: "from-gray-200 to-slate-200",
      icon: "❓",
      title: "Fase Belum Diketahui",
      image: "/image/phase-unknown.png",
    },
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gradient-to-br from-pink-100 via-white to-yellow-100 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">
              Pantau Siklusmu dengan Mudah dan Rahasia 💕
            </h1>
            <p className="text-gray-600 lg:text-lg mb-6">
              Catat siklus menstruasimu, dapatkan insight personal, dan temukan
              artikel yang tepat untuk setiap fase.
            </p>
            <CustomButton className="px-8 py-3" title="Mulai Catat" />
          </div>
          <div className="flex-1 flex justify-center">
            <Image
              src="/image/calendar-teen.png"
              alt="Calendar illustration"
              className="w-64 h-64 object-contain"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    );
  }

  const currentConfig =
    currentPhase && phaseConfig[currentPhase]
      ? phaseConfig[currentPhase]
      : phaseConfig.unknown;

  return (
<<<<<<< HEAD
    <>
      <div
        className={`bg-gradient-to-br ${
          currentConfig?.color || "from-pink-100 to-yellow-100"
        } rounded-2xl p-8 shadow-lg mb-8`}
      >
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Halo, {user?.name}! 👋
              </h2>
            </div>

            {currentPhase && currentPhase !== "unknown" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="md:text-2xl">{currentConfig.icon}</span>
                  <div>
                    <h3 className="md:text-xl font-semibold text-gray-800">
                      {currentConfig.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Hari ini kamu sedang dalam fase ini
                    </p>
                  </div>
                </div>

                {phaseInsight && (
                  <div className="bg-white/70 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-xs md:text-base text-gray-700 font-medium">
                        {phaseInsight}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : currentPhase === "unknown" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="md:text-2xl">{currentConfig.icon}</span>
                  <div>
                    <h3 className="md:text-xl font-semibold text-gray-800">
                      {currentConfig.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Catat lebih banyak untuk analisis yang akurat
                    </p>
                  </div>
                </div>

                {phaseInsight && (
                  <div className="bg-white/70 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-xs md:text-base text-gray-700 font-medium">
                        {phaseInsight}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                  Mulai catat siklus menstruasimu untuk mendapatkan insight
                  personal!
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>Klik tanggal di kalender untuk memulai</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <Image
              src={currentConfig.image}
              alt={`Ilustrasi ${currentConfig.title}`}
              className="w-48 h-48 object-contain"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>

      {/* Daily Insight Display */}
      <div className="mb-8">
        <DailyInsightDisplay />
      </div>
    </>
=======
    <div
      className={`bg-gradient-to-br ${
        currentConfig?.color || "from-pink-100 to-yellow-100"
      } rounded-2xl p-8 shadow-lg mb-8`}
    >
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Halo, {user?.name}! 👋
            </h2>
          </div>

          {currentPhase && currentPhase !== "unknown" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="md:text-2xl">{currentConfig.icon}</span>
                <div>
                  <h3 className="md:text-xl font-semibold text-gray-800">
                    {currentConfig.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Hari ini kamu sedang dalam fase ini
                  </p>
                </div>
              </div>

              {phaseInsight && (
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-xs md:text-base text-gray-700 font-medium">
                      {phaseInsight}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : currentPhase === "unknown" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="md:text-2xl">{currentConfig.icon}</span>
                <div>
                  <h3 className="md:text-xl font-semibold text-gray-800">
                    {currentConfig.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Catat lebih banyak untuk analisis yang akurat
                  </p>
                </div>
              </div>

              {phaseInsight && (
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-xs md:text-base text-gray-700 font-medium">
                      {phaseInsight}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 text-lg">
                Mulai catat siklus menstruasimu untuk mendapatkan insight
                personal!
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Klik tanggal di kalender untuk memulai</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <Image
            src={currentConfig.image}
            alt={`Ilustrasi ${currentConfig.title}`}
            className="w-48 h-48 object-contain"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
>>>>>>> 4c4a858a9da019452c26572145ebd2d41fc35147
  );
};

export default HeroSection;
