import { createSignal, createContext, useContext } from "solid-js";

const GlobalStateContext = createContext();

export function GlobalStateProvider(props) {
  const [count, setCount] = createSignal(props.count || 0);
  const globalState = [
    count,
    {
      increment() {
        setCount((c) => c + 1);
      },
      decrement() {
        setCount((c) => c - 1);
      },
    },
    // Only relevant change 7/21/2024
    // "https://192.168.1.10:3001",
    // "https://192.168.1.159:3001",
    `${window.location.protocol}//${window.location.hostname}:3001`,
  ];

  return (
    <GlobalStateContext.Provider value={globalState}>
      {props.children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
