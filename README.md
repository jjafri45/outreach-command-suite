# Outreach Command Suite

[![CI](https://github.com/jjafri45/outreach-command-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/jjafri45/outreach-command-suite/actions/workflows/ci.yml)

Outreach Command is a browser-based CRM for freelancers and small studios. It keeps prospects, outreach, follow-ups, and client documents in one workspace. It runs on GitHub Pages without a build step.

## Features

- Prospect pipeline, activity tracking, follow-ups, and JSON backup.
- ProposalCraft, Client Contract Builder, and Invoice Generator connected through Client Workspace.
- Optional AI helper and Gmail integration that use credentials you provide in your browser.

## Quick start for users

Open [the published app](https://jjafri45.github.io/outreach-command-suite/) or download the repository and open `index.html`. Choose a prospect in Client Workspace to start a proposal, contract, or invoice. CRM records are stored in this browser, not in GitHub. Browser storage can be lost if you clear site data or switch devices, so use **Export Backup (.json)** regularly. Import that file in Settings when you need to restore your CRM records.

## Architecture

`index.html` contains the existing single-page app. `v27-cleanup.js` connects its existing controls to small browser scripts in `src`. Each `src` file can also be imported into Jest without a bundler. The three document tools remain standalone pages.

```text
index.html                    Main CRM page and script loading order
v27-cleanup.js                Browser entry point for cleanup controls
src/config.js                 Public constants and email validation
src/data/sampleWorkspace.js   Demo prospects and dates
src/data/backup.js            Backup field allowlist
src/ui/iconRenderer.js        Navigation SVG icons
src/ui/modalState.js          Modal open, close, and Escape behavior
src/onboarding.js             First-run onboarding and safe storage
tools/                       Proposal, contract, and invoice pages
tests/                       Jest unit and browser compatibility tests
```

## Install for developers

Install Node 24 LTS, then run:

```sh
git clone https://github.com/jjafri45/outreach-command-suite.git
cd outreach-command-suite
npm install
```

The dependencies are for developer checks only. Users do not need Node or npm.

## Run

Open `index.html` directly in a browser, or run `npx serve .` and visit the local address it prints. The app needs no build command. Some browser integrations require an online origin and will not work from a local file.

## Test

```sh
npm test
npm run test:coverage
```

Run `npm run lint` to check JavaScript. Run `npm run lint:fix` for safe automatic fixes. Run `npm run format:check` to verify formatting or `npm run format` to format maintained source and docs. Legacy app markup is intentionally excluded from broad formatting to avoid unrelated changes.

## Configuration

`SUPPORT_EMAIL` and `ONBOARDED_KEY` live in `src/config.js`. Change the support address there if the project owner wants a different public contact address. No secrets or `.env` values are required. `.env.example` documents this explicitly.

## Security and privacy

CRM data stays in the browser's local storage. The app is a public static website, not a database. The optional AI feature asks each user for their own API key and stores it in that user's browser only. JSON backups use an explicit list of CRM fields and do not include the AI API key. Treat exported backups as private because they can contain prospect details.

## Contributing

Create a branch, keep changes focused, run `npm test`, `npm run lint`, and `npm run format:check`, then open a pull request. Do not commit real prospect data, API keys, or other credentials.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

UNLICENSED. The repository is public to view and use through the hosted app, but no permission to copy or redistribute its source is granted.
