import "./CSS/Menu.css";
import { useGlobalState } from "./GlobalStateProvider";

export function AccountMenu(props) {
  var { setUser, filters, setFilters } = useGlobalState();
  return (
    <div class="menu">
      <a href="/account">Account</a>
      <a href="/data_source">Data Source</a>
      <a href="/thought_stack">Thought Stack</a>
      <a
        onClick={() => {
          setUser({});
          setFilters(new Object(filters()));
        }}
        href="/default-view"
      >
        Log Out
      </a>
    </div>
  );
}
