import Image from "next/image";
import HeroSection from "./landing-page/HeroSection";
import OurStaff from "./landing-page/OurStaff";
import FeatureBannerCarousel from "./components/FeatureBannerCarousel";
import FTUEWrapper from "./components/first-time/FTUEWrapper";

export default function Home() {
  return (
    <>
      <FTUEWrapper />
      
      <HeroSection />

      {/** Features */}
      <section className="my-8 mx-auto">
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 py-8 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-2 text-center gap-8 max-w-4xl mx-auto">
              <div className="p-6 hover:-translate-y-2 duration-300 ease-out">
                <div className="w-fit mx-auto mb-4">
                  <Image width={80} height={80} src="/image/hero-game.png" alt="Game Edukatif" className="mx-auto md:w-32 md:h-32"/>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Game Edukatif</h3>
                <p className="text-sm text-gray-600 leading-6">Game seru untuk uji pengetahuanmu sekaligus nambah wawasan baru</p>
              </div>
              <div className="p-6 hover:-translate-y-2 duration-300 ease-out">
                <div className="w-fit mx-auto mb-4">
                  <Image width={100} height={100} src="/image/hero-ai.png" alt="AI RISA" className="mx-auto md:w-fit md:h-32"/>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">AI RISA</h3>
                <p className="text-sm text-gray-600 leading-6">AI yang dipersonalisasi untuk merekomendasikan artikel edukatif yang relevan dengan kebutuhanmu</p>
              </div>
              <div className="p-6 hover:-translate-y-2 duration-300 ease-out">
                <div className="w-fit mx-auto mb-4">
                  <Image width={80} height={80} src="/image/hero-vaksin.png" alt="Info Vaksin HPV" className="mx-auto md:w-32 md:h-32"/>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Info Vaksin HPV</h3>
                <p className="text-sm text-gray-600 leading-6">Temukan informasi lengkap tentang vaksin HPV, termasuk lokasi layanan dan harga</p>
              </div>
              <div className="p-6 hover:-translate-y-2 duration-300 ease-out">
                <div className="w-fit mx-auto mb-4">
                  <Image width={80} height={80} src="/image/hero-kalender.png" alt="Kalender Menstruasi" className="mx-auto md:w-32 md:h-32"/>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Kalender Menstruasi</h3>
                <p className="text-sm text-gray-600 leading-6">Buat catatan tentang haid, gejala, dan mood harian secara mudah dan rahasia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/** Feature Banner Carousel */}
      <FeatureBannerCarousel />

      <OurStaff />

      {/** Sponsor & Partner */}
      <section className="container my-16 mx-auto">
        <div className="mb-1">
          <h4 className="font-semibold text-center text-2xl">Sponsor & Partner</h4>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex flex-col items-center p-4">
            <Image src="/image/Laboratorium_Klinik_Prodia.png" width={120} height={80} className="w-30 h-20 object-contain mb-2" alt="Laboratorium Prodia" />
            <span className="text-center text-sm text-gray-600 font-medium">PT Prodia Widyahusada Tbk</span>
          </div>
          <div className="flex flex-col items-center p-4">
            <Image src="/image/Laurier.png" width={120} height={80} className="w-30 h-20 object-contain mb-2" alt="Laurier" />
            <span className="text-center text-sm text-gray-600 font-medium">PT Kao Indonesia</span>
          </div>
        </div>
      </section>
    </>
  );
}
