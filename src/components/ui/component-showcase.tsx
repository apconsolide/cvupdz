import React from "react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Checkbox } from "./checkbox";
import { Switch } from "./switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Badge } from "./badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Check, ChevronDown, ChevronUp, Menu, X } from "lucide-react";

interface ComponentShowcaseProps {
  title?: string;
  description?: string;
}

const ComponentShowcase = ({
  title = "CV UP Component Showcase",
  description = "A showcase of UI components styled with the CV UP brand colors and design system.",
}: ComponentShowcaseProps) => {
  return (
    <div className="w-full p-6 bg-[#1A1F2C] text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-400">{description}</p>
        </div>

        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-[#252a38]">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="toggles">Toggles</TabsTrigger>
          </TabsList>

          {/* Buttons Section */}
          <TabsContent value="buttons" className="space-y-6">
            <Card className="bg-[#252a38] border-[#3a4055]">
              <CardHeader>
                <CardTitle className="text-[#ffbd59]">Buttons</CardTitle>
                <CardDescription>
                  Various button styles and states for the CV UP platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Primary</h3>
                    <div className="space-y-2">
                      <Button className="bg-[#ffbd59] text-[#1A1F2C] hover:bg-[#ffbd59]/90 w-full">
                        Default
                      </Button>
                      <Button
                        className="bg-[#ffbd59] text-[#1A1F2C] hover:bg-[#ffbd59]/90 w-full"
                        disabled
                      >
                        Disabled
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Secondary</h3>
                    <div className="space-y-2">
                      <Button
                        variant="secondary"
                        className="bg-[#3a4055] hover:bg-[#3a4055]/80 w-full"
                      >
                        Default
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-[#3a4055] hover:bg-[#3a4055]/80 w-full"
                        disabled
                      >
                        Disabled
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Outline</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="border-[#ffbd59] text-[#ffbd59] hover:bg-[#ffbd59]/10 w-full"
                      >
                        Default
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#ffbd59] text-[#ffbd59] hover:bg-[#ffbd59]/10 w-full"
                        disabled
                      >
                        Disabled
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ghost</h3>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="text-[#ffbd59] hover:bg-[#ffbd59]/10 w-full"
                      >
                        Default
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-[#ffbd59] hover:bg-[#ffbd59]/10 w-full"
                        disabled
                      >
                        Disabled
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Destructive</h3>
                    <div className="space-y-2">
                      <Button variant="destructive" className="w-full">
                        Default
                      </Button>
                      <Button variant="destructive" className="w-full" disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sizes</h3>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="bg-[#ffbd59] text-[#1A1F2C] w-full"
                      >
                        Small
                      </Button>
                      <Button
                        size="default"
                        className="bg-[#ffbd59] text-[#1A1F2C] w-full"
                      >
                        Default
                      </Button>
                      <Button
                        size="lg"
                        className="bg-[#ffbd59] text-[#1A1F2C] w-full"
                      >
                        Large
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inputs Section */}
          <TabsContent value="inputs" className="space-y-6">
            <Card className="bg-[#252a38] border-[#3a4055]">
              <CardHeader>
                <CardTitle className="text-[#ffbd59]">Inputs</CardTitle>
                <CardDescription>
                  Form input elements for collecting user data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Text Inputs</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Default
                        </label>
                        <Input
                          placeholder="Enter your name"
                          className="border-[#3a4055] focus-visible:ring-[#ffbd59]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Disabled
                        </label>
                        <Input
                          placeholder="Disabled input"
                          disabled
                          className="border-[#3a4055]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          With Icon
                        </label>
                        <div className="relative">
                          <Input
                            placeholder="Search..."
                            className="pl-10 border-[#3a4055] focus-visible:ring-[#ffbd59]"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="11" cy="11" r="8"></circle>
                              <line
                                x1="21"
                                y1="21"
                                x2="16.65"
                                y2="16.65"
                              ></line>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Select Inputs</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Default Select
                        </label>
                        <Select>
                          <SelectTrigger className="border-[#3a4055] focus:ring-[#ffbd59]">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#252a38] border-[#3a4055]">
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
                            <SelectItem value="option3">Option 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Disabled Select
                        </label>
                        <Select disabled>
                          <SelectTrigger className="border-[#3a4055]">
                            <SelectValue placeholder="Disabled select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Section */}
          <TabsContent value="cards" className="space-y-6">
            <Card className="bg-[#252a38] border-[#3a4055]">
              <CardHeader>
                <CardTitle className="text-[#ffbd59]">Cards</CardTitle>
                <CardDescription>
                  Card components for displaying content in containers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#1A1F2C] border-[#3a4055] overflow-hidden">
                    <CardHeader>
                      <CardTitle>Standard Card</CardTitle>
                      <CardDescription>
                        A basic card with header and content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        This is a standard card component that can be used to
                        display various types of content throughout the CV UP
                        platform.
                      </p>
                    </CardContent>
                    <CardFooter className="border-t border-[#3a4055] bg-[#252a38]/50">
                      <Button
                        variant="ghost"
                        className="text-[#ffbd59] hover:bg-[#ffbd59]/10"
                      >
                        Learn More
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-gradient-to-br from-[#1A1F2C] to-[#252a38] border-[#3a4055] overflow-hidden backdrop-blur-sm bg-opacity-80">
                    <div className="absolute inset-0 bg-[#ffbd59]/5 backdrop-blur-[2px] pointer-events-none"></div>
                    <CardHeader>
                      <CardTitle className="text-[#ffbd59]">
                        Glassmorphism Card
                      </CardTitle>
                      <CardDescription>
                        A card with glassmorphism effect
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p>
                        This card demonstrates the glassmorphism effect that is
                        used throughout the CV UP platform to create depth and
                        visual interest.
                      </p>
                    </CardContent>
                    <CardFooter className="border-t border-[#3a4055]/30 bg-[#252a38]/20 relative z-10">
                      <Button className="bg-[#ffbd59] text-[#1A1F2C] hover:bg-[#ffbd59]/90">
                        Action Button
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Section */}
          <TabsContent value="badges" className="space-y-6">
            <Card className="bg-[#252a38] border-[#3a4055]">
              <CardHeader>
                <CardTitle className="text-[#ffbd59]">Badges</CardTitle>
                <CardDescription>
                  Status indicators and labels for the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Status Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[#ffbd59] text-[#1A1F2C] hover:bg-[#ffbd59]/90">
                        New
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-[#3a4055] hover:bg-[#3a4055]/80"
                      >
                        In Progress
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[#ffbd59] text-[#ffbd59]"
                      >
                        Premium
                      </Badge>
                      <Badge variant="destructive">Error</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Badge with Icons</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[#ffbd59] text-[#1A1F2C] hover:bg-[#ffbd59]/90 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Verified
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-[#3a4055] hover:bg-[#3a4055]/80 flex items-center gap-1"
                      >
                        <Menu className="h-3 w-3" /> Options
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[#ffbd59] text-[#ffbd59] flex items-center gap-1"
                      >
                        <ChevronUp className="h-3 w-3" /> Trending
                      </Badge>
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Rejected
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Toggles Section */}
          <TabsContent value="toggles" className="space-y-6">
            <Card className="bg-[#252a38] border-[#3a4055]">
              <CardHeader>
                <CardTitle className="text-[#ffbd59]">Toggles</CardTitle>
                <CardDescription>
                  Toggle controls for enabling and disabling features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Checkboxes</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms1"
                          className="border-[#ffbd59] data-[state=checked]:bg-[#ffbd59] data-[state=checked]:text-[#1A1F2C]"
                        />
                        <label
                          htmlFor="terms1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Accept terms and conditions
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms2"
                          defaultChecked
                          className="border-[#ffbd59] data-[state=checked]:bg-[#ffbd59] data-[state=checked]:text-[#1A1F2C]"
                        />
                        <label
                          htmlFor="terms2"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms3"
                          disabled
                          className="border-[#3a4055]"
                        />
                        <label
                          htmlFor="terms3"
                          className="text-sm font-medium leading-none text-gray-400"
                        >
                          Disabled option
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Switches</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="airplane-mode"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Notifications
                        </label>
                        <Switch
                          id="airplane-mode"
                          className="data-[state=checked]:bg-[#ffbd59]"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="airplane-mode-checked"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email updates
                        </label>
                        <Switch
                          id="airplane-mode-checked"
                          defaultChecked
                          className="data-[state=checked]:bg-[#ffbd59]"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="airplane-mode-disabled"
                          className="text-sm font-medium leading-none text-gray-400"
                        >
                          Premium features (upgrade required)
                        </label>
                        <Switch id="airplane-mode-disabled" disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComponentShowcase;
