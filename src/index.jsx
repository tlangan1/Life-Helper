/** @jsxImportSource solid-js */
/* @refresh reload */
import { render } from "solid-js/web";
import { MetaProvider, Meta } from "@solidjs/meta";

import LifeHelperApp from "./LifeHelperApp";

const root = document.getElementById("root");

import { GlobalStateProvider } from "./GlobalStateProvider";
import { createSignal } from "solid-js";

console.log("window.location.hostname = " + window.location.hostname);

// @ts-ignore
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => {
  var [itemType, setItemType] = createSignal("objective");
  return (
    <MetaProvider>
      <Meta name="description" content="Life Helper Objective Tracker" />
      <GlobalStateProvider>
        <LifeHelperApp itemType={itemType()} setItemType={setItemType} />
      </GlobalStateProvider>
    </MetaProvider>
  );
  // @ts-ignore
}, root);
