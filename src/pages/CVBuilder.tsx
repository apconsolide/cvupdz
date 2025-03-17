import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Edit, Eye, Plus } from "lucide-react";

const CVBuilder = () => {
  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">CV Builder</h1>
                <p className="text-gray-400 mt-1">
                  Create and optimize your professional CV
                </p>
              </div>
              <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                <Plus className="mr-2 h-4 w-4" />
                Create New CV
              </Button>
            </div>

            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="bg-[#1A1F2C] border-b border-gray-800 p-0 h-auto">
                <TabsTrigger
                  value="templates"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger
                  value="my-cvs"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  My CVs
                </TabsTrigger>
                <TabsTrigger
                  value="optimization"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Optimization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">CV Templates</h2>
                  <p className="text-gray-300 mb-6">
                    Choose from our collection of ATS-friendly templates
                    designed for the Algerian job market.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Template Card */}
                    <div className="bg-[#242938] rounded-lg overflow-hidden border border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
                          alt="Professional CV Template"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-[#ffbd59] text-black px-2 py-1 rounded text-xs font-medium">
                          Popular
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1">
                          Professional
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Clean and modern design for corporate roles
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          Use Template
                        </Button>
                      </div>
                    </div>

                    {/* Template Card */}
                    <div className="bg-[#242938] rounded-lg overflow-hidden border border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80"
                          alt="Creative CV Template"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1">Creative</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Modern design for creative industries
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          Use Template
                        </Button>
                      </div>
                    </div>

                    {/* Template Card */}
                    <div className="bg-[#242938] rounded-lg overflow-hidden border border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1586282391129-76a6df230234?w=800&q=80"
                          alt="Academic CV Template"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1">Academic</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Detailed format for academic positions
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="my-cvs" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">My CVs</h2>

                  <div className="space-y-4">
                    {/* CV Item */}
                    <div className="bg-[#242938] rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1A1F2C] p-3 rounded-lg">
                          <FileText className="h-8 w-8 text-[#ffbd59]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            Software Engineer CV
                          </h3>
                          <p className="text-sm text-gray-400">
                            Last updated: June 10, 2023
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 flex-1 md:flex-none"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 flex-1 md:flex-none"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium flex-1 md:flex-none">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* CV Item */}
                    <div className="bg-[#242938] rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1A1F2C] p-3 rounded-lg">
                          <FileText className="h-8 w-8 text-[#ffbd59]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            Project Manager CV
                          </h3>
                          <p className="text-sm text-gray-400">
                            Last updated: May 22, 2023
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 flex-1 md:flex-none"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 flex-1 md:flex-none"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium flex-1 md:flex-none">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="optimization" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">CV Optimization</h2>
                  <p className="text-gray-300 mb-6">
                    Get personalized feedback to improve your CV and increase
                    your chances of getting interviews.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        ATS Optimization
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Check if your CV is optimized for Applicant Tracking
                        Systems (ATS) used by employers.
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        Check ATS Score
                      </Button>
                    </div>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Professional Review
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Get your CV reviewed by industry professionals with
                        expertise in your field.
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        Request Review
                      </Button>
                    </div>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Keyword Optimization
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Analyze your CV for industry-specific keywords to
                        improve visibility.
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        Analyze Keywords
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

export default CVBuilder;
