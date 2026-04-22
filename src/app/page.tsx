import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyItMatters from "@/components/landing/WhyItMatters";
import TiersSection from "@/components/landing/TiersSection";
import DeviceSupport from "@/components/landing/DeviceSupport";
import LeaderboardPreview from "@/components/landing/LeaderboardPreview";
import IphoneTeaser from "@/components/landing/IphoneTeaser";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <WhyItMatters />
      <TiersSection />
      <DeviceSupport />
      <LeaderboardPreview />
      <IphoneTeaser />
      <FAQ />
      <Footer />
    </div>
  );
}
