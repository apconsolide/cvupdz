import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, change, className }: StatCardProps) => {
  return (
    <Card
      className={cn(
        "bg-cvup-blue border-gray-700 hover:border-cvup-gold transition-all duration-300",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            {change && (
              <p
                className={`text-xs font-medium mt-1 flex items-center ${change.positive ? "text-green-500" : "text-red-500"}`}
              >
                <span
                  className={`mr-1 ${change.positive ? "text-green-500" : "text-red-500"}`}
                >
                  {change.positive ? "↑" : "↓"}
                </span>
                {change.value}
                <span className="text-gray-400 ml-1">vs last month</span>
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-cvup-lightblue">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
