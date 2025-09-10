export function initWebSpeechRecognition(button, inputLanguage, callback) {
  let listening = false;
  const buttonText = button.textContent;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (typeof SpeechRecognition !== "undefined") {
    const recognition = new SpeechRecognition();

    const stop = () => {
      recognition.stop();
      button.textContent = buttonText;
    };

    const start = () => {
      recognition.start();
      button.textContent = "Stop listening";
    };

    let lastResult = null;
    const onResult = (event) => {
      const result = Array.from(event.results)
        .filter((res) => res.isFinal)
        .map((res) => {
          const text = res[0].transcript;
          return text;
        })
        .at(-1);
      if (result && result !== lastResult) {
        lastResult = result;
        callback(null, result.trim());
      }
    };

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.addEventListener("result", onResult);
    button.addEventListener("click", () => {
      recognition.lang = inputLanguage.value;
      console.log(recognition);
      listening ? stop() : start();
      listening = !listening;
    });
  } else {
    callback(new Error("Speech recognition not supported in this browser."));
  }
}
