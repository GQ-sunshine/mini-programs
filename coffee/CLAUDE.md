# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-level Code Architecture

This is a WeChat Mini Program for a coffee ordering application.

- **Entry Point**: `app.js` is the entry point of the application, where global data is managed.
- **Pages**: The `pages` directory contains all the pages of the mini-program, such as `home`, `menu`, `order`, etc. Each page consists of four files: `.js` (logic), `.json` (configuration), `.wxml` (structure), and `.wxss` (styling).
- **Services**: The `service` directory handles business logic, including `request.js` for making API calls and `storage.js` for local data storage.
- **Internationalization (i18n)**: The `i18n` directory manages localization. The `scan` script in `package.json` is used to extract text for translation.
- **Static Assets**: The `static` directory holds static resources like images.

## Common Commands

- **Run i18n scanner**: `npm run scan`
  - This command scans the codebase for i18n keys and updates the translation files.

There are no build or test commands configured in `package.json`.
