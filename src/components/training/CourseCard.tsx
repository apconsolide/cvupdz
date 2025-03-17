import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, User, ArrowRight } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration?: string;
  level?: string;
  category?: string;
  instructorName?: string;
  progress?: number;
  enrolled?: boolean;
  onClick?: () => void;
  onEnroll?: () => void;
  className?: string;
}

const CourseCard = ({
  id,
  title,
  description,
  thumbnailUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  duration = "4 weeks",
  level = "Intermediate",
  category = "Professional Skills",
  instructorName = "Ahmed Kaddour",
  progress = 0,
  enrolled = false,
  onClick,
  onEnroll,
  className,
}: CourseCardProps) => {
  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll) onEnroll();
  };

  return (
    <Card
      className={`bg-cvup-lightblue border-gray-700 hover:border-cvup-gold transition-colors overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-cvup-gold text-cvup-blue">{category}</Badge>
        </div>
        {enrolled && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 px-3 py-1">
            <div className="flex justify-between items-center text-xs text-white mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1 text-cvup-gold" />
            {duration}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <BookOpen className="h-3 w-3 mr-1 text-cvup-gold" />
            {level}
          </div>
          <div className="flex items-center text-xs text-gray-400 col-span-2 truncate">
            <User className="h-3 w-3 mr-1 text-cvup-gold flex-shrink-0" />
            {instructorName}
          </div>
        </div>

        {enrolled ? (
          <Button
            className="w-full bg-cvup-blue hover:bg-cvup-blue/80 text-white"
            onClick={onClick}
          >
            Continue Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            className="w-full bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
            onClick={handleEnrollClick}
          >
            Enroll Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
