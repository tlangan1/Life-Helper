/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import LifeHelperApp from "./LifeHelperApp";

const root = document.getElementById("root");

import { GlobalStateProvider } from "./GlobalStateProvider";

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <GlobalStateProvider count={1}>
      <LifeHelperApp />
    </GlobalStateProvider>
  ),
  root
);
