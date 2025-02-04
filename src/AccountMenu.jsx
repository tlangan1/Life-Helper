import "./CSS/Account.css";
import { useGlobalState } from "./GlobalStateProvider";

export function AccountMenu(props) {
  var { setLoggedIn, setUser } = useGlobalState();
  return (
    <div class="account-menu">
      <a href="/account">Account</a>
      <a
        onClick={() => {
          setLoggedIn(false);
          setUser({});
          props.setAccountMenu(false);
        }}
      >
        Log Out
      </a>
    </div>
  );
}
