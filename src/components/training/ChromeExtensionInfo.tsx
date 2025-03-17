import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Video, Users, Clock, Check } from "lucide-react";

interface ChromeExtensionInfoProps {
  className?: string;
}

const ChromeExtensionInfo = ({ className }: ChromeExtensionInfoProps) => {
  return (
    <Card
      className={`w-full bg-cvup-lightblue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Download className="h-5 w-5 text-cvup-gold" />
          CV UP Session Assistant Extension
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-3 -left-3 w-full h-full rounded-xl bg-cvup-gold opacity-20 transform rotate-2"></div>
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-xl bg-cvup-gold opacity-20 transform -rotate-2"></div>
                <img
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80"
                  alt="Chrome Extension Screenshot"
                  className="w-full h-auto rounded-xl shadow-2xl relative z-10"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-xl font-bold text-white">
                Enhance Your Training Sessions
              </h3>
              <p className="text-gray-300">
                The CV UP Session Assistant Chrome extension provides powerful
                tools for managing your virtual training sessions on Google
                Meet.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-green-500/20">
                    <Video className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Automatic Recording
                    </h4>
                    <p className="text-sm text-gray-400">
                      Records sessions and saves them directly to your Google
                      Drive
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-blue-500/20">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Attendance Tracking
                    </h4>
                    <p className="text-sm text-gray-400">
                      Monitors participant presence and generates detailed
                      reports
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-purple-500/20">
                    <Clock className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      Session Analytics
                    </h4>
                    <p className="text-sm text-gray-400">
                      Provides insights on engagement and participation
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full sm:w-auto mt-2 bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                <Download className="mr-2 h-4 w-4" />
                Install Chrome Extension
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-lg font-semibold mb-4">
              Installation Instructions
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cvup-gold text-cvup-blue flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="text-white">
                    Click the "Install Chrome Extension" button above
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cvup-gold text-cvup-blue flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="text-white">
                    In the Chrome Web Store, click "Add to Chrome"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cvup-gold text-cvup-blue flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="text-white">
                    Grant the necessary permissions when prompted
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cvup-gold text-cvup-blue flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="text-white">
                    Sign in with your CV UP account in the extension
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cvup-gold text-cvup-blue flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <p className="text-white">
                    You're all set! The extension will automatically work with
                    your Google Meet sessions
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cvup-blue p-4 rounded-lg flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/20">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-300">
              Your privacy is important to us. The extension only records and
              tracks attendance during official CV UP training sessions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChromeExtensionInfo;
