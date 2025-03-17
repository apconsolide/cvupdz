import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Download, Calendar, Clock, Eye, Share2 } from "lucide-react";

interface Recording {
  id: string;
  sessionTitle: string;
  date: string;
  duration: string;
  thumbnailUrl: string;
  fileSize: string;
  views: number;
  downloadUrl: string;
}

interface RecordingsListProps {
  recordings?: Recording[];
  className?: string;
}

const RecordingsList = ({
  recordings = [
    {
      id: "rec1",
      sessionTitle: "Advanced Excel for Professionals",
      date: "June 15, 2023",
      duration: "3h 45m",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80",
      fileSize: "1.2 GB",
      views: 15,
      downloadUrl: "#",
    },
    {
      id: "rec2",
      sessionTitle: "Communication Skills Workshop",
      date: "June 18, 2023",
      duration: "2h 30m",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      fileSize: "850 MB",
      views: 8,
      downloadUrl: "#",
    },
    {
      id: "rec3",
      sessionTitle: "Business French for Beginners",
      date: "June 20, 2023",
      duration: "2h 15m",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80",
      fileSize: "780 MB",
      views: 12,
      downloadUrl: "#",
    },
  ],
  className,
}: RecordingsListProps) => {
  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Video className="h-5 w-5 text-cvup-gold" />
          Session Recordings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="bg-cvup-lightblue rounded-lg overflow-hidden border border-gray-700 hover:border-cvup-gold transition-colors"
              >
                <div className="relative">
                  <img
                    src={recording.thumbnailUrl}
                    alt={recording.sessionTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {recording.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                    <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue">
                      <Eye className="mr-2 h-4 w-4" />
                      Watch
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-white line-clamp-1">
                    {recording.sessionTitle}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-cvup-gold" />
                      {recording.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-cvup-gold" />
                      {recording.views} views
                    </div>
                    <Badge className="bg-[#1A1F2C] text-gray-300 text-xs">
                      {recording.fileSize}
                    </Badge>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:text-white hover:border-white"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State Card */}
            <div className="bg-cvup-lightblue rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center p-6 h-[300px]">
              <Video className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No More Recordings
              </h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                All your session recordings will appear here
              </p>
              <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                Create New Session
              </Button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="outline" className="border-gray-700 text-gray-300">
              Load More Recordings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingsList;
