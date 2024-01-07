// This function simply finds a DOM parent of type parentType
// It has nothing to do with the parent() signal in LifeHelperApp.jsx
export function FindParentElement(currentElement, parentType) {
  if (currentElement.localName == parentType) return currentElement;
  else return FindParentElement(currentElement.parentElement, parentType);
}

export async function affectItem(
  evt,
  affectType,
  item_id,
  item_type,
  dataServer,
  refreshData,
  setRefreshData
) {
  // body data
  var item;
  var endPoint;

  switch (affectType) {
    case "add":
      item = {
        parent_id: item_id,
        name: evt.target.value,
        description: `This is a description of a ${item_type}`, // TODO create a description control
      };
      endPoint = `/${affectType}/${item_type}`;
      break;
    case "start":
      item = {
        task_id: item_id,
      };
      endPoint = `/${affectType}`;
      break;
    case "update":
      item = {
        name: evt.target.value,
        item_id: evt.target.attributes.item_id.value,
        description: `This is a description of a ${item_type}`, // TODO create a description control
      };
      break;
    case "delete":
      var parentLi = FindParentElement(evt.target, "li");
      item = {
        item_id: parentLi.attributes.item_id.value,
      };
      endPoint = `/${affectType}/${item_type}`;
      break;
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
      `Server Error: status is ${response.status} reason is ${response.statusText}`
    );
    return false;
  } else {
    evt.target.value = "";
    setRefreshData((refreshData() + 1) % 2);
    return true;
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
