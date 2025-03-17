import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import UserTable from "@/components/admin/UserTable";
import TrainingSessionTable from "@/components/admin/TrainingSessionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Calendar, TrendingUp, Plus } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-cvup-blue text-white flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Admin Dashboard"
          subtitle="Overview of your platform's performance"
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value="1,248"
                icon={<Users className="h-5 w-5 text-cvup-gold" />}
                change={{ value: "12%", positive: true }}
              />
              <StatCard
                title="CV Templates Used"
                value="3,567"
                icon={<FileText className="h-5 w-5 text-cvup-gold" />}
                change={{ value: "8%", positive: true }}
              />
              <StatCard
                title="Training Sessions"
                value="42"
                icon={<Calendar className="h-5 w-5 text-cvup-gold" />}
                change={{ value: "5%", positive: true }}
              />
              <StatCard
                title="Monthly Growth"
                value="24%"
                icon={<TrendingUp className="h-5 w-5 text-cvup-gold" />}
                change={{ value: "3%", positive: true }}
              />
            </div>

            {/* Recent Users Section */}
            <Card className="bg-cvup-blue border-gray-700 shadow-lg">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-white">
                  Recent Users
                </CardTitle>
                <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <UserTable />
              </CardContent>
            </Card>

            {/* Training Sessions Section */}
            <Card className="bg-cvup-blue border-gray-700 shadow-lg">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-white">
                  Training Sessions
                </CardTitle>
                <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Session
                </Button>
              </CardHeader>
              <CardContent>
                <TrainingSessionTable />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
