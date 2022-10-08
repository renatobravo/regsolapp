import { 
signOut, 
sendEmailVerification,
signInWithEmailAndPassword,
setPersistence,
browserSessionPersistence,
auth,
isEmptyOrSpaces
} from "./functions.js"

//REFERENCIAS
var userlink = document.getElementById("userlink");
var signoutlink = document.getElementById("signoutlink");
var logForm = document.getElementById("logForm");
var valFront = document.getElementById("valFront");
var classValFront = valFront.classList;

//SUBMIT CREAR
logForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var email = document.getElementById("emailInp").value;
    var pass = document.getElementById("passInp").value;
    AuthenticateUser(email, pass);
});

function ValidationSpace(email, pass) {
  if (
    isEmptyOrSpaces(email) ||
    isEmptyOrSpaces(pass)
  ) {
    alertasRemove();
    valFront.classList.replace("displayNone", "displayBlock");
    valFront.innerText = "Ingresa el Correo y Contraseña!";
    return false;
  }
return true;
}

//ALERTAS FRONT
function alertasRemove() {
  valFront.classList.remove(...valFront.classList);
  classValFront.add("alert");
  classValFront.add("alert-warning");
  classValFront.add("displayNone");
}

//PROCESO DE AUTENTIFICACION USER + PASS
function AuthenticateUser(email, pass) {

  if (!ValidationSpace(email, pass)) {
    return;
  }

  setPersistence(auth, browserSessionPersistence)
  .then(function() {

    signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {

        const user = userCredential.user;
        const emailVerified = user.emailVerified
        const userUID = user.uid
        
        if (emailVerified == false){
          sendEmailVerification(auth.currentUser)
              .then(() => {
              })
              .catch(error => {
                console.error(error);
              })
          signOut(auth).then(() => {
              // Sign-out successful.
            sessionStorage.removeItem("user");
            alertasRemove();
            valFront.classList.replace("displayNone", "displayBlock");
            valFront.classList.replace("alert-warning", "alert-info");
            valFront.innerText = "Debes verificar el correo electrónico antes de iniciar sesión, te hemos enviado nuevamente el correo de validación.";
          }).catch((error) => {
              // An error happened.
            alert(error);
          });

        } else {
            sessionStorage.setItem('user', JSON.stringify(user));
            window.location = "/inicio/" + userUID; 
        }
    }).catch((error) => {
        if (error.code === 'auth/user-not-found') {
          alertasRemove();
          valFront.classList.replace("displayNone", "displayBlock");
          valFront.classList.replace("alert-warning", "alert-danger");
          valFront.innerText = "Usuario no Encontrado";
        } else if (error.code === 'auth/invalid-email') {
          alertasRemove();
          valFront.classList.replace("displayNone", "displayBlock");
          valFront.classList.replace("alert-warning", "alert-danger");
          valFront.innerText = "Correo Electrónico Invalido";
        } else if (error.code === 'auth/wrong-password') {
          alertasRemove();
          valFront.classList.replace("displayNone", "displayBlock");
          valFront.classList.replace("alert-warning", "alert-danger");
          valFront.innerText = "Contraseña Incorrecta";
        } else if (error.code === 'auth/internal-error') {
          alertasRemove();
          valFront.classList.replace("displayNone", "displayBlock");
          valFront.classList.replace("alert-warning", "alert-danger");
          valFront.innerText = "Error interno, avisar al Administrador del Sistema";
        } else if (error.code === 'auth/network-request-failed') {
          alertasRemove();
          valFront.classList.replace("displayNone", "displayBlock");
          valFront.classList.replace("alert-warning", "alert-danger");
          valFront.innerText = "Sin conexión a la red";
        } else if (error.code === 'auth/auth/too-many-requests') {
          alertasRemove();
          valFront.classList.replace("displayNone", "displayBlock");
          valFront.classList.replace("alert-warning", "alert-info");
          valFront.innerText = "Se ha bloqueado temporalmente la cuenta por intentos fallidos, trata de recuperar tu contraseña o intenta más tarde.";
        } 
        else {
          alertasRemove();
          valFront.classList.replace("displayNone", "displayBlock");
          valFront.classList.replace("alert-warning", "alert-dark");
          valFront.innerText = error;
        }
    });
  }); 
}
//WINDOWS LOAD
window.onload = function () {

  if (sessionStorage.getItem('user') == null) {
      userlink.innerText = "Crear Cuenta";
      userlink.classList.replace("nav-link", "btn");
      userlink.classList.add("btn-dark");
      userlink.href = "registrar";
      signoutlink.innerText = "Acceder";
      signoutlink.classList.replace("nav-link", "btn");
      signoutlink.classList.add("btn-secondary");
      signoutlink.href = "ingresar";
  } else {
      window.location.assign("/inicio/" + userUID);
  }
}