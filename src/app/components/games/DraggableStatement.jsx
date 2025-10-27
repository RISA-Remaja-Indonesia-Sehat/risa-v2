// components/games/DraggableStatement.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function DraggableStatement({ id, statement }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { type: 'statement' },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        // Style lift dan shadow saat dragging
        opacity: isDragging ? 0.9 : 1,
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: isDragging ? '0 15px 40px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.05)',
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners} // Menangani drag start/move
            {...attributes}
            // Tambahkan data-handler-id agar GSAP di file utama bisa menarget elemen ini
            data-handler-id={id} 
            className="bg-white rounded-xl p-6 shadow-2xl select-none transition-transform duration-300 relative current-statement-card"
        >
            <p className="text-xl font-semibold">{statement}</p>
            <p className="text-xs text-gray-400 mt-3">Tekan sebentar lalu Seret — atau ketuk tombol di bawah ini.</p>
        </div>
    );
}