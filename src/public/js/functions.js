//FIREBASE 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";

import {
    getAuth,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    sendEmailVerification, 
    setPersistence,
    browserSessionPersistence, 
    signInWithEmailAndPassword, 
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";

import {
    getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

const firebaseConfig = {
            //XXXX
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

//OBTENER VALOR X ID
const getElementVal = (id) => {
    return document.getElementById(id).value;
};

//CHECKLOGIN
function checklog() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.assign("/inicio");
        } else {
            window.location.assign("/ingreso");
        }
    });
}

//VALIDAR NULL
function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

//MAKEID
function makeid() 
{ 
    var text = ""; 
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; 
    for( var i=0; i < 5; i++ ) 
    text += possible.charAt(Math.floor(Math.random() * possible.length)); 
    return text; 
}

//VERIFICAR SI ESTA LOGEADO
function isLogin() {
    onAuthStateChanged(auth, (user) => {
        var currentUser = "";
        
        if (user) {

            currentUser = JSON.parse(sessionStorage.getItem('user'));
            userlink.innerText = "Bienvenid@ "+currentUser.displayName;

            var charUser = currentUser.displayName;
            var charUserFirst = charUser.charAt(0);
            userProfile.innerText = charUserFirst;

            userlink.classList.replace("btn", "nav-link");
            userlink.classList.remove("btn-primary");
            userlink.href = "#";
            signoutlink.innerText = "Cerrar Sesión";
            signoutlink.classList.replace("btn", "nav-link");
            signoutlink.classList.remove("btn-success");
            signoutlink.addEventListener('click', (e) => {
                signOut(auth).then(() => {
                    // Sign-out successful.
                    sessionStorage.removeItem("user");
                }).catch((error) => {
                    // An error happened.
                    alert(error);
                });
                // Sign-out successful.
            });
            // ...
        } else {
            window.location.assign("/");
        }
    });
}

//GET UID
function getUID() {
    var firebase = sessionStorage.getItem("user");
    var userlog = (JSON.parse(firebase));
    var uid = userlog.uid
    return uid;
  }

export { 
    initializeApp, 
    getStorage, 
    ref_storage, 
    uploadBytesResumable, 
    getDownloadURL, 
    getAuth, 
    signOut, 
    onAuthStateChanged, 
    sendPasswordResetEmail,
    sendEmailVerification,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    app,
    auth,
    storage,
    getElementVal,
    isEmptyOrSpaces,
    isLogin,
    makeid,
    deleteObject,
    getUID,
    updateProfile
};