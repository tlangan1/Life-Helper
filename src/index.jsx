/** @jsxImportSource solid-js */
/* @refresh reload */
import "./CSS/index.css";

import { render } from "solid-js/web";
import { MetaProvider, Meta } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";

import { LifeHelperApp } from "./LifeHelperApp";
import { Filters } from "./Filters";
import { Header } from "./Header";
import { Account } from "./Account";
import { Login } from "./Login";
import { Register } from "./Register";
import { NotFound } from "./NotFound";

const root = document.getElementById("root");

import { GlobalStateProvider } from "./GlobalStateProvider";
import { logToConsole } from "./JS/helperFunctions";

logToConsole(`window.location.hostname is ${window.location.hostname}`);

import { sendMessage } from "./JS/index";

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
  return (
    <MetaProvider>
      <Meta name="description" content="Life Helper Objective Tracker" />
      <GlobalStateProvider>
        <Router root={Header}>
          <Route path="/" component={LifeHelperApp} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/account" component={Account} />
          <Route path="/filters" component={Filters} />
          <Route path="*" component={NotFound} />
        </Router>
      </GlobalStateProvider>
    </MetaProvider>
  );
  // @ts-ignore
}, root);
