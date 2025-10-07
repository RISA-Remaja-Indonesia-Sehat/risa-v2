import Image from "next/image";
import useExchangeHistory from '../../store/useExchangeHistory';

export default function ExchangeHistory() {
  const { history } = useExchangeHistory();

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-pink-200">
      <h2 className="text-2xl font-bold text-[#382b22] text-center mb-6">
        📜 Riwayat Penukaran
      </h2>
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 rounded-full p-2 w-10 h-10 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}>

                </div>
                <div>
                  <h3 className="font-semibold text-[#382b22]">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Berhasil
                </span>
                <p className="text-sm text-gray-600 mt-1">-{item.cost} stiker</p>
              </div>
            </div>
          </div>
        ))}
        
        {history.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">📝</span>
            <p>Belum ada riwayat penukaran</p>
            <p className="text-sm mt-1">Tukar stiker dengan voucher untuk melihat riwayat di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}