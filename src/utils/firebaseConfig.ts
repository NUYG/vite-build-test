import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCaQN-3SiE55OhdvgZ6-OFb3a8n0kzvel0",
    authDomain: "fplandcrm.firebaseapp.com",
    projectId: "fplandcrm",
    storageBucket: "fplandcrm.appspot.com",
    messagingSenderId: "354382168210",
    appId: "1:354382168210:web:c94e388fd939c63974e64b",
    measurementId: "G-8VEZ7JKF51"
};
export const firebaseApp = initializeApp(firebaseConfig);

export const db= getFirestore(firebaseApp)




