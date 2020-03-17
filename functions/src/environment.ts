const functions = require('firebase-functions');
export let firebaseConfig: any;

// Set according to environment mode.
if (process.env.ENV_MODE === 'develop') {
    firebaseConfig = functions.config().firebase;
    firebaseConfig.databaseAuthVariableOverride = { uid: process.env.AUTH_ACCESSID || 'sample_allow_long_uid' };
} else if (process.env.ENV_MODE === 'test') {
    firebaseConfig = functions.config();
    firebaseConfig.databaseAuthVariableOverride = { uid: process.env.AUTH_ACCESSID || 'sample_allow_long_uid' };
    firebaseConfig.databaseURL = `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`;
    firebaseConfig.projectId = `${process.env.GCLOUD_PROJECT}`;
} else {
    firebaseConfig = functions.config();
    firebaseConfig.databaseAuthVariableOverride = { uid: functions.config().auth.accessid };
    firebaseConfig.databaseURL = `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`;
    firebaseConfig.projectId = `${process.env.GCLOUD_PROJECT}`;
}
