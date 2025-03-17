import React from "react";
import { Card } from "./card";

interface ColorSwatchProps {
  color: string;
  name: string;
  hexCode: string;
  description?: string;
}

const ColorSwatch = ({
  color,
  name,
  hexCode,
  description = "",
}: ColorSwatchProps) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-24 h-24 rounded-md mb-2 shadow-md"
        style={{ backgroundColor: hexCode }}
      />
      <div className="text-center">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{hexCode}</p>
        {description && (
          <p className="text-xs mt-1 max-w-[150px] text-center">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

interface ColorPaletteProps {
  title?: string;
  description?: string;
}

const ColorPalette = ({
  title = "CV UP Color Palette",
  description = "The official color palette for the CV UP platform, featuring our primary brand colors and supporting accent colors.",
}: ColorPaletteProps) => {
  const primaryColors = [
    {
      color: "primary-dark",
      name: "Dark Blue-Black",
      hexCode: "#1A1F2C",
      description:
        "Primary background color for dark mode and main UI elements",
    },
    {
      color: "primary-orange",
      name: "Golden Orange",
      hexCode: "#FFBD59",
      description:
        "Primary accent color for buttons, highlights, and interactive elements",
    },
  ];

  const secondaryColors = [
    {
      color: "secondary-blue",
      name: "Accent Blue",
      hexCode: "#3E7BFA",
      description: "Used for links and secondary actions",
    },
    {
      color: "secondary-teal",
      name: "Teal",
      hexCode: "#2DD4BF",
      description: "Used for success states and progress indicators",
    },
    {
      color: "secondary-purple",
      name: "Purple",
      hexCode: "#8B5CF6",
      description: "Used for premium features and special highlights",
    },
    {
      color: "secondary-red",
      name: "Red",
      hexCode: "#EF4444",
      description: "Used for errors and warnings",
    },
  ];

  const neutralColors = [
    {
      color: "neutral-50",
      name: "White",
      hexCode: "#FFFFFF",
      description: "Text on dark backgrounds",
    },
    {
      color: "neutral-100",
      name: "Gray 100",
      hexCode: "#F3F4F6",
      description: "Background for light mode",
    },
    {
      color: "neutral-300",
      name: "Gray 300",
      hexCode: "#D1D5DB",
      description: "Borders and dividers",
    },
    {
      color: "neutral-500",
      name: "Gray 500",
      hexCode: "#6B7280",
      description: "Secondary text",
    },
    {
      color: "neutral-700",
      name: "Gray 700",
      hexCode: "#374151",
      description: "Primary text in light mode",
    },
  ];

  return (
    <Card className="w-full p-6 bg-white dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Primary Brand Colors
          </h3>
          <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
            {primaryColors.map((color) => (
              <ColorSwatch
                key={color.color}
                color={color.color}
                name={color.name}
                hexCode={color.hexCode}
                description={color.description}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Secondary/Accent Colors
          </h3>
          <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
            {secondaryColors.map((color) => (
              <ColorSwatch
                key={color.color}
                color={color.color}
                name={color.name}
                hexCode={color.hexCode}
                description={color.description}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Neutral Colors
          </h3>
          <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
            {neutralColors.map((color) => (
              <ColorSwatch
                key={color.color}
                color={color.color}
                name={color.name}
                hexCode={color.hexCode}
                description={color.description}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Usage Guidelines</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              Use the dark blue-black (#1A1F2C) as the primary background for
              dark mode interfaces
            </li>
            <li>
              Use the golden-orange (#FFBD59) for primary buttons,
              call-to-actions, and important UI elements
            </li>
            <li>
              Secondary colors should be used sparingly to highlight specific UI
              elements or states
            </li>
            <li>
              Maintain sufficient contrast between text and background colors
              for accessibility
            </li>
            <li>
              When using glassmorphism effects, ensure the background provides
              enough contrast
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ColorPalette;
