import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyKyrgyzstan from "@/components/WhyKyrgyzstan";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import ToursSection from "@/components/ToursSection";
import HotelsSection from "@/components/HotelsSection";
import TransportSection from "@/components/TransportSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main>
        <HeroSection />
        <WhyKyrgyzstan />
        <FeaturedDestinations />
        <ToursSection />
        <HotelsSection />
        <TransportSection />
        <ContactSection />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
