//IMPORTS
import { isLogin, ref_storage, uploadBytesResumable, getDownloadURL, makeid, auth, storage, onAuthStateChanged, deleteObject, getUID } from "./functions.js";

//REFERENCIAS SOLICITUD
var inpEstadoSol = document.getElementById("inpEstadoSol");
var inpFechaSol = document.getElementById("inpFechaSol");
var fileAdjDetSol = document.getElementById("fileButton");
var fileDelete = document.getElementById("fileDelete");
var btnGuardarSol = document.getElementById("btnGuardarSol");
var btnCancelSol = document.getElementById("btnCancelSol");
var inpIDuser = document.getElementById("inpIDuser");
var progressBar = document.getElementById("uploadProgress");
var inpUrlFile = document.getElementById("inpUrlFile");
var inpDirFile = document.getElementById("inpDirFile");
var inpNomRecepSol = document.getElementById("inpNomRecepSol");
var inpEmailuser = document.getElementById("inpEmailuser");
var emailUser = JSON.parse(sessionStorage.getItem('user'));
var inpAutEmailSol = document.getElementById("inpAutEmailSol");





//FECHA Y HORA
var currentDate = new Date();
var day = ("0" + currentDate.getDate()).slice(-2);
var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
var year = currentDate.getFullYear();
var today =  year + "-" + month + "-" + day;

var hora =
  currentDate.getHours() +
  ":" +
  currentDate.getMinutes() +
  ":" +
  currentDate.getSeconds();


//REGSOL USERNAME
function regsolUser() {
  var firebase = sessionStorage.getItem("user");
  var userlog = JSON.parse(firebase);
  var user = userlog.displayName;
  return user;
}

//REGSOL UID
function UID() {
  var fb = sessionStorage.getItem("user");
  var ul = JSON.parse(fb);
  var id = ul.uid;
  return id;
}

//WINDOWS LOAD
window.onload = function () {
  isLogin();
  fileDelete.style = "display: none;";
  inpEstadoSol.value = "Abierta";
  inpFechaSol.value = today;
  inpEmailuser.value = emailUser.email;
};

//VALIDAR AUTORIZAR
inpAutEmailSol.addEventListener("change", () => {
  if (inpEmailuser.value == inpAutEmailSol.value){
    swal("Advertencia!", "No necesitas autorizar tus solicitudes.", "warning", {
      buttons: { Ok: true },
    }).then((value) => {
      switch (value) {
        case "Ok":
          inpAutEmailSol.value = ""
      }
    });
  }
})


//VALIDAR DATALIST
inpNomRecepSol.addEventListener("change", () => {

  var emailregex =/^[a-zA-Z0-9-.]+@(caimi|caimicorp|capire|davanti|bright|gmail|caimicolombia|caimiargentina|)\.(com|cl|com.ar)$/;

  if (!emailregex.test(inpNomRecepSol.value)) {
    swal("Advertencia!", "Ingrese un destinatario válido de empresa.", "warning", {
      buttons: { Ok: true },
    }).then((value) => {
      switch (value) {
        case "Ok":
          inpNomRecepSol.value = ""
      }
    });
  }

  if (inpEmailuser.value == inpNomRecepSol.value){
    swal("Advertencia!", "El destinatario no puede ser tu email.", "warning", {
      buttons: { Ok: true },
    }).then((value) => {
      switch (value) {
        case "Ok":
          inpNomRecepSol.value = ""
      }
    });
  }

});

//CREAR LA SOLICITUD
btnGuardarSol.addEventListener("click", () => {
  var shownPopup = false;
  $("#solForm").submit(function (event) {
    if (shownPopup === false) {
      event.preventDefault();
      shownPopup = true;
      var form = $(this);
      inpUIDuser.value = UID();
      inpNomSol.value = regsolUser();
      swal("Un paso más!", "¿Desea crear la solicitud?", "success", {
        buttons: { cancel: "Volver", Si: true },
      }).then((value) => {
        switch (value) {
          case "Si":
            form.trigger("submit");
        }
      });
    }
  });
});

//CANCELAR LA SOLICITUD
btnCancelSol.addEventListener("click", () => {
  swal("Advertencia", "¿Desea salir de la solicitud?", "warning", {
    buttons: { cancel: "Volver", Si: true },
  }).then( async (value) => {
    switch (value) {
      case "Si":

        if (!inpDirFile.value ==  ""){
          var nombreFile = inpDirFile.value;
          const desertRef = ref_storage(storage, nombreFile);
          // Delete the file
          await deleteObject(desertRef).then(() => {
          $fileButton.value = "";
          inpUrlFile.value = " ";
          inpDirFile.value = " ";
          // File deleted successfully
          }).catch((error) => {
          // Uh-oh, an error occurred!
          });
        }
        var uid = getUID();
        window.location.href = "/reg/"+uid+"/registrar";
    }
  });
});

//VALIDAR UPLOAD FILE
fileAdjDetSol.addEventListener("change", async function (f) {

  const maxsize = 10000000; // 1MB = 1 millón de bytes
  var files = f.target.files;
  var archivo = files[0];

  if (archivo.size > maxsize) {
    const tamanioEnMb = maxsize / 1000000;
    const data = `El tamaño máximo es ${tamanioEnMb} MB`;
    swal("Advertencia", data, "warning", {
      buttons: { Ok: true },
    }).then((value) => {
      switch (value) {
        case "Ok":
          fileAdjDetSol.value = "";
          fileDelete.disabled = true;
      }
    });

  } else {

    fileAdjDetSol.disabled = true;

    var ext = archivo.name.split(".").pop();
    var type1 = "image/";
    var type2 = "application/";
    var app = [
      "txt",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "pdf",
      "rar",
    ];
    var img = ["jpg", "jpeg", "png"];
    if (img.includes(ext)) {
      var metadata = {
        contentType: type1 + ext,
      };
    } else if (app.includes(ext)) {
      var metadata = {
        contentType: type2 + ext,
      };
    } else {
      console.log("Extensión de Archivo Incorrecta");
    }

    await onAuthStateChanged(auth, (user) => {

      if (user) {

        var rut = inpIDuser.value;
        var idFile = makeid();
        var storageRef = ref_storage(storage,"requests/" + rut + "/" + idFile + "/" + archivo.name);
        var nom = "requests/" + rut + "/" + idFile + "/" + archivo.name;
        inpUrlFile.value = "";
        inpDirFile.value = "";
        var uploadTask = uploadBytesResumable(storageRef, archivo, metadata);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
    
            btnGuardarSol.disabled = true;
            btnCancelSol.disabled = true;
    
            var progress = 0;
            progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            progressBar.style.width = `${progress}%`;
            progressBar.innerHTML = `Subiendo ${progress}%`;
    
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
            //
          },
          (error) => {
            alert(error);
          },
          () => {
    
            progressBar.innerHTML = `Carga Finalizada`;
            var dF = nom.toString();
            inpDirFile.value = dF;
            console.log("Complete...");
            fileDelete.disabled = false;
            fileDelete.style = "display: block;";
            btnGuardarSol.disabled = false;
            btnCancelSol.disabled = false;
    
            getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
              
              console.log("Archivo Disponible en: ", downloadURL);
              var url = await downloadURL.toString();
              inpUrlFile.value = url;
            });
          }
        );
      } else {
        //ERROR NO LOGIN
      }      
    })
  }
});

//ELIMINAR ARCHIVO
fileDelete.addEventListener("click", async () => { 

  var $fileButton = document.querySelector("#fileButton");

  await onAuthStateChanged(auth, (user) => {

    if (user) {

      var nombreFile = inpDirFile.value;
      const desertRef = ref_storage(storage, nombreFile);
      // Delete the file
      deleteObject(desertRef).then(() => {
        fileAdjDetSol.disabled = false;
        fileDelete.disabled = true;
        $fileButton.value = "";
        // File deleted successfully
        console.log("Archivo adjunto eliminado..");
        progressBar.style.width = `0%`;
        progressBar.innerHTML = `Subiendo ${progress}%`;
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });
    } else {
      //
    }
    inpUrlFile.value = " ";
    inpDirFile.value = " ";
  });
});