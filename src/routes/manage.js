const { Router } = require("express");
const { db } = require("../firebase");
const path = require("path");
const router = Router();

//NODEMAILER+HBS
const hbs  = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const { fchmod } = require("fs");
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

//NEW MANAGE REQUEST
router.post('/req-manage', async (req, res) => {

  const { inpCambEstSol, inpObsComent, inpCharuser, inpFchMisoCom, UIDSess, inpUIDuser, inpPrioDetSol_aux, inpUIDSolCom, inpIDSolCom, inpCantRow, inpComentSol, inpNamUserCom, inpFchComent, inpEmailSol, inpNomRecepSolDet, inpAsuntoSol_aux, inpTipoSol_aux } = req.body;
  
  if (UIDSess != inpUIDuser) {

    if (!inpComentSol == ""){
      await db.collection("comentarios/").add({
          imgURLGestCom: "https://firebasestorage.googleapis.com/v0/b/regsol-desarrollo.appspot.com/o/database%2Fresources%2Fuser.png?alt=media&token=0b7fab6b-2c80-4459-ae4a-dac56f1e7ab3",
          inpComentSol: inpComentSol,
          inpFchComent: inpFchComent,
          inpIDComGest: inpCantRow,
          inpUIDSolGest: inpUIDSolCom,
          inpNamUserCom: inpNamUserCom,
          inpIDSolCom: inpIDSolCom,
          inpPrioDetSol_aux: inpPrioDetSol_aux,
          inpCharuser: inpCharuser
        })
      }
      
      if (!inpCambEstSol == ""){
        await db.collection("solicitudes").doc(inpUIDSolCom).update({
          inpEstadoSol: inpCambEstSol,
        })
      }

      if (!inpFchMisoCom == "" || !inpObsComent == ""){
        await db.collection("gestiones").where("inpUIDSolCom","==",inpUIDSolCom).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            return uidGest = doc.id;
          });
        });
        await db.collection("gestiones").doc(uidGest).update({
          inpFchMisoCom: inpFchMisoCom,
          inpObsComent: inpObsComent,
        });
      }

      var mailOptionsAuth = {
        from: "XXX",
        to: inpEmailSol,
        subject: "RegSol - Actualización de Solicitud Nº"+inpIDSolCom,
        template: "gestsolicitud",
        context: {
          inpIDSolCom: inpIDSolCom,
          inpAsuntoSol_aux: inpAsuntoSol_aux,
          inpTipoSol_aux: inpTipoSol_aux,
          inpCambEstSol: inpCambEstSol,
          inpFchMisoCom: inpFchMisoCom,
          inpObsComent: inpObsComent,
          inpComentSol: inpComentSol,
          inpPrioDetSol_aux: inpPrioDetSol_aux
        },
      };

  } else {
 
    if (!inpComentSol == ""){
      await db.collection("comentarios/").add({
          imgURLGestCom: "https://firebasestorage.googleapis.com/v0/b/regsol-desarrollo.appspot.com/o/database%2Fresources%2Fuser.png?alt=media&token=0b7fab6b-2c80-4459-ae4a-dac56f1e7ab3",
          inpComentSol: inpComentSol,
          inpFchComent: inpFchComent,
          inpIDComGest: inpCantRow,
          inpUIDSolGest: inpUIDSolCom,
          inpNamUserCom: inpNamUserCom,
          inpIDSolCom: inpIDSolCom,
          inpPrioDetSol_aux: inpPrioDetSol_aux,
          inpCharuser: inpCharuser
        })
        
        var mailOptionsAuth = {
          from: "XXX",
          to: inpEmailSol,
          subject: "RegSol - Nuevo Comentario Solicitud Nº"+inpIDSolCom,
          template: "gestsolicitudcom",
          context: {
            inpIDSolCom: inpIDSolCom,
            inpAsuntoSol_aux: inpAsuntoSol_aux,
            inpTipoSol_aux: inpTipoSol_aux,
            inpCambEstSol: inpCambEstSol,
            inpFchMisoCom: inpFchMisoCom,
            inpObsComent: inpObsComent,
            inpComentSol: inpComentSol, 
            inpPrioDetSol_aux: inpPrioDetSol_aux
          },
        };
      }
  }

    ///////////////////////////////////Enviar Mail
    mailTransporter.sendMail(mailOptionsAuth, (err) => {
    if (err) {
      console.log("Email de actualización no pudo ser enviado.", err);
    } else {
      console.log("Email de actualización enviado.");
    }
    });

  res.redirect("/ges/"+UIDSess+"/"+"msg?result="+encodeURIComponent('manage'));

})

//NEW MANAGE AUTH
router.post('/aut-manage', async (req, res) => {

  const { UIDSess, inpEmailSol, inpCharuser, inpAsigAutSol, inpPrioDetSol_aux, inpNomRecepSol_aux, inpUIDSolCom, inpIDSolCom, inpCantRow, inpComentSol, inpNamUserCom, inpFchComent, inpAsuntoSol_aux, inpTipoSol_aux } = req.body;
  
  var emails = inpEmailSol.concat(',',inpNomRecepSol_aux);
  
  if (!inpComentSol == "" && !inpAsigAutSol == "") {

    await db.collection("comentarios/").add({
      imgURLGestCom: "https://firebasestorage.googleapis.com/v0/b/regsol-desarrollo.appspot.com/o/database%2Fresources%2Fuser.png?alt=media&token=0b7fab6b-2c80-4459-ae4a-dac56f1e7ab3",
      inpComentSol: inpComentSol,
      inpFchComent: inpFchComent,
      inpIDComGest: inpCantRow,
      inpUIDSolGest: inpUIDSolCom,
      inpNamUserCom: inpNamUserCom,
      inpIDSolCom: inpIDSolCom,
      inpCharuser: inpCharuser
    })

    await db.collection("solicitudes").doc(inpUIDSolCom).update({
      AutResponse: inpAsigAutSol,
    })

    var mailOptionsAuth = {
      from: "XXX",
      to: emails,
      subject: "RegSol - Actualización de Solicitud Nº"+inpIDSolCom,
      template: "gestsolicitud",
      context: {
        inpIDSolCom: inpIDSolCom,
        inpAsuntoSol_aux: inpAsuntoSol_aux,
        inpTipoSol_aux: inpTipoSol_aux,
        inpAsigAutSol: inpAsigAutSol,
        inpComentSol: inpComentSol,
        inpPrioDetSol_aux: inpPrioDetSol_aux
      },
    };

    } else {

      if (!inpComentSol == ""){

        await db.collection("comentarios/").add({
          imgURLGestCom: "https://firebasestorage.googleapis.com/v0/b/regsol-desarrollo.appspot.com/o/database%2Fresources%2Fuser.png?alt=media&token=0b7fab6b-2c80-4459-ae4a-dac56f1e7ab3",
          inpComentSol: inpComentSol,
          inpFchComent: inpFchComent,
          inpIDComGest: inpCantRow,
          inpUIDSolGest: inpUIDSolCom,
          inpNamUserCom: inpNamUserCom,
          inpIDSolCom: inpIDSolCom,
          inpCharuser: inpCharuser
        })

        var mailOptionsAuth = {
          from: "XXX",
          to: emails,
          subject: "RegSol - Nuevo Comentario Solicitud Nº"+inpIDSolCom,
          template: "gestsolicitud",
          context: {
            inpIDSolCom: inpIDSolCom,
            inpAsuntoSol_aux: inpAsuntoSol_aux,
            inpTipoSol_aux: inpTipoSol_aux,
            inpComentSol: inpComentSol,
            inpPrioDetSol_aux: inpPrioDetSol_aux
          },
        };
      }
      
      if (!inpAsigAutSol == ""){

        await db.collection("solicitudes").doc(inpUIDSolCom).update({
          AutResponse: inpAsigAutSol,
        })

        var mailOptionsAuth = {
          from: "XXX",
          to: emails,
          subject: "RegSol - Actualización de Solicitud Nº"+inpIDSolCom,
          template: "gestsolicitud",
          context: {
            inpIDSolCom: inpIDSolCom,
            inpAsuntoSol_aux: inpAsuntoSol_aux,
            inpTipoSol_aux: inpTipoSol_aux,
            inpAsigAutSol: inpAsigAutSol,
            inpPrioDetSol_aux: inpPrioDetSol_aux
          },
        };
      }  
  } 

  ///////////////////////////////////Enviar Mail
  mailTransporter.sendMail(mailOptionsAuth, (err) => {
  if (err) {
    console.log("Email de actualización no pudo ser enviado.", err);
  } else {
    console.log("Email de actualización enviado.");
  }
  });

  res.redirect("/ges/"+UIDSess+"/"+"msg?result="+encodeURIComponent('auth'));

})

module.exports = router;