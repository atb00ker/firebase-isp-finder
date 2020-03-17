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
4. Create firebase [private key](https://firebase.google.com/docs/admin/setup#initialize-sdk).
5. Save key file in the `functions/` directory as `account.json`.
6. (For new project) Create a Realtime database on firebase from admin console interface.
8. Set Authentication Token: `firebase functions:config:set auth.accessid=<YOUR_RANDOM_AUTH_TOKEN>`.
9. Deploy database rules: `firebase deploy --only database`.

## Develop

1. Go to `functions/` directory.
2. Set environment variables

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./account.json"
# Use `firebase functions:config:get` to get the value of `auth.accessid`
export AUTH_ACCESSID=<YOUR_RANDOM_AUTH_ACCESS_ID>
```

3. Run: `npm run develop`.

## Deploy

**Note: To deploy only functions, `npm run deploy` can be used.**

1. Set the allowed UID value for database in `database.rules.json` (default: `sample_allow_long_uid`).
2. (Optional) Change Authentication Token `firebase functions:config:set auth.accessid=<YOUR_RANDOM_AUTH_TOKEN>`.
4. Deploy: `firebase deploy`


## Test

1. Set environment variables:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./account.json"
# Use `firebase functions:config:get` to get the value of `auth.accessid`
# Default: 'sample_allow_long_uid'
export AUTH_ACCESSID=<YOUR_RANDOM_AUTH_ACCESS_ID>
# Default: 'atb00ker-apps'
export GCLOUD_PROJECT=<YOUR_PROJECT_NAME>
```

2. Run tests: `npm run test`
