"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import ChapterDialog from "@/app/components/puberty-quest/ChapterDialog";
import {
  QUIZ_DATA,
  TTS_SCRIPTS,
} from "../../../components/puberty-quest/quizData";
import usePubertyQuestStore from "../../../store/usePubertyQuestStore";
import Image from "next/image";

const ORGANS = [
  { id: 1, name: "Ovarium", desc: "Menghasilkan sel telur", x: 10, y: 30 },
  { id: 2, name: "Rahim", desc: "Tempat tumbuh janin", x: 50, y: 35 },
  { id: 3, name: "Vagina", desc: "Saluran lahir & menstruasi", x: 50, y: 70 },
];

export default function Chapter2() {
  const router = useRouter();
  const { saveProgress } = usePubertyQuestStore();
  const [explored, setExplored] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [dialogState, setDialogState] = useState({
    show: true,
    type: "intro",
    message: TTS_SCRIPTS.chapter2.intro,
  });
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const handleExplore = (id) => {
    if (!explored.includes(id)) {
      setExplored([...explored, id]);
      if (explored.length + 1 === ORGANS.length) {
        setTimeout(() => setShowQuiz(true), 500);
      }
    }
  };

  const handleAnswer = (index) => {
    setSelected(index);
    setShowExp(true);
    const isCorrect = index === QUIZ_DATA.chapter2[currentQ].correct;
    
    if (isCorrect) {
      setScore((prev) => prev + 10);
      const audio = new Audio("/audio/correctAnswer.mp3");
      audio.play();
    } else {
      const audio = new Audio("/audio/wrongAnswer.mp3");
      audio.play();
    }

    setTimeout(() => {
      if (currentQ < QUIZ_DATA.chapter2.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setSelected(null);
        setShowExp(false);
      } else {
        const finalScore = score + (isCorrect ? 10 : 0);
        finishChapter(finalScore);
      }
    }, 2000);
  };

  const finishChapter = async (finalScore) => {
    await saveProgress(2, Math.round(finalScore), true);
    setShowCompleteDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-pink-400 rounded-3xl p-6 shadow-lg mb-6 border-2 border-pink-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white mb-1">
                Chapter 2: Organ Reproduksi
              </h1>
              <p className="text-pink-100 text-sm md:text-base">Kenalan dengan organ tubuhmu!</p>
            </div>
            <button
              onClick={() => router.push("/mini-game/puberty-quest")}
              className="px-4 py-2 bg-white hover:bg-pink-100 rounded-full text-pink-600 font-bold transition-all text-sm md:text-base"
            >
              ← Kembali
            </button>
          </div>
        </div>

        {!showQuiz ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
            <div className="relative w-full aspect-square bg-gradient-to-br from-yellow-100 to-pink-100 rounded-2xl overflow-hidden mb-6 border-3 border-pink-300">
              <Image
                src="/image/reproductive-organs.png"
                alt="Organ Reproduksi"
                fill
                className="object-contain opacity-70"
              />
              {ORGANS.map((organ) => (
                <button
                  key={organ.id}
                  onClick={() => handleExplore(organ.id)}
                  className={`absolute w-14 h-14 rounded-full flex items-center justify-center transition-all font-bold text-lg ${
                    explored.includes(organ.id)
                      ? "bg-green-400 text-white shadow-lg"
                      : "bg-white border-3 border-yellow-400 text-yellow-400 shadow-md"
                  }`}
                  style={{
                    left: `${organ.x}%`,
                    top: `${organ.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {explored.includes(organ.id) ? <Check /> : organ.id}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {ORGANS.map((organ) => (
                <div
                  key={organ.id}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    explored.includes(organ.id)
                      ? "bg-pink-200 text-pink-700 border-2 border-pink-400"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <h3 className="font-bold">{organ.name}</h3>
                  {explored.includes(organ.id) && (
                    <p className="text-sm text-pink-600 mt-1">{organ.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-2xl font-bold text-pink-600">
                Pertanyaan {currentQ + 1}/{QUIZ_DATA.chapter2.length}
              </h2>
              <div className="bg-pink-400 px-4 md:px-6 py-2 rounded-full font-bold text-white shadow-md text-sm md:text-base">
                Score: {Math.round(score)}
              </div>
            </div>
            <p className="text-lg mb-6 text-gray-800">
              {QUIZ_DATA.chapter2[currentQ].question}
            </p>
            <div className="space-y-3">
              {QUIZ_DATA.chapter2[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => !showExp && handleAnswer(i)}
                  disabled={showExp}
                  className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                    showExp
                      ? i === QUIZ_DATA.chapter2[currentQ].correct
                        ? "bg-green-100 border-2 border-green-500"
                        : i === selected
                        ? "bg-red-100 border-2 border-red-500"
                        : "bg-gray-100"
                      : "bg-gray-50 hover:bg-pink-200 border-2 border-pink-300 text-gray-800"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showExp && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl">
                <p className="text-blue-800 font-semibold">
                  💡 {QUIZ_DATA.chapter2[currentQ].explanation}
                </p>
              </div>
            )}
          </div>
        )}

        <ChapterDialog
          type="intro"
          message={TTS_SCRIPTS.chapter2.intro}
          show={dialogState.show}
          onClose={() => {
            setDialogState((prev) => ({ ...prev, show: false }));
            setShowGameDialog(true);
          }}
        />

        <ChapterDialog
          type="game"
          message={TTS_SCRIPTS.chapter2.game}
          show={showGameDialog}
          onClose={() => setShowGameDialog(false)}
        />

        <ChapterDialog
          type="complete"
          message={TTS_SCRIPTS.chapter2.complete}
          show={showCompleteDialog}
          onClose={() => {
            setShowCompleteDialog(false);
            router.push("/mini-game/puberty-quest");
          }}
        />
      </div>
    </div>
  );
}
