export function say(text, voice) {
  console.log(voice);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  speechSynthesis.speak(utterance);
}

export function loadVoices() {
  const availableVoices = speechSynthesis.getVoices();
  const englishVoices = availableVoices.filter(
    (voice) => voice.lang.startsWith("en") && voice.localService
  );
  const spanishVoices = availableVoices.filter(
    (voice) => voice.lang.startsWith("es") && voice.localService
  );

  return {
    en: englishVoices,
    es: spanishVoices,
  };
}

export function createVoiceSelect(labelText, id, voices) {
  const container = document.createElement("div");

  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = labelText;

  const select = document.createElement("select");
  select.setAttribute("id", id);
  select.classList.add("language-select");

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    if (voice.default) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  container.appendChild(label);
  container.appendChild(select);
  return container;
}
