import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Users, Settings, Plus } from "lucide-react";
import SessionManager from "@/components/training/SessionManager";
import { useTraining } from "@/hooks/useTraining";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const SessionManagement = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { loading, error } = useTraining();
  const [activeTab, setActiveTab] = useState("upcoming");

  const isAdmin = profile?.role === "admin" || profile?.role === "supervisor";

  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <div className="flex">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Training Sessions</h1>
              {isAdmin && (
                <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                  <Plus className="mr-2 h-4 w-4" /> Create New Session
                </Button>
              )}
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start bg-[#1A1F2C] p-1 rounded-lg">
                <TabsTrigger
                  value="upcoming"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Upcoming Sessions
                </TabsTrigger>
                <TabsTrigger
                  value="recordings"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Recordings
                </TabsTrigger>
                <TabsTrigger
                  value="attendance"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Attendance Reports
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-6">
                <SessionManager />
              </TabsContent>

              <TabsContent value="recordings" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8 text-center">
                  <Video className="h-16 w-16 mx-auto text-[#ffbd59] mb-4" />
                  <h2 className="text-2xl font-bold mb-2">
                    Session Recordings
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Access recordings of past training sessions captured by the
                    Chrome extension.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {/* Recording Card */}
                    <div className="bg-[#242938] rounded-lg p-6 border border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center mb-4">
                        <Video className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        Advanced Excel for Professionals
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Recorded on June 15, 2023
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-[#ffbd59] text-[#ffbd59] hover:bg-[#ffbd59] hover:text-black"
                      >
                        View Recording
                      </Button>
                    </div>

                    {/* Empty State for No Recordings */}
                    <div className="bg-[#242938] rounded-lg p-6 border border-gray-700 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        <Video className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        No Recordings Yet
                      </h3>
                      <p className="text-sm text-gray-400 text-center mb-4">
                        Install the Chrome extension to record your sessions
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        Install Extension
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8 text-center">
                  <Users className="h-16 w-16 mx-auto text-[#ffbd59] mb-4" />
                  <h2 className="text-2xl font-bold mb-2">
                    Attendance Reports
                  </h2>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    View detailed attendance reports for all your training
                    sessions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {/* Attendance Report Card */}
                    <div className="bg-[#242938] rounded-lg p-6 border border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <div className="w-full h-40 bg-gradient-to-r from-green-500 to-blue-600 rounded-md flex items-center justify-center mb-4">
                        <Users className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        Advanced Excel for Professionals
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        15 Participants • 90% Attendance Rate
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-[#ffbd59] text-[#ffbd59] hover:bg-[#ffbd59] hover:text-black"
                      >
                        View Report
                      </Button>
                    </div>

                    {/* Empty State for No Reports */}
                    <div className="bg-[#242938] rounded-lg p-6 border border-gray-700 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        No Reports Yet
                      </h3>
                      <p className="text-sm text-gray-400 text-center mb-4">
                        Install the Chrome extension to track attendance
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        Install Extension
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Session Settings</h2>

                  <div className="space-y-8 max-w-3xl">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        Notification Settings
                      </h3>
                      <div className="bg-[#242938] p-6 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Send reminder emails</p>
                            <p className="text-sm text-gray-400">
                              Send automatic reminders to participants
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select className="bg-[#1A1F2C] border border-gray-700 rounded-md p-2 text-white">
                              <option value="10">10 minutes before</option>
                              <option value="30">30 minutes before</option>
                              <option value="60">1 hour before</option>
                              <option value="1440">1 day before</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Notification template</p>
                            <p className="text-sm text-gray-400">
                              Customize the email notification template
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            Edit Template
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        Recording Settings
                      </h3>
                      <div className="bg-[#242938] p-6 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Auto-start recording</p>
                            <p className="text-sm text-gray-400">
                              Automatically start recording when session begins
                            </p>
                          </div>
                          <div className="flex items-center h-6">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              defaultChecked
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Google Drive folder</p>
                            <p className="text-sm text-gray-400">
                              Select where to save recordings
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            Select Folder
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Recording quality</p>
                            <p className="text-sm text-gray-400">
                              Set the quality of session recordings
                            </p>
                          </div>
                          <select className="bg-[#1A1F2C] border border-gray-700 rounded-md p-2 text-white">
                            <option value="high">High (1080p)</option>
                            <option value="medium">Medium (720p)</option>
                            <option value="low">Low (480p)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        Attendance Tracking
                      </h3>
                      <div className="bg-[#242938] p-6 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Track attendance</p>
                            <p className="text-sm text-gray-400">
                              Monitor participant presence during sessions
                            </p>
                          </div>
                          <div className="flex items-center h-6">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              defaultChecked
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Attendance threshold</p>
                            <p className="text-sm text-gray-400">
                              Minimum time required to be marked as present
                            </p>
                          </div>
                          <select className="bg-[#1A1F2C] border border-gray-700 rounded-md p-2 text-white">
                            <option value="50">50% of session</option>
                            <option value="75">75% of session</option>
                            <option value="90">90% of session</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SessionManagement;
