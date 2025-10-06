import Image from "next/image";

export default function ExchangeHistory() {
  const historyData = [
    {
      id: 1,
      title: "Voucher Shopee Rp 10.000",
      date: "23 Desember 2024 • 14:30",
      cost: 5,
      platform: "Shopee",
      image: "/image/laurier.png",
      bgColor: "bg-orange-100"
    },
    {
      id: 2,
      title: "Voucher Tokopedia Rp 25.000",
      date: "22 Desember 2024 • 09:15",
      cost: 10,
      platform: "Tokopedia",
      image: "/image/laurier.png",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-pink-200">
      <h2 className="text-2xl font-bold text-[#382b22] text-center mb-6">
        📜 Riwayat Penukaran
      </h2>
      <div className="space-y-4">
        {historyData.map((item) => (
          <div key={item.id} className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`${item.bgColor} rounded-full p-2`}>
                  <Image 
                    src={item.image}
                    alt={item.platform}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
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
        
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">📝</span>
          <p>Belum ada riwayat penukaran lainnya</p>
          <p className="text-sm mt-1">Tukar stiker dengan voucher untuk melihat riwayat di sini</p>
        </div>
      </div>
    </div>
  );
}