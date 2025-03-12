/** @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";
import { affectItem } from "./JS/helperFunctions";
import { useGlobalState } from "./GlobalStateProvider";
import { useNavigate } from "@solidjs/router";

export function Register(props) {
  var registerUserNameControlGroup;
  var registerPasswordControlGroup;
  var registerFullName;
  var registerDisplayName;
  var registerEmailAddress;
  var registerUserName;
  var registerPassword;
  var registerPasswordConfirmation;
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
    initControlGroupValidator(registerUserNameControlGroup, setUserFieldsValid);
    initControlGroupValidator(registerPasswordControlGroup, setPwdFieldsValid);
    function initControlGroupValidator(controlGroupRef, setter) {
      var validityObject = {};
      var inputs = controlGroupRef.querySelectorAll("input");
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
        <div
          ref={registerUserNameControlGroup}
          classList={{
            hidden: step() != "user name creation",
            register_login: true,
          }}
        >
          <div class="form-control-wrapper">
            <label for="register_full_name">
              Full Name (10-100 characters)
            </label>
            <div class="label-above-wrapper">
              <input
                ref={registerFullName}
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
            <div class="label-above-wrapper">
              <input
                ref={registerDisplayName}
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
            <div class="label-above-wrapper">
              <input
                ref={registerEmailAddress}
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
            {/* If you use this label the browser will not suggest an email address */}
            {/* It turns out that the mere presence of the work "Email" in the label */}
            {/* text is enough to elicit this behavior in thr browser */}
            {/* <label for="register_user_name">User Name</label> */}
            <div class="label-above-wrapper">
              <input
                ref={registerUserName}
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
        </div>
        <div
          ref={registerPasswordControlGroup}
          classList={{
            hidden: step() == "user name creation",
            register_login: true,
          }}
        >
          <div class="form-control-wrapper">
            <div class="embedded-label-wrapper">
              <input
                ref={registerPassword}
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
                ref={registerPasswordConfirmation}
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
              type="button"
              disabled={
                !checkPwdValidity.isInvalid() ||
                !passwordsMatch().passwordMismatchClass == "success-message"
              }
              onClick={(e) => {
                affectItemCaller("add", "user_login", dataServer);
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </section>
  );

  // *** Helper functions for the code above
  async function affectItemCaller(action, itemType, dataServer) {
    // *** ************************************************* ***
    // *** This is crucially important to prevent the form from
    // *** being submitted and the page from being reloaded.
    // *** This is a SPA after all. */
    // e.preventDefault();
    // *** However, by making the button type="button" this is
    // *** no longer necessary and the password manager
    // *** still behaves as desired.
    // ***
    // *** My hunch is that I could call e.preventDefault() when
    // *** the button is type="button" and it would have no
    // *** effect...everything would still work as desired.
    // *** ************************************************* ***

    var sentData = {
      user_name: registerUserName.value,
      password: registerPassword.value,
      full_name: registerFullName.value,
      display_name: registerDisplayName.value,
      email_address: registerEmailAddress.value,
    };

    var returnedData = await affectItem(action, itemType, sentData, dataServer);
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
      checkPasswordsMatch(registerPassword, registerPasswordConfirmation);

      // *** Helper functions for this function
      function formatPasswordFeedback(input) {
        if (document.querySelector(`.embedded-label-wrapper > #${input.id}`))
          // *** don't format the password fields spans
          // if the password fields are not visible
          return;

        var span = document.querySelector(
          `.label-above-wrapper > #${input.id} + span`
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

  function checkPasswordsMatch(password, confirmation) {
    if (password) {
      var passwordMatch;
      if (confirmation.value == "")
        passwordMatch = {
          passwordMismatchClass: "error-message",
          passwordMismatchMessage: "",
        };
      else {
        passwordMatch = {
          passwordMismatchClass:
            password.value === confirmation.value
              ? "success-message"
              : "error-message",
          passwordMismatchMessage:
            password.value === confirmation.value
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
