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

  var returnedData = await affectItem(
    "check",
    "user_login",
    sentData,
    dataServer
  );

  if (returnedData.success) {
    setUser(returnedData);
  } else {
    // TODO: Enhance this code. Use the DOM to display the error message.
    alert("Login failed. Please try again.");
  }
}

export async function affectItem(action, itemType, data, dataServer, user) {
  var endPoint;

  try {
    endPoint = `/${action}/${itemType}`;

    if (user) data.user_login_id = user().user_login_id;

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      //   signal: AbortSignal.timeout(15000),
    };

    // send POST request
    var response = await fetch(dataServer + endPoint, options);
    var contentType = response.headers.get("content-type");
    var data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text(); // Handle non-JSON response
      if (data == "OK") {
        data = { success: true };
      }
    }
    if (!response.ok) {
      alert(
        `An error occurred with this request. Please try again. If the problem persists, contact the system administrator. The response status code is ${response.status}. ${response.statusText}`
      );
      return data;
    } else {
      return data;
    }
  } catch (error) {
    alert(
      `An error occurred within the body of the "affectItem" function. Please try again. If the problem persists, contact the system administrator. The error message is ${error.message}`
    );

    return { success: false };
  }
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
