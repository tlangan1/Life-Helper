import "./CSS/Menu.css";
import { useGlobalState } from "./GlobalStateProvider";

export function AccountMenu(props) {
  var { setUser, filters, setFilters } = useGlobalState();
  return (
    <div class="menu">
      <a href="/account">Account</a>
      <a
        onClick={() => {
          setUser({});
          props.setAccountMenu(false);
          setFilters(delete filters().assigned_to_me);
        }}
        href="/"
      >
        Log Out
      </a>
    </div>
  );
}
