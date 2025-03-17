import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  position: string;
  avatar?: string;
  initials: string;
}

interface TestimonialSectionProps {
  testimonials?: Testimonial[];
  className?: string;
}

const TestimonialSection = ({
  testimonials = [
    {
      id: "1",
      content:
        "CV UP helped me completely transform my resume. I received three interview calls within a week of updating my CV using their platform!",
      author: "Amina Benali",
      position: "Software Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
      initials: "AB",
    },
    {
      id: "2",
      content:
        "The interview preparation module was a game-changer for me. The mock interviews and feedback helped me feel confident and prepared.",
      author: "Karim Hadj",
      position: "Marketing Specialist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
      initials: "KH",
    },
    {
      id: "3",
      content:
        "Thanks to CV UP's LinkedIn optimization tools, I've expanded my professional network and received multiple job opportunities.",
      author: "Leila Mansouri",
      position: "Project Manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leila",
      initials: "LM",
    },
  ],
  className,
}: TestimonialSectionProps) => {
  return (
    <div
      className={`w-full bg-cvup-blue py-20 px-6 md:px-10 lg:px-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Hear from professionals who have advanced their careers with CV UP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-cvup-lightblue border-gray-700 hover:border-cvup-gold transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <svg
                      className="h-8 w-8 text-cvup-gold mb-2"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-gray-300 italic">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-700 flex items-center">
                    <Avatar className="h-10 w-10 border-2 border-cvup-gold">
                      {testimonial.avatar ? (
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.author}
                        />
                      ) : (
                        <AvatarFallback className="bg-cvup-lightblue text-cvup-gold">
                          {testimonial.initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="ml-4">
                      <p className="text-white font-medium">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-400">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
