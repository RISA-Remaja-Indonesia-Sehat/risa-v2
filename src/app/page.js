import Image from "next/image";
import HeroSection from "./landing-page/HeroSection";
import OurStaff from "./landing-page/OurStaff";
import EvidencePanel from "./landing-page/EvidencePanel";
import FeatureBannerCarousel from "./components/FeatureBannerCarousel";
import LandingPageFTUE from "./components/first-time/LandingPageFTUE";

export default function Home() {
  return (
    <>
      <LandingPageFTUE />
      <HeroSection />

      {/** Sponsor & Partner */}
      <section className="container mt-4 mb-1 mx-auto">
        <div className="flex justify-center items-center">
          <div className="p-2">
            <Image src="/image/Laboratorium_Klinik_Prodia.png" width={300} height={200} className="w-30 h-20 object-contain" alt="Laboratorium Prodia" loading="lazy" />
          </div>
          <div className="p-2">
            <Image src="/image/Laurier.png" width={300} height={200} className="w-30 h-20 object-contain" alt="Laurier" loading="lazy" />
          </div>
          <div className="p-2">
            <Image src="/image/bca.png" width={300} height={200} className="w-30 h-20 object-contain" alt="BCA" loading="lazy" />
          </div>
          <div className="p-2 mx-4">
            <Image src="/image/bkkbn.png" width={300} height={200} className="w-30 h-20 object-contain" alt="BKKBN" loading="lazy" />
          </div>
        </div>
      </section>

      {/** Features */}
      <section className="mb-8 mx-auto">
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 py-8 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-2 text-center gap-8 max-w-4xl mx-auto">
              <div className="p-6 hover:-translate-y-2 duration-300 ease-out">
                <div className="w-fit mx-auto mb-4">
                  <Image width={80} height={80} src="/image/hero-game.png" alt="Game Edukatif" className="mx-auto md:w-32 md:h-32" loading="lazy"/>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Game Edukatif</h3>
                <p className="text-sm text-gray-600 leading-6">Main sambil belajar! Uji pengetahuanmu dan dapetin poin</p>
              </div>
              <div className="p-6 hover:-translate-y-2 duration-300 ease-out">
                <div className="w-fit mx-auto mb-4">
                  <Image width={100} height={100} src="/image/hero-ai.png" alt="AI RISA" className="mx-auto md:w-fit md:h-32" loading="lazy"/>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">AI RISA</h3>
                <p className="text-sm text-gray-600 leading-6">AI yang paham kebutuhanmu. Rekomendasi artikel yang pas buat kamu</p>
              </div>
              <div className="p-6 hover:-translate-y-2 duration-300 ease-out">
                <div className="w-fit mx-auto mb-4">
                  <Image width={80} height={80} src="/image/hero-vaksin.png" alt="Info Vaksin HPV" className="mx-auto md:w-32 md:h-32" loading="lazy"/>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Info Vaksin HPV</h3>
                <p className="text-sm text-gray-600 leading-6">Info lengkap vaksin HPV: lokasi, harga, dan cara booking</p>
              </div>
              <div className="p-6 hover:-translate-y-2 duration-300 ease-out">
                <div className="w-fit mx-auto mb-4">
                  <Image width={80} height={80} src="/image/hero-kalender.png" alt="Kalender Menstruasi" className="mx-auto md:w-32 md:h-32" loading="lazy"/>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Kalender Menstruasi</h3>
                <p className="text-sm text-gray-600 leading-6">Catat siklus haid, mood, dan gejala. Privasi terjamin!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/** Feature Banner Carousel */}
      <FeatureBannerCarousel />

      {/** Evidence Panel */}
      <EvidencePanel />

      <OurStaff />

    </>
  );
}
