'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function ETicket({ show, onClose, bookingData }) {
  const ticketRef = useRef();

  const handleDownloadJPG = async () => {
    if (!ticketRef.current || !bookingData) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `e-ticket-vaksin-hpv-${bookingData.nama || 'user'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    } catch (error) {
      console.error('Error generating ticket:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto border-2 border-pink-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div ref={ticketRef} style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #f8bbd9',
          marginBottom: '24px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{textAlign: 'center', marginBottom: '24px'}}>
            <span style={{fontSize: '36px', display: 'inline-block', marginBottom: '16px'}}>🎫</span>
            <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#ec4899', margin: '0'}}>E-Ticket Vaksin HPV</h3>
            <p style={{color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0'}}>Tunjukkan tiket ini saat kedatangan</p>
          </div>

          <div style={{fontSize: '14px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>NIK</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.nik}</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Nama</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.nama}</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Usia</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.usia} tahun</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Gender</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.gender}</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>No. HP</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.phone}</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Vaksin</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.vaccineType}</p>
              </div>
            </div>
            
            <div style={{borderTop: '1px solid #f9a8d4', paddingTop: '16px', marginTop: '16px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Lab Tujuan</p>
                  <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.lab}</p>
                </div>
                <div>
                  <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Tanggal</p>
                  <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.tanggal}</p>
                </div>
                <div>
                  <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Jam</p>
                  <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.jam}</p>
                </div>
              </div>
            </div>
            
            <div style={{textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #f9a8d4', marginTop: '16px'}}>
              <p style={{fontSize: '12px', color: '#6b7280', margin: '0'}}>Booking ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p style={{fontSize: '12px', color: '#ec4899', fontWeight: '500', marginTop: '8px', margin: '8px 0 0 0'}}>💝 Terima kasih telah mempercayai RISA</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-pink-600 rounded-full font-semibold border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300"
          >
            Tutup
          </button>
          <button
            onClick={handleDownloadJPG}
            className="w-full py-3 bg-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Download E-Ticket
          </button>
        </div>
      </div>
    </div>
  );
}