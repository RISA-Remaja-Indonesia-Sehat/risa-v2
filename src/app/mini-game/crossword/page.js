'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import BackButton from '@/app/components/games/BackButton';

const GRID_SIZE = 10;

export default function CrosswordPage() {
  const router = useRouter();
  const [clues, setClues] = useState([]);
  const [userGrid, setUserGrid] = useState(null);
  const [validCells, setValidCells] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchCrossword = async () => {
      try {
        const response = await fetch('https://server-risa.vercel.app/api/crossword/generate');
        const data = await response.json();
        
        if (data.success) {
          setClues(data.data.clues);
          
          const emptyGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
          const valid = new Set();
          
          data.data.clues.forEach(clue => {
            if (clue.direction === 'across') {
              for (let i = 0; i < clue.length; i++) {
                valid.add(`${clue.row}-${clue.col + i}`);
              }
            } else {
              for (let i = 0; i < clue.length; i++) {
                valid.add(`${clue.row + i}-${clue.col}`);
              }
            }
          });
          
          setUserGrid(emptyGrid);
          setValidCells(valid);
        }
      } catch (error) {
        console.error('Error fetching crossword:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrossword();
  }, []);

  const handleCellChange = (row, col, value) => {
    const letter = value.toUpperCase().replace(/[^A-Z]/g, '');
    if (letter.length > 1) return;
    
    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = letter;
    setUserGrid(newGrid);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const duration = Math.floor((Date.now() - startTime) / 1000);

    const answers = {};
    clues.forEach(clue => {
      let answer = '';
      if (clue.direction === 'across') {
        for (let i = 0; i < clue.length; i++) {
          answer += userGrid[clue.row][clue.col + i] || '';
        }
      } else {
        for (let i = 0; i < clue.length; i++) {
          answer += userGrid[clue.row + i][clue.col] || '';
        }
      }
      answers[clue.id] = answer;
    });

    try {
      const response = await fetch('https://server-risa.vercel.app/api/crossword/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          answers,
          duration_seconds: parseInt(duration)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('gameResult', JSON.stringify({
          gameType: 'CROSSWORD',
          score: data.data.score,
          correct: data.data.correct,
          total: data.data.total,
          answers: data.data.answers,
          duration_seconds: duration
        }));
        
        router.push('/mini-game/result');
      }
    } catch (error) {
      console.error('Error submitting crossword:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  // Map nomor urut (1-10) ke clue ID berdasarkan urutan di array
  const clueNumberMap = {};
  clues.forEach((clue, index) => {
    clueNumberMap[clue.id] = index + 1;
  });

  // Map nomor urut ke posisi grid
  const clueNumbers = {};
  clues.forEach(clue => {
    const key = `${clue.row}-${clue.col}`;
    if (!clueNumbers[key]) {
      clueNumbers[key] = clueNumberMap[clue.id];
    }
  });

  const acrossClues = clues.filter(c => c.direction === 'across');
  const downClues = clues.filter(c => c.direction === 'down');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 p-3 md:p-4">
      <div className="max-w-6xl mx-auto sm:p-4">
        <BackButton />

        <h1 className="text-2xl md:text-4xl text-center font-bold text-pink-600 mb-1 md:mb-2">Teka-Teki Silang</h1>
        <p className="text-sm md:text-base text-center text-gray-600 mb-6 md:mb-8">Isi kotak dengan jawaban yang tepat!</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Grid */}
          <div className="lg:col-span-2 mx-auto">
            <div className="bg-white p-3 md:p-6 rounded-2xl shadow-lg border-2 border-pink-200 overflow-x-auto">
              <div className="inline-block border-2 border-gray-300">
                {userGrid && userGrid.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex">
                    {row.map((cell, colIdx) => {
                      const isValid = validCells.has(`${rowIdx}-${colIdx}`);
                      const cellKey = `${rowIdx}-${colIdx}`;
                      const clueNum = clueNumbers[cellKey];
                      return (
                        <div key={cellKey} className="relative">
                          <input
                            type="text"
                            maxLength="1"
                            value={userGrid[rowIdx][colIdx]}
                            onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                            onClick={() => setSelectedCell({ row: rowIdx, col: colIdx })}
                            className={`w-8 h-8 md:w-10 md:h-10 text-center font-bold text-xs md:text-sm border border-gray-300 transition-all ${
                              isValid ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'
                            } ${selectedCell?.row === rowIdx && selectedCell?.col === colIdx ? 'ring-2 ring-pink-500' : ''}`}
                            disabled={!isValid}
                          />
                          {clueNum && (
                            <span className="absolute top-0 left-0 text-xs font-bold text-pink-600 leading-none p-0.5">
                              {clueNum}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clues */}
          <div className="space-y-4 md:space-y-6">
            {/* Across */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border-2 border-pink-200">
              <h3 className="font-bold text-pink-600 mb-2 md:mb-3 text-sm md:text-base">Mendatar</h3>
              <div className="space-y-1 md:space-y-2 max-h-48 md:max-h-64 overflow-y-auto text-xs md:text-sm">
                {acrossClues.map(clue => (
                  <div key={clue.id}>
                    <span className="font-bold text-pink-600">{clueNumberMap[clue.id]}. </span>
                    <span className="text-gray-700">{clue.question}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Down */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border-2 border-pink-200">
              <h3 className="font-bold text-pink-600 mb-2 md:mb-3 text-sm md:text-base">Menurun</h3>
              <div className="space-y-1 md:space-y-2 max-h-48 md:max-h-64 overflow-y-auto text-xs md:text-sm">
                {downClues.map(clue => (
                  <div key={clue.id}>
                    <span className="font-bold text-pink-600">{clueNumberMap[clue.id]}. </span>
                    <span className="text-gray-700">{clue.question}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-2 md:py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all text-sm md:text-base"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
