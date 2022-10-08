//REFERENCIAS
let userlink = document.getElementById("userlink");
let signoutlink = document.getElementById("signoutlink");

var areaInp = document.getElementById("areaInp");
var subareas = document.getElementById("subareas");
var subareaInp = document.getElementById("subareaInp");

//AREA GERENCIA
areaInp.addEventListener("change", () => {
    if (areaInp.value == "Gerencia"){
        subareas.classList.replace("displayNone", "display");
    } else {
        subareas.classList.replace("display", "displayNone");
        subareaInp.value == "";
    }
  })

//WINDOWS LOAD
window.onload = function () {

if (sessionStorage.getItem('user') == null) {
    
    userlink.innerText = "Crear Cuenta";
    userlink.classList.replace("nav-link", "btn");
    userlink.classList.add("btn-dark");
    userlink.href = "./registrar";
    signoutlink.innerText = "Acceder";
    signoutlink.classList.replace("nav-link", "btn");
    signoutlink.classList.add("btn-secondary");
    signoutlink.href = "./ingresar";
} 
else {
    window.location.assign("inicio");
}
}