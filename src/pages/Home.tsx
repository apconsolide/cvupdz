import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <Navbar />

      <Hero />

      <FeatureSection />

      <div className="w-full bg-[#121620] py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1A1F2C] to-[#242938] rounded-xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Advance Your Career?
            </h2>
            <p className="text-lg text-gray-300">
              Join thousands of professionals who have transformed their career
              prospects with CV UP's comprehensive tools and resources.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium text-lg px-8 py-6"
              size="lg"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>

      <TestimonialSection />

      <Footer />
    </div>
  );
};

export default Home;
