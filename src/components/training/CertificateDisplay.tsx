import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface CertificateDisplayProps {
  id: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  issueDate: string;
  certificateUrl?: string;
  onBack?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

const CertificateDisplay = ({
  id,
  courseId,
  courseTitle = "Advanced Excel for Professionals",
  userName,
  issueDate = "2023-06-15",
  certificateUrl,
  onBack,
  onDownload,
  onShare,
  className,
}: CertificateDisplayProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-cvup-lightblue mr-2"
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-cvup-gold" />
              Certificate of Completion
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:text-white hover:border-white"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              size="sm"
              className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue"
              onClick={onDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-cvup-lightblue rounded-lg">
          <div className="w-full max-w-3xl bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-1">
            <div className="bg-[#1A1F2C] rounded-lg p-8 flex flex-col items-center">
              <div className="mb-6">
                <img
                  src="/logo.png"
                  alt="CV UP Logo"
                  className="h-16 w-auto"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/160x60?text=CV+UP";
                  }}
                />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Certificate of Completion
              </h2>
              <p className="text-gray-400 mb-8">This certifies that</p>

              <h1 className="text-3xl font-bold text-cvup-gold mb-4">
                {userName}
              </h1>

              <p className="text-gray-300 text-center mb-6">
                has successfully completed the course
              </p>

              <h3 className="text-2xl font-semibold text-white mb-8">
                {courseTitle}
              </h3>

              <div className="flex items-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Issue Date</p>
                  <p className="text-white">{formatDate(issueDate)}</p>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">Certificate ID</p>
                  <p className="text-white font-mono text-xs">
                    {id.substring(0, 8)}
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <div className="w-32 h-16 border-b border-gray-600 mb-2"></div>
                  <p className="text-gray-400 text-sm">Instructor Signature</p>
                </div>

                <div>
                  <Award className="h-16 w-16 text-cvup-gold mb-2 mx-auto" />
                  <p className="text-gray-400 text-sm text-center">
                    Official Seal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateDisplay;
