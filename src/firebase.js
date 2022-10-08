require('dotenv').config();

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } =  require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

initializeApp ({
    credential: applicationDefault(),
})

const db = getFirestore();;
const auth = getAuth();

module.exports = {
    db, auth
}