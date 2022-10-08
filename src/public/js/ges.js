//IMPORTS
import { isLogin } from "./functions.js";

//DATA
var idSolSelectDataGes = document.getElementById("idSolSelectDataGes");
var idSolSelectDataAut = document.getElementById("idSolSelectDataAut");
var AutEmailSolData = document.getElementById("AutEmailSolData");
var SessEmailData = document.getElementById("SessEmailData");
var UIDSess = document.getElementById("UIDSess");

var alertGest = document.getElementById("alertGest");
var alertAut = document.getElementById("alertAut");
var ClassalertGest = alertGest.classList;
var ClassalertAut = alertAut.classList;

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('result');

//WINDOWS LOAD
window.onload = function () {
  isLogin();
  idSolSelectDataGes.value = "";
  idSolSelectDataAut.value = "";
  AutEmailSolData.value = "";
  SessEmailData.value = "";

  if(myParam == "manage") {
    ClassalertGest.remove("displayNone");
  } else if (myParam == "auth") {
    ClassalertAut.remove("displayNone");
  }
};

//CLICK TABLE GESTIONAR
$("#soltable tr").click(function () {
    $(".clickableRow").on("click", function () {
        $(".highlight").removeClass("highlight");
        $(this).addClass("highlight");
        var $SelectData = $(this).find(".data1").text();
        idSolSelectDataGes.value = $.trim($SelectData);
    });
});

$("#soltable tr").dblclick(function(){
  $(".clickableRow").on("dblclick", function () {
  var $SelectData = $(this).find(".data1").text();
  idSolSelectDataGes.value = $.trim($SelectData);
  window.location.href = "/gestionar/" + UIDSess.value + "/" + idSolSelectDataGes.value;
  });
})

//CLICK TABLE AUTORIZAR
$("#auttable tr").click(function () {
  $(".clickableRow").on("click", function () {
      $(".highlight").removeClass("highlight");
      $(this).addClass("highlight");
      var $SelectData = $(this).find(".data2").text();
      idSolSelectDataAut.value = $.trim($SelectData);
  });
});

$("#auttable tr").dblclick(function(){
  $(".clickableRow").on("dblclick", function () {
  var $SelectData = $(this).find(".data2").text();
  idSolSelectDataAut.value = $.trim($SelectData);
  window.location.href = "/autorizar/" + UIDSess.value + "/" + idSolSelectDataAut.value;
  });
})