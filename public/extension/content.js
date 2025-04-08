// Path: public/extension/content.js
// Content script for CV UP Zoom Assistant
console.log('CV UP Assistant: Content script loaded');

// Variables to track meeting state
let inMeeting = false;
let meetingId = null;
let recordingInProgress = false;
let participants = []; // Basic participant tracking (placeholder)
let meetingStartTime = null;
let platform = null; // 'zoom' or 'google'

// Function to extract meeting ID
function extractMeetingId() {
    const url = window.location.href;
    let id = null;
    if (url.includes('zoom.us/j/') || url.includes('zoom.us/wc/')) {
        platform = 'zoom';
        const match = url.match(/(?:zoom\\.us\\/(?:j|wc)\\/)(\\d+)/);
        if (match && match[1]) {
            id = match[1];
        }
    } else if (url.includes('meet.google.com/')) {
        platform = 'google';
        const urlParts = url.split('?')[0].split('/');
        id = urlParts[urlParts.length - 1];
        // Google Meet IDs often contain hyphens, ensure it's not empty
        if (id && id.includes('-')) {
           // Potentially valid ID
        } else {
           id = null; // Reset if format doesn't seem right
        }
    }
    console.log('CV UP Assistant: Extracted Meeting ID:', id, 'Platform:', platform);
    return id;
}

// Function to detect if we're in a meeting
function detectMeeting() {
  console.log('CV UP Assistant: detectMeeting called');
  const currentMeetingId = extractMeetingId();

  if (currentMeetingId && !inMeeting) {
    console.log('CV UP Assistant: Entering meeting:', currentMeetingId);
    inMeeting = true;
    meetingId = currentMeetingId;
    meetingStartTime = new Date();

    // Notify background script
    chrome.runtime.sendMessage({
      action: 'meetingDetected',
      meetingId: meetingId,
      platform: platform
    }, response => {
      if (chrome.runtime.lastError) {
        console.error("CV UP Assistant: Error sending meetingDetected:", chrome.runtime.lastError.message);
      } else {
        console.log("CV UP Assistant: Background script acknowledged meetingDetected:", response);
      }
    });

    // Start tracking participants (placeholder)
    startParticipantTracking();
    return true;
  } else if (!currentMeetingId && inMeeting) {
      console.log('CV UP Assistant: Exiting meeting');
      if(recordingInProgress) stopRecording(); // Stop recording if leaving
      inMeeting = false;
      meetingId = null;
      platform = null;
      meetingStartTime = null;
  }
  return inMeeting;
}

let participantInterval = null;
// Function to start tracking participants
function startParticipantTracking() {
  console.log('CV UP Assistant: Starting participant tracking for meeting:', meetingId);
  // Clear any existing interval
  if (participantInterval) clearInterval(participantInterval);

  // In a real extension, this would use platform-specific DOM scraping or APIs
  // For this demo, we'll simulate it with console logs

  // Check immediately and then periodically
  updateParticipantsList();
  participantInterval = setInterval(() => {
    if (!inMeeting) {
      console.log('CV UP Assistant: Stopping participant tracking interval.');
      clearInterval(participantInterval);
      participantInterval = null;
      return;
    }
    updateParticipantsList();
  }, 60000); // Check every minute
}

// Function to update participants list (Placeholder)
function updateParticipantsList() {
  if (!inMeeting) return;
  // Placeholder: In a real extension, scrape the DOM or use APIs.
  // Example for Google Meet (highly dependent on changing class names):
  let currentParticipants = [];
  if (platform === 'google') {
      // This selector is illustrative and likely to break
      const participantElements = document.querySelectorAll('[data-participant-id]');
      participantElements.forEach(el => {
          // Extract name or identifier
          const nameElement = el.querySelector('.ZjFb7c'); // Example selector, WILL change
          if (nameElement) {
              currentParticipants.push(nameElement.textContent || 'Unknown Participant');
          }
      });
  } else if (platform === 'zoom') {
      // Zoom Web SDK or DOM scraping needed here
      // Example (illustrative, likely incorrect/unstable):
      const participantElements = document.querySelectorAll('.participants-item__display-name');
       participantElements.forEach(el => {
            currentParticipants.push(el.textContent || 'Unknown Participant');
       });
  }

  // Simple update - just log changes for now
  if (JSON.stringify(participants) !== JSON.stringify(currentParticipants) && currentParticipants.length > 0) {
      console.log('CV UP Assistant: Participants updated:', currentParticipants);
      participants = currentParticipants;
  } else if (currentParticipants.length === 0) {
       console.log('CV UP Assistant: Could not find participant elements (or only self).');
  }
}

// Function to start recording (Placeholder)
function startRecording() {
  if (recordingInProgress || !inMeeting) {
       console.log('CV UP Assistant: Start recording requested, but already recording or not in meeting.');
       return;
  }

  recordingInProgress = true;
  console.log('CV UP Assistant: Recording started simulation for meeting:', meetingId);

  // In a real extension, this would potentially use:
  // 1. chrome.tabCapture API (requires more permissions)
  // 2. MediaRecorder API on a captured stream
  // 3. Triggering the platform's native recording feature (if possible/allowed)
}

// Function to stop recording (Placeholder)
function stopRecording() {
  if (!recordingInProgress) {
      console.log('CV UP Assistant: Stop recording requested, but not recording.');
      return;
  }

  recordingInProgress = false;
  console.log('CV UP Assistant: Recording stopped simulation for meeting:', meetingId);

  const meetingEndTime = new Date();

  // Prepare recording data (metadata only in this placeholder)
  const recordingData = {
    meetingId: meetingId,
    platform: platform,
    start_time: meetingStartTime ? meetingStartTime.toISOString() : null,
    end_time: meetingEndTime.toISOString(),
    participants: participants, // Contains participants tracked during the session
    // In a real extension, this would include a reference to the actual recording file/data
  };

  // Send recording data to background script
  chrome.runtime.sendMessage({ action: 'recordingComplete', recordingData: recordingData }, response => {
      if (chrome.runtime.lastError) {
         console.error("CV UP Assistant: Error sending recordingComplete:", chrome.runtime.lastError.message);
      } else {
         console.log("CV UP Assistant: Background script acknowledged recordingComplete:", response);
      }
  });

  // Reset participants for next potential meeting in the same tab
  participants = [];
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('CV UP Assistant: Message received from background:', request);
  if (request.action === 'checkForMeeting') {
    const result = detectMeeting();
    sendResponse({ inMeeting: result, meetingId: meetingId });
    return true; // Indicate async response potentially needed (though not strictly here)
  }

  if (request.action === 'startRecording') {
     if(request.meetingId === meetingId){ // Ensure it's for the current meeting
        startRecording();
        sendResponse({ started: recordingInProgress });
     } else {
        console.warn('CV UP Assistant: Received startRecording for wrong meeting ID', request.meetingId, 'current is', meetingId);
        sendResponse({ started: false, error: 'Meeting ID mismatch' });
     }
    return true;
  }

  if (request.action === 'stopRecording') { // Allow manual stop potentially
    stopRecording();
    sendResponse({ stopped: !recordingInProgress });
    return true;
  }

  // Default response for unhandled actions
  sendResponse({ received: false, message: 'Unknown action' });
  return true;
});

// Initial check when the content script loads
// Use a small delay to allow the page structure to stabilize slightly
setTimeout(detectMeeting, 500);

// Monitor URL changes for SPA navigation within meet/zoom
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('CV UP Assistant: URL changed, re-checking for meeting:', url);
    setTimeout(detectMeeting, 200); // Delay check after URL change
  }
}).observe(document, { subtree: true, childList: true });


// Listen for page unload to stop recording and tracking
window.addEventListener('beforeunload', function() {
  console.log('CV UP Assistant: Page unloading');
  if (inMeeting && recordingInProgress) {
    console.log('CV UP Assistant: Stopping recording due to page unload');
    stopRecording(); // Send final data before closing
  }
  inMeeting = false;
  recordingInProgress = false;
  if(participantInterval) clearInterval(participantInterval);
});

console.log('CV UP Assistant: Content script execution finished.');
