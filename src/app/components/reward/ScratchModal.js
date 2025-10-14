'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function ScratchModal({ show, selectedReward, voucherCode, onClose }) {
  const [isScratching, setIsScratching] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const scratchCardRef = useRef();
  const voucherRef = useRef();
  const scratchOverlayRef = useRef();

  useEffect(() => {
    if (show) {
      setIsScratching(false);
      setShowVoucher(false);
    }
  }, [show]);

  const handleScratch = () => {
    if (isScratching) return;
    
    setIsScratching(true);
    
    // GSAP Animation for scratching effect
    const tl = gsap.timeline();
    
    // Shake animation while scratching
    tl.to(scratchCardRef.current, {
      duration: 0.1,
      x: -5,
      repeat: 10,
      yoyo: true,
      ease: "power2.inOut"
    })
    // Fade out scratch overlay
    .to(scratchOverlayRef.current, {
      duration: 1,
      opacity: 0,
      scale: 0.8,
      ease: "power2.out",
      onComplete: () => {
        setShowVoucher(true);
        setIsScratching(false);
        // Animate voucher in after state change
        setTimeout(() => {
          if (voucherRef.current) {
            gsap.fromTo(voucherRef.current, 
              { opacity: 0, scale: 0.5, y: 50 },
              { duration: 0.8, opacity: 1, scale: 1, y: 0, ease: "back.out(1.7)" }
            );
          }
        }, 50);
      }
    }, "-=0.5");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(voucherCode);
      // Add success feedback animation
      gsap.to(voucherRef.current, {
        duration: 0.2,
        scale: 1.05,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!show || !selectedReward) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-2 border-pink-200">
        <div className="text-center h-fit">
          <h3 className="text-xl font-bold text-[#382b22] mb-6">🎉 Selamat!</h3>
          
          <div className="mb-6">
            {!showVoucher ? (
              // Scratch Card
              <div 
                ref={scratchCardRef}
                className="cursor-pointer"
                onClick={handleScratch}
              >
                <div 
                  ref={scratchOverlayRef}
                  className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-8 hover:from-pink-300 hover:to-rose-300 transition-all duration-300"
                >
                  <div className="text-6xl mb-4">🎫</div>
                  <p className="text-gray-600 font-medium">Gosok untuk melihat kode voucher</p>
                  <p className="text-sm text-gray-500 mt-2">Tap untuk mengosok</p>
                </div>
              </div>
            ) : (
              // Voucher Content
              <div 
                ref={voucherRef}
                className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200"
              >
                <div className="text-3xl mb-3">🎊</div>
                <h4 className="font-bold text-[#382b22] mb-2">{selectedReward.title}</h4>
                <div className="bg-white rounded-lg p-4 border border-pink-200 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Kode Voucher:</p>
                  <p className="text-2xl font-bold text-pink-600 tracking-wider">{voucherCode}</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Gunakan kode ini di <strong>Laurier Official Store Shopee</strong>
                </p>
                <button
                  onClick={copyToClipboard}
                  className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-600 transition-all duration-300"
                >
                  📋 Salin Kode
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 hover:shadow-lg transition-all duration-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}