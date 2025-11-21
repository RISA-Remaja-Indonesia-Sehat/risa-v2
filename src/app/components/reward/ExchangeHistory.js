import { useEffect } from 'react';
import useExchangeHistory from '../../store/useExchangeHistory';

export default function ExchangeHistory() {
  const { history, loading, loadHistory } = useExchangeHistory();
  
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 border-2 border-pink-200">
      <h2 className="text-xl sm:text-2xl font-bold text-[#382b22] text-center mb-4 sm:mb-6">
        📜 Riwayat Penukaran
      </h2>
      <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div key={item.id} className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-3 sm:p-4 border border-pink-200">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-pink-100 rounded-full p-2 w-10 h-10 flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}>

                </div>
                <div className="flex-1 sm:flex-initial">
                  <h3 className="font-semibold text-[#382b22] text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{item.date}</p>
                </div>
              </div>
              <div className="text-center sm:text-right w-full sm:w-auto">
                <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Berhasil
                </span>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">-{item.cost} stiker</p>
              </div>
            </div>
          </div>
        ))}
        
        {history.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <span className="text-3xl sm:text-4xl mb-2 block">📝</span>
            <p className="text-sm sm:text-base">Belum ada riwayat penukaran</p>
            <p className="text-xs sm:text-sm mt-1">Tukar stiker dengan voucher untuk melihat riwayat di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}