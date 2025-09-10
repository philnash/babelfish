let recorder, stream;

export function initMediaRecorder(recordButton, callback) {
  if ("MediaRecorder" in window) {
    recordButton.addEventListener("click", async () => {
      console.log("click", recorder, stream);
      if (recorder && recorder.state === "recording" && stream) {
        recorder.stop();
        recordButton.innerText = "Record";
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });
        return;
      }

      recordButton.innerText = "Stop";
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        const mimeType = "audio/webm";
        let chunks = [];
        recorder = new MediaRecorder(stream, { type: mimeType });
        recorder.addEventListener("dataavailable", (event) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          chunks.push(event.data);
        });
        recorder.addEventListener("stop", async () => {
          let recording = new Blob(chunks, {
            type: mimeType,
          });
          callback(null, recording);
          chunks = [];
        });
        recorder.start();
      } catch (error) {
        console.error("Error accessing microphone:", error);
        callback(
          new Error(
            "You denied access to the microphone so this demo will not work."
          )
        );
      }
    });
  } else {
    callback(new Error("MediaRecorder API not supported in this browser."));
  }
}
