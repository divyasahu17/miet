"use client";
import TopBar from '@/components/TopBar';
import WelcomeBoard from '@/components/WelcomeBoard';
import SearchPanel from '@/components/SearchPanel';
import FeaturedSection from '@/components/FeaturedSection';
import WebinarSection from '@/components/WebinarSection';
import MarketplaceSection from '@/components/MarketplaceSection';
import ImageGallery from '@/components/ImageGallery';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import '@fontsource/righteous';
import '@fontsource/josefin-sans';

export default function Home() {
  return (
    <>
      <TopBar />
      <WelcomeBoard />
      <SearchPanel />
      <FeaturedSection />
      <WebinarSection />
      <MarketplaceSection />
      <ImageGallery />
      <BlogSection />
      <Footer />
    </>
  );
}
