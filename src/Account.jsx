/** @jsxImportSource solid-js */
import "./CSS/Account.css";
import "./CSS/forms.css";

import { useGlobalState } from "./GlobalStateProvider";
import { AccountForm } from "./AccountForm";
import { Login } from "./Login";

export function Account(props) {
  var { loggedIn } = useGlobalState();
  return <div class="route">{loggedIn() ? <AccountForm /> : <Login />}</div>;
}
