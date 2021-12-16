import UiClass from "../Modules/ui/ui.js";
import UserControl from "../Modules/util/user-control.js";
import { LocalDataPersistenceClass } from "../services/persistent-service.js";
import RouterService from "../services/router.js";

//Initialize business logic classes
export const userControl = new UserControl();

const ui = new UiClass();
const router = new RouterService();

//get elements from DOM
const loginUserNameInput = ui.getElements("#loginModal .userName")[0];
const loginPasswordInput = ui.getElements("#loginModal .password")[0];
const loginButton = ui.getElements("#loginSubmit")[0];
const modalTriggers = ui.getElements(".openModal a");
const modals = ui.getElements(".cusModal");
const showPasswordToggles = ui.getElements("input[type='password'] + span");
const localDataPersistenceService = new LocalDataPersistenceClass();

ui.addEventListenerToElements(
  [loginButton],
  ["click"],
  [
    async function (event) {
      event.preventDefault();
      let loginEntries = ui.getInputValue([
        loginUserNameInput,
        loginPasswordInput,
      ]);
      const loginResult = await userControl.login(
        loginEntries[0],
        loginEntries[1]
      );
      if ("token" in loginResult) {
        localDataPersistenceService.saveData("loginStatus", {
          [loginEntries[0]]: loginResult,
        });
        router.goToRoute("dashboard.html");
      } else {
        alert("Incorrect login credentials");
      }
    },
  ]
);

ui.addEventListenerToElements(
  Array.from(modalTriggers),
  ["click", "click"],
  [
    function () {
      openModal("signupModal");
    },
    function () {
      openModal("loginModal");
    },
  ]
);
ui.addEventListenerToElements(
  Array.from(showPasswordToggles),
  ["click"],
  [togglePassword]
);

if (userControl.checkIfUserIsSignedIn()) {
  router.goToRoute("dashboard.html");
}
function openModal(id) {
  for (let i = 0; i < modals.length; i++) {
    if (modals[i].id == id) {
      modals[i].classList.add("cusShow");
    } else {
      modals[i].classList.remove("cusShow");
    }
  }
}

function togglePassword() {
  const input = this.previousElementSibling;
  if (input.type == "password") {
    input.type = "text";
    this.innerHTML = "Hide";
  } else {
    input.type = "password";
    this.innerHTML = "Show";
  }
}
