import "./CSS/Menu.css";
import { useGlobalState } from "./GlobalStateProvider";

export function AccountMenu(props) {
  var { setUser, filters, setFilters } = useGlobalState();
  return (
    <div class="menu">
      <a href="/account">Account</a>
      <a href="/data_source">Data Source</a>
      <a href="/task_stack">Task Stack</a>
      <a
        onClick={() => {
          setUser({});
          filters().assigned_to_me = false;
          setFilters(new Object(filters()));
        }}
        href="/"
      >
        Log Out
      </a>
    </div>
  );
}
