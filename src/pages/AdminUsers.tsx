import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import UserTable from "@/components/admin/UserTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Search } from "lucide-react";

const AdminUsers = () => {
  return (
    <div className="min-h-screen bg-[#121620] text-white flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="User Management"
          subtitle="Manage all platform users"
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">All Users</h2>
                <p className="text-gray-400">
                  Manage user accounts and permissions
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 bg-[#242938] border-gray-700 text-white w-full sm:w-64 focus:border-[#ffbd59] focus:ring-[#ffbd59]"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-[#1A1F2C] border-b border-gray-800 p-0 h-auto w-full justify-start">
                <TabsTrigger
                  value="all"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]"
                >
                  All Users
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="inactive"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]"
                >
                  Inactive
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]"
                >
                  Pending
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <Card className="bg-[#1A1F2C] border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <UserTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <Card className="bg-[#1A1F2C] border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <UserTable
                      users={[
                        {
                          id: "1",
                          name: "Ahmed Benali",
                          email: "ahmed.benali@example.com",
                          role: "admin",
                          status: "active",
                          joinDate: "Jan 10, 2023",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
                          initials: "AB",
                        },
                        {
                          id: "2",
                          name: "Leila Mansouri",
                          email: "leila.m@example.com",
                          role: "user",
                          status: "active",
                          joinDate: "Feb 15, 2023",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Leila",
                          initials: "LM",
                        },
                        {
                          id: "3",
                          name: "Karim Hadj",
                          email: "karim.h@example.com",
                          role: "premium",
                          status: "active",
                          joinDate: "Mar 22, 2023",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
                          initials: "KH",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inactive" className="mt-6">
                <Card className="bg-[#1A1F2C] border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <UserTable
                      users={[
                        {
                          id: "4",
                          name: "Amina Berrada",
                          email: "amina.b@example.com",
                          role: "user",
                          status: "inactive",
                          joinDate: "Apr 5, 2023",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
                          initials: "AB",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <Card className="bg-[#1A1F2C] border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <UserTable
                      users={[
                        {
                          id: "5",
                          name: "Youssef Alami",
                          email: "youssef.a@example.com",
                          role: "user",
                          status: "pending",
                          joinDate: "May 18, 2023",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef",
                          initials: "YA",
                        },
                      ]}
                    />
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

export default AdminUsers;
