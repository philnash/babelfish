# A built-in browser-based babelfish

This application is an example application that uses [browser built-in AI](https://developer.chrome.com/docs/ai/built-in) to create an English-Spanish translation application in the browser.

> [!WARNING]
> This is experimental browser technology. If you want to build great server-side AI experiences, check out [Langflow](https://www.langflow.org/).

## Running the application

At the time of publishing, the best experience is in Chrome Canary with the right flags to enable [the Prompt API with multimodal capabilities](https://developer.chrome.com/docs/ai/prompt-api).



Clone the application:

```sh
git clone https://github.com/philnash/babelfish.git
cd babelfish
```

Install the dependencies:

```sh
npm install
```

And run the development server:

```sh
npm run dev
```

The app will open at [http://localhost:5173/](http://localhost:5173/).

