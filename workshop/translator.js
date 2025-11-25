async function init() {
  const posts = document.querySelectorAll("article");

  if ("LanguageDetector" in window) {
    const detectorAvailability = await LanguageDetector.availability();
    if (detectorAvailability === "unavailable") {
      console.log("Language detection is unavailable in this environment.");
      return;
    }
    const detector = await LanguageDetector.create();

    const homeLanguage = navigator.languages.find((lang) => lang.length === 2);
    console.log(homeLanguage);

    posts.forEach((post) => {
      setupPost(post, detector, homeLanguage);
    });
  } else {
    console.log("LanguageDetector is not available in this environment.");
  }
}

async function setupPost(post, detector, homeLanguage) {
  const content = post.querySelector(".content");
  const actions = post.querySelector(".actions");
  const text = content.textContent;

  const detectedLanguage = (await detector.detect(text))[0].detectedLanguage;

  const translatable = await Translator.availability({
    sourceLanguage: detectedLanguage,
    targetLanguage: homeLanguage,
  });
  console.log(translatable);

  const translateButton = document.createElement("button");
  translateButton.className = "translate-button";
  translateButton.textContent = "Translate";
  translateButton.addEventListener("click", () => {
    // Placeholder for translation logic
    alert(`Translating post: ${text}`);
  });
  actions.appendChild(translateButton);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
