'use client';

import { useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

export default function VaccineTicket({ show, onClose, vaccinationData }) {
  const ticketRef = useRef();
  
  const bookingId = useMemo(() => {
    return 'VST' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }, [show]);

  const handleDownloadJPG = async () => {
    if (!ticketRef.current) return;
    
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
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
          stylesheets.forEach(sheet => sheet.remove());
        }
      });
      
      const link = document.createElement('a');
      link.download = `tiket-vaksin-hpv-${new Date().getTime()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    } catch (error) {
      console.error('Error generating ticket:', error);
      alert('Gagal mengunduh tiket. Silakan coba lagi.');
    }
  };

  if (!show) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
            <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#ec4899', margin: '0'}}>Tiket Vaksin HPV</h3>
            <p style={{color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0'}}>Jadwal Vaksinasi Kamu</p>
          </div>

          <div style={{fontSize: '14px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Nama Lengkap</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{vaccinationData?.full_name || '-'}</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Umur</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{vaccinationData?.age || '-'} tahun</p>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Jenis Kelamin</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{vaccinationData?.gender || '-'}</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>No. HP Orang Tua</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{vaccinationData?.parent_phone || '-'}</p>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Jenis Vaksin</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>{vaccinationData?.vaccine_type || 'HPV9'}</p>
              </div>
              <div>
                <p style={{color: '#6b7280', margin: '0 0 4px 0'}}>Total Harga</p>
                <p style={{fontWeight: 'bold', color: '#ec4899', margin: '0'}}>Rp {(vaccinationData?.vaccine_price || 0).toLocaleString('id-ID')}</p>
              </div>
            </div>
            
            <div style={{borderTop: '1px solid #f9a8d4', paddingTop: '16px', marginTop: '16px'}}>
              <h4 style={{fontWeight: 'bold', color: '#382b22', margin: '0 0 12px 0'}}>📅 Jadwal Dosis</h4>
              
              <div style={{marginBottom: '12px', padding: '12px', backgroundColor: '#fce7f3', borderRadius: '8px'}}>
                <p style={{color: '#6b7280', margin: '0 0 4px 0', fontSize: '12px'}}>Dosis 1</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>
                  {formatDate(vaccinationData?.dose1_date)}
                </p>
                <p style={{fontWeight: 'bold', color: '#ec4899', margin: '4px 0 0 0'}}>
                  {formatTime(vaccinationData?.dose1_date)} WIB
                </p>
              </div>

              <div style={{padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px'}}>
                <p style={{color: '#6b7280', margin: '0 0 4px 0', fontSize: '12px'}}>Dosis 2</p>
                <p style={{fontWeight: 'bold', color: '#382b22', margin: '0'}}>
                  {formatDate(vaccinationData?.dose2_date)}
                </p>
                <p style={{fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0'}}>
                  ℹ️ Jadwal akan dikonfirmasi lebih lanjut
                </p>
              </div>
            </div>
            
            <div style={{textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #f9a8d4', marginTop: '16px'}}>
              <p style={{fontSize: '12px', color: '#ec4899', fontWeight: '500', margin: '0'}}>💝 Terima kasih telah memilih RISA</p>
              <p style={{fontSize: '11px', color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0'}}>Booking ID: #{bookingId}</p>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
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
              <Download className="w-4 h-4" />
              Unduh Tiket
            </button>
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
        </div>
      </div>
    </div>
  );
}
