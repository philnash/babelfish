import "./style.css";
import { initWebSpeechRecognition } from "./web-speech-recognition.js";
import { initMediaRecorder } from "./media-recorder.js";
import { initTranslator } from "./translator.js";
import { say, loadVoices, createVoiceSelect } from "./text-to-speech.js";
import { initTranscriber } from "./llm-audio.js";

const translators = {};
const voices = {
  en: null,
  es: null,
};
const inputLanguage = document.getElementById("input-language");
const input = document.getElementById("input");
const output = document.getElementById("output");
const startListeningBtn = document.querySelector(".listen-button");
const recordButton = document.querySelector(".record-button");
const translateButton = document.querySelector(".translate-button");
const setup = document.querySelector(".setup");

const populateVoices = () => {
  const { en, es } = loadVoices();
  voices.en = en[0];
  voices.es = es[0];

  if (setup) {
    if (en && en.length > 0) {
      const enVoiceSelect = createVoiceSelect(
        "English Voice:",
        "en-voice-select",
        en
      );
      setup.appendChild(enVoiceSelect);
      enVoiceSelect.addEventListener("change", (event) => {
        voices.en = en[event.target.selectedIndex];
      });
    }
    if (es && es.length > 0) {
      const esVoiceSelect = createVoiceSelect(
        "Spanish Voice:",
        "es-voice-select",
        es
      );
      setup.appendChild(esVoiceSelect);
      esVoiceSelect.addEventListener("change", (event) => {
        voices.es = es[event.target.selectedIndex];
      });
    }
  }
};

async function translateAndSpeak() {
  // get input language and text
  const detector = await LanguageDetector.create();
  // const inputLang = inputLanguage.value;
  const text = input.value;
  const results = await detector.detect(text);
  const inputLang = results[0].detectedLanguage;
  inputLanguage.value = inputLang;
  console.log("Detected language:", inputLang);

  const outputLang = inputLang === "en" ? "es" : "en";
  // set output text
  console.log(translators);
  const translation = await translators[inputLang].translate(text);
  const outputText = document.createElement("p");
  outputText.textContent = translation;
  output.prepend(outputText);
  say(translation, voices[outputLang]);
}

window.addEventListener("DOMContentLoaded", async () => {
  initWebSpeechRecognition(startListeningBtn, inputLanguage, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    input.value = "";
    input.value = result;
    translateAndSpeak();
  });

  translateButton.addEventListener(
    "click",
    async (event) => {
      Promise.all([
        initTranslator("en", "es", (err, event) => {
          if (err) {
            console.error(err);
            return;
          }
          if (event.type === "translator") {
            translators["en"] = event.translator;
          }
        }),
        initTranslator("es", "en", (err, event) => {
          if (err) {
            console.error(err);
            return;
          }
          if (event.type === "translator") {
            translators["es"] = event.translator;
          }
        }),
      ])
        .then(() => {
          translateButton.removeAttribute("disabled");
          translateButton.textContent = "Translate";
          translateButton.addEventListener("click", async (event) => {
            event.preventDefault();
            translateAndSpeak();
          });
        })
        .catch((err) => {
          console.error("Error initializing translators:", err);
        });
    },
    { once: true }
  );

  populateVoices();
  speechSynthesis.onvoiceschanged = populateVoices;

  let transcriber = null;
  recordButton.addEventListener(
    "click",
    (event) => {
      initTranscriber((err, event) => {
        if (err) {
          console.error(err);
          return;
        }
        if (event.type === "transcriber") {
          recordButton.textContent = "Start recording";
          transcriber = event.transcriber;
          console.log("Transcriber initialized", transcriber);
          initMediaRecorder(recordButton, async (err, recording) => {
            if (err) {
              console.error(err);
              return;
            }
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(
              await recording.arrayBuffer()
            );
            console.log("transcribing audio", audioBuffer);
            const transcription = await transcriber.prompt([
              {
                role: "user",
                content: [
                  { type: "audio", value: audioBuffer },
                  { type: "text", value: "Transcribe this short audio." },
                ],
              },
            ]);

            console.log("Transcription result:", transcription);
            input.value = transcription;
            translateAndSpeak();

            // const url = URL.createObjectURL(recording);
            // const audio = document.createElement("audio");
            // audio.controls = true;
            // audio.src = url;
            // output.appendChild(audio);
          });
        }
        if (event.type === "downloadProgress") {
          const { progress } = event;
          recordButton.textContent = `Preparing to record... ${Math.round(
            progress.loaded * 100
          )}%`;
        }
      });
    },
    { once: true }
  );
});
