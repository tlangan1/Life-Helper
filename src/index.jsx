/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import LifeHelperApp from "./LifeHelperApp";

const root = document.getElementById("root");

import { GlobalStateProvider } from "./GlobalStateProvider";
import { createSignal } from "solid-js";

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => {
  var [itemType, setItemType] = createSignal("objective");
  return (
    <GlobalStateProvider>
      <LifeHelperApp type={itemType()} setter={setItemType} />
    </GlobalStateProvider>
  );
}, root);
