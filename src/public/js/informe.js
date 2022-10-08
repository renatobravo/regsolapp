//IMPORTS
import { isLogin, signOut } from "./functions.js";

var uidSelectInfo = document.getElementById("uidSelectInfo");

//CLICK TABLE INFO
$("#soltable tr").click(function () {
  $(".clickableRow").on("click", function () {
      $(".highlight").removeClass("highlight");
      $(this).addClass("highlight");
      var $SelectData = $(this).find(".data1").text();
      uidSelectInfo.value = $.trim($SelectData);
  });
  });

//DOUBLECLICK TABLE INFO
$("#soltable tr").dblclick(function(){
  $(".clickableRow").on("dblclick", function () {
  var $SelectData = $(this).find(".data1").text();
  uidSelectInfo.value = $.trim($SelectData);
  window.open("/exportsol/" + uidSelectInfo.value);
  });
})

//SIGNOUT USER
function signOutUser() {
  signOut(auth).then(() => {
    // Sign-out successful.
    sessionStorage.removeItem("user");
}).catch((error) => {
    // An error happened.
    alert(error);
});
}

//WINDOWS LOAD
window.onload = function () {
  isLogin();
};


