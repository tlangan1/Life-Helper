"use strict";

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

export async function affectItem(evt, affectType, item_type, data, dataServer) {
  var endPoint;

  try {
    switch (affectType) {
      case "add":
      case "pause":
      case "start":
      case "complete":
      case "cancel_delete":
      case "update":
      case "check":
        endPoint = `/${affectType}/${item_type}`;
        break;
      default:
        alert(
          `Invalid route "/${affectType}/${item_type}" in function affectItem!`
        );
        return false;
    }

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

    if (!response.ok) {
      alert(
        `An error occurred with this request. Please try again. If the problem persists, contact the system administrator. The response status code is ${response.status}. ${response.statusText}`
      );
      return false;
    } else {
      evt.target.value = "";
      return true;
    }
  } catch (error) {
    alert(
      `An error occurred within the body of the "affectItem" function. Please try again. If the problem persists, contact the system administrator. The error message is ${error.message}`
    );
    return false;
  }
}
