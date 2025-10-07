import useStickers from '@/app/store/useStickers';

export default function RewardGrid({ rewards, onExchange }) {
  const { stickers } = useStickers();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {rewards.map((reward) => (
        <div key={reward.id} className={`bg-gradient-to-br ${reward.color} rounded-3xl shadow-lg p-6 border-2 ${reward.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
          <div className="text-center mb-4">
            <div 
              className="bg-white rounded-2xl mb-4 shadow-md h-64 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${reward.image})` }}
            >
            </div>
            <h3 className="font-bold text-[#382b22] text-lg mb-2">{reward.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
            
            <div className="text-center">
              <span className="text-pink-600 font-bold text-lg">{reward.cost} Stiker</span>
            </div>
          </div>
          
          <button
            onClick={() => onExchange(reward)}
            disabled={stickers < reward.cost}
            className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
              stickers >= reward.cost
                ? 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-lg hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {stickers >= reward.cost ? 'Tukar Sekarang' : 'Stiker Tidak Cukup'}
          </button>
        </div>
      ))}
    </div>
  );
}