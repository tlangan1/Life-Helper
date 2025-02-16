"use strict";

var affectTypes = new Set([
  "add",
  "pause",
  "start",
  "complete",
  "cancel_delete",
  "update",
  "check",
]);

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

export async function affectItem(affectType, itemType, data, dataServer, user) {
  var endPoint;

  try {
    if (!affectTypes.has(affectType)) {
      return { success: false };
    }
    endPoint = `/${affectType}/${itemType}`;

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
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
