'use client';

export default function VaccineInfoModal({ show, onClose, onBooking, selectedVaccine }) {
  if (!show || !selectedVaccine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-2xl mx-auto border-2 border-pink-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-2">{selectedVaccine.name}</h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#382b22]">{selectedVaccine.price}</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Efek Samping */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
            <h4 className="font-bold text-[#382b22] mb-3 flex items-center gap-2">
              <span>⚠️</span> Efek Samping yang Mungkin Terjadi
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Nyeri, kemerahan, atau bengkak di tempat suntikan (ringan dan hilang dalam 1-2 hari)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Demam ringan (37-38°C) selama 1-2 hari</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Pusing atau mual ringan (jarang terjadi)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Reaksi alergi berat sangat jarang (kurang dari 0.1%)</span>
              </li>
            </ul>
          </div>

          {/* Cara Pemberian */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-bold text-[#382b22] mb-3 flex items-center gap-2">
              <span>💉</span> Cara Pemberian Vaksin
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Disuntikkan di otot lengan atas (deltoid)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Proses penyuntikan hanya 2-3 menit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Observasi 15-30 menit setelah vaksinasi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Jadwal: Usia 9-14 tahun (2 dosis), 15+ tahun (3 dosis)</span>
              </li>
            </ul>
          </div>

          {/* Syarat & Ketentuan */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <h4 className="font-bold text-[#382b22] mb-3 flex items-center gap-2">
              <span>📋</span> Syarat & Ketentuan
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Wajib membawa KTP/kartu identitas asli</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Dalam kondisi sehat (tidak demam/sakit)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Beri tahu riwayat alergi obat/vaksin sebelumnya</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Pembayaran dapat dilakukan tunai atau melalui asuransi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Reschedule maksimal 24 jam sebelum jadwal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button 
            onClick={onClose}
            className="w-full py-3 sm:py-4 bg-white text-pink-600 rounded-full font-semibold border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300 text-sm sm:text-base"
          >
            Batal
          </button>
          <button 
            onClick={onBooking}
            className="w-full py-3 sm:py-4 bg-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Buat Janji Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}