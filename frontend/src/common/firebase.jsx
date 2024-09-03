import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB3VzQnOqLwFVkb4zDQysHnhwL7b5O2bTQ",
  authDomain: "myconspector.firebaseapp.com",
  projectId: "myconspector",
  storageBucket: "myconspector.appspot.com",
  messagingSenderId: "235037755331",
  appId: "1:235037755331:web:f97c1443ae3613cf82df76"
};

const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) => {
        console.log(err)
    })
    return user;
}