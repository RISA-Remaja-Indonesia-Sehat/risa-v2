'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Swal from 'sweetalert2';
import ChapterDialog from '../../../components/puberty-quest/ChapterDialog';
import { TTS_SCRIPTS } from '../../../components/puberty-quest/quizData';
import usePubertyQuestStore from '../../../store/usePubertyQuestStore';

const CORRECT_ORDER = [
  'Bersihkan dari depan ke belakang',
  'Gunakan air bersih',
  'Keringkan dengan handuk bersih',
  'Ganti pakaian dalam setiap hari'
];

function SortableItem({ id, text }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`p-4 bg-pink-100 border-2 border-pink-300 rounded-2xl font-semibold text-pink-700 shadow-md touch-none select-none ${
        isDragging ? 'opacity-50 scale-105' : 'cursor-move'
      }`}
    >
      {text}
    </div>
  );
}

export default function Chapter5() {
  const router = useRouter();
  const { saveProgress } = usePubertyQuestStore();
  const [items, setItems] = useState(CORRECT_ORDER.map((text, i) => ({ id: `${i}`, text })).sort(() => Math.random() - 0.5));
  const [dialogState, setDialogState] = useState({ show: true, type: 'intro', message: TTS_SCRIPTS.chapter5.intro });
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const checkOrder = () => {
    const isCorrect = items.every((item, i) => item.text === CORRECT_ORDER[i]);
    if (isCorrect) {
      const audio = new Audio('/audio/correctAnswer.mp3');
      audio.play();
      Swal.fire({
        title: '🎉 Keren Banget!',
        text: 'Urutan perawatan kamu sudah benar!',
        icon: 'success',
        confirmButtonText: 'Lanjut',
        confirmButtonColor: '#ec4899',
        background: '#fef3ff',
        customClass: {
          popup: 'rounded-3xl',
          title: 'text-pink-600',
          confirmButton: 'rounded-xl'
        }
      }).then(() => finishChapter());
    } else {
      const audio = new Audio('/audio/wrongAnswer.mp3');
      audio.play();
      Swal.fire({
        title: '💪 Coba Lagi Yuk!',
        text: 'Urutan belum tepat nih. Kamu pasti bisa!',
        icon: 'error',
        confirmButtonText: 'Oke, Coba Lagi!',
        confirmButtonColor: '#f59e0b',
        background: '#fef3ff',
        customClass: {
          popup: 'rounded-3xl',
          title: 'text-yellow-600',
          confirmButton: 'rounded-xl'
        }
      });
    }
  };

  const finishChapter = async () => {
    await saveProgress(5, 10, true);
    setShowCompleteDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-pink-400 rounded-3xl p-6 shadow-lg mb-6 border-2 border-pink-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white mb-1">Chapter 5: Merawat Diri</h1>
              <p className="text-pink-100 text-sm md:text-base">Susun urutan perawatan yang benar!</p>
            </div>
            <button
              onClick={() => router.push('/mini-game/puberty-quest')}
              className="px-4 py-2 bg-white hover:bg-pink-100 rounded-full text-pink-600 font-bold transition-all text-sm md:text-base"
            >
              ← Kembali
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-pink-200">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <SortableItem key={item.id} id={item.id} text={item.text} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            onClick={checkOrder}
            className="w-full bg-pink-400 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-md cursor-pointer"
          >
            ✓ Cek Urutan
          </button>
        </div>

        <ChapterDialog
          type="intro"
          message={TTS_SCRIPTS.chapter5.intro}
          show={dialogState.show}
          onClose={() => {
            setDialogState((prev) => ({ ...prev, show: false }));
            setShowGameDialog(true);
          }}
        />

        <ChapterDialog
          type="game"
          message={TTS_SCRIPTS.chapter5.game}
          show={showGameDialog}
          onClose={() => setShowGameDialog(false)}
        />

        <ChapterDialog
          type="complete"
          message={TTS_SCRIPTS.chapter5.complete}
          show={showCompleteDialog}
          onClose={() => {
            setShowCompleteDialog(false);
            router.push('/mini-game/puberty-quest');
          }}
        />
      </div>
    </div>
  );
}
