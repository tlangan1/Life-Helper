/** @jsxImportSource solid-js */

export function Login(props) {
  return (
    <section class="route">
      <h2>
        Log In or{" "}
        <a href="/register" class="navlink">
          Sign Up Here
        </a>
      </h2>

      <form id="formLogin">
        <fieldset>
          <label for="login_user_id">User ID</label>
          <input
            id="login_user_id"
            required
            type="text"
            autocomplete="current username"
            placeholder="user ID"
            title="Enter your ID."
            minLength="10"
            maxLength="30"
          />
          <div class="password-wrapper">
            <label for="login_password">Password</label>
            <input
              id="login_password"
              required
              type="password"
              autocomplete="current-password"
              // *** ************************************************* ***
              // placeholder="" can be used for the css that prevents
              // the input field from being invalid when a placeholder
              // is present.
              placeholder=""
              title="The password must be at least 10 characters long and contain at least one lowercase letter, uppercase letter and number."
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\s]{10,}$"
            />
            <span class="show">Show</span>
          </div>
        </fieldset>
      </form>
      <button class="action-button">Login</button>
    </section>
  );
}
