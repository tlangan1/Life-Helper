/** @jsxImportSource solid-js */

export function Login(props) {
  return (
    <div class="route">
      <div class="login">
        <form>
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="registration">
        <form>
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="reset-password">
        <form>
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
