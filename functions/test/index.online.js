/*
    Tests for index.ts, it uses the production
    firebase realtime database.
    // TODO: Unhandled Promises
    Find a way to test "send" function as well;
    Provisionally using `--exit` for mocha as these
    promises are not handled.
*/

// Test Setup

const admin = require('firebase-admin');
var assert = require('assert');
const sinon = require('sinon');

const accessid = process.env.AUTH_ACCESSID || 'sample_allow_long_uid';
const gproject = process.env.GCLOUD_PROJECT || 'atb00ker-apps';
const privtoken = process.env.GOOGLE_APPLICATION_CREDENTIALS || './account.json';

const projectConfig = {
    databaseURL: `https://${gproject}.firebaseio.com`,
    projectId: `${gproject}`,
    databaseAuthVariableOverride: { uid: accessid }
};
const firebaseFunctionsTest = require('firebase-functions-test')(projectConfig, privtoken);

describe('Cloud Functions', () => {
    let testFunction;
    let testPincode = "tests";

    after(() => {
        firebaseFunctionsTest.cleanup();
        admin.database().ref('isplist').child(testPincode).remove();
    });

    describe('Authenticated User', () => {
        before(() => {
            sinon.stub(admin, 'auth').get(() => () => ({ getUser: sinon.fake.resolves(), }));
            testFunction = require('../lib/index.js');
        });

        it('Successfully Add Provider', (done) => {
            const body = {
                "pincode": testPincode,
                "uid": 'pass',
                "values": {
                    "contact": "test@test.com",
                    "name": "Company Name",
                    "website": "http://www.something.com"
                }
            }
            const req = { method: "POST", body: body };
            const res = { status: (code) => { assert.equal(code, 200); done(); }, set: () => { } };
            testFunction.addProvider(req, res);
        });

        /* Test Fails due to wrong Request Method. */

        it('Method Not Allowed', (done) => {
            const req = { method: "GET" };
            const res = { status: (code) => { assert.equal(code, 405); done(); }, set: () => { } };
            testFunction.addProvider(req, res);
        });

        /* Test Fails due to wrong Request Body. */

        it('Fail: No Request Body', (done) => {
            const req = { method: "POST" };
            const res = { status: (code) => { assert.equal(code, 400); done(); }, set: () => { } };
            testFunction.addProvider(req, res);
        });

        it('Fail: No "Values" Parameter', (done) => {
            const body = {
                "uid": 'pass',
                "pincode": testPincode,
            }
            const req = { method: "POST", body: body };
            const res = { status: (code) => { assert.equal(code, 400); done(); }, set: () => { } };
            testFunction.addProvider(req, res);
        });

        it('Fail: No User', (done) => {
            const req = { method: "POST", body: {} };
            const res = { status: (code) => { assert.equal(code, 400); done(); }, set: () => { } };
            testFunction.addProvider(req, res);
        });

        it('Fail: No Pincode', (done) => {
            const body = { "uid": 'pass' }
            const req = { method: "POST", body: body };
            const res = { status: (code) => { assert.equal(code, 400); done(); }, set: () => { } };
            testFunction.addProvider(req, res);
        });

        it('Fail: No Name', (done) => {
            const body = {
                "uid": 'pass',
                "pincode": testPincode,
                "values": {}
            }
            const req = { method: "POST", body: body };
            const res = { status: (code) => { assert.equal(code, 400); done(); }, set: () => { } };
            testFunction.addProvider(req, res);
        });
    });

    describe('Unauthenticated User', () => {

        before(() => {
            sinon.stub(admin, 'auth').get(() => () => ({ getUser: sinon.fake.resolves(), }));
            testFunction = require('../lib/index.js');
        });

        it('Unknown User', (done) => {
            const body = { "uid": 'pass' }
            const req = { method: "POST", body: body };
            const res = { status: (code) => { assert.equal(code, 400); done(); }, set: () => { } };
            testFunction.addProvider(req, res);
        });
    });
})
