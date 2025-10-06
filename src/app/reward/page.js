'use client';

import Image from "next/image";
import { useState } from 'react';
import Link from "next/link";

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
      image: "https://logos-world.net/wp-content/uploads/2020/11/Shopee-Logo.png",
      description: "Voucher belanja untuk semua kategori produk",
      color: "from-orange-100 to-red-100",
      borderColor: "border-orange-200"
    },
    {
      id: 2,
      title: "Voucher Shopee Rp 25.000",
      cost: 10,
      platform: "Shopee",
      image: "https://logos-world.net/wp-content/uploads/2020/11/Shopee-Logo.png",
      description: "Voucher belanja untuk semua kategori produk",
      color: "from-orange-100 to-red-100",
      borderColor: "border-orange-200"
    },
    {
      id: 3,
      title: "Voucher Tokopedia Rp 10.000",
      cost: 5,
      platform: "Tokopedia",
      image: "https://logos-world.net/wp-content/uploads/2020/11/Tokopedia-Logo.png",
      description: "Voucher belanja untuk semua kategori produk",
      color: "from-green-100 to-emerald-100",
      borderColor: "border-green-200"
    },
    {
      id: 4,
      title: "Voucher Tokopedia Rp 25.000",
      cost: 10,
      platform: "Tokopedia",
      image: "https://logos-world.net/wp-content/uploads/2020/11/Tokopedia-Logo.png",
      description: "Voucher belanja untuk semua kategori produk",
      color: "from-green-100 to-emerald-100",
      borderColor: "border-green-200"
    },
    {
      id: 5,
      title: "Voucher Shopee Rp 50.000",
      cost: 20,
      platform: "Shopee",
      image: "https://logos-world.net/wp-content/uploads/2020/11/Shopee-Logo.png",
      description: "Voucher belanja untuk semua kategori produk",
      color: "from-orange-100 to-red-100",
      borderColor: "border-orange-200"
    },
    {
      id: 6,
      title: "Voucher Tokopedia Rp 50.000",
      cost: 20,
      platform: "Tokopedia",
      image: "https://logos-world.net/wp-content/uploads/2020/11/Tokopedia-Logo.png",
      description: "Voucher belanja untuk semua kategori produk",
      color: "from-green-100 to-emerald-100",
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
                <p className="text-gray-600 text-sm">Stiker tersedia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {rewards.map((reward) => (
            <div key={reward.id} className={`bg-gradient-to-br ${reward.color} rounded-3xl shadow-lg p-6 border-2 ${reward.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              <div className="text-center mb-4">
                <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
                  <Image 
                    src={reward.image}
                    alt={reward.platform}
                    width={80}
                    height={40}
                    className="mx-auto object-contain"
                  />
                </div>
                <h3 className="font-bold text-[#382b22] text-lg mb-2">{reward.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                
                <div className="bg-white rounded-full px-4 py-2 mb-4 shadow-md">
                  <span className="text-pink-600 font-bold text-lg">{reward.cost} Stiker</span>
                </div>
              </div>
              
              <button
                onClick={() => handleExchange(reward)}
                disabled={userStickers < reward.cost}
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                  userStickers >= reward.cost
                    ? 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-lg hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {userStickers >= reward.cost ? 'Tukar Sekarang' : 'Stiker Tidak Cukup'}
              </button>
            </div>
          ))}
        </div>

        {/* Exchange History Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-[#382b22] text-center mb-6">
            📜 Riwayat Penukaran
          </h2>
          <div className="space-y-4">
            {/* Sample exchange history - replace with real data */}
            <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 rounded-full p-2">
                    <Image 
                      src="https://logos-world.net/wp-content/uploads/2020/11/Shopee-Logo.png"
                      alt="Shopee"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#382b22]">Voucher Shopee Rp 10.000</h3>
                    <p className="text-sm text-gray-600">23 Desember 2024 • 14:30</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Berhasil
                  </span>
                  <p className="text-sm text-gray-600 mt-1">-5 stiker</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Image 
                      src="https://logos-world.net/wp-content/uploads/2020/11/Tokopedia-Logo.png"
                      alt="Tokopedia"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#382b22]">Voucher Tokopedia Rp 25.000</h3>
                    <p className="text-sm text-gray-600">22 Desember 2024 • 09:15</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Berhasil
                  </span>
                  <p className="text-sm text-gray-600 mt-1">-10 stiker</p>
                </div>
              </div>
            </div>
            
            {/* Empty state when no history */}
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">📝</span>
              <p>Belum ada riwayat penukaran lainnya</p>
              <p className="text-sm mt-1">Tukar stiker dengan voucher untuk melihat riwayat di sini</p>
            </div>
          </div>
        </div>

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