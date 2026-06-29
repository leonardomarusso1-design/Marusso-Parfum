import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import ProductsSection from "@/components/ProductsSection";
import DiscoverSection from "@/components/DiscoverSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
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
