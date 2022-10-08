const { Router } = require('express');
const { db } = require('../firebase');
const router = Router();
const path = require("path");

//FECHA
var currentDate = new Date();
var day = ("0" + currentDate.getDate()).slice(-2);
var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
var today = currentDate.getFullYear() + "-" + month + "-" + day;

//ADD 3 MONTH
function addMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() + numOfMonths);
    return date;
}
const addDate = new Date(today);
const newDate = addMonths(3, addDate);
var day3 = ("0" + newDate.getDate()).slice(-2);
var month3 = ("0" + (newDate.getMonth() + 1)).slice(-2);
var newDate3 = newDate.getFullYear() + "-" + month3 + "-" + day3;

//MONTH EXPIRE
var puDate = new Date();

var puDateNew1 = new Date(puDate.getFullYear(), puDate.getMonth(), 1);
var day4 = ("0" + puDateNew1.getDate()).slice(-2);
var month4 = ("0" + (puDateNew1.getMonth() + 1)).slice(-2);
var MprimerDia = puDateNew1.getFullYear() + "-" + month4 + "-" + day4;

var puDateNew2 = new Date(puDate.getFullYear(), puDate.getMonth() + 1, 0);
var day5 = ("0" + puDateNew2.getDate()).slice(-2);
var month5 = ("0" + (puDateNew2.getMonth() + 1)).slice(-2);
var MultimoDia = puDateNew2.getFullYear() + "-" + month5 + "-" + day5;

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


//INGRESAR
router.get('/ingresar', async (req, res) => {
    res.render('ingresar');
})

//REGISTRAR
router.get('/registrar', async (req, res) => {

    const querySnapshot = await db.collectionGroup("areas").get();
    const areas = querySnapshot.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    const querySnapshot1 = await db.collectionGroup("areasgerencia").get();
    const subareas = querySnapshot1.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    res.render('registrar', { areas, subareas } )
})

//PROFILE
router.get('/perfil/:uid', async (req, res) => {

    const querySnapshot = await db.collectionGroup("areas").get();
    const areas = querySnapshot.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    const querySnapshot1 = await db.collectionGroup("areasgerencia").get();
    const areasgerencias = querySnapshot1.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    const loguser = await db.collection("usuarios")
    .doc(req.params.uid).get();

    var nameUser = loguser.data().displayName
    var areaUser = loguser.data().area
    var emailUser = loguser.data().email
    var rutUser = loguser.data().rut
    var subarea = loguser.data().subarea
    var uidUser = req.params.uid
    
    res.render('perfil', { areas, subarea, nameUser, areaUser, emailUser, rutUser, uidUser, areasgerencias })

})

//RECUPERAR
router.get('/problemas', async (req, res) => {
    res.render('problemas');
})

//INICIO
router.get('/inicio/:uid', async (req, res) => {

    const loguser = await db.collection("usuarios")
    .doc(req.params.uid).get();

    var idUser = loguser.data().rut
    var emailUser = loguser.data().email

//////////////////////
    
    //SOLICITUDES EMITIDAS
    var soluser1 = db.collection("solicitudes");
    soluser1 = soluser1.where("inpEstadoSol", "==", "Abierta");
    soluser1 = await soluser1.where("inpIDuser", "==", idUser).get();
    var SolRegEmitida = soluser1.docs.map((doc) => ({
        uidSol: doc.id,
        catSol: 'E',
        ...doc.data(),
    })) 

    //SOLICITUDES RECIBIDA
    var soluser2 = db.collection("solicitudes");
    soluser2 = soluser2.where("inpEstadoSol", "==", "Abierta");
    soluser2 = await soluser2.where("inpNomRecepSol", "==", emailUser).get();
    var SolRegRecibida = soluser2.docs.map((doc) => ({
        uidSol: doc.id,
        catSol: 'R',
        ...doc.data(),
    })) 

//////////////////////

    //SOLICITUDES EMITIDAS CON/SIN FCHNECESARIA EN PROCESO + VENCIDAS
    var soluserE = db.collection("solicitudes");
    soluserE = soluserE.where("inpEstadoSol", "==", "Proceso").where("inpIDuser", "==", idUser);
    soluserE = await soluserE.where("inpFchNecesariaSol", "<=", today).get();
    var soluserEmiV = soluserE.docs.map((doc) => ({
        uidSol: doc.id,
        catSol: 'E',
        ...doc.data(),
    })) 

    //SOLICITUDES RECIBIDA CON/SIN FCHNECESARIA EN PROCESO + VENCIDAS
    var soluserR = db.collection("solicitudes");
    soluserR = soluserR.where("inpEstadoSol","==", "Proceso").where("inpNomRecepSol", "==", emailUser);
    soluserR = await soluserR.where("inpFchNecesariaSol", "<=", today).get();
    var soluserRepV = soluserR.docs.map((doc) => ({
        uidSol: doc.id,
        catSol: 'R',
        ...doc.data(),
    })) 

    //SOLICITUDES RECIBIDA VECEN ESTE MES
    var solVenRec = db.collection("solicitudes");
    solVenRec = solVenRec.where("inpEstadoSol", "in", ['Abierta', 'Proceso']).where("inpNomRecepSol", "==", emailUser);
    var solVenRec = solVenRec.where("inpFchNecesariaSol", ">=", MprimerDia);
    var solVenRecM = await solVenRec.where("inpFchNecesariaSol", "<=", MultimoDia).get()
    .then(snap => {
        return snap.size;
    });

    //SOLICITUDES EMITIDAS FECHA NORMAL EN PROCESO
    var soluserEN = db.collection("solicitudes");
    soluserEN = soluserEN.where("inpEstadoSol", "==", "Proceso").where("inpIDuser", "==", idUser);
    soluserEN = await soluserEN.where("inpFchNecesariaSol", ">", today).get();
    var soluserEmiN = soluserEN.docs.map((doc) => ({
        uidSol: doc.id,
        catSol: 'E',
        FchNormal: 'OK',
        ...doc.data(),
    })) 

    //SOLICITUDES RECIBIDAS FECHA NORMAL EN PROCESO
    var soluserRN = db.collection("solicitudes");
    soluserRN = soluserRN.where("inpEstadoSol","==", "Proceso").where("inpNomRecepSol", "==", emailUser);
    soluserRN = await soluserRN.where("inpFchNecesariaSol", ">", today).get();
    var soluserRepN = soluserRN.docs.map((doc) => ({
        uidSol: doc.id,
        catSol: 'R',
        FchNormal: 'OK',
        ...doc.data(),
    })) 

////////////////////// 

//SOLICITUDES COMPLETADAS ÚLTIMOS 3 MESES
    var allSOL1 = db.collection("solicitudes");
    allSOL1 = allSOL1.where("inpEstadoSol", "==", "Completada").where("inpNomRecepSol", "==", emailUser);
    var comple1 = await allSOL1.where("inpFechaSol", "<", newDate3).get()
    .then(snap => {
        return snap.size;
    });
    
    var allSOL2 = db.collection("solicitudes");
    allSOL2 = allSOL2.where("inpEstadoSol", "==", "Completada").where("inpIDuser", "==", idUser);
    var comple2 = await allSOL2.where("inpFechaSol", "<", newDate3).get()
    .then(snap => {
        return snap.size;
    });

//////////////////////  

    const Ayuda = await db.collection("listas")
    .doc("ayudas").get();
    var AyudaInicio = Ayuda.data().inicio

    var soluserEmiRepComple = comple1 + comple2;
    var soluserEmiRepV = soluserEmiV.concat(soluserRepV);
    var soluserEmiRepN = soluserEmiN.concat(soluserRepN);
    var soluserEmiRepVN = soluserEmiRepV.concat(soluserEmiRepN)

    res.render('inicio', { soluserEmiRepComple, soluserEmiRepVN, SolRegRecibida, SolRegEmitida, solVenRecM, AyudaInicio});
})

//404
router.get('/404', async (req, res) => {
    res.render('404');
})

//INFO
router.get('/info/:id', async (req, res) => {

    var inpUIDuser = req.params.id

    const loguser = await db.collection("usuarios")
    .doc(inpUIDuser).get();
    var subarea = loguser.data().subarea
    var areauser = loguser.data().area

    const areas = await db.collection("usuarios").where('__name__', '==', inpUIDuser).get();
    const areasUser = areas.docs.map((doc) => ({
        ...doc.data(),
    }))
    
    const Ayuda = await db.collection("listas")
    .doc("ayudas").get();
    var AyudaInforme = Ayuda.data().informe

    const tipos = await db.collectionGroup("tipos").get();   
    const tiposol = tipos.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    const etd = await db.collectionGroup("estados").get();   
    const estadosol = etd.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    })) 

    if (areauser == "Gerencia") {
        const diri = await db.collectionGroup("dirigido").where('area', '==', subarea ).get();  
        var searchDir = diri.docs.map((doc) => ({
            nombre: doc.nombre,
            ...doc.data(),
        }))
    } else {
        var searchDir = "";
    }
    res.render('info', { AyudaInforme, tiposol, estadosol, inpUIDuser, areasUser, searchDir });
})

//INFORME
router.get('/informe', async (req, res) => {
    res.render('informe');
})

//EXPORT-PDF
router.get('/exportsol/:uid', async (req, res) => {

    const expSol = await db.collection("solicitudes").where('__name__', '==', req.params.uid).get();
    const exportSolicitud = expSol.docs.map((doc) => ({
        ...doc.data(),
    }))
    res.render('exportsol', {exportSolicitud})
});

//AUTORIZACION
router.get('/auth/:id/:uid/:resp', async (req, res) => {

    var idSol = req.params.id


    const exSol = await db.collection("solicitudes").where('__name__', '==', req.params.uid).get()
    .then(snap => {
        return snap.size;
    });

    if (exSol == 0) {

        res.redirect("/404");

    } else {

    const dataSol = await db.collection("solicitudes")
    .doc(req.params.uid).get();

    var inpAsunSol = dataSol.data().inpAsunSol
    var inpPrioridadSol = dataSol.data().inpPrioridadSol
    var AutResponse = req.params.resp
    var estadoSol = dataSol.data().inpEstadoSol
    var emailEmisor = dataSol.data().inpEmailSol
    var emailReceptor = dataSol.data().inpNomRecepSol
    var inpTipoSol = dataSol.data().inpTipoSol


    if (estadoSol == "Abierta" || estadoSol == "Proceso") {

        await db.collection("solicitudes").doc(req.params.uid).update({
            AutResponse: req.params.resp
        })

        var emails = emailEmisor.concat(',',emailReceptor);

        var mailOptions = {
            from: "XXX",
            to: emails,
            subject: "RegSol - Actualización de Solicitud",
            template: "autemailsol",
            context: {
                idSol: idSol,
                inpAsunSol: inpAsunSol,
                inpPrioridadSol: inpPrioridadSol,
                AutResponse: AutResponse,
                inpTipoSol:inpTipoSol
            },
          };
          ///////////////////////////////////Enviar Mail
          mailTransporter.sendMail(mailOptions, (err) => {
            if (err) {
              console.log("Email de respuesta no pudo ser enviado.", err);
            } else {
              console.log("Email de respuesta enviado.");
            }
          });

          res.render('auth', { idSol })

    } else {
        res.render('auth')
    }
   }
})

//AUTORIZACION END
router.get('/auth', async (req, res) => {
    res.render('auth');
})

//CANCELAR SOLICITUD
router.get('/reg/cancel/:id/:uid', async (req, res) => {
    
    await db.collection("solicitudes").doc(req.params.id).update({
        inpEstadoSol: "Cerrada"
    })
    res.redirect("/reg/"+req.params.uid+"/"+"msg?result="+encodeURIComponent('cancel'));
    //res.redirect('back');
})

//ACTUALIZAR SOLICITUD
router.get('/reg/edit/:uid', async (req, res) => {

    const Ayuda = await db.collection("listas")
    .doc("ayudas").get();
    var AyudaEditReg = Ayuda.data().editsol

    const edSol = await db.collection("solicitudes").where('__name__', '==', req.params.uid).get();
    const editSol = edSol.docs.map((doc) => ({
        ...doc.data(),
    }))

    const tipos = await db.collectionGroup("tipos").get();   
        const tiposol = tipos.docs.map((doc) => ({
            nombre: doc.nombre,
            ...doc.data(),
        }))

    const um = await db.collectionGroup("umedida").get();   
        const umedida = um.docs.map((doc) => ({
            nombre: doc.nombre,
            ...doc.data(),
        }))    

    const aut = await db.collectionGroup("autorizador").get();   
        const autoriza = aut.docs.map((doc) => ({
            nombre: doc.nombre,
            email: doc.email,
            ...doc.data(),
        }))

    const dir = await db.collectionGroup("dirigido").get();   
    const dirigido = dir.docs.map((doc) => ({
        nombre: doc.nombre,
        email: doc.email,
        ...doc.data(),
    }))

    const priori = await db.collectionGroup("prioridad").get();   
    const prioridad = priori.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    var uidSol = req.params.uid;

    res.render('editsol', { editSol, tiposol, autoriza, dirigido, umedida, AyudaEditReg, uidSol, prioridad })

})

//REG+ID+MSG
router.get('/reg/:id/:msg', async (req, res) => {

    const Ayuda = await db.collection("listas")
    .doc("ayudas").get();
    var AyudaReg = Ayuda.data().registrar

    const loguser = await db.collection("usuarios")
    .doc(req.params.id).get();

    var idUser = loguser.data().rut
    
    var soluser = db.collection("solicitudes")
    soluser = soluser.where("inpEstadoSol", "==", "Abierta")
    soluser = soluser.where("AutResponse", "==", "")
    soluser = await soluser.where("inpIDuser", "==", idUser).orderBy("inpFechaSol", "desc").get();
    const SolReg = soluser.docs.map((doc) => ({
        uidSol: doc.id,
        ...doc.data(),
    })) 
    res.render('reg', { AyudaReg, SolReg })
})

//REGSOL+ID
router.get('/regsol/:id', async (req, res) => {

    const Ayuda = await db.collection("listas")
    .doc("ayudas").get();
    var AyudaNewReg = Ayuda.data().nuevasol

    const idSol = await db.collection("solicitudes")
    .orderBy('inpIDSol', 'desc').limit(1).get();

    const PreIdSol = idSol.docs.map((doc) => ({
        idsolicitud: parseInt(doc.data().inpIDSol)+1 }))

    const loguser = await db.collection("usuarios")
    .doc(req.params.id).get();

        var idUser = loguser.data().rut
        var nameUser = loguser.data().displayName

    const tipos = await db.collectionGroup("tipos").get();   
    const tiposol = tipos.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    const um = await db.collectionGroup("umedida").get();   
    const umedida = um.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))    

    const aut = await db.collectionGroup("autorizador").get();   
    const autoriza = aut.docs.map((doc) => ({
        nombre: doc.nombre,
        email: doc.email,
        ...doc.data(),
    }))

    const dir = await db.collectionGroup("dirigido").get();   
    const dirigido = dir.docs.map((doc) => ({
        nombre: doc.nombre,
        email: doc.email,
        ...doc.data(),
    }))

    const priori = await db.collectionGroup("prioridad").get();   
    const prioridad = priori.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    res.render('regsol', { idUser, nameUser, tiposol, autoriza, dirigido, umedida, PreIdSol, AyudaNewReg, prioridad })

})

//INDEX
router.get('/', async (req, res) => {
    res.render('index');
})

//GESTIONAR+UID+IDSOL
router.get('/gestionar/:uid/:idsol', async (req, res) => {

    const Ayuda = await db.collection("listas")
    .doc("ayudas").get();
    var AyudaGestSol = Ayuda.data().gestsol

    const idSol = await db.collection("solicitudes").where('__name__', '==', req.params.idsol).get();
    const idSolicitud = idSol.docs.map((doc) => ({
        ...doc.data(),
    }))

    const etd = await db.collectionGroup("estados").get();   
    const estados = etd.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    })) 

    const com = await db.collection("comentarios").where('inpUIDSolGest', '==', req.params.idsol).orderBy("inpIDComGest", "desc").get();
    const gestCom = com.docs.map((doc) => ({
        ...doc.data(),
    }))

    const ges = await db.collection("gestiones").where('inpUIDSolCom', '==', req.params.idsol).get();   
    const gestData = ges.docs.map((doc) => ({
        ...doc.data(),
    }))

    var UIDSess = req.params.uid;
    var inpUIDSolCom = req.params.idsol;

    res.render('gestionar', { idSolicitud, estados, UIDSess, gestCom, inpUIDSolCom, gestData, AyudaGestSol });
})

//GESTIONAR+UID+MSG
router.get('/ges/:uid/:msg', async (req, res) => {

    const Ayuda = await db.collection("listas")
    .doc("ayudas").get();
    var AyudaGestionar = Ayuda.data().gestionar

    const loguserges = await db.collection("usuarios")
    .doc(req.params.uid).get();

    var idUserGes = loguserges.data().rut
    var emailUserGes = loguserges.data().email
    var areaUserGes = loguserges.data().area

    var solusergest1 = db.collection("solicitudes")
    solusergest1 = solusergest1.where("inpEstadoSol", "not-in", ["Cerrada", "Cancelada", "Completada"]);
    solusergest1 = await solusergest1.where("inpIDuser", "==", idUserGes).get();
    var SolReg1 = solusergest1.docs.map((doc) => ({
        uidSol: doc.id,
        catSol: 'E',
        ...doc.data(),
    })) 

    var soluserges2 = db.collection("solicitudes"),
    soluserges2 = soluserges2.where("inpEstadoSol", "not-in", ["Cerrada", "Cancelada", "Completada"]);
    soluserges2 = await soluserges2.where("inpNomRecepSol", "==", emailUserGes).get();
    var SolReg2 = soluserges2.docs.map((doc) => ({
        uidSol: doc.id,
        catSol: 'R',
        ...doc.data(),
    })) 

    var soluserges3 = db.collection("solicitudes"),r
    soluserges3 = soluserges3.where("inpEstadoSol", "not-in", ["Cerrada", "Cancelada", "Completada", "Proceso"]);
    soluserges3 = await soluserges3.where("inpAutEmailSol", "==", emailUserGes).get();
    var SolReg3 = soluserges3.docs.map((doc) => ({
        uidSol: doc.id,
        AutSol: 'A',
        ...doc.data(),
    })) 

    var UIDSess = req.params.uid;

    res.render('ges', { AyudaGestionar, SolReg1, SolReg2, SolReg3, UIDSess, areaUserGes, })
})

//AUTORIZACION SOLICITUD
router.get('/autorizar/:uid/:idsol', async (req, res) => {

    const Ayuda = await db.collection("listas")
    .doc("ayudas").get();
    var AyudaAutSol = Ayuda.data().autsol

    const idSol = await db.collection("solicitudes").where('__name__', '==', req.params.idsol).get();
    const idSolicitud = idSol.docs.map((doc) => ({
        ...doc.data(),
    }))

    const aut = await db.collectionGroup("autorizar").get();   
    const autorizar = aut.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    })) 

    const com = await db.collection("comentarios").where('inpUIDSolGest', '==', req.params.idsol).orderBy("inpIDComGest", "desc").get();
    const gestCom = com.docs.map((doc) => ({
        ...doc.data(),
    }))

    const ges = await db.collection("gestiones").where('inpUIDSolCom', '==', req.params.idsol).get();   
    const gestData = ges.docs.map((doc) => ({
        ...doc.data(),
    }))

    var UIDSess = req.params.uid;
    var inpUIDSolCom = req.params.idsol;

    //console.log(gestData);
    res.render('autorizar', { idSolicitud, autorizar, UIDSess, gestCom, inpUIDSolCom, gestData, AyudaAutSol });
})

module.exports = router;
