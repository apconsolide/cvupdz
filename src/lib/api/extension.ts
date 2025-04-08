// Function to download the extension
export function downloadExtension() {
  try {
    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute and href
    link.download = "cvup-zoom-assistant.zip";
    link.href = "/extension.zip";

    // Append to the document
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error("Error downloading extension:", error);
    throw error;
  }
}
