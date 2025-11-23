"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Trophy,
  Zap,
  Clock,
  Gamepad2Icon,
  TrendingUp,
  Users,
  Target,
  Rocket,
} from "lucide-react";

import Herogame from "../../../public/image/Illustration_hero_gamification.png";
import TrophyImage from "../../../public/image/piala.png";
import CustomButton from "../components/ui/CustomButton";
import Link from "next/link";
import MemoIcon from "../../../public/image/memory-game.png";
import DragIcon from "../../../public/image/drag-drop.png";
import axios from "axios";
import PinkProwessLeaderboard from "../components/games/PinkProwessLeaderboard";

gsap.registerPlugin(ScrollTrigger);

const GAMES_ENDPOINT = "https://server-risa.vercel.app/api/mini-games";

const GameCardLegend = ({
  title,
  description,
  linkgame,
  icon,
  type,
  gameId,
  points,
}) => {
  const mainColor = type === "DRAG_DROP" ? "bg-pink-400" : "bg-pink-600";
  const accentColor =
    type === "DRAG_DROP" ? "border-pink-600" : "border-pink-300";
  const pointsText = type === "DRAG_DROP" ? "FACT FINDER" : "MEMORY CHALLENGE";

  const DynamicIcon = type === "DRAG_DROP" ? Target : Clock;

  return (
    <div
      className="relative p-4 bg-gradient-to-br from-pink-50 to-yellow-100 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Layer 3D bawah untuk kedalaman */}
      <div className="absolute inset-0 bg-pink-100 rounded-2xl transform translate-z-0 opacity-50"></div>

      {/* Header */}
      <div className="relative bg-pink-200 py-2 px-3 text-pink-700 font-bold text-xs uppercase rounded-t-xl flex items-center justify-between z-10">
        <div className="flex items-center">
          <DynamicIcon size={14} className="mr-2 text-yellow-400" />
          {pointsText} Quest
        </div>
        <div className="bg-yellow-200 text-pink-800 font-semibold px-2 py-1 rounded-full text-xs">
          {points} PTS
        </div>
      </div>

      {/* Body */}
      <div className="relative bg-white p-4 rounded-b-xl border-t-2 border-yellow-200 z-10">
        <div className="flex items-center mb-3">
          <Image
            src={icon}
            alt={title}
            width={80}
            height={80}
            className="rounded-full border-2 border-pink-200 shadow-md"
          />
          <h3 className="ml-3 text-lg font-bold text-pink-700 leading-tight">
            {title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>

        <Link href={`${linkgame}?gameId=${gameId}`} passHref>
          <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-pink-800 font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center text-sm hover:scale-102">
            <Zap size={16} className="mr-2" /> Mulai Game
          </button>
        </Link>
      </div>
    </div>
  );
};

export default function Home() {
  const [miniGames, setMiniGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [leaderboardVisible, setLeaderboardVisible] = useState(false);

  const handleToggleLeaderboard = () => {
    setLeaderboardVisible((prev) => !prev);
  };

  const headerRef = useRef(null);

  const fadeSlideRef = useRef([]);
  const scaleInRef = useRef([]);
  const fadeSlideUpRef = useRef([]);
  const trophyRef = useRef(null);

  fadeSlideRef.current = [];
  scaleInRef.current = [];
  fadeSlideUpRef.current = [];

  const addFadeSlide = (el) => {
    if (el && !fadeSlideRef.current.includes(el)) fadeSlideRef.current.push(el);
  };
  const addScaleIn = (el) => {
    if (el && !scaleInRef.current.includes(el)) scaleInRef.current.push(el);
  };
  const addFadeSlideUp = (el) => {
    if (el && !fadeSlideUpRef.current.includes(el))
      fadeSlideUpRef.current.push(el);
  };

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(GAMES_ENDPOINT);
        const result = response.data;

        if (result.success && Array.isArray(result.data)) {
          setMiniGames(result.data);
        } else {
          throw new Error("Format data games tidak valid.");
        }
      } catch (err) {
        const errorMessage = err.response
          ? `Gagal memuat: Status ${err.response.status}`
          : "Terjadi kesalahan koneksi jaringan.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  const getGameCardDetails = (game) => {
    const defaultPoints = 100;
    switch (game.type) {
      case "MEMO_CARD":
        return {
          description:
            "Uji daya ingat dan kecepatan mencocokkan istilah kunci kesehatan reproduksi dalam batas waktu.",
          linkgame: `/mini-game/memory`,
          icon: MemoIcon,
          points: defaultPoints,
        };
      case "DRAG_DROP":
        return {
          description:
            "Analisis dan pilah informasi untuk menentukan mitos versus fakta secara akurat dan raih skor tertinggi.",
          linkgame: `/mini-game/drag-drop`,
          icon: DragIcon,
          points: defaultPoints,
        };
      default:
        return {
          description: "Deskripsi game belum tersedia. Hubungi tim developer.",
          linkgame: `#`,
          icon: MemoIcon,
          points: 0,
        };
    }
  };

  const renderGameCards = () => {
    if (isLoading) {
      return (
        <>
          <div className="w-full h-56 bg-pink-100 rounded-2xl animate-pulse shadow-md"></div>
          <div className="w-full h-56 bg-pink-100 rounded-2xl animate-pulse shadow-md"></div>
        </>
      );
    }

    if (error) {
      return (
        <p className="text-red-600 text-center col-span-full py-10 border border-red-300 bg-red-50 rounded-lg font-semibold">
          ❌ Kesalahan Server: {error}
        </p>
      );
    }

    if (miniGames.length === 0) {
      return (
        <p className="text-gray-500 text-center col-span-full py-10 text-xl font-medium">
          ❌ Belum ada mini-game yang di-publish.
        </p>
      );
    }

    return miniGames.map((game) => {
      const details = getGameCardDetails(game);

      return (
        <GameCardLegend
          key={game.id}
          gameId={game.id}
          title={game.title}
          type={game.type}
          description={details.description}
          linkgame={details.linkgame}
          icon={details.icon}
          points={details.points}
        />
      );
    });
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      fadeSlideRef.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.2,
          ease: "back.out(1.7)",
        });
      });
      scaleInRef.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.5 + i * 0.2,
          ease: "elastic.out(1, 0.6)",
        });
      });
      fadeSlideUpRef.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 1 + i * 0.1,
          ease: "power2.out",
        });
      });

      if (trophyRef.current) {
        gsap.fromTo(
          trophyRef.current,
          { opacity: 0, scale: 0, rotation: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: trophyRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handlePubertyQuestClick = () => {
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 via-white to-yellow-100 min-h-screen">
      <section className="w-full py-8 px-2 lg:px-16 flex flex-col lg:gap-6 lg:flex-row sm:items-center sm:justify-center">
        <div className="p-2 space-y-2 lg:space-y-6">
          <h1
            ref={addFadeSlide}
            className="text-2xl lg:text-5xl font-bold text-pink-600"
          >
            Yuk, Main & Kumpulkan Poin!
          </h1>
          <p
            ref={addFadeSlide}
            className="text-sm text-gray-700 md:text-lg mb-8"
          >
            Dapatkan hingga 100 poin per game!
          </p>
        </div>
        <div ref={addScaleIn} className="p-2 mt-6 md:mt-0 hidden sm:block">
          <Image
            src={Herogame}
            alt="Hero Illustration"
            width={400}
            height={400}
            className="max-h-80 drop-shadow-xl"
            priority={false}
          />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 space-y-20 overflow-hidden">

        <section className="w-full flex flex-col items-center">
          <h2
            ref={addFadeSlide}
            className="text-3xl lg:text-4xl font-black text-pink-700 mb-2 pb-1 flex items-center"
          >
            <Gamepad2Icon size={32} className="mr-3 text-pink-500" /> GAME BOARD
          </h2>
          <p className="text-gray-600 lg:text-xl text-center mb-12">
            Pilih Game kamu. Selesaikan untuk mendapatkan poin kompetisi dan
            menjadi yang terbaik!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
            {renderGameCards()}
          </div>
        </section>
        
        <section className="w-full flex flex-col items-center">
          <Link href="/mini-game/puberty-quest" onClick={handlePubertyQuestClick}>
            <div className="w-full max-w-2xl bg-pink-600 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 cursor-pointer border-4 border-pink-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">Puberty Quest</h3>
                  <p className="text-white text-lg mb-4">Perjalanan seru mengenal tubuhmu!</p>
                  <p className="text-pink-100 text-sm mb-4">Selesaikan 5 chapter menarik dan pelajari tentang pubertas dengan cara yang fun dan interaktif.</p>
                  <button className="bg-white text-pink-600 font-bold py-3 px-6 rounded-full hover:bg-pink-100 transition-all cursor-pointer">
                    Mulai Petualangan →
                  </button>
                </div>
                <div className="hidden sm:block ml-6">
                  <Image width="80" height="80" src="https://img.icons8.com/officel/80/quest.png" alt="quest"/>
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section
          className="w-full flex flex-col items-center py-12 
      bg-gradient-to-br from-pink-50 to-yellow-50 rounded-3xl shadow-lg border-4 border-pink-300 relative overflow-hidden"
        >
          {/* Live Ranking Badge */}
          <div
            ref={headerRef}
            className="bg-pink-600 text-white font-bold text-sm px-4 py-2 rounded-full 
          shadow-md mb-6 uppercase tracking-wide flex items-center z-10"
          >
            <TrendingUp size={18} className="mr-1" />
            Live Ranking
          </div>

          {/* Trophy Image/Placeholder */}
          <Image
            ref={trophyRef}
            src={TrophyImage}
            alt="Competition Trophy"
            width={150}
            height={150}
            className="mb-6 drop-shadow-xl z-10"
            style={{ opacity: 0, scale: 0 }}
          />

          {/* Judul & Deskripsi */}
          <h2 className="text-3xl font-bold text-pink-700 mb-3 z-10">
            Papan Skor
          </h2>

          <p className="text-gray-700 text-lg text-center max-w-xl mb-8 z-10">
            Lihat peringkat real-time. Main sekarang dan naik ke puncak!
          </p>

          <PinkProwessLeaderboard />
        </section>
      </main>
    </div>
  );
}
