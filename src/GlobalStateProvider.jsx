/** @jsxImportSource solid-js */
import {
  createSignal,
  createContext,
  useContext,
  createEffect,
} from "solid-js";

const GlobalStateContext = createContext();

console.log(
  `${window.location.hostname}:${parseInt(window.location.port) + 1}`
);

export function GlobalStateProvider(props) {
  var dataServer = `https://${window.location.hostname}:${
    parseInt(window.location.port) + 1
  }`;
  //   var dataServer = "https://192.168.1.159:3001";
  var [user, setUser] = createSignal({});
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
    sort: "item_name",
    direction: "asc",
  });

  var [itemsView, setItemsView] = createSignal("/");

  var [dataSource, setDataSource] = createSignal("unknown");

  fetchDataSource();

  const globalState = {
    user: user,
    setUser: setUser,
    loggedIn: function loggedIn() {
      return Object.keys(user()).length > 0;
    },
    passwordPattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{10,}$",
    itemType: itemType,
    parent: parent,
    setParent: setParent,
    setItemType: setItemType,
    refreshData: refreshData,
    toggleRefreshData: toggleRefreshData,
    dataServer: dataServer,
    dataSource: dataSource,
    filters: filters,
    setFilters: setFilters,
    mode: "dev",
    // *** The last view the user used to display the items.
    // *** As of 3/5/2025 there are only two views:
    // *** the default view "/" and the my-tasks view "/my-tasks-view".
    itemsView: itemsView,
    setItemsView: setItemsView,
  };

  return (
    <GlobalStateContext.Provider value={globalState}>
      {props.children}
    </GlobalStateContext.Provider>
  );
  /* *** Helper functions *** */

  function toggleRefreshData() {
    setRefreshData((refreshData() + 1) % 2);
  }

  async function fetchDataSource() {
    var response = await fetch(
      dataServer + `/data_source` // *** The route to check if the server is in production
    );
    if (!response.ok) {
      alert(
        `Server Error: status is ${response.status} reason is ${response.statusText}`
      );
    } else {
      var data = await response.json();
      setDataSource(data.dataSource);
    }
  }
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
