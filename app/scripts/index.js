//import UserControl from "../Modules/util/user-control.js";

function login(entry) {}
function openModal(id) {
  const modals = document.querySelectorAll(".cusModal");
  for (let i = 0; i < modals.length; i++) {
    if (modals[i].id == id) {
      modals[i].classList.add("cusShow");
    } else {
      modals[i].classList.remove("cusShow");
    }
  }
}

function togglePass(el) {
  const input = el.previousElementSibling;
  if (input.type == "password") {
    input.type = "text";
    el.innerHTML = "Hide";
  } else {
    input.type = "password";
    el.innerHTML = "Show";
  }
}
