//IMPORTS
import { isLogin } from "./functions.js";

//DATA
var UIDSess = document.getElementById("UIDSess").value;
var NamUserCom = JSON.parse(sessionStorage.getItem('user'));
var btnGuardarSol = document.getElementById("btnGuardarSol");
var btnCancelSol = document.getElementById("btnCancelSol");
var inpCantRow = document.getElementById("inpCantRow");
var inpFechaDetSol = document.getElementById("inpFechaDetSol").value;
var inpDiasDetSol = document.getElementById("inpDiasDetSol");
var inpAsigAutSol = document.getElementById("inpAsigAutSol");
var inpCharuser = document.getElementById("inpCharuser");

var hoy = new Date();
var dd = String(hoy.getDate()).padStart(2, '0');
var mm = String(hoy.getMonth() + 1).padStart(2, '0');
var yyyy = hoy.getFullYear();
hoy = dd + '/' + mm + '/' + yyyy;
var hoy1 = new Date();
hoy1 = yyyy + '-' + mm + '-' + dd;

//DIAS TRANSCURRIDOS
var date_diff_indays = function(date1, date2) {
  var dt1 = new Date(date1);
  var dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

var inpNamUserCom = document.getElementById("inpNamUserCom");
var inpFchComent =  document.getElementById("inpFchComent");
inpNamUserCom.value = NamUserCom.displayName;
inpFchComent.value =  hoy;

//WINDOWS LOAD
window.onload = function () {
  isLogin();
  var rowCount = $('#tablacomment tr').length;
  var currentUser1 = JSON.parse(sessionStorage.getItem('user'));
  var charUser1 = currentUser1.displayName;
  var charUserFirst1 = charUser1.charAt(0);
  inpCharuser.value = charUserFirst1;
  newComment(rowCount, charUserFirst1);
  inpDiasDetSol.value = date_diff_indays(inpFechaDetSol, hoy1)
};

//NEW COMMENT
function newComment(rowCount, char){
    if (rowCount >= 20) {
      swal("Advertencia!", "La solicitud ha superado el máximo de comentarios (20).", "warning", {
          buttons: { Ok: true },
      });
  } else {
    var newRow = $("<tr>");
    var cols = "";
    cols ='<td><div class="areaform2"><div class="text-center mr-2 mb-2 float-left" style="height:auto;"><div class="containerProfile"><img class="commentIMG" src="/img/user_bg.png" /><div id="userProfile1" class="centered">'+char+'</div></div></div><div class="text-left float-left col-md-10"><textarea rows="3" id="inpComentSol" class="form-control" style="font-size: 11px;" name="inpComentSol" placeholder="(Max. 140 Caracteres)" maxlength="140"></textarea><a style="font-size: 11px; color:#ffffff "id="inpNamUserCom" name="inpNamUserCom">'+NamUserCom.displayName+'</a><a style="font-size: 11px; color:#ffffff;"> - </a><a style="font-size: 11px; color:#ffffff;" id="inpFchComent" name="inpFchComent">'+hoy+'</a></div></div></td>';
    newRow.append(cols);
    $("table.newcomment").append(newRow);
    inpCantRow.value = $('#tablacomment tr').length;
  }
}

//CREAR LA AUTORIZACION
btnGuardarSol.addEventListener("click", () => {
  var shownPopup = false;
  $("#manageForm").submit(function (event) {
    if (shownPopup === false) {
      event.preventDefault();
      shownPopup = true;
      var form = $(this);

      if (validGest()==true) {
        swal("Advertencia!", "No hay ningún cambio que guardar.", "warning", {
          buttons: { Ok: true },
        });
      } else {
      swal("Un paso más!", "¿Desea guardar los cambios?", "success", {
        buttons: { cancel: "Volver", Si: true },
      }).then((value) => {
        switch (value) {
          case "Si":
            form.trigger("submit");
        }
      });
      }
    }
  });
});

//CANCELAR LA AUTORIZACION
btnCancelSol.addEventListener("click", () => {
  swal("Advertencia", "¿Desea salir de la gestión?", "warning", {
    buttons: { cancel: "Volver", Si: true },
  }).then( async (value) => {
    switch (value) {
      case "Si":
        window.location.href = "/ges/" + UIDSess + "/data";
    }
  });
});

//VALIDAR GUARDAR
function validGest(){
var inpComentSol = document.getElementById("inpComentSol").value;

  if (inpAsigAutSol.value == "" && inpComentSol == "") {
    return true;
  } else {
    return false;
  }
}