import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  return (
    <div
      className={`w-full bg-[#1A1F2C] py-20 px-6 md:px-10 lg:px-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Elevate Your <span className="text-[#ffbd59]">Career</span> With
            Professional Tools
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            CV UP helps Algerian professionals create optimized CVs, prepare for
            interviews, enhance LinkedIn profiles, and develop essential skills
            for career success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium text-lg px-8 py-6"
              size="lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-[#ffbd59] text-[#ffbd59] hover:bg-[#ffbd59] hover:text-black font-medium text-lg px-8 py-6"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-6 -left-6 w-full h-full rounded-xl bg-[#ffbd59] opacity-20 transform rotate-3"></div>
            <div className="absolute -bottom-6 -right-6 w-full h-full rounded-xl bg-[#ffbd59] opacity-20 transform -rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80"
              alt="Professional Development"
              className="w-full h-auto rounded-xl shadow-2xl relative z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
