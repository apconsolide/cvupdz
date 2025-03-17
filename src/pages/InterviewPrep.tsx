import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, MessageSquare, BookOpen, Play, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InterviewPrep = () => {
  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Interview Preparation</h1>
                <p className="text-gray-400 mt-1">
                  Practice and prepare for your upcoming job interviews
                </p>
              </div>
              <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                <Video className="mr-2 h-4 w-4" />
                Start Mock Interview
              </Button>
            </div>

            <Tabs defaultValue="mock-interviews" className="w-full">
              <TabsList className="bg-[#1A1F2C] border-b border-gray-800 p-0 h-auto">
                <TabsTrigger
                  value="mock-interviews"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Mock Interviews
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Question Bank
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Resources
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mock-interviews" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Mock Interviews</h2>
                  <p className="text-gray-300 mb-6">
                    Practice with simulated interviews tailored to your industry
                    and receive detailed feedback.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Interview Type Card */}
                    <Card className="bg-[#242938] border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Video className="h-5 w-5 text-[#ffbd59]" />
                          Technical Interview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">
                          Practice technical questions and coding challenges for
                          software engineering roles.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-blue-100 text-blue-800">
                            Software
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            Coding
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            Problem Solving
                          </Badge>
                        </div>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          <Play className="mr-2 h-4 w-4" />
                          Start Practice
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Interview Type Card */}
                    <Card className="bg-[#242938] border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Video className="h-5 w-5 text-[#ffbd59]" />
                          Behavioral Interview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">
                          Practice answering questions about your past
                          experiences and how you handle situations.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-blue-100 text-blue-800">
                            Soft Skills
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            Communication
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            Leadership
                          </Badge>
                        </div>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          <Play className="mr-2 h-4 w-4" />
                          Start Practice
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Interview Type Card */}
                    <Card className="bg-[#242938] border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Video className="h-5 w-5 text-[#ffbd59]" />
                          Case Interview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">
                          Practice solving business cases and demonstrating
                          analytical thinking for consulting roles.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-blue-100 text-blue-800">
                            Consulting
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            Analysis
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            Strategy
                          </Badge>
                        </div>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          <Play className="mr-2 h-4 w-4" />
                          Start Practice
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Recent Practice Sessions
                    </h3>
                    <div className="space-y-4">
                      {/* Session Item */}
                      <div className="bg-[#242938] rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#1A1F2C] p-3 rounded-lg">
                            <Video className="h-6 w-6 text-[#ffbd59]" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">
                              Technical Interview Practice
                            </h4>
                            <p className="text-sm text-gray-400">
                              Completed on June 12, 2023
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Badge className="bg-green-100 text-green-800">
                            Score: 85%
                          </Badge>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300 flex-1 md:flex-none"
                          >
                            View Feedback
                          </Button>
                          <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium flex-1 md:flex-none">
                            <Play className="mr-2 h-4 w-4" />
                            Retry
                          </Button>
                        </div>
                      </div>

                      {/* Session Item */}
                      <div className="bg-[#242938] rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#1A1F2C] p-3 rounded-lg">
                            <Video className="h-6 w-6 text-[#ffbd59]" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">
                              Behavioral Interview Practice
                            </h4>
                            <p className="text-sm text-gray-400">
                              Completed on June 8, 2023
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Badge className="bg-green-100 text-green-800">
                            Score: 92%
                          </Badge>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300 flex-1 md:flex-none"
                          >
                            View Feedback
                          </Button>
                          <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium flex-1 md:flex-none">
                            <Play className="mr-2 h-4 w-4" />
                            Retry
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Question Bank</h2>
                  <p className="text-gray-300 mb-6">
                    Browse and practice common interview questions for different
                    industries and roles.
                  </p>

                  <div className="space-y-6">
                    {/* Question Category */}
                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Technical Questions
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            Explain the difference between REST and GraphQL.
                          </h4>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Answer Guide
                          </Button>
                        </div>
                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            How would you optimize a slow-performing database
                            query?
                          </h4>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Answer Guide
                          </Button>
                        </div>
                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            Describe your approach to debugging a complex issue.
                          </h4>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Answer Guide
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Question Category */}
                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Behavioral Questions
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            Tell me about a time when you had to deal with a
                            difficult team member.
                          </h4>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Answer Guide
                          </Button>
                        </div>
                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            Describe a situation where you had to meet a tight
                            deadline.
                          </h4>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Answer Guide
                          </Button>
                        </div>
                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            Give an example of a time when you showed leadership
                            skills.
                          </h4>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Answer Guide
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Interview Resources
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Access guides, tips, and resources to help you prepare for
                    your interviews.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Resource Card */}
                    <Card className="bg-[#242938] border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-[#ffbd59]" />
                          Interview Preparation Guide
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">
                          Comprehensive guide covering all aspects of interview
                          preparation.
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          Read Guide
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Resource Card */}
                    <Card className="bg-[#242938] border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Video className="h-5 w-5 text-[#ffbd59]" />
                          Video Tutorials
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">
                          Watch expert tutorials on answering common interview
                          questions.
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          Watch Videos
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Resource Card */}
                    <Card className="bg-[#242938] border-gray-700 hover:border-[#ffbd59] transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-[#ffbd59]" />
                          Industry-Specific Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">
                          Specialized advice for interviews in different
                          industries and roles.
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          View Tips
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Schedule a Mock Interview
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Book a one-on-one mock interview session with a professional
                    interviewer.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Available Sessions
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#1A1F2C] rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h4 className="font-medium">
                              Technical Interview Practice
                            </h4>
                            <p className="text-sm text-gray-400">
                              June 20, 2023 • 10:00 AM - 11:30 AM
                            </p>
                          </div>
                          <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium w-full md:w-auto">
                            Book Session
                          </Button>
                        </div>
                        <div className="p-4 bg-[#1A1F2C] rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h4 className="font-medium">
                              Behavioral Interview Practice
                            </h4>
                            <p className="text-sm text-gray-400">
                              June 22, 2023 • 2:00 PM - 3:30 PM
                            </p>
                          </div>
                          <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium w-full md:w-auto">
                            Book Session
                          </Button>
                        </div>
                        <div className="p-4 bg-[#1A1F2C] rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h4 className="font-medium">
                              Case Interview Practice
                            </h4>
                            <p className="text-sm text-gray-400">
                              June 25, 2023 • 11:00 AM - 12:30 PM
                            </p>
                          </div>
                          <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium w-full md:w-auto">
                            Book Session
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        My Upcoming Sessions
                      </h3>
                      <div className="p-4 bg-[#1A1F2C] rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h4 className="font-medium">
                            Technical Interview Practice
                          </h4>
                          <p className="text-sm text-gray-400">
                            June 18, 2023 • 3:00 PM - 4:30 PM
                          </p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300 flex-1 md:flex-none"
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-700 text-red-400 hover:bg-red-900/20 flex-1 md:flex-none"
                          >
                            Cancel
                          </Button>
                        </div>
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

export default InterviewPrep;
