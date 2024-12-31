"use strict";

// This function simply finds a DOM parent of type parentType
// It has nothing to do with the parent() signal in LifeHelperApp.jsx
// As of 2024-12-13, this function is not used in the codebase.
// export function FindParentElement(currentElement, parentType) {
//   if (currentElement.localName == parentType) return currentElement;
//   else return FindParentElement(currentElement.parentElement, parentType);
// }

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export async function affectItem(evt, affectType, item_type, data, dataServer) {
  var item;
  var endPoint;

  // TODO: test this error handling to make sure it works.
  try {
    switch (affectType) {
      case "add":
        // item = {
        //   parent_id: data.parent_id,
        //   // TODO: replace evt with data
        //   name: data.item_name,
        //   description: data.item_description, // TODO create a description control
        // };
        item = data;
        endPoint = `/${affectType}/${item_type}`;
        break;
      case "start":
      case "complete":
        item = {
          task_id: data.item_id,
        };
        endPoint = `/${affectType}`;
        break;
      case "update":
        item = {
          // TODO: replace evt with data
          name: evt.target.value,
          // TODO: replace evt with data
          item_id: evt.target.attributes.item_id.value,
          description: `This is a description of a ${item_type}`, // TODO create a description control
        };
        break;
      case "cancel_delete":
        item = {
          item_type: item_type,
          item_id: data.item_id,
        };
        endPoint = `/${affectType}`;
        break;
      default:
        alert(`Invalid affectType "${affectType}" in function affectItem!`);
        return false;
    }

    // request options
    const options = {
      method: "POST",
      body: JSON.stringify(item),
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
