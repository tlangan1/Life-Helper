import "./Account.css";
import { useGlobalState } from "./GlobalStateProvider";

export function AccountMenu(props) {
  var { setLoggedIn } = useGlobalState();
  return (
    <div class="account-menu">
      <a href="/account">Account</a>
      <a
        onClick={() => {
          setLoggedIn(false);
          props.setAccountMenu(false);
        }}
      >
        Log Out
      </a>
    </div>
  );
}
