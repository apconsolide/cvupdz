import React from "react";
import FeatureCard from "./FeatureCard";
import { FileText, Video, Linkedin, BookOpen } from "lucide-react";

interface FeatureSectionProps {
  className?: string;
}

const FeatureSection = ({ className }: FeatureSectionProps) => {
  const features = [
    {
      id: "cv-builder",
      title: "CV Builder",
      description:
        "Create and optimize your CV with ATS-friendly templates designed for the Algerian job market.",
      icon: (
        <div className="w-16 h-16 rounded-full bg-cvup-lightgold flex items-center justify-center">
          <FileText className="w-8 h-8 text-cvup-blue" />
        </div>
      ),
      linkText: "Build Your CV",
      onClick: () => console.log("CV Builder clicked"),
    },
    {
      id: "interview-prep",
      title: "Interview Preparation",
      description:
        "Practice with simulated interviews and receive personalized feedback to improve your performance.",
      icon: (
        <div className="w-16 h-16 rounded-full bg-cvup-lightgold flex items-center justify-center">
          <Video className="w-8 h-8 text-cvup-blue" />
        </div>
      ),
      linkText: "Practice Now",
      onClick: () => console.log("Interview Prep clicked"),
    },
    {
      id: "linkedin",
      title: "LinkedIn Enhancement",
      description:
        "Optimize your LinkedIn profile and learn strategies to build your professional network.",
      icon: (
        <div className="w-16 h-16 rounded-full bg-cvup-lightgold flex items-center justify-center">
          <Linkedin className="w-8 h-8 text-cvup-blue" />
        </div>
      ),
      linkText: "Enhance Profile",
      onClick: () => console.log("LinkedIn Enhancement clicked"),
    },
    {
      id: "training",
      title: "Training Dashboard",
      description:
        "Access skill development courses with personalized learning paths to advance your career.",
      icon: (
        <div className="w-16 h-16 rounded-full bg-cvup-lightgold flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-cvup-blue" />
        </div>
      ),
      linkText: "Start Learning",
      onClick: () => console.log("Training Dashboard clicked"),
    },
  ];

  return (
    <div
      className={`w-full bg-cvup-blue py-20 px-6 md:px-10 lg:px-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comprehensive Career Development Tools
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our platform offers a suite of professional tools designed to help
            you succeed in your career journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              linkText={feature.linkText}
              onClick={feature.onClick}
              bgColor="#353963"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
