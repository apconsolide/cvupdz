import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ChromeExtensionInfo from "@/components/training/ChromeExtensionInfo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Settings, HelpCircle } from "lucide-react";

const ChromeExtension = () => {
  return (
    <div className="min-h-screen bg-cvup-blue text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Chrome Extension</h1>
                <p className="text-gray-400 mt-1">
                  Enhance your training sessions with our Chrome extension
                </p>
              </div>
              <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                <Download className="mr-2 h-4 w-4" />
                Install Extension
              </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-cvup-blue border-b border-gray-700 p-0 h-auto">
                <TabsTrigger
                  value="overview"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-lightblue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold`}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-lightblue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Extension Settings
                </TabsTrigger>
                <TabsTrigger
                  value="help"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-lightblue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold`}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <ChromeExtensionInfo />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Extension Settings
                  </h2>

                  <div className="space-y-8 max-w-3xl">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        Recording Settings
                      </h3>
                      <div className="bg-[#242938] p-6 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Auto-start recording</p>
                            <p className="text-sm text-gray-400">
                              Automatically start recording when joining a
                              session
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
                            <p className="font-medium">Auto-stop recording</p>
                            <p className="text-sm text-gray-400">
                              Automatically stop recording when the session ends
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
                        Google Drive Integration
                      </h3>
                      <div className="bg-[#242938] p-6 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Google Drive account</p>
                            <p className="text-sm text-gray-400">
                              Connect your Google Drive account
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            Connect Account
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Storage folder</p>
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
                            <p className="font-medium">Tracking interval</p>
                            <p className="text-sm text-gray-400">
                              How often to check for participant presence
                            </p>
                          </div>
                          <select className="bg-[#1A1F2C] border border-gray-700 rounded-md p-2 text-white">
                            <option value="1">Every minute</option>
                            <option value="5">Every 5 minutes</option>
                            <option value="10">Every 10 minutes</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="help" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Help & Support</h2>

                  <div className="space-y-8 max-w-3xl">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        Frequently Asked Questions
                      </h3>
                      <div className="bg-[#242938] p-6 rounded-lg space-y-6">
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">
                            How do I install the Chrome extension?
                          </h4>
                          <p className="text-sm text-gray-300">
                            Click the "Install Extension" button at the top of
                            this page. This will take you to the Chrome Web
                            Store where you can add the extension to your
                            browser.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-white">
                            Does the extension work with other browsers?
                          </h4>
                          <p className="text-sm text-gray-300">
                            Currently, the extension is only available for
                            Google Chrome. We are working on versions for
                            Firefox and Edge.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-white">
                            How are recordings stored?
                          </h4>
                          <p className="text-sm text-gray-300">
                            Recordings are saved directly to your Google Drive
                            account. You can select a specific folder in the
                            extension settings.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-white">
                            Is my data secure?
                          </h4>
                          <p className="text-sm text-gray-300">
                            Yes, all recordings and attendance data are stored
                            in your own Google Drive account. The extension only
                            requests the minimum permissions needed to function.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        Contact Support
                      </h3>
                      <div className="bg-[#242938] p-6 rounded-lg">
                        <p className="text-gray-300 mb-4">
                          If you're experiencing issues with the Chrome
                          extension or have questions not covered in the FAQ,
                          please contact our support team.
                        </p>
                        <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                          Contact Support
                        </Button>
                      </div>
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

export default ChromeExtension;
