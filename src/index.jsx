/** @jsxImportSource solid-js */
/* @refresh reload */
import "./index.css";

import { render } from "solid-js/web";
import { MetaProvider, Meta } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";

import { LifeHelperApp } from "./LifeHelperApp";
import { Filters } from "./Filters";
import { Header } from "./Header";
import { Login } from "./Login";
import { NotFound } from "./NotFound";

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

const Other = (props) => (
  <>
    <h1>The other page</h1>
    {props.children}
  </>
);

render(() => {
  var [itemType, setItemType] = createSignal("objective");
  return (
    <MetaProvider>
      <Meta name="description" content="Life Helper Objective Tracker" />
      <GlobalStateProvider>
        <Router root={Header}>
          <Route path="/" component={LifeHelperApp} />
          <Route path="/account" component={Login} />
          <Route path="/filters" component={Filters} />
          <Route path="*" component={NotFound} />
        </Router>
      </GlobalStateProvider>
    </MetaProvider>
  );
  // @ts-ignore
}, root);
