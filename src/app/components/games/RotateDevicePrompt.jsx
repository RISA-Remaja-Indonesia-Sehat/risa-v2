'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

const RotateDevicePrompt = () => {
    const [isMobilePortrait, setIsMobilePortrait] = useState(false);

    // Cek ukuran layar dan orientasi
    const checkOrientation = () => {
        // Cek jika lebar layar kurang dari 768px (mobile)
        const isMobile = window.innerWidth < 768;
        // Cek jika orientasi adalah portrait (tinggi > lebar)
        const isPortrait = window.innerHeight > window.innerWidth;
        
        setIsMobilePortrait(isMobile && isPortrait);
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        checkOrientation();
        // Listener untuk resize dan orientation change
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!isMobilePortrait) {
        return null; // Jangan tampilkan jika sudah landscape atau di desktop
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-gray-900/95 flex flex-col items-center justify-center p-6 text-white text-center backdrop-blur-sm">
            <RefreshCw className="w-16 h-16 animate-spin-slow mb-6 text-pink-400" />
            <h2 className="text-3xl font-extrabold mb-3">Mohon Putar Perangkat Anda</h2>
            <p className="text-lg font-medium max-w-sm">
                Game Memory Card ini dirancang untuk pengalaman terbaik dalam mode <strong>Landscape</strong>.
            </p>
            <p className="mt-4 text-sm text-gray-400">
                Putar perangkat Anda untuk melanjutkan.
            </p>
        </div>
    );
};

export default RotateDevicePrompt;