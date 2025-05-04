# trust-extension

## Installation (Chrome)

Clone and navigate to the repository.

If you haven't already, download/install Nodejs:
   - [https://nodejs.org/en/download](https://nodejs.org/en/download)
   - Or use [nvm](https://github.com/nvm-sh/nvm) if you're on unix or macOS and like version management.

If you haven't already, install pnpm:

```sh
npm install -g pnpm
```

Install dependencies:

```sh
pnpm i
```

Build the code:

```sh
pnpm run build
```

Visit [chrome://extensions/](chrome://extensions/) and ensure 'Developer mode' is enabled. Select 'Load unpacked'. Select the `dist` folder that was generated when building the code.

The extension should now be running in Chrome.
