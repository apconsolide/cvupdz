import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Separator } from "./separator";
import ColorPalette from "./color-palette";
import Typography from "./typography";
import ComponentShowcase from "./component-showcase";
import GlassmorphismExamples from "./glassmorphism-examples";
import { Download, Copy, ExternalLink } from "lucide-react";
import { Button } from "./button";

interface DesignSystemProps {
  title?: string;
  description?: string;
}

const DesignSystem = ({
  title = "CV UP Design System",
  description = "A comprehensive design system for the CV UP platform, showcasing colors, typography, components, and glassmorphism effects.",
}: DesignSystemProps) => {
  return (
    <div className="min-h-screen w-full bg-[#1A1F2C] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-[#ffbd59]">{title}</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#ffbd59] text-[#ffbd59] hover:bg-[#ffbd59]/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#ffbd59] text-[#ffbd59] hover:bg-[#ffbd59]/10"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
          <p className="text-gray-400 max-w-3xl">{description}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#ffbd59]"></div>
              <span className="text-sm">Version 1.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Updated: June 2024</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              Documentation
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Main Content */}
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-[#252a38]">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="glassmorphism">Glassmorphism</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <ColorPalette />
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-6">
            <Card className="bg-white dark:bg-gray-900">
              <CardContent className="p-0">
                <Typography />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <ComponentShowcase />
          </TabsContent>

          {/* Glassmorphism Tab */}
          <TabsContent value="glassmorphism" className="space-y-6">
            <GlassmorphismExamples />
          </TabsContent>

          {/* Guidelines Tab */}
          <TabsContent value="guidelines" className="space-y-6">
            <Card className="bg-[#252a38] border-[#3a4055]">
              <CardHeader>
                <CardTitle className="text-[#ffbd59]">
                  Design Guidelines
                </CardTitle>
                <CardDescription>
                  Best practices and guidelines for implementing the CV UP
                  design system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-white">
                      Spacing System
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Extra Small (xs)</span>
                        <span className="text-sm text-gray-400">
                          4px (0.25rem)
                        </span>
                      </div>
                      <div className="h-1 w-1 bg-[#ffbd59]"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Small (sm)</span>
                        <span className="text-sm text-gray-400">
                          8px (0.5rem)
                        </span>
                      </div>
                      <div className="h-2 w-2 bg-[#ffbd59]"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medium (md)</span>
                        <span className="text-sm text-gray-400">
                          16px (1rem)
                        </span>
                      </div>
                      <div className="h-4 w-4 bg-[#ffbd59]"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Large (lg)</span>
                        <span className="text-sm text-gray-400">
                          24px (1.5rem)
                        </span>
                      </div>
                      <div className="h-6 w-6 bg-[#ffbd59]"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Extra Large (xl)</span>
                        <span className="text-sm text-gray-400">
                          32px (2rem)
                        </span>
                      </div>
                      <div className="h-8 w-8 bg-[#ffbd59]"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-white">
                      Accessibility Guidelines
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start space-x-2">
                        <div className="rounded-full bg-green-500 p-1 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>
                          Maintain a minimum contrast ratio of 4.5:1 for normal
                          text and 3:1 for large text
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="rounded-full bg-green-500 p-1 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>
                          Use semantic HTML elements and provide appropriate
                          ARIA attributes when necessary
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="rounded-full bg-green-500 p-1 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>
                          Ensure all interactive elements are keyboard
                          accessible with visible focus states
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="rounded-full bg-green-500 p-1 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>
                          Provide text alternatives for non-text content like
                          images and icons
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-white">
                    Responsive Design Principles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-[#1A1F2C] border-[#3a4055]">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-medium text-[#ffbd59] mb-2">
                          Mobile First
                        </h4>
                        <p className="text-sm text-gray-300">
                          Design for mobile screens first, then progressively
                          enhance for larger screens. Use Tailwind's responsive
                          prefixes (sm:, md:, lg:, xl:) to adjust layouts.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#1A1F2C] border-[#3a4055]">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-medium text-[#ffbd59] mb-2">
                          Fluid Typography
                        </h4>
                        <p className="text-sm text-gray-300">
                          Use relative units (rem) for typography. Text should
                          scale appropriately across different screen sizes
                          without becoming too small or too large.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#1A1F2C] border-[#3a4055]">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-medium text-[#ffbd59] mb-2">
                          Breakpoints
                        </h4>
                        <p className="text-sm text-gray-300">
                          Follow Tailwind's default breakpoints: sm (640px), md
                          (768px), lg (1024px), xl (1280px), and 2xl (1536px)
                          for consistent responsive behavior.
                        </p>
                      </CardContent>
                    </Card>
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

export default DesignSystem;
