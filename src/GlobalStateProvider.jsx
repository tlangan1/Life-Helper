/** @jsxImportSource solid-js */
import { createSignal, createContext, useContext } from "solid-js";

const GlobalStateContext = createContext();

export function GlobalStateProvider(props) {
  var [itemType, setItemType] = createSignal("objective");
  // *** refreshData is a signal that is used to initiate a data refresh
  // *** using the function fetchItems.
  // *** setRefreshData is used to toggle refreshData between 0 and 1.
  var [refreshData, setRefreshData] = createSignal(0);

  // *** parent contains an array of at most two objects.
  // *** It is essentially a stack that is used to navigate the hierarchy of objectives, goals and tasks.
  // *** Each object contains two properties: item_id and item_name.
  // *** 1) If the current view is the list of objectives then the array is empty.
  // *** 2) If the current view is a list of goals, then the array contains
  // ***    one object that identifies the objective with which the goals are associated.
  // *** 3) If the current view is a list of tasks, then the array contains two objects.
  // ***    The second object contains the goal to which the tasks are associated
  // ***    and the first object contains the objective to which that goal is associated.
  var [parent, setParent] = createSignal([]);

  var [filters, setFilters] = createSignal({
    completed_items: "no",
    started_items: "either",
    deleted_items: "no",
  });

  const globalState = {
    mode: "dev",
    itemType: itemType,
    parent: parent,
    setParent: setParent,
    setItemType: setItemType,
    refreshData: refreshData,
    toggleRefreshData: function toggleRefreshData() {
      setRefreshData((refreshData() + 1) % 2);
    },
    dataServer: "https://192.168.1.10:3001",
    filters: filters,
    setFilters: setFilters,
  };

  return (
    <GlobalStateContext.Provider value={globalState}>
      {props.children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
