# ISP Finder (Firebase)

Fasebase Backend for ISP Finder project.
It contains the database rules and Cloud Function manage the database.

## Requirements
- Node 8+
- npm

## Setup

1. Install firebase: `npm install -g firebase-tools`
2. Go to `functions/` directory.
3. Install: `npm install`.
4. Read [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to create the private key.
5. Save key file in the `functions/` directory as `account.json`.
6. Set environment variable `export GOOGLE_APPLICATION_CREDENTIALS="./account.json"` to point to this file.
7. Run: `npm run develop`.

## Deploy
1. Set the allowed UID value for database in `database.rules.json` (default: `sample_allow_long_uid`).
2. Set environment variable (change default value) `firebase functions:config:set auth.accessid=sample_allow_long_uid`.
3. Unset development environment value `unset GOOGLE_APPLICATION_CREDENTIALS`
4. Deploy: `firebase deploy`
