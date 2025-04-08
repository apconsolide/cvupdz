// Path: public/extension/background.js
// Background script for CV UP Zoom Assistant

// Listen for installation
chrome.runtime.onInstalled.addListener(function () {
  console.log("CV UP Zoom Assistant installed");

  // Set default settings
  chrome.storage.sync.set({
    autoRecord: true,
    trackAttendance: true,
    uploadRecordings: true,
    connected: false,
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "meetingDetected") {
    console.log("Background: Meeting detected", request.meetingId);
    // Check if we should auto-record
    chrome.storage.sync.get(["autoRecord", "connected"], function (data) {
      if (data.autoRecord && data.connected) {
        console.log(
          "Background: Auto-record enabled, sending startRecording to tab",
          sender.tab.id,
        );
        // Send message back to content script to start recording
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "startRecording",
          meetingId: request.meetingId,
        });
      } else {
        console.log("Background: Auto-record disabled or not connected.");
      }
    });

    sendResponse({ received: true });
    return true; // Indicates asynchronous response
  }

  if (request.action === "recordingComplete") {
    // Process the recording data
    console.log(
      "Background: Recording complete received",
      request.recordingData,
    );

    // In a real extension, this would upload the recording to the CV UP server
    // For now, we'll just log it

    sendResponse({ received: true });
    return true; // Indicates asynchronous response
  }

  // Handle other potential messages if needed
});

// Listen for tab updates to detect Zoom meetings
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Ensure the URL is valid before trying to access it
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    (tab.url.includes("zoom.us/j/") ||
      tab.url.includes("zoom.us/wc/") ||
      tab.url.includes("meet.google.com/"))
  ) {
    console.log(
      "Background: Detected potential meeting URL on tab update:",
      tab.url,
    );
    // Inject content script if not already injected (more robust approach)
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["content.js"],
      })
      .then(() => {
        console.log("Background: Injected content script into tab", tabId);
        // Notify content script that we're in a meeting
        // Use a slight delay to ensure content script is ready
        setTimeout(() => {
          chrome.tabs.sendMessage(
            tabId,
            {
              action: "checkForMeeting",
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.warn(
                  "Background: Could not send checkForMeeting message to tab",
                  tabId,
                  chrome.runtime.lastError.message,
                );
              } else {
                console.log(
                  "Background: Sent checkForMeeting message, response:",
                  response,
                );
              }
            },
          );
        }, 100); // 100ms delay
      })
      .catch((err) =>
        console.error("Background: Failed to inject script: ", err),
      );
  }
});
