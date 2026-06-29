import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import DiscoverSection from "@/components/DiscoverSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProductsSection />
      <WhyChooseUs />
      <HowItWorks />
      <DiscoverSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
