export async function initTranscriber(callback) {
  const modelAvailability = await LanguageModel.availability({
    expectedInputs: [{ type: "audio" }],
  });
  if (modelAvailability === "unavailable") {
    callback(
      new Error("Multimodal prompt API is not available in this browser.")
    );
    return;
  }
  const params = await LanguageModel.params();
  if (modelAvailability === "downloadable") {
    const model = await LanguageModel.create({
      expectedInputs: [{ type: "audio" }],
      monitor(m) {
        console.log("monitoring llm download", m);
        m.ondownloadprogress = (event) => {
          console.log(event);
          callback(null, { type: "downloadProgress", progress: event });
        };
      },
    });
    callback(null, { type: "transcriber", transcriber: model });
    return;
  }
  if (modelAvailability === "available") {
    const model = await LanguageModel.create({
      expectedInputs: [{ type: "audio" }],
      temperature: 0.1,
      topK: params.defaultTopK,
    });
    callback(null, { type: "transcriber", transcriber: model });
  }
}

export async function transcribeAudio(blob, callback) {
  if (!("LanguageModel" in window)) {
    callback(new Error("LanguageModel not supported in this browser."));
    return;
  }
}
