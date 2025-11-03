// store/useUserScoreStore.js (PERBARUI FILE INI)

import { create } from 'zustand';

// Mendapatkan nilai total skor yang tersimpan dari browser (localStorage) 
// saat store pertama kali diinisialisasi.
const getInitialScore = () => {
    if (typeof window !== 'undefined') {
        const storedScore = localStorage.getItem('totalUserScore');
        return storedScore ? parseInt(storedScore, 10) : 0;
    }
    return 0;
};

const useUserScoreStore = create((set) => ({
    // State Awal: Diinisialisasi dari localStorage (atau 0)
    userScore: getInitialScore(),
    
    /**
     * Fungsi untuk MENAMBAH skor game yang baru dimainkan ke total skor user.
     * Skor total juga disimpan ke localStorage.
     * @param {number} scoreToAdd - Skor yang didapat dari game yang baru selesai.
     */
    addScore: (scoreToAdd) => 
        set((state) => {
            const newTotalScore = state.userScore + scoreToAdd;
            
            // [PENTING] Simpan total skor baru ke localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('totalUserScore', newTotalScore.toString());
            }
            
            // Kembalikan state baru
            return { userScore: newTotalScore };
        }),
        
    /**
     * Fungsi untuk MENGGANTI total skor user (misal: saat setelan admin)
     * @param {number} score - Nilai total skor baru.
     */
    setTotalScore: (score) => 
        set(() => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('totalUserScore', score.toString());
            }
            return { userScore: score };
        }),

        
        resetScore: () => 
        set(() => {
            if (typeof window !== 'undefined') {
               
                localStorage.setItem('totalUserScore', '0');
            }
            // Atur ulang state di Zustand menjadi 0
            return { userScore: 0 };
        }),
}));

export default useUserScoreStore;