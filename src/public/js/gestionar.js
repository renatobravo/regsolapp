//IMPORTS
import { isLogin } from "./functions.js";

//DATA
var UIDSess = document.getElementById("UIDSess").value;
var inpUIDuser = document.getElementById("inpUIDuser").value;
var inpCambEstSol = document.getElementById("inpCambEstSol");
var inpFchMisoCom = document.getElementById("inpFchMisoCom");
var inpObsComent = document.getElementById("inpObsComent");
var inpFchMisoCom_aux = document.getElementById("inpFchMisoCom_aux");
var inpObsComent_aux = document.getElementById("inpObsComent_aux");
var inpAutResponse_aux = document.getElementById("inpAutResponse_aux");
var inpAutEmailSolDet_aux = document.getElementById("inpAutEmailSolDet_aux");
var inpCharuser = document.getElementById("inpCharuser");
var NamUserCom = JSON.parse(sessionStorage.getItem('user'));
var btnGuardarSol = document.getElementById("btnGuardarSol");
var btnCancelSol = document.getElementById("btnCancelSol");
var inpCantRow = document.getElementById("inpCantRow");
var inpFechaDetSol = document.getElementById("inpFechaDetSol").value;
var inpDiasDetSol = document.getElementById("inpDiasDetSol");
var gestDir1 = document.getElementById("gestDir1");
var gestDir2 = document.getElementById("gestDir2");
var gestDir3 = document.getElementById("gestDir3");
var gestDir4 = document.getElementById("gestDir4");
var classareagestDir1 = gestDir1.classList;
var classareagestDir2 = gestDir2.classList;
var classareagestDir3 = gestDir3.classList;
var classareagestDir4 = gestDir4.classList;

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


//WINDOWS LOAD
window.onload = function () {
  isLogin();
  if (UIDSess != inpUIDuser){
    if (!inpAutEmailSolDet_aux.value == "" && inpAutResponse_aux.value == "") {
      inpCambEstSol.disabled = true;
      inpFchMisoCom.disabled = true;
      inpObsComent.disabled = true;
      classareagestDir1.add("displayNone");
      classareagestDir2.add("displayNone");
    } else {
      inpCambEstSol.disabled = false;
      inpFchMisoCom.disabled = false;
      inpObsComent.disabled = false;
      classareagestDir1.add("displayNone");
      classareagestDir2.add("displayNone");
    }
  } else {
    classareagestDir3.add("displayNone");
    classareagestDir4.add("displayNone");
  }
  var rowCount = $('#tablacomment tr').length;
  var currentUser1 = JSON.parse(sessionStorage.getItem('user'));
  var charUser1 = currentUser1.displayName;
  var charUserFirst1 = charUser1.charAt(0);
  inpCharuser.value = charUserFirst1;
  newComment(rowCount, charUserFirst1);
  inpDiasDetSol.value = date_diff_indays(inpFechaDetSol, hoy1)
  inpComentSol.value == ""
};

//NEW COMMENT
function newComment(rowCount, char){
    if (rowCount >= 20) {
      swal("Advertencia!", "La solicitud ha superado el máximo de comentarios (20).", "warning", {
          buttons: { Ok: true },
      });
  } else {
    var inpNamUserCom = document.getElementById("inpNamUserCom");
    var inpFchComent =  document.getElementById("inpFchComent");
    inpNamUserCom.value = NamUserCom.displayName;
    inpFchComent.value =  hoy;
    var newRow = $("<tr>");
    var cols = "";
    cols ='<td><div class="areaform2"><div class="text-center mr-2 mb-2 float-left" style="height:auto;"><div class="containerProfile"><img class="commentIMG" src="/img/user_bg.png" /><div id="userProfile1" class="centered">'+char+'</div></div></div><div class="text-left float-left col-md-10"><textarea rows="3" id="inpComentSol" class="form-control" style="font-size: 11px;" name="inpComentSol" placeholder="(Max. 140 Caracteres)" maxlength="140"></textarea><a style="font-size: 11px; color:#ffffff "id="inpNamUserCom" name="inpNamUserCom">'+NamUserCom.displayName+'</a><a style="font-size: 11px; color:#ffffff;"> - </a><a style="font-size: 11px; color:#ffffff;" id="inpFchComent" name="inpFchComent">'+hoy+'</a></div></div></td>';
    newRow.append(cols);
    $("table.newcomment").append(newRow);
    inpCantRow.value = $('#tablacomment tr').length;
  }
}

//CREAR LA GESTION
btnGuardarSol.addEventListener("click", () => {
  var shownPopup = false;
  $("#manageForm").submit(function (event) {
    if (shownPopup === false) {
      event.preventDefault();
      shownPopup = true;
      var form = $(this);
      console.log(inpFchMisoCom.value, inpFchMisoCom_aux.value, inpObsComent.value, inpObsComent_aux.value);
      if (validGest()==true) {
        swal("Advertencia!", "La solicitud no puede ser gestionada si no has realizado ningún cambio, está pendiente de autorización, o está sometida a revisión.", "warning", {
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

//CANCELAR LA GESTION
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

//VALIDAR GUARDAR GESTION
function validGest(){
  var inpComentSol = document.getElementById("inpComentSol");
  //SIN AUTORIZACION NI RESPUESTA
    if (inpAutEmailSolDet_aux.value == "" && inpAutResponse_aux.value == ""){
      if (inpFchMisoCom.value == "" && inpObsComent.value == "" && inpCambEstSol.value == "" && inpComentSol.value == "") {
        return true;
      } else if (!inpComentSol.value == "") {
        return false;
      } else if (inpFchMisoCom_aux.value == inpFchMisoCom.value && inpObsComent_aux.value == inpObsComent.value && inpCambEstSol.value == "") {
        return true;
      } else {
        return false;
      }
  //CON AUTORIZACION PERO SIN RESPUESTA
    } else if (!inpAutEmailSolDet_aux.value == "" && inpAutResponse_aux.value == "" && !inpComentSol.value == "") {  
        return false;
    } else if (!inpAutEmailSolDet_aux.value == "" && inpAutResponse_aux.value == "" && inpComentSol.value == "") {
        return true;
  //CON AUTORIZACION Y RESPUESTA
    } else if (!inpAutEmailSolDet_aux.value == "" && !inpAutResponse_aux.value == "") {
      //SOLO INGRESA COMENTARIO
        if (inpCambEstSol.value == "" && !inpComentSol.value == "") {
          return false;
      //DETECTA CAMBIOS DE ESTADO    
        } else if (inpAutResponse_aux.value == "Revisión" && inpCambEstSol.value == "Proceso") {
          return true;
        } else if (inpAutResponse_aux.value == "Revisión" && inpCambEstSol.value == "Completada") {
          return true;
        } else if (inpAutResponse_aux.value == "Rechazada" && inpCambEstSol.value == "Abierta") {
          return true;
        } else if (inpAutResponse_aux.value == "Rechazada" && inpCambEstSol.value == "Proceso") {
          return true;
        } else if (inpAutResponse_aux.value == "Rechazada" && inpCambEstSol.value == "Completada") {
          return true;
      //NO DETECTA CAMBIOS    
        } else if (inpComentSol.value == "" && inpCambEstSol.value == "" && inpFchMisoCom.value == inpFchMisoCom_aux.value  && inpObsComent_aux.value == inpObsComent.value) {
          return true;
        }
    }
}
