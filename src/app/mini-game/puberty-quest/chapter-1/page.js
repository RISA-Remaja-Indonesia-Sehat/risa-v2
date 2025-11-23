"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import ChapterDialog from "../../../components/puberty-quest/ChapterDialog";
import {
  QUIZ_DATA,
  TTS_SCRIPTS,
} from "../../../components/puberty-quest/quizData";
import usePubertyQuestStore from "../../../store/usePubertyQuestStore";
import Image from "next/image";

const CHANGES = [
  { id: 1, text: "Payudara berkembang", x: 55, y: 35, found: false },
  { id: 2, text: "Pinggul melebar", x: 40, y: 55, found: false },
  { id: 3, text: "Jerawat muncul", x: 50, y: 20, found: false },
  { id: 4, text: "Rambut ketiak tumbuh", x: 40, y: 35, found: false },
  { id: 5, text: "Tinggi badan bertambah", x: 50, y: 70, found: false },
];

export default function Chapter1() {
  const router = useRouter();
  const { saveProgress } = usePubertyQuestStore();
  const [changes, setChanges] = useState(CHANGES);
  const [foundCount, setFoundCount] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [dialogState, setDialogState] = useState({
    show: true,
    type: "intro",
    message: TTS_SCRIPTS.chapter1.intro,
  });
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const handleSpotClick = (id) => {
    const updated = changes.map((c) =>
      c.id === id ? { ...c, found: true } : c
    );
    setChanges(updated);
    setFoundCount((prev) => prev + 1);
    if (updated.filter((c) => c.found).length === CHANGES.length) {
      setTimeout(() => setShowQuiz(true), 500);
    }
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === QUIZ_DATA.chapter1[currentQuestion].correct) {
      setScore((prev) => prev + 33.33);
      const audio = new Audio("/audio/correctAnswer.mp3");
      audio.play();
    } else {
      const audio = new Audio("/audio/wrongAnswer.mp3");
      audio.play();
    }
    setTimeout(() => {
      if (currentQuestion < QUIZ_DATA.chapter1.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        finishChapter();
      }
    }, 2000);
  };

  const finishChapter = async () => {
    const finalScore =
      score +
      (selectedAnswer === QUIZ_DATA.chapter1[currentQuestion].correct ? 33.33 : 0);
    await saveProgress(1, Math.round(finalScore), true);
    setShowCompleteDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-pink-400 rounded-3xl p-6 shadow-lg mb-6 border-2 border-pink-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Chapter 1: Awal Pubertas
              </h1>
              <p className="text-pink-100">
                Temukan 5 perubahan tubuh saat pubertas!
              </p>
            </div>
            <button
              onClick={() => router.push("/mini-game/puberty-quest")}
              className="px-4 py-2 bg-white hover:bg-pink-100 rounded-full text-pink-600 font-bold transition-all"
            >
              ← Kembali
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 bg-white/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-3 rounded-full transition-all"
                style={{ width: `${(foundCount / CHANGES.length) * 100}%` }}
              />
            </div>
            <span className="font-bold text-white text-lg">
              {foundCount}/{CHANGES.length}
            </span>
          </div>
        </div>

        {!showQuiz ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto bg-gradient-to-br from-yellow-100 to-pink-100 rounded-2xl overflow-hidden mb-6 border-3 border-pink-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/image/body-silhouette.png"
                  alt="Body"
                  fill
                  className="object-contain opacity-70"
                />
              </div>
              {changes.map((change) => (
                <button
                  key={change.id}
                  onClick={() => !change.found && handleSpotClick(change.id)}
                  disabled={change.found}
                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all transform -translate-x-1/2 -translate-y-1/2 font-bold text-lg ${
                    change.found
                      ? "bg-green-400 text-white shadow-lg"
                      : "bg-white border-3 border-yellow-400 text-yellow-400 shadow-md"
                  }`}
                  style={{ left: `${change.x}%`, top: `${change.y}%` }}
                >
                  {change.found ? "✓" : change.id}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {changes.map((change) => (
                <div
                  key={change.id}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    change.found
                      ? "bg-pink-200 text-pink-700 border-2 border-pink-400"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {change.found && <Check className="w-4 h-4 inline mr-2" />}
                  {change.text}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-pink-600">
                  Pertanyaan {currentQuestion + 1}/{QUIZ_DATA.chapter1.length}
                </h2>
                <div className="bg-pink-400 text-white px-6 py-2 rounded-full font-bold shadow-md">
                  Score: {Math.round(score)}
                </div>
              </div>
              <p className="text-lg text-gray-800 mb-6">
                {QUIZ_DATA.chapter1[currentQuestion].question}
              </p>

              <div className="space-y-3">
                {QUIZ_DATA.chapter1[currentQuestion].options.map(
                  (option, index) => (
                    <button
                      key={index}
                      onClick={() => !showExplanation && handleAnswer(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${
                        showExplanation
                          ? index ===
                            QUIZ_DATA.chapter1[currentQuestion].correct
                            ? "bg-green-100 border-2 border-green-500"
                            : index === selectedAnswer
                            ? "bg-red-100 border-2 border-red-500"
                            : "bg-gray-100"
                          : "bg-gray-50 hover:bg-pink-200 border-2 border-pink-300 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {showExplanation &&
                          index ===
                            QUIZ_DATA.chapter1[currentQuestion].correct && (
                            <Check className="w-5 h-5" />
                          )}
                        {showExplanation &&
                          index === selectedAnswer &&
                          index !==
                            QUIZ_DATA.chapter1[currentQuestion].correct && (
                            <X className="w-5 h-5" />
                          )}
                        <span>{option}</span>
                      </div>
                    </button>
                  )
                )}
              </div>

              {showExplanation && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl">
                  <p className="text-blue-800 font-semibold">
                    💡 {QUIZ_DATA.chapter1[currentQuestion].explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <ChapterDialog
          type="intro"
          message={TTS_SCRIPTS.chapter1.intro}
          show={dialogState.show}
          onClose={() => {
            setDialogState((prev) => ({ ...prev, show: false }));
            setShowGameDialog(true);
          }}
        />

        <ChapterDialog
          type="game"
          message={TTS_SCRIPTS.chapter1.game}
          show={showGameDialog}
          onClose={() => setShowGameDialog(false)}
        />

        <ChapterDialog
          type="complete"
          message={TTS_SCRIPTS.chapter1.complete}
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
