/** @jsxImportSource solid-js */
/* @refresh reload */
import "./CSS/index.css";

import { render } from "solid-js/web";
import { MetaProvider, Meta } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";

import { LifeHelperApp } from "./LifeHelperApp";
import { Filters } from "./Filters";
import { Views } from "./Views";
import { DataSource } from "./DataSource";
import { Header } from "./Header";
import { Account } from "./Account";
import { Login } from "./Login";
import { Register } from "./Register";
import { TaskStack } from "./TaskStack";
import { NotFound } from "./NotFound";

const root = document.getElementById("root");

import { GlobalStateProvider } from "./GlobalStateProvider";
import { logToConsole } from "./JS/helperFunctions";

logToConsole(`window.location.hostname is ${window.location.hostname}`);

// @ts-ignore
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => {
  return (
    <MetaProvider>
      <Meta name="description" content="Life Helper Objective Tracker" />
      <GlobalStateProvider>
        <Router root={Header}>
          <Route path="/" component={LifeHelperApp} />
          <Route path="/:viewType" component={LifeHelperApp} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/account" component={Account} />
          <Route path="/filters" component={Filters} />
          <Route path="/views" component={Views} />
          <Route path="/data_source" component={DataSource} />
          <Route path="/task_stack" component={TaskStack} />
          <Route path="*" component={NotFound} />
        </Router>
      </GlobalStateProvider>
    </MetaProvider>
  );
  // @ts-ignore
}, root);
