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
const passwordValidationTextElement = ui.getElements(
  "#password-validation-message"
)[0];

//make API calls
localDataPersistenceService.removeData("allUserAccounts");
userControl.getAndSaveAllUsers(LIST_USERS_URL + 1);

//Add event listeners
ui.addEventListenerToElements(
  [loginButton, signUpButton, signUpPasswordInput],
  ["click", "click", "keyup"],
  [
    (event) => startLogin(event),
    (event) => startSignup(event),
    function () {
      ui.displayPasswordValidationResult(this, passwordValidationTextElement);
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

ui.addEventListenerToElements(
  [ui.getElements("#closeInfoAlert")[0]],
  ["click"],
  [
    function () {
      ui.removeClassFromElements([ui.getElements("#infoAlert")[0]], "d-block");
    },
  ]
);
ui.addEventListenerToElements(
  [ui.getElements("#infoAlert")[0]],
  ["click"],
  [
    function () {
      ui.removeClassFromElements([ui.getElements("#infoAlert")[0]], "d-block");
    },
  ]
);

//If a user is already signed in, route to dashboard page
if (userControl.checkIfUserIsSignedIn()) {
  router.goToRoute("dashboard.html");
}

async function startLogin(event) {
  event.preventDefault();
  let loginEntries = ui.getInputValue([loginEmailInput, loginPasswordInput]);
  ui.attachText([loginButton], ["logging in..."]);
  const loginResult = await userControl.login(loginEntries[0], loginEntries[1]);
  if (loginResult) {
    //if login successful, save logged in user details to local storage
    localDataPersistenceService.saveData("loginStatus", {
      [loginEntries[0]]: loginResult,
    });
    router.goToRoute("dashboard.html");
  } else {
    ui.attachText([loginButton], ["Login"]);
    ui.displayAlert("Incorrect login credentials");
  }
}

async function startSignup(event) {
  event.preventDefault();
  let signUpEntries = ui.getInputValue([signUpEmailInput, signUpPasswordInput]);
  if (
    handlerHelpers.validateEmails([signUpEntries[0]]) &&
    handlerHelpers.validatePassword(signUpEntries[1])
  ) {
    //if email & password are validated, attempt to register admin
    ui.attachText([signUpButton], ["registering..."]);
    const signUpResult = await userControl.register(
      signUpEntries[0],
      signUpEntries[1]
    );
    if (!signUpResult) {
      ui.displayAlert(
        "Registeration failed. Please check your network & try again"
      );
    }
  } else {
    ui.displayAlert("Please check email & password provided");
  }
  ui.attachText([signUpButton], ["Signup"]);
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
