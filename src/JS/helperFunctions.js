"use strict";

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// The default format for MySQL dates is "YYYY-MM-DD HH:MM:SS".
export function reformatMySQLDate(inputDate) {
  var date = new Date(inputDate);
  if (!isNaN(date.getTime())) {
    // Months use 0 index.
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  }
}

export function logToConsole(message) {
  console.log(`${new Date().toLocaleString()}: ${message}`);
}

export function startedButNotCompletedCount(items) {
  return items().reduce((totalStarted, item) => {
    if (item.started_dtm && !item.completed_dtm) return totalStarted + 1;
    else return totalStarted;
  }, 0);
}

export function completedCount(items) {
  return items().reduce((totalStarted, item) => {
    if (item.completed_dtm) return totalStarted + 1;
    else return totalStarted;
  }, 0);
}

export function childItemType(parentType) {
  if (parentType == "objective") return "goal";
  else if (parentType == "goal") return "task";
  else return "task";
}

export async function login(sentData, setUser, dataServer) {
  //   var sentData = {
  //     user_name: loginUserID.value,
  //     password: loginPassword.value,
  //   };

  var result = await affectItem("check", "user_login", sentData, dataServer);

  var returnedData = result.data;

  if (result.success && returnedData) {
    returnedData.user_working == "true"
      ? (returnedData.user_working = true)
      : (returnedData.user_working = false);

    if (returnedData.success) {
      setUser(returnedData);
    }
  }

  return result;
}

export function fetchUserElapsedDailyWorkTime(user_login_id) {
  var data = {
    user_login_id: user_login_id,
  };

  var returnedData = affectItem("get", "user_daily_work_time", data);
  return returnedData;
}

export async function affectItem(action, itemType, payload, dataServer, user) {
  try {
    const endPoint = `/${action}/${itemType}`;
    const requestPayload = user
      ? { ...payload, user_login_id: user().user_login_id }
      : payload;
    const timeoutSignal =
      typeof AbortSignal !== "undefined" &&
      typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(15000)
        : undefined;

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: {
        "Content-Type": "application/json",
      },
      signal: timeoutSignal,
    };

    // send POST request
    const response = await fetch(dataServer + endPoint, options);
    const contentType = response.headers.get("content-type") || "";
    let responseData = null;
    let responseText = null;

    if (response.status !== 204) {
      if (contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseText = await response.text();
        if (responseText == "OK") {
          responseData = { success: true };
        }
      }
    }

    const payloadSuccess =
      typeof responseData?.success == "boolean"
        ? responseData.success
        : response.ok;
    const success = response.ok && payloadSuccess;

    return {
      success: success /*  tells you if the business operation succeeded */,
      ok: response.ok /* tells you if the network/protocol request succeeded */,
      status: response.status,
      data: responseData,
      text: responseText,
      error: success
        ? null
        : buildErrorMessage(response, responseData, responseText),
    };
  } catch (error) {
    return {
      success: false /*  tells you if the business operation succeeded */,
      ok: false /* tells you if the network/protocol request succeeded */,
      status: null,
      data: null,
      text: null,
      error:
        error?.name == "TimeoutError"
          ? "The request timed out. Please try again."
          : `An error occurred within the body of the \"affectItem\" function. Please try again. If the problem persists, contact the system administrator. The error message is ${error.message}`,
    };
  }
}

function buildErrorMessage(response, responseData, responseText) {
  if (responseData?.error) return responseData.error;
  if (responseData?.message) return responseData.message;
  if (responseText && responseText != "OK") return responseText;

  return `An error occurred with this request. Please try again. If the problem persists, contact the system administrator. The response status code is ${response.status}. ${response.statusText}`;
}

/* *** Preliminary Context Menu Stuff *** */
export function setupContextMenu() {
  document.onclick = hideMenu;
  document.oncontextmenu = rightClick;

  function hideMenu() {
    if (document.getElementById("contextMenu"))
      document.getElementById("contextMenu").classList.add("hide");
  }

  function rightClick(e) {
    e.preventDefault();

    if (!document.getElementById("contextMenu").classList.contains("hide"))
      hideMenu();
    else {
      let menu = document.getElementById("contextMenu");

      document.getElementById("contextMenu").classList.remove("hide");
      // These are the coordinates of the mouse click.
      // which can be used if the menu is absolute relative to the window
      //   menu.style.left = e.pageX + "px";
      //   menu.style.top = e.pageY + "px";
      // If the menu is relative to the parent element, use these coordinates
      menu.style.left = e.offsetX + "px";
      menu.style.top = e.offsetY + "px";
    }
  }
}

export function isolateItem(items, pushedItem) {
  var task = items().filter((item) => pushedItem.item_id == item.item_id);
  if (task.length > 0) {
    return task[0];
  }
}

export function addPasteOption(htmlElement) {
  var range /*, start, end */;

  document.addEventListener("selectionchange", (event) => {
    range = window.getSelection().getRangeAt(0);
    // start = window.getSelection().getRangeAt(0).startOffset;
    // end = window.getSelection().getRangeAt(0).endOffset;
  });

  //   document.getElementById("note_text").addEventListener("paste", (event) => {
  htmlElement.addEventListener("paste", (event) => {
    /* *** Important Note *** */
    // If you use the debugger here you will loose focus and the readText will not work
    /* *** Important Note *** */
    if (window.getSelection().toString()) {
      event.preventDefault();

      console.log("paste called from getSelection");
      let paste = (event.clipboardData || window.clipboardData).getData("text");
      doPaste(paste, event);
    }

    function isValidHttpUrl(string) {
      let url;

      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    }

    function doPaste(paste, event) {
      if (isValidHttpUrl(paste)) {
        var span = document.createElement("span");
        span.setAttribute("contenteditable", "false");
        var a = document.createElement("a");
        a.href = paste;
        a.title = paste;
        a.target = "_blank";
        range.surroundContents(a);
        range.surroundContents(span);
      }
    }
  });
}
