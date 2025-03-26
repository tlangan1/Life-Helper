import { For, Show } from "solid-js";

import { webPushList } from "./JS/index.js";

export function WebPushList(props) {
  return (
    <div>
      <h1>Web Push List</h1>
      <Show when={webPushList().length > 0}>
        <ul>
          <For each={webPushList()}>
            {(item) => (
              <li /* key={index of item} */>
                {`task with name(id) [${item.item_name}(${
                  item.item_id
                })] was ${conjugateVerb(item.update_type)}`}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );

  /* *** Helper functions *** */
  function conjugateVerb(verb) {
    switch (verb) {
      case "pause":
        return "paused";
      case "resume":
        return "resumed";
      case "restart":
        return "restarted";
      case "start":
        return "started";
      case "complete":
        return "completed";
      case "cancel_delete":
        return "canceled/deleted";
      default:
        return verb;
    }
  }
}
