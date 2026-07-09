# ams2-driver-rating

An Electron application with React and TypeScript. Still **WIP**.

## Overview
*Delta* is an application designed to help improve driver's skills before they go online in the game Automobillista 2. It uses [CREST2-AMS2](https://github.com/viper4gh/CREST2-AMS2) to pull data and accurately record races as you run them. 

As you race, your driver difficulty will adjust based on your current rating. As you finish races, they will automatically be recorded into the system locally, but you'll also have full control of modifying them.

Additionally, your safety rating will adjust each race based on hitting other drivers or objects, going off track, or spinning out.

You can set up races in any fashion, and drive races to your heart's content, it does not check for specific race types. Additionally, you can use custom drivers alongside this, or use this with other career apps. It does not generate drivers, only recommends AI strength and assumes all AI are of that strength.

**Just ensure you set the AI strength to match what your strength is in-game**

## Phase 2

Eventually will be turned into my own application involving custom series using Automobillista 2's content, with support for custom series.

Think of *iRacing Lite* where you will have seasons, and a bunch of series, and have to work up from Rookies to A class or Pro class.

This will also be optional as you'll be able to download the application with or without the series part of it.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
