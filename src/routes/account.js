const { Router } = require("express");
const { auth } = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { db } = require("../firebase");
const { body, validationResult } = require("express-validator");
const path = require("path");
const router = Router();
const CryptoJS = require("crypto-js");

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

//NUEVO USUARIO
router.post(
  "/new-user",
  [

    body("rut").custom( async (value) => {
      var rt = Fn.validaRut(value);
      if (rt == false) {
        return await Promise.reject("Rut ingresado es Inválido! (Ej: 12345678-9)");
      } else {
        return await Promise.resolve();
      }
    }),

    body("rut").custom( async (value) => {

      const querySnapshot = await db.collection("usuarios").where("rut", "==", value).get()

      if (querySnapshot.empty) {
        return Promise.resolve();
      } else {
        return Promise.reject("El Rut ya fue registrado!");
      }
    }),

    body("username", "Ingrese su Nombre y Apellido!").isLength({ min: 5 }),

    body("username").custom( async (value) => {
      var nameregex =
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
      if (!nameregex.test(value)) {
        return await Promise.reject("Nombre y Apellido debe contener solo Letras!");
      } else {
        return await Promise.resolve();
      }
    }),

    body("email").custom( async (value) => {
      var emailregex =
        /^[a-zA-Z0-9]+@(caimi|caimicorp|capire|davanti|bright)\.(com|cl)$/;
      if (!emailregex.test(value)) {
        return await Promise.reject("Ingrese un correo válido de Empresa.");
      } else {
        return await Promise.resolve();
      }
    }),

    body("email").custom( async (value) => {

      const querySnapshot = await db.collection("usuarios").where("email", "==", value).get()

      if (querySnapshot.empty) {
        return Promise.resolve();
      } else {
        return Promise.reject("El Email ya fue registrado!");
      }
    }),

    body("area").custom( async (value) => {
      if (value == null) {
        return await Promise.reject("Debe seleccionar su Área!");
      } else {
        return await Promise.resolve();
      }
    }),

    body(
      "password",
      "La Contraseña debe tener al menos 6 Caracteres."
    ).isLength({ min: 6 }),

    body("password2").custom( async ( value, { req }) => {
      if (value === req.body.password) {
        return await Promise.resolve();
      } else {
        return await Promise.reject("Las Contraseñas no Coinciden!");
      }
    })

  ], async (req, res) => {
    
    //Lista Areas
    const querySnapshot = await db.collectionGroup("areas").get();
    const areas = querySnapshot.docs.map((doc) => ({
      nombre: doc.nombre,
      ...doc.data(),
    }));

    const querySnapshot1 = await db.collectionGroup("areasgerencia").get();
    const subareas = querySnapshot1.docs.map((doc) => ({
        nombre: doc.nombre,
        ...doc.data(),
    }))

    //Referencias
    const errors = validationResult(req);
    const valores = req.body;
    const validaciones = errors.array();
    const { rut, username, email, area, password, subarea } = req.body;

    //Funcion Render Validaciones
    if (!errors.isEmpty()) {

      await res.render("registrar", {
      validaciones: validaciones,
      valores: valores,
      areas,
      subareas,
      });

    } else {

    //Crear Usuario Authentication
    await auth()
      .createUser({
        displayName: username,
        email,
        emailVerified: false,
        password,
        disabled: false,
        
      })
      .then( async (userRecord) => {
        console.log("Usuario creado correctamente.");

        //Crear usuario en la DB

        await db.collection("usuarios/").doc(userRecord.uid)
          .set({
            rut,
            area,
            subarea: subarea,
            displayName: username,
            email,
            pass: encPass(password, email),
          })
          .catch((error) => {
            console.log(error.code);
            res.render("registrar", {
              message:
                "Error al registrar al usuario, por favor contactar al adminstrador.",
              intro: "Oops!",
              type: "danger",
            });
          });


          //Crear como Receptor
          var dir1 = db.collectionGroup("dirigido");
          var dir1 = await dir1.where("email", "==", email).get()
          .then(snap => {
              return snap.size;
          });

          if (!dir1 >= 1) {

          const dir2 = db.collection("listas");
          await dir2.doc("solicitud").collection("dirigido")
          .add({
            area: area,
            nombre: username,
            email: email,
          }).catch((error) => {
              console.log(error.code);
              res.render("registrar", {
                message:
                  "Error al registrar al usuario, por favor contactar al adminstrador.",
                intro: "Oops!",
                type: "danger",
              });
            });
          }

        ///////////////////////////////////Enviar Mail Verificación
        await getAuth()
        .generateEmailVerificationLink(userRecord.email)
        .then((link) => {

          var mailOptions = {
            from: "XXX",
            to: userRecord.email,
            subject: "RegSol - Verificación",
            template: "validaremail",
            context: {
              username: userRecord.displayName,
              verificar: link,
            },
          };
          ///////////////////////////////////Enviar Mail
          mailTransporter.sendMail(mailOptions, (err) => {
            if (err) {
              console.log("Email de verificación, no pudo ser enviado.", err);
            } else {
              console.log("Email de verificación enviado.");
            }
          });
          // return sendCustomVerificationEmail(
          //   userRecord.email,
          //   userRecord.displayName,
          //   link
          // );
        })
        .catch((error) => {
          console.log("Error: ", error.code);
          // Some error occurred.
        });
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          res.render("registrar", {
            message: "Email inválido!",
            intro: "Oops!",
            type: "danger",
          });
        } else if (error.code === "auth/email-already-exists") {
          res.render("registrar", {
            message: "Email ya fue registrado.",
            intro: "Oops!",
            type: "danger",
          });
        } else if (error.code === "auth/invalid-password") {
          res.render("registrar", {
            message: "La contraseña debe tener al menos 6 o mas caracteres!",
            intro: "Oops!",
            type: "danger",
          });
        } else if (error.code === "auth/internal-error") {
          res.render("registrar", {
            message: "Error interno, avisar al administrador del sistema.",
            intro: "Oops!",
            type: "danger",
          });
        } else if (error.code === "auth/network-request-failed") {
          res.render("registrar", {
            message: "Sin conexión a la red.",
            intro: "Oops!",
            type: "danger",
          });
        } else if (error.code === "auth/weak-password") {
          res.render("registrar", {
            message:
              "La contraseña es muy débil, debe tener al menos 6 caracteres.",
            intro: "Oops!",
            type: "danger",
          });
        } else {
          console.log("Error: ", error.code);
        }
      });
      await res.render('ingresar', {
        message:
          "Usuario registrado correctamente, por favor revisa tu correo electrónico.",
        intro: "Activa tu Cuenta!",
        type: "success",
      });
    }
  }
);

//VALIDAR RUT
let Fn = {
  // Valida el rut con su cadena completa "XXXXXXXX-X"
  validaRut: function (rutCompleto) {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
    let tmp = rutCompleto.split("-");
    let digv = tmp[1];
    let rut = tmp[0];
    if (digv == "K") digv = "k";
    return Fn.dv(rut) == digv;
  },
  dv: function (T) {
    let M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : "k";
  },
};

//ENCRIPTAR PASS
function encPass(pass, email) {
  var pw = CryptoJS.AES.encrypt(pass, email);
  return pw.toString();
}

//DESENCRIPTAR PASS
function decPass(dbpass, email) {
  var pw = CryptoJS.AES.decrypt(dbpass, email);
  return pw.toString(CryptoJS.enc.Utf8);
}

//RECUPERAR PASS
router.post(
  "/get-pass",
  [

    body("email").custom( async (value) => {

      const querySnapshot = await db.collection("usuarios").where("email", "==", value).get()

      if (querySnapshot.empty) {
        return Promise.reject("Correo Electrónico no registrado.");
      } else {
        return Promise.resolve();
      }
    })
    
], async (req, res) => {
    
  //Referencias
  var errors = validationResult(req);
  var validaciones = errors.array();
  const { email } = req.body;

  //Funcion Render Validaciones
  if (!errors.isEmpty()) {

    await res.render("problemas", {
    validaciones: validaciones,
    });

  } else {

    const querySnapshot = await db.collection("usuarios").where("email", "==", email).get()

    querySnapshot.forEach(doc => {

      var pw = decPass(doc.data().pass, email)
      var name = doc.data().displayName

      var mailOptions = {
        from: "XXX",
        to: email,
        subject: "RegSol - Recuperar Contraseña",
        template: "enviarpass",
        context: {
          username: name,
          passw: pw,
        },
      };
      ///////////////////////////////////Enviar Mail
      mailTransporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log("Email de recuperación, no pudo ser enviado.", err);
        } else {
          console.log("Email de recuperación enviado.");

          res.render('problemas', {
            message:
              "Por favor revisa tu correo electrónico.",
            intro: "Email Enviado!",
            type: "success",
          });

        }
      });
    });
    }
});

//EDITAR USUARIO
router.post("/edit-user", async (req, res) => {
  
  //Referencias
  const { username, area, subarea, UIDSess} = req.body;

    await db.collection("usuarios").doc(UIDSess).update({
      displayName: username,
      area: area,
      subarea: subarea
    })

  res.redirect('/inicio/' + UIDSess)
  
})

module.exports = router;
