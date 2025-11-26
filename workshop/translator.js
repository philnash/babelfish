const errorMessage = "LanguageDetector is not available in this environment.";

async function createLanguageDetector() {
  if ("LanguageDetector" in window) {
    const detectorAvailability = await LanguageDetector.availability();
    if (detectorAvailability === "unavailable") {
      return false;
    }
    const detector = await LanguageDetector.create();
    return detector;
  } else {
    return false;
  }
}

async function detectLanguage(text, detector) {
  const detectedLanguages = await detector.detect(text);
  return detectedLanguages[0].detectedLanguage;
}

async function translationAvailable(sourceLanguage, targetLanguage) {
  const translatable = await Translator.availability({
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  });
  return translatable !== "unavailable";
}

async function translate(text, sourceLanguage, targetLanguage) {
  const translator = await Translator.create({
    sourceLanguage,
    targetLanguage,
  });
  return await translator.translate(text);
}

async function init() {
  const posts = document.querySelectorAll("article");

  const homeLanguage = navigator.languages[0].split("-")[0];

  const detector = await createLanguageDetector();

  if (detector) {
    posts.forEach((post) => {
      setupPost(post, detector, homeLanguage);
    });
  } else {
    console.log(errorMessage);
  }
}

async function setupPost(post, detector, homeLanguage) {
  const content = post.querySelector(".content");
  const actions = post.querySelector(".actions");
  const text = content.textContent;

  const detectedLanguage = await detectLanguage(text, detector);
  if (!detectLanguage) {
    return;
  }

  const translatable = await translationAvailable(
    detectedLanguage,
    homeLanguage
  );

  if (translatable) {
    const translateButton = document.createElement("button");
    translateButton.className = "translate-button";
    translateButton.textContent = "Translate";
    translateButton.addEventListener("click", async () => {
      translateButton.classList.add("loading");

      const newText = await translate(text, detectedLanguage, homeLanguage);

      const newP = createContent(newText);
      content.insertAdjacentElement("afterend", newP);
      translateButton.remove();
    });
    actions.appendChild(translateButton);
  } else {
    console.log(
      `Translation not available for ${detectedLanguage} to ${homeLanguage}`
    );
  }
}

function createContent(text) {
  const content = document.createElement("p");
  content.className = "content";
  content.textContent = text;
  return content;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
