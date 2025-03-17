import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardCheck, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EvaluationFormProps {
  sessionId?: string;
  sessionTitle?: string;
  sessionType?: string;
  className?: string;
}

const EvaluationForm = ({
  sessionId = "1",
  sessionTitle = "Advanced Excel for Professionals",
  sessionType = "Skill it Up - Excel",
  className,
}: EvaluationFormProps) => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    contentQuality: "",
    instructorKnowledge: "",
    materialQuality: "",
    practicalRelevance: "",
    overallSatisfaction: "",
    improvements: "",
    additionalComments: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);

    // Show success message
    toast({
      title: "Evaluation Submitted",
      description: "Thank you for your feedback on this training session.",
      duration: 5000,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card
        className={`w-full bg-[#1A1F2C] text-white border-none shadow-lg ${className}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-[#ffbd59]" />
            Evaluation Submitted
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
            <ClipboardCheck className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
          <p className="text-center text-gray-300 mb-6">
            Your feedback for "{sessionTitle}" has been successfully submitted.
            Your input helps us improve our training programs.
          </p>
          <Button
            className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium"
            onClick={() => setSubmitted(false)}
          >
            Submit Another Evaluation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full bg-[#1A1F2C] text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-[#ffbd59]" />
          Training Session Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {sessionTitle}
              </h3>
              <div className="mt-2 sm:mt-0 px-3 py-1 rounded-full bg-[#2A3042] text-[#ffbd59] text-sm">
                {sessionType}
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              Please rate your experience with this training session. Your
              feedback is valuable to us.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-white">Select Training Session</Label>
              <Select
                defaultValue="excel-1"
                onValueChange={(value) => console.log(value)}
              >
                <SelectTrigger className="bg-[#242938] border-gray-700 text-white">
                  <SelectValue placeholder="Select a training session" />
                </SelectTrigger>
                <SelectContent className="bg-[#242938] border-gray-700 text-white">
                  <SelectItem value="excel-1">
                    Advanced Excel for Professionals
                  </SelectItem>
                  <SelectItem value="skills-1">
                    Communication Skills Workshop
                  </SelectItem>
                  <SelectItem value="french-1">
                    Business French for Beginners
                  </SelectItem>
                  <SelectItem value="english-1">
                    English for Job Interviews
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Content Quality</Label>
              <RadioGroup
                className="flex space-x-4"
                value={formData.contentQuality}
                onValueChange={(value) => handleChange("contentQuality", value)}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem
                      value={value.toString()}
                      id={`content-${value}`}
                      className="text-[#ffbd59]"
                    />
                    <Label
                      htmlFor={`content-${value}`}
                      className="mt-1 text-sm text-gray-300"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">
                Instructor Knowledge
              </Label>
              <RadioGroup
                className="flex space-x-4"
                value={formData.instructorKnowledge}
                onValueChange={(value) =>
                  handleChange("instructorKnowledge", value)
                }
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem
                      value={value.toString()}
                      id={`instructor-${value}`}
                      className="text-[#ffbd59]"
                    />
                    <Label
                      htmlFor={`instructor-${value}`}
                      className="mt-1 text-sm text-gray-300"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">Material Quality</Label>
              <RadioGroup
                className="flex space-x-4"
                value={formData.materialQuality}
                onValueChange={(value) =>
                  handleChange("materialQuality", value)
                }
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem
                      value={value.toString()}
                      id={`material-${value}`}
                      className="text-[#ffbd59]"
                    />
                    <Label
                      htmlFor={`material-${value}`}
                      className="mt-1 text-sm text-gray-300"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">
                Practical Relevance
              </Label>
              <RadioGroup
                className="flex space-x-4"
                value={formData.practicalRelevance}
                onValueChange={(value) =>
                  handleChange("practicalRelevance", value)
                }
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem
                      value={value.toString()}
                      id={`relevance-${value}`}
                      className="text-[#ffbd59]"
                    />
                    <Label
                      htmlFor={`relevance-${value}`}
                      className="mt-1 text-sm text-gray-300"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">
                Overall Satisfaction
              </Label>
              <RadioGroup
                className="flex space-x-4"
                value={formData.overallSatisfaction}
                onValueChange={(value) =>
                  handleChange("overallSatisfaction", value)
                }
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem
                      value={value.toString()}
                      id={`overall-${value}`}
                      className="text-[#ffbd59]"
                    />
                    <Label
                      htmlFor={`overall-${value}`}
                      className="mt-1 text-sm text-gray-300"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <Label htmlFor="improvements" className="text-white mb-2 block">
                What could be improved?
              </Label>
              <Textarea
                id="improvements"
                placeholder="Please share your suggestions for improvement..."
                className="bg-[#242938] border-gray-700 text-white resize-none"
                rows={3}
                value={formData.improvements}
                onChange={(e) => handleChange("improvements", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="comments" className="text-white mb-2 block">
                Additional Comments
              </Label>
              <Textarea
                id="comments"
                placeholder="Any other feedback you'd like to share..."
                className="bg-[#242938] border-gray-700 text-white resize-none"
                rows={3}
                value={formData.additionalComments}
                onChange={(e) =>
                  handleChange("additionalComments", e.target.value)
                }
              />
            </div>
          </div>

          <CardFooter className="px-0 pt-6">
            <Button
              type="submit"
              className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Evaluation
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default EvaluationForm;
