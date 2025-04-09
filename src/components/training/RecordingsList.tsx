import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Download,
  Calendar,
  Clock,
  Eye,
  Share2,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTraining } from "@/hooks/useTraining";
import { SessionRecording } from "@/lib/api/training";

interface RecordingsListProps {
  sessionId?: string;
  recordings?: SessionRecording[];
  className?: string;
}

type SortField = "title" | "date" | "views" | "fileSize";
type SortDirection = "asc" | "desc";

const RecordingsList = ({
  sessionId,
  recordings: externalRecordings,
  className,
}: RecordingsListProps) => {
  const {
    loadSessionRecordings,
    recordings: hookRecordings,
    loading,
    error,
  } = useTraining();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Use external recordings if provided, otherwise use recordings from the hook
  const recordings = externalRecordings || hookRecordings;

  useEffect(() => {
    if (!externalRecordings && sessionId) {
      loadSessionRecordings(sessionId);
    }
  }, [sessionId, externalRecordings, loadSessionRecordings]);

  // Filter recordings based on search term
  const filteredRecordings = recordings.filter((recording) =>
    recording.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort recordings based on sort field and direction
  const sortedRecordings = [...filteredRecordings].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "views":
        comparison = a.views - b.views;
        break;
      case "fileSize":
        // Extract numeric value from fileSize string (e.g., "1.2 GB" -> 1.2)
        const sizeA = parseFloat(a.fileSize);
        const sizeB = parseFloat(b.fileSize);
        comparison = sizeA - sizeB;
        break;
      default:
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <SortAsc className="h-3 w-3" />
    ) : (
      <SortDesc className="h-3 w-3" />
    );
  };
  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Video className="h-5 w-5 text-cvup-gold" />
          Session Recordings
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-cvup-lightblue border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:border-white flex items-center gap-1"
              onClick={() => toggleSort("title")}
            >
              Title {getSortIcon("title")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:border-white flex items-center gap-1"
              onClick={() => toggleSort("date")}
            >
              Date {getSortIcon("date")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:border-white flex items-center gap-1"
              onClick={() => toggleSort("views")}
            >
              Views {getSortIcon("views")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cvup-gold"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-400">Error loading recordings: {error}</p>
          </div>
        ) : sortedRecordings.length === 0 ? (
          <div className="text-center py-10">
            <Video className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No Recordings Found
            </h3>
            <p className="text-sm text-gray-400 text-center">
              {searchTerm
                ? "Try a different search term"
                : "No recordings available for this session"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRecordings.map((recording) => (
                <div
                  key={recording.id}
                  className="bg-cvup-lightblue rounded-lg overflow-hidden border border-gray-700 hover:border-cvup-gold transition-colors"
                >
                  <div className="relative">
                    <img
                      src={
                        recording.thumbnailUrl ||
                        "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80"
                      }
                      alt={recording.title}
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
                      {recording.title}
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
                        onClick={() =>
                          window.open(recording.downloadUrl, "_blank")
                        }
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State Card */}
              {sortedRecordings.length > 0 && (
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
              )}
            </div>

            {sortedRecordings.length > 6 && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  Load More Recordings
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordingsList;
