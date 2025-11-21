export default function ConfirmationModal({ show, selectedReward, onClose, onConfirm }) {
  if (!show || !selectedReward) return null;

  return (
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
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 hover:shadow-lg transition-all duration-300"
            >
              Ya, Tukar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}