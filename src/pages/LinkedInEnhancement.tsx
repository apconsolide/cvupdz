import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Linkedin, Edit, Users, BarChart, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LinkedInEnhancement = () => {
  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">LinkedIn Enhancement</h1>
                <p className="text-gray-400 mt-1">
                  Optimize your LinkedIn profile and build your professional
                  network
                </p>
              </div>
              <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                <Linkedin className="mr-2 h-4 w-4" />
                Connect LinkedIn
              </Button>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="bg-[#1A1F2C] border-b border-gray-800 p-0 h-auto">
                <TabsTrigger
                  value="profile"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Profile Optimization
                </TabsTrigger>
                <TabsTrigger
                  value="network"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Network Building
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Content Strategy
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-[#242938] data-[state=active]:text-[#ffbd59] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#ffbd59]`}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Profile Optimization
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Enhance your LinkedIn profile to attract recruiters and grow
                    your professional network.
                  </p>

                  <div className="space-y-6">
                    <Card className="bg-[#242938] border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Linkedin className="h-5 w-5 text-[#ffbd59]" />
                          Profile Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300">Current Score</span>
                          <span className="text-[#ffbd59] font-bold">68%</span>
                        </div>
                        <Progress value={68} className="h-2 mb-4" />
                        <p className="text-sm text-gray-400 mb-4">
                          Your profile is performing well, but there's room for
                          improvement. Follow the recommendations below to
                          increase your visibility.
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          Run Full Analysis
                        </Button>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Recommendations</h3>

                      <div className="bg-[#242938] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">
                            Add a professional profile photo
                          </h4>
                          <span className="text-[#ffbd59] text-sm font-medium">
                            High Impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Profiles with professional photos receive 14x more
                          views. Upload a high-quality headshot with a neutral
                          background.
                        </p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          View Tips
                        </Button>
                      </div>

                      <div className="bg-[#242938] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Enhance your headline</h4>
                          <span className="text-[#ffbd59] text-sm font-medium">
                            Medium Impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Your headline appears in search results. Make it
                          compelling with keywords relevant to your industry.
                        </p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          View Tips
                        </Button>
                      </div>

                      <div className="bg-[#242938] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Add more skills</h4>
                          <span className="text-[#ffbd59] text-sm font-medium">
                            Medium Impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          You've added 12 skills, but LinkedIn allows up to 50.
                          Add more relevant skills to appear in more searches.
                        </p>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          View Tips
                        </Button>
                      </div>
                    </div>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Professional Review
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Get personalized feedback on your LinkedIn profile from
                        industry professionals.
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        Request Review
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="network" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Network Building</h2>
                  <p className="text-gray-300 mb-6">
                    Expand your professional network strategically to increase
                    opportunities.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-[#242938] border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Users className="h-5 w-5 text-[#ffbd59]" />
                          Network Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-300">Connections</span>
                              <span className="text-white font-medium">
                                187
                              </span>
                            </div>
                            <Progress value={37} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-300">
                                Industry Relevance
                              </span>
                              <span className="text-white font-medium">
                                65%
                              </span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-300">
                                Engagement Rate
                              </span>
                              <span className="text-white font-medium">
                                42%
                              </span>
                            </div>
                            <Progress value={42} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#242938] border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Users className="h-5 w-5 text-[#ffbd59]" />
                          Connection Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400 mb-4">
                          Connect with these professionals to expand your
                          network in your industry.
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          View Suggestions
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">
                      Networking Strategies
                    </h3>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h4 className="text-lg font-medium mb-3">
                        Connection Request Templates
                      </h4>
                      <p className="text-gray-300 mb-4">
                        Personalized templates for sending connection requests
                        to different types of professionals.
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        View Templates
                      </Button>
                    </div>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h4 className="text-lg font-medium mb-3">
                        Industry Groups
                      </h4>
                      <p className="text-gray-300 mb-4">
                        Recommended LinkedIn groups in your industry to join for
                        networking and knowledge sharing.
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        Browse Groups
                      </Button>
                    </div>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h4 className="text-lg font-medium mb-3">
                        Networking Events
                      </h4>
                      <p className="text-gray-300 mb-4">
                        Upcoming virtual and in-person networking events in your
                        industry.
                      </p>
                      <Button className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                        View Events
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Content Strategy</h2>
                  <p className="text-gray-300 mb-6">
                    Develop a content strategy to increase your visibility and
                    establish yourself as a thought leader.
                  </p>

                  <div className="space-y-6">
                    <Card className="bg-[#242938] border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-[#ffbd59]" />
                          Content Calendar
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400 mb-4">
                          Plan and schedule your LinkedIn posts to maintain a
                          consistent presence.
                        </p>
                        <Button className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium">
                          View Calendar
                        </Button>
                      </CardContent>
                    </Card>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Content Ideas
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            Share industry insights and trends
                          </h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Demonstrate your knowledge by sharing your
                            perspective on current industry trends.
                          </p>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Examples
                          </Button>
                        </div>

                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            Showcase your projects and achievements
                          </h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Share your work, case studies, or professional
                            achievements to highlight your expertise.
                          </p>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Examples
                          </Button>
                        </div>

                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <h4 className="font-medium mb-2">
                            Engage with your network's content
                          </h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Increase your visibility by thoughtfully commenting
                            on posts from your connections.
                          </p>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                          >
                            View Examples
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Content Templates
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Ready-to-use templates for different types of LinkedIn
                        posts.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          Professional Updates
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          Industry Insights
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          Career Milestones
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="bg-[#1A1F2C] rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    LinkedIn Analytics
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Track your LinkedIn performance and measure the impact of
                    your optimization efforts.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-[#242938] border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">
                          Profile Views
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end justify-between">
                          <span className="text-3xl font-bold text-white">
                            127
                          </span>
                          <span className="text-green-500 text-sm">+24%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Last 30 days
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#242938] border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">
                          Post Impressions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end justify-between">
                          <span className="text-3xl font-bold text-white">
                            1,842
                          </span>
                          <span className="text-green-500 text-sm">+18%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Last 30 days
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#242938] border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">
                          Engagement Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end justify-between">
                          <span className="text-3xl font-bold text-white">
                            3.2%
                          </span>
                          <span className="text-green-500 text-sm">+0.5%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Last 30 days
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Performance Trends
                      </h3>
                      <div className="h-64 bg-[#1A1F2C] rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">
                          Chart visualization will appear here
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#242938] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Top Performing Content
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">
                              My experience with AI in software development
                            </h4>
                            <span className="text-[#ffbd59] text-sm font-medium">
                              2,145 views
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            Posted on June 5, 2023
                          </p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>48 reactions</span>
                            <span>12 comments</span>
                            <span>8 shares</span>
                          </div>
                        </div>

                        <div className="p-4 bg-[#1A1F2C] rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">
                              5 tips for effective remote collaboration
                            </h4>
                            <span className="text-[#ffbd59] text-sm font-medium">
                              1,876 views
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            Posted on May 22, 2023
                          </p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>36 reactions</span>
                            <span>8 comments</span>
                            <span>5 shares</span>
                          </div>
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

export default LinkedInEnhancement;
