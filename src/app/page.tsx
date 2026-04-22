import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CoreCapabilities from "@/components/landing/CoreCapabilities";
import Workflow from "@/components/landing/Workflow";
import LeaderboardPreview from "@/components/landing/LeaderboardPreview";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2]">
      <Navbar />
      <HeroSection />
      <CoreCapabilities />
      <Workflow />
      <LeaderboardPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
