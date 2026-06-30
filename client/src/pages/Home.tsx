import HeroSection from "@/components/HeroSection";
import WhatsAppGroupBanner from "@/components/WhatsAppGroupBanner";
import ProductsSection from "@/components/ProductsSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhatsAppGroupBanner />
      <ProductsSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
