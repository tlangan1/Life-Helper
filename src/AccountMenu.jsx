import "./CSS/Menu.css";
import { useGlobalState } from "./GlobalStateProvider";

export function AccountMenu(props) {
  var { setUser, loggedIn, filters, setFilters } = useGlobalState();
  return (
    <div class="menu">
      <a href="/account">Account</a>
      <Show when={loggedIn()}>
        <a href="/thought_stack">Thought Stack</a>
        <a
          onClick={() => {
            setUser({});
            setFilters(new Object(filters()));
          }}
          href="/"
        >
          Log Out
        </a>
      </Show>
      <Show when={!loggedIn()}>
        <a href="/login">Log In</a>
      </Show>
    </div>
  );
}
