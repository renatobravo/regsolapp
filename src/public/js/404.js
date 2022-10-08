var userlink = document.getElementById("userlink");
var signoutlink = document.getElementById("signoutlink");

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
    } 
    else {

        currentUser = JSON.parse(sessionStorage.getItem('user'));
        userlink.innerText = "Bienvenid@ "+currentUser.displayName;
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
            window.location.assign("ingresar");
            // Sign-out successful.
        });
    }
    }