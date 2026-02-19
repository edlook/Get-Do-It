import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import Categories from '@/components/Categories';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <StatsBar />
      <Categories />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
