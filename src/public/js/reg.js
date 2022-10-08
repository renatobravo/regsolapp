//IMPORTS
import { isLogin } from "./functions.js";

var alertUpdate = document.getElementById("alertUpdate");
var alertCreate = document.getElementById("alertCreate");
var alertCancel = document.getElementById("alertCancel");
var ClassAlertUpdate = alertUpdate.classList;
var ClassAlertCreate = alertCreate.classList;
var ClassAlertCancel = alertCancel.classList;

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('result');


//WINDOWS LOAD
window.onload = function () {
  isLogin();
  if(myParam == "update") {
    ClassAlertUpdate.remove("displayNone");
  } else if (myParam == "create") {
    ClassAlertCreate.remove("displayNone");
  } else if (myParam == "cancel"){
    ClassAlertCancel.remove("displayNone");
  }
};


