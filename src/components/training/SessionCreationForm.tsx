import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, Video, Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SessionCreationFormProps {
  className?: string;
  onSessionCreated?: () => void;
}

interface Participant {
  id: string;
  name: string;
  email: string;
}

const SessionCreationForm = ({
  className,
  onSessionCreated,
}: SessionCreationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    meetLink: "",
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewParticipant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addParticipant = () => {
    if (!newParticipant.name || !newParticipant.email) return;

    setParticipants((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newParticipant.name,
        email: newParticipant.email,
      },
    ]);

    setNewParticipant({
      name: "",
      email: "",
    });
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      participants.length === 0
    ) {
      toast({
        title: "Missing information",
        description:
          "Please fill in all required fields and add at least one participant.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would call an API to create the session
    console.log("Session created:", { ...formData, participants });

    toast({
      title: "Session created",
      description: "Your training session has been successfully created.",
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      meetLink: "",
    });
    setParticipants([]);

    if (onSessionCreated) {
      onSessionCreated();
    }
  };

  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Video className="h-5 w-5 text-cvup-gold" />
          Create New Training Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title*</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Advanced Excel for Professionals"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-cvup-lightblue border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what will be covered in this session..."
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-cvup-lightblue border-gray-700 text-white resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cvup-gold" />
                    Date*
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="bg-cvup-lightblue border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="startTime"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4 text-cvup-gold" />
                    Start Time*
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="bg-cvup-lightblue border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cvup-gold" />
                    End Time*
                  </Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="bg-cvup-lightblue border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetLink" className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-cvup-gold" />
                  Google Meet Link (Optional)
                </Label>
                <Input
                  id="meetLink"
                  name="meetLink"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  value={formData.meetLink}
                  onChange={handleChange}
                  className="bg-cvup-lightblue border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400">
                  You can add this later if you don't have it yet
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cvup-gold" />
                  Participants*
                </Label>
                <span className="text-sm text-gray-400">
                  {participants.length} added
                </span>
              </div>

              <div className="p-4 bg-cvup-lightblue rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Input
                      placeholder="Name"
                      name="name"
                      value={newParticipant.name}
                      onChange={handleParticipantChange}
                      className="bg-cvup-blue border-gray-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      placeholder="Email"
                      name="email"
                      type="email"
                      value={newParticipant.email}
                      onChange={handleParticipantChange}
                      className="bg-cvup-blue border-gray-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Button
                      type="button"
                      onClick={addParticipant}
                      className="w-full bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
                      disabled={!newParticipant.name || !newParticipant.email}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Participant
                    </Button>
                  </div>
                </div>

                {participants.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex justify-between items-center p-2 bg-cvup-blue rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {participant.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {participant.email}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParticipant(participant.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {participants.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    No participants added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <CardFooter className="px-0 pt-6">
            <Button
              type="submit"
              className="w-full bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
            >
              <Video className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default SessionCreationForm;
