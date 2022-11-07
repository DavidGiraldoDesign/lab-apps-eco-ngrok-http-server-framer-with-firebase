require('dotenv').config();
const express = require("express");
const cors = require("cors");
const jsonDataModel = require("./data_model.json");

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, addDoc } = require("firebase/firestore");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "ooh-interactive-experience.firebaseapp.com",
    projectId: "ooh-interactive-experience",
    storageBucket: "ooh-interactive-experience.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getFirestore(firebaseApp);
const leadsCollection = collection(database, 'Leads');

async function getLeads(leadsCollection) {
    const leadSnapshot = await getDocs(leadsCollection);
    //console.log(leadSnapshot)
    const leadList = leadSnapshot.docs.map(doc => doc.data());
    console.log(leadList);
    return leadList;
}
getLeads(leadsCollection);

async function addNewDocument(collection, newDocument) {
    try {
        let document = newDocument
        const docRef = await addDoc(collection, document);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) { console.log(e) }
}

const app = express();
app.use(cors({ origin: "*" }))
app.use(express.json())
app.listen(5050);

let animals = jsonDataModel.animals
let drinks = jsonDataModel.drinks

app.get('/animals', (request, response) => {
    console.log('log - ' + new Date().getMilliseconds())
    response.send(animals);
})

app.get('/drinks', (request, response) => {
    console.log('log - ' + new Date().getMilliseconds())
    response.send(drinks);
})

app.post('/add-new-lead', (request, response) => {
    console.log('log - ' + new Date().getMilliseconds())
    console.log('Framer body:')
    console.log(request.body)
    addNewDocument(leadsCollection, request.body);
    response.status(200).end();
})