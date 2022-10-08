//IMPORTS
import { isLogin, ref_storage, uploadBytesResumable, getDownloadURL, makeid, auth, storage, onAuthStateChanged, deleteObject, getUID } from "./functions.js";

//REFERENCIAS SOLICITUD
var fileAdjDetSol = document.getElementById("fileButton");
var fileDelete = document.getElementById("fileDelete");
var btnGuardarSol = document.getElementById("btnGuardarSol");
var btnCancelSol = document.getElementById("btnCancelSol");
var inpIDuser = document.getElementById("inpIDuser");
var inpUIDuser = document.getElementById("inpUIDuser");
var progressBar = document.getElementById("uploadProgress");
var inpUrlFile = document.getElementById("inpUrlFile");
var inpDirFile = document.getElementById("inpDirFile");
var inpDirFileLoaded = document.getElementById("inpDirFileLoaded");
var inpUrlFileLoaded = document.getElementById("inpUrlFileLoaded");
var archivoCargado = document.getElementById("archivoCargado");
var archivoElimado = document.getElementById("archivoElimado");
var deleteFileLoad = ""

//WINDOWS LOAD
window.onload = function () {
  isLogin();
  fileDelete.style = "display: none;";
  inpUIDuser.value = getUID();
};

//GUARDAR(EDITAR) LA SOLICITUD
btnGuardarSol.addEventListener("click", async () => {
  var shownPopup = false;
  await $("#solForm").submit(function (event) {
    if (shownPopup === false) {
      event.preventDefault();
      shownPopup = true;
      var form = $(this);
      swal("Un paso más!", "¿Desea actualizar la solicitud?", "info", {
        buttons: { cancel: "Volver", Si: true },
      }).then( async (value) => {
        switch (value) {
          case "Si":

           //ARCHIVO CARGADO SIN BORRAR
            if (inpDirFileLoaded.value != "" && inpUrlFileLoaded.value != "")
            {
              inpDirFile.value = inpDirFileLoaded.value;
              inpUrlFile.value = inpUrlFileLoaded.value;

            //ARCHIVO ELIMINADO SIN CARGAR OTRO
            } else if (deleteFileLoad != "" && inpDirFile.value == "" && inpUrlFile.value == ""){
              const desertRef = ref_storage(storage, deleteFileLoad);
              deleteObject(desertRef).then(() => {
                console.log("Archivo adjunto eliminado..");
              }).catch((error) => {
                console.log(error);
              });
              deleteFileLoad = "";

            //ARCHIVO ELIMINADO Y CARGADO OTRO  
            } else if (deleteFileLoad != "" && inpDirFile.value != "" && inpUrlFile.value != "") {
              const desertRef = ref_storage(storage, deleteFileLoad);
              await deleteObject(desertRef).then(() => {
                console.log("Archivo adjunto eliminado..");
              }).catch((error) => {
                console.log(error);
              });
              deleteFileLoad = "";
            }
            console.log(inpUrlFile.value, inpUrlFile.value, deleteFileLoad )
            form.trigger("submit");
            }
      });
    }
  });
});

//CANCELAR EDITAR LA SOLICITUD
btnCancelSol.addEventListener("click", () => {
  swal("Advertencia", "¿Desea salir?", "warning", {
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
        inpUrlFile.value = "";
        inpDirFile.value = "";
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
        var nom = "requests/" + rut + "/" + idFile + "/" + archivo.name
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
    
            progressBar.innerHTML = `Archivo Editado`;
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
    inpUrlFile.value = "";
    inpDirFile.value = "";
  });
});

//ELIMINAR ARCHIVO CARGADO
viewfileDelete.addEventListener("click",() => { 
  archivoCargado.classList.add("displayNone");
  archivoElimado.classList.remove("displayNone");
  fileAdjDetSol.disabled = false;
  inpUrlFileLoaded.value = "";
  deleteFileLoad = inpDirFileLoaded.value;
});

