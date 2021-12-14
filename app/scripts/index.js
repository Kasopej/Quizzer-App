import UiClass from "../Modules/ui/ui.js";
import UserControl from "../Modules/util/user-control.js";

//Initialize business logic classes
export const userControl = new UserControl();
const ui = new UiClass();

//get elements from DOM
const loginUserNameInput = ui.getElements("#loginModal .userName")[0];
const loginPasswordInput = ui.getElements("#loginModal .password")[0];

/*
d
d
d
d
d
d
d
d
d
d
d
d
dd
d
d
*/

(function openModal(id) {
  const modals = document.querySelectorAll(".cusModal");
  for (let i = 0; i < modals.length; i++) {
    if (modals[i].id == id) {
      modals[i].classList.add("cusShow");
    } else {
      modals[i].classList.remove("cusShow");
    }
  }
})();

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
