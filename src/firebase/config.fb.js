import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCXZoAKPXgdYIdwrIAj_HjKoEdaNoxcRMk",
    authDomain: "fir-chat-611fe.firebaseapp.com",
    projectId: "fir-chat-611fe",
    storageBucket: "fir-chat-611fe.appspot.com",
    messagingSenderId: "799000397572",
    appId: "1:799000397572:web:b378f4486a32c9ddcb3251",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const roomCol = collection(db, "room");

const loginWithGoole = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((res) =>
        console.log("user", res.user)
    );
};

const logOut = () => {
    auth.signOut();
};

const sendMsg = async (uid, url, name, text) => {
    const newMsg = {
        text,
        uid,
        url,
        name,
        time: Date.now(),
    };
    await addDoc(roomCol, newMsg);
};

export { app, auth, db, roomCol, loginWithGoole, logOut, sendMsg };
