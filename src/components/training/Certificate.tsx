import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface CertificateProps {
  id: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  issueDate: string;
  certificateUrl?: string;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

const Certificate = ({
  id,
  courseId,
  courseTitle = "Advanced Excel for Professionals",
  userName,
  issueDate = "2023-06-15",
  certificateUrl,
  onDownload,
  onShare,
  className,
}: CertificateProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card
      className={`bg-cvup-lightblue border-gray-700 hover:border-cvup-gold transition-colors overflow-hidden ${className}`}
    >
      <div className="relative">
        <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
          <Award className="h-16 w-16 text-white" />
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs text-white flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(issueDate)}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
          {courseTitle}
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Awarded to: <span className="text-white">{userName}</span>
        </p>

        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:border-white"
            onClick={onShare}
          >
            <Share2 className="h-3 w-3 mr-1" />
            Share
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue"
            onClick={onDownload}
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Certificate;
