import { Show } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

export function OptionsMenu(props) {
  var { loggedIn } = useGlobalState();
  return (
    <div class="menu">
      <a href="/filters">Filters</a>
      <Show when={loggedIn()}>
        <a href="/views">Views</a>
      </Show>
    </div>
  );
}
