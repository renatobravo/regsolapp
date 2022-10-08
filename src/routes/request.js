const { Router, json } = require("express");
const { db, storageRef } = require("../firebase");
const { body, validationResult } = require("express-validator");
const path = require("path");
const router = Router();
db.settings({ ignoreUndefinedProperties: true });



//NODEMAILER+HBS
const hbs  = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const mailTransporter  = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "XXX",
    pass: "XXX",
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve(__dirname, "../views/emails"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../views/emails"),
  extName: ".hbs",
};
mailTransporter.use("compile", hbs(handlebarOptions));

//FECHA Y HORA
var currentDate = new Date();
var day = ("0" + currentDate.getDate()).slice(-2);
var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
var year = currentDate.getFullYear();
var today =  year + "-" + month + "-" + day;

//NEW REQUEST FORM
router.post("/new-request", async (req, res) => {

  const { inpIDuser, inpUIDuser, inpEstadoSol, inpAsunSol, inpFechaSol, inpFchNecesariaSol, inpNomSol, inpEmailuser, inpTipoSol ,inpNomRecepSol ,inpAutEmailSol, inpDetalleSol, inpUrlFile, inpDirFile, inpPrioridadSol, inpDescProdSol0, inpCantProdSol0, inpUndMedSol0, AddDescProdSol1, AddDescProdSol2, AddDescProdSol3, AddDescProdSol0, AddCantProdSol1, AddCantProdSol2, AddCantProdSol3, AddCantProdSol0, AddUndMedSol1, AddUndMedSol2, AddUndMedSol3, AddUndMedSol0 } = req.body;

  await db.collection("solicitudes")
  .orderBy('inpIDSol', 'desc').limit(1).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      return idSol = parseInt(doc.data().inpIDSol) + 1
    });
  }); 

  await db.collectionGroup("dirigido").where("email","==", inpNomRecepSol).get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      return recepArea = doc.data().area
    });
  });

  if (!recepArea) {
    var recepArea = "sin area";
  } 

  await db.collection("solicitudes")
  .orderBy('inpIDSol', 'desc').limit(1).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      return idSol = parseInt(doc.data().inpIDSol) + 1
    });
  }); 

  if (inpPrioridadSol == "Alta") {
    var imgPriori = "/img/red.png";
  } else if (inpPrioridadSol == "Media") {
    var imgPriori = "/img/yellow.png";
  } else if (inpPrioridadSol == "Baja") {
    var imgPriori = "/img/green.png";
  }

  const addSol = await db.collection("solicitudes/")
          .add({
            inpIDSol: idSol,
            inpIDuser: inpIDuser, 
            inpUIDuser: inpUIDuser,
            inpEstadoSol: inpEstadoSol,
            inpFechaSol: inpFechaSol,
            inpFchNecesariaSol: inpFchNecesariaSol,
            inpPrioridadSol: inpPrioridadSol,
            imgPrioriSrc: imgPriori,
            inpNomSol: inpNomSol,
            inpEmailSol: inpEmailuser,
            inpTipoSol: inpTipoSol, 
            inpAsunSol: inpAsunSol, 
            inpNomRecepSol: inpNomRecepSol,
            inpAreaRecepSol: recepArea,
            inpAutEmailSol: inpAutEmailSol,
            AutResponse: "",
            inpDetalleSol: inpDetalleSol, 
            inpUrlFile: inpUrlFile,
            inpDirFile: inpDirFile,
            inpDescProdSol0: inpDescProdSol0,
            inpCantProdSol0: inpCantProdSol0, 
            inpUndMedSol0: inpUndMedSol0, 
            AddDescProdSol0: AddDescProdSol0, 
            AddCantProdSol0: AddCantProdSol0,
            AddUndMedSol0: AddUndMedSol0,
            AddDescProdSol1: AddDescProdSol1,
            AddCantProdSol1: AddCantProdSol1,
            AddUndMedSol1: AddUndMedSol1,
            AddDescProdSol2: AddDescProdSol2, 
            AddCantProdSol2: AddCantProdSol2,
            AddUndMedSol2: AddUndMedSol2,
            AddDescProdSol3: AddDescProdSol3, 
            AddCantProdSol3: AddCantProdSol3,
            AddUndMedSol3: AddUndMedSol3
          }).then((Record) => {

         const addSolGest = db.collection("gestiones/").add({
          inpUIDSolCom: Record.id,
          inpFchMisoCom: "",
          inpObsComent: "",
          })

            if (!inpAutEmailSol == "") {
              //MAIL AUTORIZADOR
              var mailOptionsAuth = {
                from: "XXX",
                to: inpAutEmailSol,
                subject: "RegSol - Autorizar Solicitud Nº"+idSol,
                template: "autsolicitud",
                context: {
                  uidSol: Record.id,
                  inpNomRecepSol: inpNomRecepSol,
                  idSol: idSol,
                  inpTipoSol: inpTipoSol,
                  inpNomSol: inpNomSol,
                  inpAsunSol: inpAsunSol,
                  inpDetalleSol: inpDetalleSol,
                  inpFechaSol: inpFechaSol,
                  inpPrioridadSol: inpPrioridadSol
                },
                };
                ///////////////////////////////////Enviar Mail
                mailTransporter.sendMail(mailOptionsAuth, (err) => {
                if (err) {
                  console.log("Email de autorización no pudo ser enviado.", err);
                } else {
                  console.log("Email de autorización enviado.");
                }
                });
            }

            //MAIL RECEPTOR
            var mailOptionsSol = {
            from: "XXX",
            to: inpNomRecepSol,
            subject: "RegSol - Nueva Solicitud Nº"+idSol,
            template: "regsolicitud",
            context: {
              inpNomRecepSol: inpNomRecepSol,
              idSol: idSol,
              inpTipoSol: inpTipoSol,
              inpNomSol: inpNomSol,
              inpAsunSol: inpAsunSol,
              inpDetalleSol: inpDetalleSol,
              inpFechaSol: inpFechaSol,
              inpPrioridadSol: inpPrioridadSol
            },
            };
            ///////////////////////////////////Enviar Mail
            mailTransporter.sendMail(mailOptionsSol, (err) => {
            if (err) {
              console.log("Email de registro no pudo ser enviado.", err);
            } else {
              console.log("Email de registro enviado.");
            }
            });

          }).catch((error) => {
            console.log(error.code);
            res.render("inicio", {
              message:
                "error al registrar la solicitud, intentelo nuevamente.",
              intro: "Oops!",
              type: "danger",
            });
          });


  res.redirect("/reg/"+inpUIDuser+"/"+"msg?result="+encodeURIComponent('create'));

})

//EDIT REQUEST FORM
router.post("/edit-request", async (req, res) => {

  const { inpUIDuser, inpUIDSol, inpIDSol, inpAsunSol, inpFchNecesariaSol, inpPrioridadSol, inpTipoSol, inpDetalleSol, inpUrlFile, inpDirFile, inpDescProdSol0, inpCantProdSol0, inpUndMedSol0, AddDescProdSol1, AddDescProdSol2, AddDescProdSol3, AddDescProdSol0, AddCantProdSol1, AddCantProdSol2, AddCantProdSol3, AddCantProdSol0, AddUndMedSol1, AddUndMedSol2, AddUndMedSol3, AddUndMedSol0 } = req.body;
  if (inpPrioridadSol == "Alta") {
    var imgPriori = "/img/red.png";
  } else if (inpPrioridadSol == "Media") {
    var imgPriori = "/img/yellow.png";
  } else if (inpPrioridadSol == "Baja") {
    var imgPriori = "/img/green.png";
  }

  await db.collection("solicitudes").doc(inpUIDSol).update({
    inpTipoSol: inpTipoSol,
    inpAsunSol: inpAsunSol,
    inpFchNecesariaSol: inpFchNecesariaSol,
    imgPrioriSrc: imgPriori,
    inpPrioridadSol: inpPrioridadSol,
    inpDetalleSol: inpDetalleSol, 
    inpUrlFile: inpUrlFile,
    inpDirFile: inpDirFile,
    inpDescProdSol0: inpDescProdSol0,
    inpCantProdSol0: inpCantProdSol0, 
    inpUndMedSol0: inpUndMedSol0, 
    AddDescProdSol0: AddDescProdSol0, 
    AddCantProdSol0: AddCantProdSol0,
    AddUndMedSol0: AddUndMedSol0,
    AddDescProdSol1: AddDescProdSol1,
    AddCantProdSol1: AddCantProdSol1,
    AddUndMedSol1: AddUndMedSol1,
    AddDescProdSol2: AddDescProdSol2, 
    AddCantProdSol2: AddCantProdSol2,
    AddUndMedSol2: AddUndMedSol2,
    AddDescProdSol3: AddDescProdSol3, 
    AddCantProdSol3: AddCantProdSol3,
    AddUndMedSol3: AddUndMedSol3
  })

  res.redirect("/reg/"+inpUIDuser+"/"+"msg?result="+encodeURIComponent('update'));
})

//SEARCH REQUEST FORM
router.post("/search-request", async (req, res) => {

  const { inpArea, inpSubarea, qryGerenciaVal, verAutorizados, inpTipoSol, inpEstadoSol, inpFchDesdeSol, inpFchHastaSol, inpUIDuser, inpUserSol, inpEmailUserGes} = req.body;

  console.log(verAutorizados);
  
  if (inpFchHastaSol == "") {
    FchHastaSol = today;
  } else {
    var FchHastaSol = inpFchHastaSol;
  }

  if ( inpEstadoSol == "Todos") {
  //Todos los Estados
  const estSol = await db.collectionGroup("estados").get();   
  var EstadoSol = estSol.docs.map(doc => 
  doc.data().nombre
  );
  } else {
    var EstadoSol = [inpEstadoSol];
  }

  var msgBusqueda = "";

  //Si es usuario Gerente y activa área
  if (qryGerenciaVal == "qryGerencia"){

    if (inpUserSol == "") {

      var inpEstadoSol1 = db.collection("solicitudes"),
      inpEstadoSol1 = inpEstadoSol1.where("inpFechaSol", ">=", inpFchDesdeSol),
      inpEstadoSol1 = inpEstadoSol1.where("inpFechaSol", "<=", FchHastaSol),
      inpEstadoSol1 = inpEstadoSol1.where("inpAreaRecepSol", "==", inpSubarea),
      inpEstadoSol1 = await inpEstadoSol1.where("inpEstadoSol", "in", EstadoSol).get();
      var resSolTodas = inpEstadoSol1.docs.map((doc) => ({
         uidSol: doc.id,
         ...doc.data(),
      })) 
      msgBusqueda = "TODA TU ÁREA"

    } else {

      var inpEstadoSol3 = db.collection("solicitudes"),
      inpEstadoSol3 = inpEstadoSol3.where("inpFechaSol", ">=", inpFchDesdeSol),
      inpEstadoSol3 = inpEstadoSol3.where("inpFechaSol", "<=", FchHastaSol),
      inpEstadoSol3 = inpEstadoSol3.where("inpEmailSol", "==", inpUserSol),
      inpEstadoSol3 = await inpEstadoSol3.where("inpEstadoSol", "in", EstadoSol).get();
      var resSolTodas3 = inpEstadoSol3.docs.map((doc) => ({
         uidSol: doc.id,
         ...doc.data(),
      })) 
  
      var inpEstadoSol4 = db.collection("solicitudes"),
      inpEstadoSol4 = inpEstadoSol4.where("inpFechaSol", ">=", inpFchDesdeSol),
      inpEstadoSol4 = inpEstadoSol4.where("inpFechaSol", "<=", FchHastaSol),
      inpEstadoSol4 = inpEstadoSol4.where("inpNomRecepSol", "==", inpUserSol),
      inpEstadoSol4 = await inpEstadoSol4.where("inpEstadoSol", "in", EstadoSol).get();
      var resSolTodas4 = inpEstadoSol4.docs.map((doc) => ({
         uidSol: doc.id,
         ...doc.data(),
      })) 
    
      msgBusqueda = " DE " +  inpUserSol.toUpperCase();

      var resSolTodas = resSolTodas3.concat(resSolTodas4);
    }

  } else {

    var inpEstadoSol1 = db.collection("solicitudes"),
    inpEstadoSol1 = inpEstadoSol1.where("inpFechaSol", ">=", inpFchDesdeSol),
    inpEstadoSol1 = inpEstadoSol1.where("inpFechaSol", "<=", FchHastaSol),
    inpEstadoSol1 = inpEstadoSol1.where("inpUIDuser", "==", inpUIDuser),
    inpEstadoSol1 = await inpEstadoSol1.where("inpEstadoSol", "in", EstadoSol).get();
    var resSolTodas1 = inpEstadoSol1.docs.map((doc) => ({
       uidSol: doc.id,
       ...doc.data(),
    })) 

    var inpEstadoSol2 = db.collection("solicitudes"),
    inpEstadoSol2 = inpEstadoSol2.where("inpFechaSol", ">=", inpFchDesdeSol),
    inpEstadoSol2 = inpEstadoSol2.where("inpFechaSol", "<=", FchHastaSol),
    inpEstadoSol2 = inpEstadoSol2.where("inpNomRecepSol", "==", inpEmailUserGes),
    inpEstadoSol2 = await inpEstadoSol2.where("inpEstadoSol", "in", EstadoSol).get();
    var resSolTodas2 = inpEstadoSol2.docs.map((doc) => ({
       uidSol: doc.id,
       ...doc.data(),
    })) 

    if (verAutorizados == "verAutorizados") {

      var inpEstadoSol5 = db.collection("solicitudes"),
      inpEstadoSol5 = inpEstadoSol5.where("inpFechaSol", ">=", inpFchDesdeSol),
      inpEstadoSol5 = inpEstadoSol5.where("inpFechaSol", "<=", FchHastaSol),
      inpEstadoSol5 = inpEstadoSol5.where("inpAutEmailSol", "==", inpEmailUserGes),
      inpEstadoSol5 = await inpEstadoSol5.where("inpEstadoSol", "in", EstadoSol).get();
      var resSolTodas5 = inpEstadoSol5.docs.map((doc) => ({
         uidSol: doc.id,
         autSol: "A",
         ...doc.data(),
      })) 
      var resSolTodas6 = resSolTodas1.concat(resSolTodas2);
      var resSolTodas = resSolTodas6.concat(resSolTodas5);
    } else {
    var resSolTodas = resSolTodas1.concat(resSolTodas2);
    }
    msgBusqueda = "TUS RESULTADOS"
  }
  

  if (inpUserSol == "" && qryGerenciaVal == "qryGerencia") {
    var UserSol = "Todos";
  } else {
    var UserSol = inpUserSol;
  }
    
  res.render("informe", { inpEstadoSol, inpFchDesdeSol, inpFchHastaSol, resSolTodas, UserSol, inpSubarea, msgBusqueda, verAutorizados });
})

module.exports = router;

