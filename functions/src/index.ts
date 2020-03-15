import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const firebaseConfig = require('./environment');

admin.initializeApp(firebaseConfig);
const auth = admin.auth();

export const addProvider = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Methods', 'POST')
    response.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');

    if (request.method === 'OPTIONS') {
        response.status(200).send('Allowed');
        return;
    } else if (request.method === 'POST') {
        if (!request.body || !request.body['uid'] ||
            !request.body['pincode'] || !request.body['values'] ||
            !request.body['values']['name']) { response.status(400).send('Request Body Error'); }
        const data = request.body;
        auth.getUser(data['uid'])
            .then(() => {
                const pincode = data['pincode'];
                const name = data['values']['name'];
                const contact = (data['values']['contact'] || '');
                const website = (data['values']['website'] || '');
                databasePush(pincode, name, contact, website)
                    .then(status => {
                        if (status === undefined) response.status(200).send('Success');
                        else response.status(400).send('Failed');
                    })
                    .catch(error => {
                        console.log(error);
                        response.status(500).send('Server Error');
                    });
                return;
            })
            .catch(() => {
                response.status(403).send('Unknown User');
                return;
            });
    } else {
        response.status(405).send('Method Not Allowed');
        return
    }
});

async function databasePush(pincode: number, name: string, contact: string, website: string) {
    const database = admin.database().ref('isplist').child(pincode);
    await database.push({ name, contact, website }, (error: Error | null) => { return error; });
}
