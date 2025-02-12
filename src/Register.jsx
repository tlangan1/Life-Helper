/** @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";
import { affectItem } from "./JS/helperFunctions";
import { useGlobalState } from "./GlobalStateProvider";
import { useNavigate } from "@solidjs/router";

export function Register(props) {
  var [step, setStep] = createSignal("user name creation");
  var { passwordPattern, dataServer } = useGlobalState();
  var [userFieldsValid, setUserFieldsValid] = createSignal({});
  var [pwdFieldsValid, setPwdFieldsValid] = createSignal({});
  var checkUserValidity = initValidityChecker(userFieldsValid);
  var checkPwdValidity = initValidityChecker(pwdFieldsValid);
  var [passwordVisible, setPasswordVisible] = createSignal(false);
  var [passwordsMatch, setPasswordsMatch] = createSignal({
    passwordMismatchClass: "error-message",
    passwordMismatchMessage: "",
  });

  const navigate = useNavigate(); // Create navigate function

  // *** ************************************************* ***
  // The logic surrounding the userFieldsValid and pwdFieldsValid
  // signals serves the purpose of enabling the commit button on each
  // fieldset only when all fields in the given fieldset are valid.
  // These signals are initialized in the onMount function because
  // the code is relying on the browser to determine if the fields
  // are valid or not and the browser cannot make that determination
  // until the fields are rendered.
  // *** ************************************************* ***
  onMount(() => {
    initFieldSetValidator("register_user_name_creation", setUserFieldsValid);
    initFieldSetValidator("register_password_creation", setPwdFieldsValid);
    function initFieldSetValidator(fieldsetID, setter) {
      var validityObject = {};
      var fieldset = document.getElementById(fieldsetID);
      var inputs = fieldset.querySelectorAll("input");
      inputs.forEach((input) => {
        validityObject[input.id] = input.checkValidity();
      });
      setter(validityObject);
    }
  });

  return (
    <section class="route">
      <h2>Register</h2>

      <form id="formRegister">
        <fieldset
          id="register_user_name_creation"
          classList={{
            hidden: step() != "user name creation",
          }}
        >
          <div class="form-control-wrapper">
            {/* <label for="register_full_name" data-default_value="Full Name"> */}
            <label for="register_full_name">
              Full Name (10-100 characters)
            </label>
            <div class="separated-label-wrapper">
              <input
                id="register_full_name"
                required
                type="text"
                autocomplete="name"
                placeholder=""
                title="Enter your full name."
                minLength="10"
                maxLength="100"
                onInput={(e) => checkUserValidity.setValidity(e.target)}
              />
              <span></span>
            </div>
          </div>
          <div class="form-control-wrapper">
            <label for="register_display_name">
              Display Name (1-30 characters)
            </label>
            <div class="separated-label-wrapper">
              <input
                id="register_display_name"
                required
                type="text"
                autocomplete="given-name"
                placeholder=""
                title="Enter the name you want to be called by."
                minLength="1"
                maxLength="30"
                onInput={(e) => checkUserValidity.setValidity(e.target)}
              />
              <span></span>
            </div>
          </div>
          <div class="form-control-wrapper">
            <label for="register_email_address">Email Address</label>
            <div class="separated-label-wrapper">
              <input
                id="register_email_address"
                type="text"
                autocomplete="email"
                placeholder=""
                title="Enter your email address (optional)."
                minLength="5"
                maxLength="100"
              />
              <span></span>
            </div>
          </div>
          {/* The mere presence of the word Email in the label will cause */}
          {/* chrome to suggest an email address */}
          <div class="form-control-wrapper">
            <label for="register_user_name">
              User Name or Email (10-30 characters)
            </label>
            {/* If you use this label it will not suggest an email address */}
            {/* <label for="register_user_name">User Name</label> */}
            <div class="separated-label-wrapper">
              <input
                id="register_user_name"
                required
                type="text"
                autocomplete="new username"
                placeholder=""
                title="Enter a user name."
                minLength="10"
                maxLength="30"
                onInput={(e) => checkUserValidity.setValidity(e.target)}
              />
              <span></span>
            </div>
          </div>
          <button
            class="action-button"
            disabled={!checkUserValidity.isInvalid()}
            onClick={() => setStep("password creation")}
          >
            Continue
          </button>
        </fieldset>
        <fieldset
          id="register_password_creation"
          classList={{
            hidden: step() == "user name creation",
          }}
        >
          <div class="form-control-wrapper">
            <div class="embedded-label-wrapper">
              <input
                id="register_password"
                required
                type={passwordVisible() ? "text" : "password"}
                autocomplete="new-password"
                placeholder=""
                title="The password must be at least 10 characters long and contain at least one lowercase letter, uppercase letter and number."
                aria-describedby="password_requirements"
                // *** ************************************************* ***
                // placeholder="" Note that a blank placeholder will work for the css
                // that does not style the input field as invalid when it is empty.
                // placeholder="" but I am going to use a placeholder anyway.
                onInput={(e) => checkPwdValidity.setValidity(e.target)}
                onPointerDown={(e) => setPasswordFocusClass()}
                // *** ************************************************* ***
                // This pattern is an example of the
                // problem with chrome...see the README.md.
                // chrome changes this
                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\s]{10,}$"
                // to this
                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[A-Za-zds]{10,}$"
                // so I have to change it to this
                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d\\s]{10,}$"
                // *** ************************************************* ***
                // This pattern will enforce the rule that the password
                // is at least 10 characters long and contains
                // at least one lowercase letter, one uppercase letter.
                pattern={passwordPattern}
              />
              <label for="register_password">Password</label>
              <span
                class={passwordVisible() ? "hide" : "show"}
                onClick={() => setPasswordVisible(!passwordVisible())}
              >
                {passwordVisible() ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          <div class="form-control-wrapper">
            <div class="embedded-label-wrapper">
              <input
                id="register_password_confirmation"
                required
                type={passwordVisible() ? "text" : "password"}
                autocomplete="new-password"
                placeholder=""
                pattern={passwordPattern}
                title="The password must be at least 10 characters long and contain at least one lowercase letter, uppercase letter and number."
                aria-describedby="password_requirements"
                onInput={(e) => checkPwdValidity.setValidity(e.target)}
              />
              <label for="register_password_confirmation">
                Confirm Password
              </label>
              <span
                class={passwordVisible() ? "hide" : "show"}
                onClick={() => setPasswordVisible(!passwordVisible())}
              >
                {passwordVisible() ? "Hide" : "Show"}
              </span>
            </div>
            <p class={passwordsMatch().passwordMismatchClass}>
              {passwordsMatch().passwordMismatchMessage}
            </p>
            <p id="password_requirements">
              The password must be at least 10 characters in length and contain
              at least one upper case letter, one lower case letter and one
              number.
            </p>
            <button
              class="action-button"
              disabled={
                !checkPwdValidity.isInvalid() ||
                !passwordsMatch().passwordMismatchClass == "success-message"
              }
              onClick={(e) => {
                affectItemCaller(e, "add", "user_login", dataServer);
              }}
            >
              Sign Up
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );

  // *** Helper functions for the code above
  async function affectItemCaller(e, operation, item_type, dataServer) {
    // *** ************************************************* ***
    // *** This is crucially important to prevent the form from
    // ** being submitted and the page from being reloaded.
    //** This is a SPA after all. */
    e.preventDefault();
    // *** ************************************************* ***

    var sentData = {
      user_name: document.getElementById("register_user_name").value,
      password: document.getElementById("register_password").value,
      full_name: document.getElementById("register_full_name").value,
      display_name: document.getElementById("register_display_name").value,
      email_address: document.getElementById("register_email_address").value,
    };

    var returnedData = await affectItem(
      e,
      operation,
      item_type,
      sentData,
      dataServer
    );
    console.log("After affectItem Call");
    // TODO: replace the alert with a more user-friendly message
    // in the DOM, not an alert.
    if (returnedData.success) navigate("/account");
    else alert("Registration failed.");
  }

  function initValidityChecker(signal) {
    var valid = false;
    return {
      setValidity: function setValidity(input) {
        valid = input.checkValidity();
        signal()[input.id] = valid;
        formatInputFeedback(input);
        setUserFieldsValid(structuredClone(signal()));
      },

      isInvalid: function checkValidity() {
        return Object.values(signal()).filter((value) => !value).length == 0;
      },
    };

    // *** Helper functions for this function
    function formatInputFeedback(input) {
      formatPasswordFeedback(input);
      checkPasswordsMatch();

      // *** Helper functions for this function
      function formatPasswordFeedback(input) {
        if (document.querySelector(`.embedded-label-wrapper > #${input.id}`))
          // *** don't format the password fields spans
          // if the password fields are not visible
          return;

        var span = document.querySelector(
          `.separated-label-wrapper > #${input.id} + span`
        );
        if (!valid) {
          if (input.value.length > 0)
            span.innerHTML = -(input.minLength - input.value.length);
          else span.innerHTML = "";
        } else {
          span.innerHTML = "&#x2714;";
        }
      }
    }
  }

  function checkPasswordsMatch() {
    if (document.getElementById("register_password")) {
      var passwordMatch;
      if (document.getElementById("register_password_confirmation").value == "")
        passwordMatch = {
          passwordMismatchClass: "error-message",
          passwordMismatchMessage: "",
        };
      else {
        passwordMatch = {
          passwordMismatchClass:
            document.getElementById("register_password").value ===
            document.getElementById("register_password_confirmation").value
              ? "success-message"
              : "error-message",
          passwordMismatchMessage:
            document.getElementById("register_password").value ===
            document.getElementById("register_password_confirmation").value
              ? "Passwords match!"
              : "Passwords do not match.",
        };
        setPasswordsMatch(passwordMatch);
      }
    }
  }

  function setPasswordFocusClass() {
    var passwordFields = Array.from(
      document.querySelectorAll(`input[autocomplete="new-password"]`)
    );
    passwordFields.forEach((input) => {
      input.classList.add("password_focus");
    });
  }
}
