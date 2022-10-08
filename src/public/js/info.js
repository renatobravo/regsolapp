//IMPORTS
import { isLogin } from "./functions.js";

var inpArea = document.getElementById("inpArea");
var btnBuscarSol = document.getElementById("btnBuscarSol");
var areaSwitch = document.getElementById("areaSwitch");
var qryGerenciaVal = document.getElementById("qryGerenciaVal");
var verAutorizados = document.getElementById("verAutorizados");
var inpFchDesdeSol = document.getElementById("inpFchDesdeSol");
var inpFchHastaSol = document.getElementById("inpFchHastaSol");
var customSwitch1 = document.getElementById("customSwitch1");
var UserSol = document.getElementById("UserSol");
var AutSol = document.getElementById("AutSol");
var flexCheckDefault = document.getElementById("flexCheckDefault");
var inpUserSol = document.getElementById("inpUserSol");

function checkQRY() {
  if(document.getElementById('customSwitch1').checked) {
    qryGerenciaVal.value = $('#customSwitch1:checked').val()
  } else {
    qryGerenciaVal.value = ""
  }
}

function checkQRY2() {
  if(document.getElementById('flexCheckDefault').checked) {
    verAutorizados.value = $('#flexCheckDefault:checked').val()
  } else {
    verAutorizados.value = ""
  }
}

//USUARIOS
customSwitch1.addEventListener("click", () => {
  if(document.getElementById('customSwitch1').checked) {
    UserSol.classList.replace("displayNone", "display");
    AutSol.classList.replace("display", "displayNone");
    flexCheckDefault.disabled = true;
    flexCheckDefault.checked = "";
  } else {
    UserSol.classList.replace("display", "displayNone");
    AutSol.classList.replace("displayNone", "display");
    flexCheckDefault.disabled = false;
    inpUserSol.value = "";
  }
})

//BUSCAR
btnBuscarSol.addEventListener("click", () => {
  var shownPopup = false;
  $("#searchForm").submit(function (event) {
    if (shownPopup === false) {
      event.preventDefault();
      shownPopup = true;
      var form = $(this);
      if (inpFchHastaSol.value < inpFchDesdeSol.value) {
        swal("Fecha Incorrecta!", "La fecha hasta, no puede ser menor a la fecha desde.", "warning", {
          buttons: { Volver: true },
        });
      } else {
        checkQRY();
        checkQRY2();
        form.trigger("submit");
      }
    }
  });
});

//WINDOWS LOAD
window.onload = function () {
  isLogin();
  //AREA GERENCIA
  if (inpArea.value == "Gerencia"){
    areaSwitch.classList.replace("displayNone", "display");
    AutSol.classList.replace("displayNone", "display");
  } else {
    areaSwitch.classList.replace("display", "displayNone");
    AutSol.classList.replace("display", "displayNone");
  }
};


