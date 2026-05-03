import {
  createSignal,
  createContext,
  useContext,
  onCleanup,
  createEffect,
} from "solid-js";
import { fetchUserWorkingStatusToday } from "./JS/helperFunctions";

const GlobalStateContext = createContext();

console.log(
  `${window.location.hostname}:${parseInt(window.location.port) + 1}`,
);

export function GlobalStateProvider(props) {
  const USER_STATUS_POLL_MS = 30000;
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
    canceled_items: "no",
    sort: "item_name",
    direction: "asc",
  });

  var [itemsView, setItemsView] = createSignal("/");
  var [searchText, setSearchText] = createSignal("");

  var [dataSource, setDataSource] = createSignal("unknown");
  var [toastMessage, setToastMessage] = createSignal("");
  var [toastType, setToastType] = createSignal("error");
  let toastTimerID;
  let userStatusTimerID;
  let userStatusRequestPending = false;

  fetchDataSource();

  createEffect(() => {
    var currentUserLoginId = user().user_login_id;

    if (userStatusTimerID) {
      clearInterval(userStatusTimerID);
      userStatusTimerID = undefined;
    }

    if (!currentUserLoginId) return;

    refreshUserWorkingStatus();
    userStatusTimerID = setInterval(
      refreshUserWorkingStatus,
      USER_STATUS_POLL_MS,
    );
  });

  onCleanup(() => {
    if (toastTimerID) clearTimeout(toastTimerID);
    if (userStatusTimerID) clearInterval(userStatusTimerID);
  });

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
    searchText: searchText,
    setSearchText: setSearchText,
    showToast: showToast,
  };

  return (
    <GlobalStateContext.Provider value={globalState}>
      {props.children}
      {toastMessage() ? (
        <div
          class={`app-toast app-toast-${toastType()}`}
          role="status"
          aria-live="polite"
        >
          {toastMessage()}
        </div>
      ) : null}
    </GlobalStateContext.Provider>
  );
  /* *** Helper functions *** */

  function toggleRefreshData() {
    setRefreshData((refreshData() + 1) % 2);
  }

  async function fetchDataSource() {
    // *** This function checks if the server is pointing to the production
    // *** database, "life_helper" or the development database, "test_life_helper".
    // *** This is important because the production database contains
    // *** real user data such as my plans to enhance this application.
    // ***
    // *** the "get_item" part of the route is not actually used by the server
    // *** it consults the "data_source" portion only.
    var response = await fetch(
      dataServer + `/get_item/data_source`, // *** The route to check if the server is in production
    );
    if (!response.ok) {
      showToast(
        `Server Error: status is ${response.status} reason is ${response.statusText}`,
      );
    } else {
      var data = await response.json();
      setDataSource(data.dataSource);
    }
  }

  function showToast(message, type = "error") {
    setToastType(type);
    setToastMessage(message);

    if (toastTimerID) clearTimeout(toastTimerID);
    toastTimerID = setTimeout(() => {
      setToastMessage("");
    }, 5000);
  }

  async function refreshUserWorkingStatus() {
    if (!user().user_login_id || userStatusRequestPending) return;

    userStatusRequestPending = true;
    try {
      var response = await fetchUserWorkingStatusToday(dataServer, user);
      if (!response.ok) return;

      var responseData = await response.json();
      var userPatch = normalizeUserStatusPatch(responseData);
      if (Object.keys(userPatch).length == 0) return;

      setUser((previousUser) => ({
        ...previousUser,
        ...userPatch,
      }));
    } catch (error) {
      console.error("refreshUserWorkingStatus failed", error);
    } finally {
      userStatusRequestPending = false;
    }
  }

  function normalizeUserStatusPatch(responseData) {
    var firstRecord = Array.isArray(responseData)
      ? responseData[0]
      : responseData;
    if (!firstRecord || typeof firstRecord != "object") return {};

    var patch = {};

    if (Object.hasOwn(firstRecord, "user_working")) {
      patch.user_working =
        firstRecord.user_working === true ||
        firstRecord.user_working === 1 ||
        firstRecord.user_working === "1" ||
        firstRecord.user_working === "true";
    }

    if (Object.hasOwn(firstRecord, "elapsed_work_time")) {
      var elapsedHours = Number(firstRecord.elapsed_work_time);
      if (!Number.isNaN(elapsedHours)) patch.elapsed_work_time = elapsedHours;
    }

    if (
      !Object.hasOwn(patch, "elapsed_work_time") &&
      Object.hasOwn(firstRecord, "elapsed_daily_work_time")
    ) {
      var elapsedDailyHours = Number(firstRecord.elapsed_daily_work_time);
      if (!Number.isNaN(elapsedDailyHours)) {
        patch.elapsed_work_time = elapsedDailyHours;
      }
    }

    return patch;
  }
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
