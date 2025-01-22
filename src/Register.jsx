/** @jsxImportSource solid-js */
import { createEffect, createSignal } from "solid-js";
import { affectItem } from "./helperFunctions";
import { useGlobalState } from "./GlobalStateProvider";

export function Register(props) {
  var [step, setStep] = createSignal("user name creation");
  var { dataServer } = useGlobalState();
  var [validCount, setValidCount] = createSignal(0);
  createEffect(checkValidityCount);

  return (
    <section class="route">
      <h2>Register</h2>

      <form id="formRegister" onSubmit={(e) => e.preventDefault()}>
        <fieldset
          id="register_user_name_creation"
          classList={{
            hidden: step() != "user name creation",
          }}
        >
          <label for="register_full_name">Full Name</label>
          <input
            id="register_full_name"
            required
            type="text"
            autocomplete="name"
            placeholder="full name"
            title="Enter your full name."
            minLength="10"
            maxLength="100"
            onChange={(e) =>
              e.target.parentElement.checkValidity
                ? setValidCount(validCount() + 1)
                : setValidCount(validCount() - 1)
            }
          />
          <span></span>
          <label for="register_display_name">Display Name</label>
          <input
            id="register_display_name"
            required
            type="text"
            autocomplete="given-name"
            placeholder="display name"
            title="Enter the name you want to be called by."
            minLength="1"
            maxLength="30"
            onChange={(e) =>
              e.target.parentElement.checkValidity
                ? setValidCount(validCount() + 1)
                : setValidCount(validCount() - 1)
            }
          />
          <span></span>
          <label for="register_user_name_or_email">User Name or Email</label>
          <input
            id="register_user_name_or_email"
            required
            type="text"
            autocomplete="new username"
            placeholder="user name or email address"
            title="Enter a user name or email address."
            aria-describedby="Enter a user name or email address."
            minLength="10"
            maxLength="30"
            onChange={(e) =>
              e.target.parentElement.checkValidity
                ? setValidCount(validCount() + 1)
                : setValidCount(validCount() - 1)
            }
          />
          <span></span>
          <button
            class="action-button"
            disabled="true"
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
          <label for="register_password">Password</label>
          <input
            id="register_password"
            required
            type="text"
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
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d\\s]{10,}$"
            title="The password must be at least 10 characters long and contain at least one lowercase letter, uppercase letter and number."
            aria-describedby="[id of element that describes the password requirements]"
            // *** ************************************************* ***
            // placeholder="" Note that a blank placeholder will work for the css
            // that does not style the input field as invalid when it is empty.
            // placeholder="" but I am going to use a placeholder anyway.
            placeholder="password"
          />
          <label for="register_password_confirmation">Confirm Password</label>
          <input
            id="register_password_confirmation"
            required
            autocomplete="new-password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d\\s]{10,}$"
            title="The password must be at least 10 characters long and contain at least one lowercase letter, uppercase letter and number."
            aria-describedby="[id of element that describes the password requirements]"
            placeholder="password"
          />
          <p>
            The password must be at least 10 characters in length and contain at
            least one upper case letter, one lower case letter and one number.
          </p>
          <a href="/account">
            <button
              class="action-button"
              onClick={(e) => {
                affectItemCaller(e, "add", "user_login", dataServer);
              }}
            >
              Sign Up
            </button>
          </a>
        </fieldset>
      </form>
    </section>
  );

  // *** Helper functions for the code above
  async function affectItemCaller(e, operation, item_type, dataServer) {
    var data = {
      user_name: document.getElementById("register_user_name_or_email").value,
      password: document.getElementById("register_password").value,
      full_name: document.getElementById("register_full_name").value,
      display_name: document.getElementById("display_name").value,
    };

    var success = await affectItem(e, operation, item_type, data, dataServer);
    // TODO: Add code to handle the success or failure of the request.
    // if (success) {
    //   history.pushState({}, "", "./");
    // }
  }

  function checkValidity(e) {
    Array.from(e.target.parentElement.querySelectorAll("input")).filter(
      (input) => {
        return !input.checkValidity();
      }
    ).length == 0
      ? (e.target.parentElement.querySelector("button").disabled = false)
      : (e.target.parentElement.querySelector("button").disabled = true);
  }

  function checkValidityCount() {
    validCount() == 3
      ? (document
          .getElementById("register_user_name_creation")
          .querySelector("button").disabled = false)
      : (document
          .getElementById("register_user_name_creation")
          .querySelector("button").disabled = true);
  }
}
