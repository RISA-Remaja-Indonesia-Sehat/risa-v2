"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trophy, Zap, Clock,Gamepad2Icon, TrendingUp, Users, Target, Rocket } from 'lucide-react'; 

import Herogame from "../../../public/image/Illustration_hero_gamification.png"
import TrophyImage from "../../../public/image/piala.png" 
import CustomButton from "../components/ui/CustomButton";
import Link from "next/link";
import MemoIcon from "../../../public/image/memory-game.png";
import DragIcon from "../../../public/image/drag-drop.png";
import axios from 'axios'; 

gsap.registerPlugin(ScrollTrigger);

const GAMES_ENDPOINT = "https://server-risa.vercel.app/api/mini-games";

const GameCardLegend = ({ title, description, linkgame, icon, type, gameId, points }) => {
    const mainColor = type === 'DRAG_DROP' ? 'bg-pink-400' : 'bg-pink-600'; 
    const accentColor = type === 'DRAG_DROP' ? 'border-pink-600' : 'border-pink-300';
    const pointsText = type === 'DRAG_DROP' ? 'FACT FINDER' : 'MEMORY CHALLENGE';

    const DynamicIcon = type === 'DRAG_DROP' ? Target : Clock;

    return (
        <div 
            className={`p-1 bg-white border-8 border-double ${mainColor} rounded-2xl shadow-xl shadow-pink-500/30 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer relative overflow-hidden`}
        >
            <div className={`w-full ${mainColor} py-2 px-4 text-white font-black text-xs uppercase rounded-t-xl flex items-center justify-between`}>
                <div className="flex items-center">
                    <DynamicIcon size={16} className="mr-2 text-yellow-300" />
                    {pointsText} QUEST
                </div>
                
                <div className="bg-yellow-400 text-gray-900 font-extrabold px-3 py-0.5 rounded-full shadow-md text-sm uppercase transform rotate-2">
                    {points} PTS
                </div>
            </div>

            <div className={`p-6 border-b-4 ${accentColor} bg-white rounded-b-xl`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-shrink-0">
                        <Image 
                            src={icon} 
                            alt={title} 
                            width={120} 
                            height={100} 
                            className="drop-shadow-lg p-2 bg-yellow-50 border-3 border-yellow-400 rounded-full"
                        />
                    </div>
                    
                    <div className="flex-grow ml-4">
                        <h3 className="text-lg md:text-xl font-black text-gray-900 leading-snug">
                            {title}
                        </h3>
                    </div>
                </div>

                <p className="text-gray-600 mb-6 text-sm border-t border-dashed border-gray-200 pt-4 mt-4">{description}</p>
                
                <Link href={`${linkgame}?gameId=${gameId}`} passHref>
                    <button
                        className={`w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-black py-3 rounded-lg shadow-lg shadow-yellow-400/50 transition-all duration-200 uppercase tracking-widest text-lg transform hover:scale-[1.01] flex items-center justify-center`}
                    >
                        <Zap size={20} className="mr-2"/> MULAI GAME
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
            case 'MEMO_CARD':
                return {
                    description: "Uji daya ingat dan kecepatan mencocokkan istilah kunci kesehatan reproduksi dalam batas waktu.",
                    linkgame: `/mini-game/memory`, 
                    icon: MemoIcon,
                    points: defaultPoints
                };
            case 'DRAG_DROP':
                return {
                    description: "Analisis dan pilah informasi untuk menentukan mitos versus fakta secara akurat dan raih skor tertinggi.",
                    linkgame: `/mini-game/drag-drop`, 
                    icon: DragIcon,
                    points: defaultPoints
                };
            default:
                return {
                    description: "Deskripsi game belum tersedia. Hubungi tim developer.",
                    linkgame: `#`,
                    icon: MemoIcon, 
                    points: 0
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
            return <p className="text-red-600 text-center col-span-full py-10 border border-red-300 bg-red-50 rounded-lg font-semibold">❌ Kesalahan Server: {error}</p>;
        }

        if (miniGames.length === 0) {
            return <p className="text-gray-500 text-center col-span-full py-10 text-xl font-medium">❌ Belum ada mini-game yang di-publish.</p>;
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
                gsap.to(el, { opacity: 1, y: 0, duration: 1, delay: i * 0.2, ease: "back.out(1.7)" });
            });
            scaleInRef.current.forEach((el, i) => {
                gsap.to(el, { opacity: 1, scale: 1, duration: 0.8, delay: 0.5 + i * 0.2, ease: "elastic.out(1, 0.6)" });
            });
            fadeSlideUpRef.current.forEach((el, i) => {
                gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay: 1 + i * 0.1, ease: "power2.out" });
            });
            
            if (trophyRef.current) {
                gsap.fromTo(trophyRef.current, { opacity: 0, scale: 0, rotation: 0 }, {
                    opacity: 1, scale: 1, rotation: 360, duration: 1.5, 
                    ease: "elastic.out(1, 0.5)", 
                    scrollTrigger: {
                        trigger: trophyRef.current, 
                        start: "top 80%", 
                        toggleActions: "play none none none",
                    },
                });
            }
        });
        return () => ctx.revert();
    }, []);


    return (
        <div className="bg-gradient-to-br from-pink-100 via-white to-yellow-100 min-h-screen">
            
            <section className="w-full py-8 px-2 lg:px-16 flex flex-col lg:gap-6 lg:flex-row sm:items-center sm:justify-center">
                <div className="p-2 space-y-2 lg:space-y-6">
                    <h1 ref={addFadeSlide} className="text-2xl lg:text-5xl font-bold text-pink-600">
                        Yuk, Main & Kumpulkan Poin!
                    </h1>
                    <p ref={addFadeSlide} className="text-sm text-gray-700 md:text-lg mb-8">Dapatkan hingga 100 poin per game!</p>
                    <div ref={addFadeSlide} className="flex flex-col sm:flex-row gap-4">
                        <Link href="/mini-game/memory">
                            <CustomButton title="Memory Card" className="w-full flex justify-center text-nowrap px-4 py-2 lg:px-6 lg:py-4 bg-purple-600 hover:bg-purple-700 shadow-xl animate-pulse-slow" />
                        </Link>
                        <Link href="/mini-game/drag-drop">
                            <CustomButton title="Mitos VS Fakta" className="w-full flex justify-center px-4 py-2 lg:px-6 lg:py-4 bg-purple-600 hover:bg-purple-700 shadow-xl animate-pulse-slow" />
                        </Link>
                    </div>
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
                    <h2 ref={addFadeSlide} className="text-4xl font-black text-pink-700 mb-2 border-b-4 border-yellow-500 pb-1 flex items-center">
                        <Gamepad2Icon size={32} className="mr-3 text-pink-600"/> GAME BOARD
                    </h2>
                    <p className="text-gray-600 text-xl text-center mb-12">Pilih Misi Anda. Selesaikan untuk mendapatkan poin kompetisi dan menjadi yang terbaik!</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
                        {renderGameCards()}
                    </div>
                </section>
                
                <section className="w-full flex flex-col items-center py-12 bg-white rounded-3xl shadow-2xl border-4 border-yellow-500 relative overflow-hidden">
                    
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-pink-200 to-yellow-200"></div>

                    <div className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg mb-4 uppercase tracking-widest flex items-center z-10">
                        <TrendingUp size={16} className="mr-1" />
                        Live Ranking
                    </div>

                    <Image ref={trophyRef} src={TrophyImage} alt="Competition Trophy" width={150} height={150} className="mb-6 drop-shadow-xl z-10" style={{opacity: 0, scale: 0}} />
                    
                    <h2 className="text-4xl font-black text-pink-700 mb-3 drop-shadow-sm z-10">
                        Papan Skor Top Players
                    </h2>
                    
                    <p className="text-gray-800 text-xl text-center max-w-2xl mb-8 font-bold z-10">
                        Ayo! Setiap sesi game yang kamu selesaikan akan langsung mengatrol posisimu. Main sekarang, lihat namamu melesat ke puncak Leaderboard Real-Time ini!
                    </p>
                    
                    <CustomButton 
                        title="LIHAT LEADERBOARD REAL-TIME" 
                        className="mt-4 p-3 bg-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-400/50 text-xl font-bold" 
                    />

                    <div className="flex space-x-4 mt-6 text-gray-500 z-10">
                        <Rocket size={20} className="text-pink-600" />
                        <Users size={20} />
                        <Trophy size={20} className="text-yellow-600" />
                    </div>

                </section>
            </main>
        </div>
    );
}