import { For, Show } from "solid-js";

import { webPushList } from "./JS/index.js";

export function WebPushList(props) {
  return (
    <div>
      <h1>Web Push List</h1>
      <Show when={webPushList().length > 0}>
        <ul>
          <For each={webPushList()}>
            {(item) => <li /* key={index of item} */>{item.message}</li>}
          </For>
        </ul>
      </Show>
    </div>
  );
}
