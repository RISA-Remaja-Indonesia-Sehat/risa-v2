'use client';

import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import useBookingData from '../../store/useBookingData';

export default function ETicket({ show, onClose, bookingId }) {
  const ticketRef = useRef();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getBookingById } = useBookingData();

  useEffect(() => {
    if (show && bookingId) {
      fetchBookingData();
    }
  }, [show, bookingId]);

  const fetchBookingData = async () => {
    setLoading(true);
    try {
      const result = await getBookingById(bookingId);
      if (result.success) {
        setBookingData(result.data);
      } else {
        alert('Gagal memuat data booking');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJPG = async () => {
    if (!ticketRef.current || !bookingData) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          return element.tagName === 'STYLE' || element.classList?.contains('ignore-html2canvas');
        },
        onclone: (clonedDoc) => {
          // Remove all stylesheets to avoid oklch issues
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
          stylesheets.forEach(sheet => sheet.remove());
        }
      });
      
      const link = document.createElement('a');
      link.download = `e-ticket-vaksin-hpv-${bookingData?.user?.name || bookingData?.user_name}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    } catch (error) {
      console.error('Error generating ticket:', error);
      alert('Gagal mengunduh e-ticket. Silakan coba lagi.');
    }
  };

  if (!show) return null;

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: '0',
        zIndex: '50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <p>Memuat data booking...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div style={{
        position: 'fixed',
        inset: '0',
        zIndex: '50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <p>Data booking tidak ditemukan</p>
          <button onClick={onClose} style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#ec4899',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>Tutup</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: '0',
      zIndex: '50',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '32px',
        width: '100%',
        maxWidth: '448px',
        margin: '0 auto',
        border: '2px solid #fbcfe8',
        maxHeight: '95vh',
        overflowY: 'auto'
      }}>
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
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.user?.name || bookingData?.user_name}</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Usia</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.age} tahun</p>
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
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.vaccine?.name}</p>
              </div>
            </div>
            
            <div style={{borderTop: '1px solid #f9a8d4', paddingTop: '16px', marginTop: '16px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Lab Tujuan</p>
                  <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{bookingData?.lab?.name}</p>
                </div>
                <div>
                  <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Tanggal</p>
                  <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{new Date(bookingData?.date_time).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Jam</p>
                  <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{new Date(bookingData?.date_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
            
            <div style={{textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #f9a8d4', marginTop: '16px'}}>
              <p style={{fontSize: '12px', color: '#6b7280', margin: '0'}}>Booking ID: #{bookingData?.id}</p>
              <p style={{fontSize: '12px', color: '#ec4899', fontWeight: '500', marginTop: '8px', margin: '8px 0 0 0'}}>💝 Terima kasih telah mempercayai RISA</p>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 0',
              backgroundColor: '#ffffff',
              color: '#ec4899',
              borderRadius: '9999px',
              fontWeight: '600',
              border: '2px solid #f9a8d4',
              cursor: 'pointer'
            }}
          >
            Tutup
          </button>
          <button
            onClick={handleDownloadJPG}
            style={{
              width: '100%',
              padding: '12px 0',
              backgroundColor: '#ec4899',
              color: '#ffffff',
              borderRadius: '9999px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Download E-Ticket
          </button>
        </div>
      </div>
    </div>
  );
}