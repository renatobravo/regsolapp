//IMPORTS
import { isLogin, getUID, auth, updateProfile } from "./functions.js";

//REFERENCIAS SOLICITUD
var btnGuardarSol = document.getElementById("btnGuardarSol");
var btnCancelSol = document.getElementById("btnCancelSol");
var areaInp = document.getElementById("areaInp");
var subareas = document.getElementById("subareas");
var subareaInp = document.getElementById("subareaInp");
var labenameInp = document.getElementById("labenameInp");

//WINDOWS LOAD
window.onload = function () {
  isLogin();
  //AREA GERENCIA
  if (areaInp.value == "Gerencia"){
      subareas.classList.replace("displayNone", "display");
  } else {
    subareas.classList.replace("display", "displayNone");
      subareaInp.value == "";
  }
};

//AREA GERENCIA
areaInp.addEventListener("change", () => {
  if (areaInp.value == "Gerencia"){
      subareas.classList.replace("displayNone", "display");
  } else {
      subareas.classList.replace("display", "displayNone");
      subareaInp.value == " ";
  }
})

//GUARDAR
btnGuardarSol.addEventListener("click", () => {
  var shownPopup = false;
  $("#userForm").submit(function (event) {
    if (shownPopup === false) {
      event.preventDefault();
      shownPopup = true;
      var form = $(this);
      swal("Un paso más!", "¿Desea guardar los cambios?", "success", {
        buttons: { cancel: "Volver", Si: true },
      }).then((value) => {
        switch (value) {
          case "Si":
            var newDisplayName = "";
            newDisplayName = document.getElementById("nameInp").value;
            if (valUsername(newDisplayName) == false) {
              labenameInp.classList.replace("displayNone", "display");
            } else {
            updateProfile(auth.currentUser, {
              displayName: newDisplayName
            }).then(() => {
              form.trigger("submit");
            }).catch((error) => {
              alert(error);
            });  
            }
          }
      });
    }
  });
});

//CANCELAR
btnCancelSol.addEventListener("click", () => {
  swal("Advertencia", "¿Desea salir?", "warning", {
    buttons: { cancel: "Volver", Si: true },
  }).then( async (value) => {
    switch (value) {
      case "Si":
        var uid = getUID();
        window.location.href = "/inicio/"+uid;
    }
  });
});

//VALIDACIONES REGISTRO USUARIO
function valUsername(username) {
  let nameregex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
  if (!nameregex.test(username)) {
      return false;
  }
  return true;
}

