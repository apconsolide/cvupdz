import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, FileText, Users } from "lucide-react";
import { useUserActivity } from "@/hooks/useUserActivity";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "cv" | "interview" | "linkedin" | "training";
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
    initials: string;
  };
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const getActivityIcon = (type: ActivityItem["type"] | string) => {
  switch (type) {
    case "cv":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "interview":
      return <Users className="h-4 w-4 text-green-500" />;
    case "linkedin":
      return <Users className="h-4 w-4 text-blue-700" />;
    case "training":
      return <Award className="h-4 w-4 text-amber-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getActivityBadge = (type: ActivityItem["type"] | string) => {
  switch (type) {
    case "cv":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          CV Builder
        </Badge>
      );
    case "interview":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Interview Prep
        </Badge>
      );
    case "linkedin":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          LinkedIn
        </Badge>
      );
    case "training":
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
          Training
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Activity
        </Badge>
      );
  }
};

const formatTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "some time ago";
  }
};

const RecentActivity = ({
  activities: defaultActivities,
}: RecentActivityProps) => {
  const { activities: backendActivities, loading } = useUserActivity();

  // Map backend activities to the format expected by the component
  const mappedActivities = backendActivities.map((activity) => ({
    id: activity.id,
    type: activity.activityType as ActivityItem["type"],
    title: activity.description.split(".")[0], // Use first sentence as title
    description: activity.description,
    timestamp: formatTime(activity.createdAt),
    user: {
      name: "Current User",
      initials: "CU",
    },
  }));

  // Use backend activities if available, otherwise use default activities
  const displayActivities =
    mappedActivities.length > 0 ? mappedActivities : defaultActivities;

  if (loading) {
    return (
      <Card className="w-full bg-[#1A1F2C] text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#ffbd59]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-lg bg-[#242938]"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-16 bg-gray-700 rounded"></div>
                      <div className="h-3 w-12 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#1A1F2C] text-white border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#ffbd59]" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities && displayActivities.length > 0 ? (
            displayActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg bg-[#242938] hover:bg-[#2A3042] transition-colors"
              >
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10 border-2 border-[#ffbd59]">
                    {activity.user?.avatar ? (
                      <AvatarImage
                        src={activity.user.avatar}
                        alt={activity.user.name}
                      />
                    ) : (
                      <AvatarFallback className="bg-[#2A3042] text-[#ffbd59]">
                        {activity.user?.initials || "CV"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.title}</p>
                    <div className="flex items-center gap-2">
                      {getActivityBadge(activity.type)}
                      <span className="text-xs text-gray-400">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="h-12 w-12 text-gray-500 mb-3" />
              <p className="text-gray-400">No recent activity to display</p>
              <p className="text-sm text-gray-500 mt-1">
                Your activities will appear here as you use the platform
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    type: "cv",
    title: "CV Updated",
    description: "You've updated your CV with new skills and experiences.",
    timestamp: "2 hours ago",
    user: {
      name: "Current User",
      initials: "CU",
    },
  },
  {
    id: "2",
    type: "interview",
    title: "Interview Practice Completed",
    description:
      "You've completed a mock interview session for Software Engineer position.",
    timestamp: "Yesterday",
    user: {
      name: "Current User",
      initials: "CU",
    },
  },
  {
    id: "3",
    type: "linkedin",
    title: "LinkedIn Profile Optimized",
    description:
      "Your LinkedIn profile has been optimized with new recommendations.",
    timestamp: "3 days ago",
    user: {
      name: "Current User",
      initials: "CU",
    },
  },
  {
    id: "4",
    type: "training",
    title: "Course Completed",
    description: "You've completed 'Professional Communication Skills' course.",
    timestamp: "1 week ago",
    user: {
      name: "Current User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      initials: "CU",
    },
  },
];

export default RecentActivity;
