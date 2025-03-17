import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import TrainingSessionTable from "@/components/admin/TrainingSessionTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter } from "lucide-react";

const AdminTrainingSessions = () => {
  return (
    <div className="min-h-screen bg-cvup-blue text-white flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Training Sessions"
          subtitle="Manage all training sessions"
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">All Sessions</h2>
                <p className="text-gray-400">
                  Manage and monitor training sessions
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Session
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-cvup-lightblue border-b border-gray-800 p-0 h-auto w-full justify-start">
                <TabsTrigger
                  value="all"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-blue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold"
                >
                  All Sessions
                </TabsTrigger>
                <TabsTrigger
                  value="scheduled"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-blue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold"
                >
                  Scheduled
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-blue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-blue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-blue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold"
                >
                  Cancelled
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <Card className="bg-cvup-lightblue border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <TrainingSessionTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scheduled" className="mt-6">
                <Card className="bg-cvup-lightblue border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <TrainingSessionTable
                      sessions={[
                        {
                          id: "1",
                          title: "Advanced Excel for Professionals",
                          date: "June 15, 2023",
                          time: "10:00 AM - 2:00 PM",
                          instructor: "Ahmed Kaddour",
                          type: "excel",
                          capacity: 25,
                          enrolled: 18,
                          status: "scheduled",
                        },
                        {
                          id: "2",
                          title: "Communication Skills Workshop",
                          date: "June 18, 2023",
                          time: "1:00 PM - 4:00 PM",
                          instructor: "Leila Benali",
                          type: "soft-skills",
                          capacity: 20,
                          enrolled: 15,
                          status: "scheduled",
                        },
                        {
                          id: "4",
                          title: "English for Job Interviews",
                          date: "June 22, 2023",
                          time: "2:00 PM - 5:00 PM",
                          instructor: "John Smith",
                          type: "english",
                          capacity: 20,
                          enrolled: 12,
                          status: "scheduled",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="in-progress" className="mt-6">
                <Card className="bg-cvup-lightblue border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <TrainingSessionTable
                      sessions={[
                        {
                          id: "3",
                          title: "Business French for Beginners",
                          date: "June 20, 2023",
                          time: "9:00 AM - 12:00 PM",
                          instructor: "Marie Dubois",
                          type: "french",
                          capacity: 15,
                          enrolled: 10,
                          status: "in-progress",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <Card className="bg-cvup-lightblue border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <TrainingSessionTable
                      sessions={[
                        {
                          id: "5",
                          title: "Excel Data Analysis",
                          date: "June 10, 2023",
                          time: "9:00 AM - 1:00 PM",
                          instructor: "Ahmed Kaddour",
                          type: "excel",
                          capacity: 25,
                          enrolled: 25,
                          status: "completed",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cancelled" className="mt-6">
                <Card className="bg-cvup-lightblue border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <p className="text-gray-400">
                        No cancelled sessions found
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTrainingSessions;
