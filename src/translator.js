export async function initTranslator(sourceLanguage, targetLanguage, callback) {
  const availability = await Translator.availability({
    sourceLanguage,
    targetLanguage,
  });
  if (availability === "unavailable") {
    callback(
      new Error(
        `Translation from ${sourceLanguage} to ${targetLanguage} is not available.`
      )
    );
    return;
  }

  if (availability === "downloading") {
    callback(
      new Error(
        `Translation from ${sourceLanguage} to ${targetLanguage} is currently downloading. Please try again later.`
      )
    );
    return;
  }

  if (availability === "downloadable" || availability === "available") {
    const monitor = (m) => {
      console.log("monitoring");
      m.addEventListener("downloadProgress", (event) => {
        console.log(event);
        // callback(null, { type: "downloadProgress", progress: event });
      });
    };
    const translator = await Translator.create({
      sourceLanguage,
      targetLanguage,
      monitor,
    });
    callback(null, {
      type: "translator",
      translator,
    });
  }
}
