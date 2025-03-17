import React from "react";

const Typography = () => {
  return (
    <div className="p-8 bg-white dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[#1A1F2C] dark:text-white">
        CV UP Typography System
      </h1>

      <div className="grid gap-12">
        {/* Headings Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#1A1F2C] dark:text-white border-b border-[#ffbd59] pb-2">
            Headings
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-32 text-sm text-gray-500 dark:text-gray-400">
                H1 (36px)
              </div>
              <h1 className="text-4xl font-bold text-[#1A1F2C] dark:text-white">
                Main Heading
              </h1>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-32 text-sm text-gray-500 dark:text-gray-400">
                H2 (30px)
              </div>
              <h2 className="text-3xl font-bold text-[#1A1F2C] dark:text-white">
                Section Heading
              </h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-32 text-sm text-gray-500 dark:text-gray-400">
                H3 (24px)
              </div>
              <h3 className="text-2xl font-semibold text-[#1A1F2C] dark:text-white">
                Subsection Heading
              </h3>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-32 text-sm text-gray-500 dark:text-gray-400">
                H4 (20px)
              </div>
              <h4 className="text-xl font-semibold text-[#1A1F2C] dark:text-white">
                Card Heading
              </h4>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-32 text-sm text-gray-500 dark:text-gray-400">
                H5 (18px)
              </div>
              <h5 className="text-lg font-medium text-[#1A1F2C] dark:text-white">
                Small Heading
              </h5>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-32 text-sm text-gray-500 dark:text-gray-400">
                H6 (16px)
              </div>
              <h6 className="text-base font-medium text-[#1A1F2C] dark:text-white">
                Micro Heading
              </h6>
            </div>
          </div>
        </section>

        {/* Body Text Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#1A1F2C] dark:text-white border-b border-[#ffbd59] pb-2">
            Body Text
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#1A1F2C] dark:text-white">
                Large (18px)
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                This is large body text used for important paragraphs or
                introductory content. It provides better readability for key
                information.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#1A1F2C] dark:text-white">
                Regular (16px)
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300">
                This is the standard body text used throughout the application.
                It provides good readability for most content while maintaining
                a clean look.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#1A1F2C] dark:text-white">
                Small (14px)
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                This smaller text is used for less important information,
                secondary details, or when space is limited. It maintains
                readability while being more compact.
              </p>
            </div>
          </div>
        </section>

        {/* Special Text Styles */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#1A1F2C] dark:text-white border-b border-[#ffbd59] pb-2">
            Special Text Styles
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium text-[#1A1F2C] dark:text-white">
                Emphasis
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300">
                Text can be <span className="font-medium">medium weight</span>{" "}
                for subtle emphasis or <span className="font-bold">bold</span>{" "}
                for stronger emphasis.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium text-[#1A1F2C] dark:text-white">
                Links
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300">
                <a href="#" className="text-[#ffbd59] hover:underline">
                  Primary links
                </a>{" "}
                use our golden-orange color, while
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  secondary links
                </a>{" "}
                use blue.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium text-[#1A1F2C] dark:text-white">
                Captions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Captions are used for image descriptions, footnotes, or other
                supplementary information that needs to be visually subordinate.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium text-[#1A1F2C] dark:text-white">
                Highlighted Text
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300">
                Important information can be{" "}
                <span className="bg-[#ffbd59]/20 px-1 rounded">
                  highlighted with a subtle background
                </span>{" "}
                to draw attention.
              </p>
            </div>
          </div>
        </section>

        {/* Font Family Information */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#1A1F2C] dark:text-white border-b border-[#ffbd59] pb-2">
            Font Family
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium text-[#1A1F2C] dark:text-white mb-2">
                Primary Font: Inter
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 font-sans">
                Inter is a clean, modern sans-serif typeface designed for
                computer screens. It features a tall x-height and open forms,
                making it highly readable at various sizes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-base font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Light (300)
                </h4>
                <p className="text-base font-light text-gray-700 dark:text-gray-300">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-base font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Regular (400)
                </h4>
                <p className="text-base font-normal text-gray-700 dark:text-gray-300">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-base font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Medium (500)
                </h4>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-base font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Semibold (600)
                </h4>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-base font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Bold (700)
                </h4>
                <p className="text-base font-bold text-gray-700 dark:text-gray-300">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-base font-medium text-[#1A1F2C] dark:text-white mb-2">
                  Extrabold (800)
                </h4>
                <p className="text-base font-extrabold text-gray-700 dark:text-gray-300">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Typography;
