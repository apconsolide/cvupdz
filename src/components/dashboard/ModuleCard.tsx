import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface ModuleCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  progress?: number;
  onClick?: () => void;
  bgColor?: string;
}

const ModuleCard = ({
  title = "Module Title",
  description = "This module helps you develop your professional skills in a specific area.",
  icon = (
    <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 text-xl font-bold">
      M
    </div>
  ),
  progress = 0,
  onClick = () => console.log("Module card clicked"),
  bgColor = "#1A1F2C",
}: ModuleCardProps) => {
  return (
    <Card
      className="w-[280px] h-[320px] overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer bg-opacity-20 backdrop-blur-md border border-gray-700"
      style={{
        background: `${bgColor}`,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          {icon}
          {progress > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">Progress</span>
              <div className="w-16 h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-[#ffbd59] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">{progress}%</span>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold mt-4 text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium"
          variant="default"
        >
          <span>Get Started</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
