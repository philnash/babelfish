# Built-in AI Workshop

This workshop demonstrates how to use the built-in AI language detection and translation services in the browser.

There is a static HTML page of a fake social media site that displays posts in different languages. The posts are displayed in the user's language, and a "Translate" button is added to each post if the post's language is different from the user's language. Clicking the button translates the post to the user's language.

At least it should. Your task is to hook up the four functions at the top of `translator.js` so that the app can:

- Create the `LanguageDetector` model
- Detect the language of a given text
- Check if translation is available between two languages
- Translate a given text from one language to another

## Running the application

You can run this application by opening `workshop/index.html` in Chrome.

## What to do

### Create the `LanguageDetector` model

The `createLanguageDetector` function needs to do two things:

- Check to see whether the `LanguageDetector` model is available in the browser with `LanguageDetector.availability()`
- If it is, load the model with `LanguqageDetector.create()` and return it

If the model is not available, the function should return `false`.

### Detect the language of a given text

The `detectLanguage` function needs to receive a string of text and a detector and return the top most likely language of that text.

To do so, you will need to call `detector.detect(text)` which returns a promise that resolves with an array of potential languages. Return the `detectedLanguage` from the first item in the array.

### Check if translation is available between two languages

The `translationAvailable` function receives two languages and must check the availability of a translation model for them. You need to use `Translator.availability()` passing the `sourceLanguage` and `targetLanguage` as an object.

If the model is "unavailable" then we return `false`, but if it is any other status, return `true`.

### Translate a given text from one language to another

Finally the `translate` function receives a string of text, a source language, a target language. It must now create a translator model using `Translator.create()` passing the `sourceLanguage` and `targetLanguage` as an object.

Once the model is created, you can then call `translator.translate(text)` which returns a promise that resolves with the translated text.

### Documentation

- [The Language Detector API](https://developer.chrome.com/docs/ai/language-detection)
- [The Translator API](https://developer.chrome.com/docs/ai/translator-api)
