//REFERENCIAS
let userlink = document.getElementById("userlink");
let signoutlink = document.getElementById("signoutlink");

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

    window.location.assign("inicio");
}
}