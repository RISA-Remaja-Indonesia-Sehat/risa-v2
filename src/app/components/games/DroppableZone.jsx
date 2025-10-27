// components/games/DroppableZone.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

// Menggunakan ForwardRef agar kita bisa tetap memberikan ref dari komponen utama (jika diperlukan)
const DroppableZone = React.forwardRef(({ id, type, isOverId, handleAnswer }, ref) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id, // id akan menjadi 'mitos' atau 'fakta'
        data: { type: type }
    });

    // Cek apakah Draggable berada di atas zone ini (menggunakan state dari context)
    const isActive = isOverId === id; 

    // Styling dengan Tailwind untuk feedback visual (menggantikan GSAP pulse)
    const baseClass = "relative p-6 rounded-2xl text-center border-2 shadow-lg cursor-pointer transition-all duration-300";
    
    // Tentukan warna dasar
    const typeClasses = type === 'mitos'
        ? "border-pink-200 bg-gradient-to-br from-pink-50 to-white"
        : "border-green-200 bg-gradient-to-br from-green-50 to-white";

    // Tentukan kelas highlight saat aktif
    const activeClasses = isActive 
        ? (type === 'mitos' 
            ? 'scale-[1.07] ring-4 ring-red-400/50 border-red-400 shadow-xl' 
            : 'scale-[1.07] ring-4 ring-green-400/50 border-green-400 shadow-xl') 
        : 'hover:scale-[1.05]';

    return (
        <div
            ref={setNodeRef} // WAJIB: Ref untuk dnd-kit
            className={`${baseClass} ${typeClasses} ${activeClasses}`}
            data-type={type}
            onClick={() => handleAnswer(type)} // Tombol fallback
        >
            <div className="relative">
                <div
                    className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-inner 
                    ${type === 'mitos' ? 'bg-red-100' : 'bg-green-100'}`}>
                    {type === 'mitos' ? '❌' : '✅'}
                </div>
                <h3 className="text-2xl font-extrabold tracking-wide text-gray-700">{type.toUpperCase()}</h3>
            </div>
        </div>
    );
});

DroppableZone.displayName = 'DroppableZone';
export default DroppableZone;