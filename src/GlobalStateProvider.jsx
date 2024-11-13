import { createSignal, createContext, useContext } from "solid-js";

const GlobalStateContext = createContext();

export function GlobalStateProvider(props) {
  const [count, setCount] = createSignal(props.count || 0);
  // *** refreshData is a signal that is used to initiate a data refresh
  // *** using the function fetchItems.
  // *** setRefreshData is used to toggle refreshData between 0 and 1.
  var [refreshData, setRefreshData] = createSignal(0);

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
    refreshData,
    function toggleRefreshData() {
      setRefreshData((refreshData() + 1) % 2);
    },
    "https://192.168.1.159:3001",
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
