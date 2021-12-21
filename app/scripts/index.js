import UiClass from "../Modules/ui/ui.js";
import { HandlerHelpersClass } from "../Modules/util/helpers.js";
import UserControl from "../Modules/util/user-control.js";
import { LocalDataPersistenceClass } from "../services/persistent-service.js";
import RouterService from "../services/router.js";
import { LIST_USERS_URL } from "../Modules/util/url.js";

//Initialize business logic classes
const userControl = new UserControl();
const handlerHelpers = new HandlerHelpersClass();
const ui = new UiClass();
const router = new RouterService();

//get elements from DOM
const loginEmailInput = ui.getElements("#loginModal .email")[0];
const loginPasswordInput = ui.getElements("#loginModal .password")[0];
const loginButton = ui.getElements("#loginSubmit")[0];
const signUpEmailInput = ui.getElements("#signupModal .email")[0];
const signUpPasswordInput = ui.getElements("#signupModal .password")[0];
const signUpButton = ui.getElements("#signupSubmit")[0];
const modalTriggers = ui.getElements(".openModal a");
const modals = ui.getElements(".cusModal");
const showPasswordToggles = ui.getElements("input[type='password'] + span");
const localDataPersistenceService = new LocalDataPersistenceClass();

//make API calls
localDataPersistenceService.removeData("allUserAccounts");
userControl.getAndSaveAllUsers(LIST_USERS_URL + 1);

ui.addEventListenerToElements(
  [loginButton, signUpButton, signUpPasswordInput],
  ["click", "click", "keyup"],
  [
    (event) => startLogin(event),
    (event) => startSignup(event),
    function () {
      const passwordValidationTextElement = ui.getElements(
        "#password-validation-message"
      );
      if (!handlerHelpers.validatePassword.call(null, this.value)) {
        ui.replaceClassOnElements(passwordValidationTextElement, [
          "success-message",
          "failure-message",
        ]);
        ui.attachText(passwordValidationTextElement, [
          "Weak password. password must contain a number [0-9], a special symbol [#,@,<,$ etc] and be at least 8 characters long",
        ]);
        return;
      }
      ui.replaceClassOnElements(passwordValidationTextElement, [
        "failure-message",
        "success-message",
      ]);
      ui.attachText(passwordValidationTextElement, ["strong password"]);
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
async function startLogin(event) {
  event.preventDefault();
  let loginEntries = ui.getInputValue([loginEmailInput, loginPasswordInput]);
  const loginResult = await userControl.login(loginEntries[0], loginEntries[1]);
  if (loginResult) {
    localDataPersistenceService.saveData("loginStatus", {
      [loginEntries[0]]: loginResult,
    });
    router.goToRoute("dashboard.html");
  } else {
    alert("Incorrect login credentials");
  }
}

async function startSignup(event) {
  event.preventDefault();
  let signUpEntries = ui.getInputValue([signUpEmailInput, signUpPasswordInput]);
  if (
    handlerHelpers.validateEmails([signUpEntries[0]]) &&
    handlerHelpers.validatePassword(signUpEntries[1])
  ) {
    if (userControl.isEmailAlreadyRegistered(signUpEntries[0])) return;
    const signUpResult = await userControl.register(
      signUpEntries[0],
      signUpEntries[1]
    );
  } else alert("Please check the email & password provided");
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
