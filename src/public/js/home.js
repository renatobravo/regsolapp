import { isLogin } from '././functions.js';

//WINDOWS LOAD
window.onload = function () {
  isLogin();
  renderPage();
}

//////////////////////////// CONTAR FUNCION
function countOccurrences(str, word) {
  // split the string by spaces in a
  let a = str.split(" ");
  // search for pattern in a
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    // if match found increase count
    if (word == (a[i]))
      count++;
  }
  return count;
}
//////////////////////////// CONTAR SOLICITUDES
var abiertaSTDEmitida_count = document.getElementById("abiertaSTDEmitida").value
var abiertaSTDRecibida_count = document.getElementById("abiertaSTDRecibida").value
var procesoSTDEmiRec_count = document.getElementById("procesoSTDEmiRec").value
//COMPLETADA VIENE CON CONTADOR
var completadaSTDEmiRec_count = document.getElementById("completadaSTDEmiRec").value
var completadaSTDEmiRec = parseInt(completadaSTDEmiRec_count)
//COUNT VENCEN
var vencenSTDRec_count = document.getElementById("vencenSTDRec").value
var vencenSTDRec = parseInt(vencenSTDRec_count)
//DRIVER CODE
var abierta = "Abierta";
var proceso = "Proceso";
//COUNT
var abiertaSTDEmitida = countOccurrences(abiertaSTDEmitida_count, abierta)
var abiertaSTDRecibida = countOccurrences(abiertaSTDRecibida_count, abierta)
var abiertaSTDEmiRec = abiertaSTDEmitida + abiertaSTDRecibida
var procesoSTDEmiRec = countOccurrences(procesoSTDEmiRec_count, proceso)

$("#spnAbierta").text(abiertaSTDEmiRec);
$("#spnProceso").text(procesoSTDEmiRec);
$("#spnCompletada").text(completadaSTDEmiRec);
$("#spnVencer").text(vencenSTDRec);

/////////////////////COUNTER FUNCTION
$(document).ready(function () {

  $('.counter').each(function () {
    $(this).prop('Counter', 0).animate({
      Counter: $(this).text()
    }, {
      duration: 400,
      easing: 'linear',
      step: function (now) {
        $(this).text(Math.ceil(now));
      }
    });
  });
});

///////////////DATE
const pages = document.querySelector('.date');
const locale = window.navigator.language || 'en-us'

let date = new Date();
let dayNum = date.getDate();
let dayName = date.toLocaleString(locale, { weekday: 'long' });
let monthName = date.toLocaleString(locale, { month: 'long' });
let year = date.getFullYear();

function renderPage () {
  const newPage = document.createElement('div');
  newPage.classList.add('date');
  newPage.innerHTML = `
    <p class="subdate"><i class="mt-3 mr-4 fa fa-circle text-white"></i>&nbsp;<i class="mt-3 ml-4 fa fa-circle text-white"></i></p>
    <spam class="month">${monthName}</spam><br>
    <span class="day">${dayNum}</span><br>
    <span class="day-name">${dayName}</span><br>
    <span class="year">${year}</span><br>
  `;
  pages.appendChild(newPage);
}
