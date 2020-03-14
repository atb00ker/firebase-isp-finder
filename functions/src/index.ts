import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

let accessid: string;
let firebaseConfig = null;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Development
    accessid = "sample_allow_long_uid";
    firebaseConfig = functions.config().firebase;
} else {
    // Production
    accessid = functions.config().auth.accessid;
    firebaseConfig = functions.config();
}

firebaseConfig.databaseAuthVariableOverride = { uid: accessid };
firebaseConfig.databaseURL = `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`;
firebaseConfig.storageBucket = `${process.env.GCLOUD_PROJECT}.appspot.com`;
firebaseConfig.projectId = `${process.env.GCLOUD_PROJECT}`;
admin.initializeApp(firebaseConfig);
const auth = admin.auth();

export const addProvider = functions.https.onRequest((request, response) => {
    if (request.method !== "POST") {
        response.status(400).send("Not Allowed");
        return;
    }
    const data = request.body;
    auth.getUser(data['uid'])
        .then(() => {
            const pincode = valueOrEmpty(data["pincode"]);
            const name = valueOrEmpty(data["values"]["name"]);
            const contact = valueOrEmpty(data["values"]["contact"]);
            const website = valueOrEmpty(data["values"]["website"]);
            const database = admin.database().ref("isplist").child(pincode);
            database.push({ name, contact, website }, (error: any) => console.log(error));
            response.status(200).send("Complete");
        })
        .catch((error: any) => {
            console.log(error);
            response.status(403).send("Unknown User");
        });
});

function valueOrEmpty(value: string) {
    if (value !== undefined)
        return value;
    else
        return '';
}
