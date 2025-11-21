"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { EnhancedButton } from "@/app/components/games/EnhancedButton";
import { Badge } from "@/app/components/ui/badge";
import { Clock, Target, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GameCard = ({
  title,
  description,
  points,
  timeEstimate,
  difficulty,
  completedBy,
  onPlay,
  icon,
  linkgame,
  isCompleted = false,
}) => {
  const difficultyColors = {
    Mudah: "bg-green-100 text-green-700 border-green-200",
    Sedang: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Sulit: "bg-red-100 text-red-700 border-red-200",
  };

  const router = useRouter();

  const [isFullscreen, setIsFullscreen] = useState(false);
  // Fungsi enter fullscreen (target elemen utama halaman home)
  const enterFullscreen = () => {
    const element = document.documentElement; // Atau gunakan ref jika ada di Home.jsx
    if (element && document.fullscreenEnabled) {
      element
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.warn("Fullscreen gagal:", err);
        });
    } else {
      console.warn("Fullscreen tidak didukung.");
    }
  };
  // Handler untuk tombol "Mulai Main"
  const handlePlay = () => {
    enterFullscreen(); // Panggil fullscreen dulu
    setTimeout(() => {
      router.push(linkgame); // Navigate setelah delay kecil untuk memastikan fullscreen aktif
    }, 100); // Delay 100ms
    onPlay(); // Panggil onPlay existing
  };

  return (
    <Card className="group relative max-w-screen md:min-w-md overflow-hidden backdrop-blur-md bg-white/70 hover:bg-white/90 border border-pink-200 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
      {/* Gradient background floating effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-transparent to-pink-200 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

      <CardHeader className="relative z-10">
        <div className="flex items-center sm:items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
            {title}
          </CardTitle>
          <Image src={icon} width={100} height={100} alt="game"></Image>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        <p className="text-gray-600 leading-relaxed hidden sm:block">
          {description}
        </p>

        <div className="flex gap-2">
          <Badge className={difficultyColors[difficulty]}>
            <Target className="h-3 w-3 mr-1" />
            {difficulty}
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            {timeEstimate}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-yellow-600">{points} poin</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{completedBy.toLocaleString("id-ID")} player</span>
          </div>
        </div>

        <EnhancedButton
          onClick={handlePlay}
          disabled={isCompleted}
          variant={isCompleted ? "ghost" : "default"}
          size="lg"
          className="w-full mt-4"
          animation="hover"
        >
          {isCompleted ? (
            <>
              <Trophy className="h-4 w-4" />
              Sudah Selesai
            </>
          ) : (
            "Mulai Main"
          )}
        </EnhancedButton>
      </CardContent>
    </Card>
  );
};

export default GameCard;
