/** @jsxImportSource solid-js */
import "./Account.css";
import "./forms.css";

import { useGlobalState } from "./GlobalStateProvider";
import { AccountForm } from "./AccountForm";
import { Login } from "./Login";

export function Account(props) {
  var { loggedIn } = useGlobalState();
  return <div class="route">{loggedIn() ? <AccountForm /> : <Login />}</div>;
}
