'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import Link from "next/link";
import RewardGrid from '../components/reward/RewardGrid';
import ExchangeHistory from '../components/reward/ExchangeHistory';
import ConfirmationModal from '../components/reward/ConfirmationModal';
import ScratchModal from '../components/reward/ScratchModal';
import useStickers from '../store/useStickers';
import useExchangeHistory from '../store/useExchangeHistory';

export default function RewardPage() {
  const { stickers, deductStickers } = useStickers();
  const { addExchange } = useExchangeHistory();
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const handleExchange = (reward) => {
    if (stickers >= reward.cost) {
      setSelectedReward(reward);
      setShowConfirmModal(true);
    }
  };

  const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'RISA';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const confirmExchange = () => {
    if (selectedReward) {
      const newVoucherCode = generateVoucherCode();
      deductStickers(selectedReward.cost);
      setShowConfirmModal(false);
      setShowScratchModal(true);
      setVoucherCode(newVoucherCode);
      addExchange(selectedReward, newVoucherCode);
    }
  };

  const closeScratchModal = () => {
    setShowScratchModal(false);
    setSelectedReward(null);
    setVoucherCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Link href="/missions" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Misi
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#382b22] mb-4">
            Tukar Stiker Digital
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Tukarkan stiker digitalmu dengan item favoritmu!
          </p>
          
          {/* User Stickers Display */}
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-pink-200 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4">
              <Image 
                src='/image/stiker-digital.png'
                alt="stiker digital RISA"
                width={80}
                height={80}
                className="drop-shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-pink-600">{stickers} Stiker</h2>
              </div>
            </div>
          </div>
        </div>

        <RewardGrid 
          rewards={rewards} 
          onExchange={handleExchange} 
        />

        <ExchangeHistory />

        {/* How it Works Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-[#382b22] text-center mb-6">
            📋 Cara Menukar Stiker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-bold text-[#382b22] mb-2">Pilih Voucher</h3>
              <p className="text-gray-600 text-sm">Pilih voucher yang ingin kamu tukar dengan stiker digital</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-bold text-[#382b22] mb-2">Konfirmasi Penukaran</h3>
              <p className="text-gray-600 text-sm">Pastikan jumlah stiker kamu mencukupi untuk penukaran</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-bold text-[#382b22] mb-2">Terima Voucher</h3>
              <p className="text-gray-600 text-sm">Kode voucher akan muncul ketika digosok</p>
            </div>
          </div>
        </div>

        <ConfirmationModal 
          show={showConfirmModal}
          selectedReward={selectedReward}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmExchange}
        />

        <ScratchModal 
          show={showScratchModal}
          selectedReward={selectedReward}
          voucherCode={voucherCode}
          onClose={closeScratchModal}
        />
      </div>
    </div>
  );
}