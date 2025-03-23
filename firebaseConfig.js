import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDyK-bZj9b1HAmVypOh3M9cHS2-ZTADh_o",
    authDomain: "info6127-1237011.firebaseapp.com",
    databaseURL: "https://info6127-1237011-default-rtdb.firebaseio.com",
    projectId: "info6127-1237011",
    storageBucket: "info6127-1237011.firebasestorage.app",
    messagingSenderId: "371025354760",
    appId: "1:371025354760:web:31ae563483e83cfdf071bd"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };