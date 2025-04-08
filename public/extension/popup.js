// Path: public/extension/popup.js
document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const statusElement = document.getElementById("status");
  const connectBtn = document.getElementById("connect-btn");
  const autoRecordCheckbox = document.getElementById("auto-record");
  const trackAttendanceCheckbox = document.getElementById("track-attendance");
  const uploadRecordingsCheckbox = document.getElementById("upload-recordings");
  const saveBtn = document.getElementById("save-btn");

  // Load saved settings
  chrome.storage.sync.get(
    {
      autoRecord: true,
      trackAttendance: true,
      uploadRecordings: true,
      connected: false,
    },
    function (items) {
      autoRecordCheckbox.checked = items.autoRecord;
      trackAttendanceCheckbox.checked = items.trackAttendance;
      uploadRecordingsCheckbox.checked = items.uploadRecordings;

      if (items.connected) {
        statusElement.textContent = "Connected";
        statusElement.classList.add("connected");
        connectBtn.textContent = "Disconnect";
      }
    },
  );

  // Connect/Disconnect button
  connectBtn.addEventListener("click", function () {
    const isConnected = statusElement.classList.contains("connected");

    if (isConnected) {
      // Disconnect logic
      chrome.storage.sync.set({ connected: false }, function () {
        statusElement.textContent = "Not connected";
        statusElement.classList.remove("connected");
        connectBtn.textContent = "Connect";
      });
    } else {
      // Connect logic - in a real extension, this would authenticate with the CV UP API
      chrome.storage.sync.set({ connected: true }, function () {
        statusElement.textContent = "Connected";
        statusElement.classList.add("connected");
        connectBtn.textContent = "Disconnect";
      });
    }
  });

  // Save settings
  saveBtn.addEventListener("click", function () {
    chrome.storage.sync.set(
      {
        autoRecord: autoRecordCheckbox.checked,
        trackAttendance: trackAttendanceCheckbox.checked,
        uploadRecordings: uploadRecordingsCheckbox.checked,
      },
      function () {
        // Show saved message
        const savedMsg = document.createElement("div");
        savedMsg.textContent = "Settings saved!";
        savedMsg.style.color = "#4caf50";
        savedMsg.style.marginTop = "8px";
        savedMsg.style.textAlign = "center";

        const footer = document.querySelector(".footer");
        footer.appendChild(savedMsg);

        // Remove message after 2 seconds
        setTimeout(function () {
          if (footer.contains(savedMsg)) {
            footer.removeChild(savedMsg);
          }
        }, 2000);
      },
    );
  });
});
