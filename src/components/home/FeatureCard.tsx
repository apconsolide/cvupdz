import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  linkText?: string;
  onClick?: () => void;
  bgColor?: string;
  className?: string;
}

const FeatureCard = ({
  title = "Feature Title",
  description = "This feature helps you develop your professional skills in a specific area.",
  icon,
  linkText = "Learn More",
  onClick = () => console.log("Feature card clicked"),
  bgColor = "#353963",
  className,
}: FeatureCardProps) => {
  return (
    <Card
      className={`w-full h-full overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer bg-opacity-20 backdrop-blur-md border border-gray-700 ${className}`}
      style={{
        background: `${bgColor}`,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-center items-center mb-4">{icon}</div>
        <CardTitle className="text-xl font-bold text-white text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 text-center">{description}</p>
        <Button
          className="w-full bg-cvup-gold hover:bg-cvup-gold/90 text-black font-medium"
          variant="default"
        >
          <span>{linkText}</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
