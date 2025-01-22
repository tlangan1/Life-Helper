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
          <label for="login_user_name_or_email">User Name or Email</label>
          <input
            id="login_user_name_or_email"
            required
            type="text"
            autocomplete="current username"
            placeholder="user name or email address"
            title="Enter your user name or email address."
            minLength="10"
            maxLength="30"
          />
          <label for="login_password">Password</label>
          <input
            id="login_password"
            autocomplete="current-password"
            required
            // *** ************************************************* ***
            // placeholder="" Note that a blank placeholder will work for the css
            // that does not style the input field as invalid when it is empty.
            // placeholder=""
            // But I am going to use a placeholder to show the pattern
            placeholder="password"
          />
        </fieldset>
      </form>
      <button class="action-button">Login</button>
    </section>
  );
}
