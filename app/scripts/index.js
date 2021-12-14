import UiClass from "../Modules/ui/ui.js";
import UserControl from "../Modules/util/user-control.js";
import RouterService from "../services/router.js";

//Initialize business logic classes
export const userControl = new UserControl();
const ui = new UiClass();
const router = new RouterService();

function startLogin() {
  //get elements from DOM
  const loginUserNameInput = ui.getElements("#loginModal .userName")[0];
  const loginPasswordInput = ui.getElements("#loginModal .password")[0];
  const loginButton = ui.getElements("#loginSubmit")[0];

  ui.addEventListenerToElements(
    [loginButton],
    ["click"],
    [
      async function () {
        let loginEntries = ui.getInputValue([
          loginUserNameInput,
          loginPasswordInput,
        ]);
        const loginResult = await userControl.login(
          loginEntries[0],
          loginEntries[1]
        );
        if (loginResult) router.goToRoute("dashboard.html");
      },
    ]
  );
}

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
dd
d
d
*/
/*
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
*/
