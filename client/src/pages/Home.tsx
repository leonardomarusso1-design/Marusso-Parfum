import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import DiscoverSection from "@/components/DiscoverSection";
import ProductsSection from "@/components/ProductsSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PromoBanner />
      <HeroSection />
      <WhyChooseUs />
      <HowItWorks />
      <DiscoverSection />
      <ProductsSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
