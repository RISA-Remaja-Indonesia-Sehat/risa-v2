'use client';

import Image from "next/image";
import { useState } from 'react';
import Link from "next/link";
import RewardGrid from '../components/reward/RewardGrid';
import ExchangeHistory from '../components/reward/ExchangeHistory';

export default function RewardPage() {
  const [userStickers, setUserStickers] = useState(14);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const rewards = [
    {
      id: 1,
      title: "Voucher Shopee Rp 10.000",
      cost: 5,
      platform: "Shopee",
      image: "/image/shopee.png",
      description: "Voucher belanja untuk semua kategori produk",
      borderColor: "border-orange-200"
    },
    {
      id: 2,
      title: "Voucher Shopee Rp 25.000",
      cost: 10,
      platform: "Shopee",
      image: "/image/shopee.png",
      description: "Voucher belanja untuk semua kategori produk",
      borderColor: "border-orange-200"
    },
    {
      id: 3,
      title: "Voucher Tokopedia Rp 10.000",
      cost: 5,
      platform: "Tokopedia",
      image: "/image/tokopedia.png",
      description: "Voucher belanja untuk semua kategori produk",
      borderColor: "border-green-200"
    },
    {
      id: 4,
      title: "Voucher Tokopedia Rp 25.000",
      cost: 10,
      platform: "Tokopedia",
      image: "/image/tokopedia.png",
      description: "Voucher belanja untuk semua kategori produk",
      borderColor: "border-green-200"
    },
    {
      id: 5,
      title: "Voucher Shopee Rp 50.000",
      cost: 20,
      platform: "Shopee",
      image: "/image/shopee.png",
      description: "Voucher belanja untuk semua kategori produk",
      borderColor: "border-orange-200"
    },
    {
      id: 6,
      title: "Voucher Tokopedia Rp 50.000",
      cost: 20,
      platform: "Tokopedia",
      image: "/image/tokopedia.png",
      description: "Voucher belanja untuk semua kategori produk",
      borderColor: "border-green-200"
    }
  ];

  const handleExchange = (reward) => {
    if (userStickers >= reward.cost) {
      setSelectedReward(reward);
      setShowConfirmModal(true);
    }
  };

  const confirmExchange = () => {
    if (selectedReward) {
      setUserStickers(prev => prev - selectedReward.cost);
      setShowConfirmModal(false);
      setSelectedReward(null);
      alert(`Berhasil menukar ${selectedReward.cost} stiker dengan ${selectedReward.title}!`);
    }
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
            🎁 Tukar Stiker Digital
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Tukarkan stiker digitalmu dengan voucher belanja menarik!
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
                <h2 className="text-2xl font-bold text-pink-600">{userStickers} Stiker</h2>
              </div>
            </div>
          </div>
        </div>

        <RewardGrid 
          rewards={rewards} 
          userStickers={userStickers} 
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
              <p className="text-gray-600 text-sm">Voucher akan dikirim ke email atau nomor HP yang terdaftar</p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-2 border-pink-200">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🎁</span>
                <h3 className="text-xl font-bold text-[#382b22] mb-4">Konfirmasi Penukaran</h3>
                <p className="text-gray-600 mb-6">
                  Apakah kamu yakin ingin menukar <strong>{selectedReward.cost} stiker</strong> dengan <strong>{selectedReward.title}</strong>?
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmExchange}
                    className="flex-1 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 hover:shadow-lg transition-all duration-300"
                  >
                    Ya, Tukar!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}