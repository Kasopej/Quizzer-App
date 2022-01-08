import UiClass from "../Modules/ui/ui.js";
import { InputValidationHelpersClass } from "../Modules/util/helpers.js";
import UserControl from "../modules/user/user-control.js";
import { LocalDataPersistenceClass } from "../services/persistent-service.js";
import RouterService from "../services/router.js";
import { LIST_USERS_URL } from "../Modules/util/url.js";
import User from "../modules/user/user.js";

//Initialize business logic classes
const user = new User();
const userControl = new UserControl(user);
const inputValidationHelpers = new InputValidationHelpersClass();
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

localDataPersistenceService.removeData("allUserAccounts");
await userControl.getAndSaveAllUsers(LIST_USERS_URL + 1);

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
userControl.attemptAutoLogin();
if (user.isLoggedIn) {
  router.goToRoute("quiz-results.html");
}
ui.removeElement(ui.getElements(".page-blocker")[0]);

async function startLogin(event) {
  event.preventDefault();
  let loginEntry = ui.getInputValue([loginEmailInput, loginPasswordInput]);
  ui.attachText([loginButton], ["logging in..."]);
  const loginResult = await userControl.login(loginEntry[0], loginEntry[1]);
  if (loginResult) {
    /*
    localDataPersistenceService.saveData("loginStatus", {
      [loginEntry[0]]: loginResult,
    });
    */
    router.goToRoute("quiz-results.html");
  } else {
    ui.attachText([loginButton], ["Login"]);
    ui.displayAlert("Incorrect login credentials");
  }
}

async function startSignup(event) {
  event.preventDefault();
  let signUpEntry = ui.getInputValue([signUpEmailInput, signUpPasswordInput]);
  if (
    inputValidationHelpers.validateEmails([signUpEntry[0]]) &&
    inputValidationHelpers.validatePassword(signUpEntry[1])
  ) {
    //if email & password are validated, attempt to register admin
    ui.attachText([signUpButton], ["registering..."]);
    const signUpResult = await userControl.register(
      signUpEntry[0],
      signUpEntry[1]
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
