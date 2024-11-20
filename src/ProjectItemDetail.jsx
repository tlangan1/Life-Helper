// This is the code that was once in ProjectItem.jsx used to delete an item.
// {
//   <button
//     class="destroy"
//     onClick={(e) => {
//       affectItemCaller(
//         e,
//         "delete",
//         props.itemType,
//         { item_id: item.item_id },
//         dataServer
//       );
//     }}
//   />;
// }

// This is the code that was once in ProjectItem.jsx used to start a task.
// {
//   <div class="toggle">
//     {props.itemType == "task" ? (
//       <input
//         type="checkbox"
//         class="toggle"
//         onClick={(e) => {
//           affectItemCaller(
//             e,
//             "start",
//             props.itemType,
//             { item_id: item.item_id },
//             dataServer
//           );
//         }}
//         disabled={item.completed_dtm}
//         checked={item.started_dtm}
//       ></input>
//     ) : (
//       <input type="checkbox" class="toggle" disabled></input>
//     )}
//     <span class="hide">Start</span>
//   </div>;
// }

import { displayObjectKeysAndValues } from "./diagnostic";

import { useGlobalState } from "./GlobalStateProvider";
import { createResource, createSignal } from "solid-js";

export function ProjectItemDetail(props) {
  // *** The SolidJS resource item_details is used to store the details of the item
  // *** retrieved from the server depending on the type and id.
  console.log(
    `In ProjectItemDetail rendering props ${displayObjectKeysAndValues(props)}`
  );
  // *** dataServer is the URL of the server that provides the data.
  var [, , refreshData, toggleRefreshData, dataServer] = useGlobalState();
  const [refreshDetailData, setRefreshDetailData] = createSignal(0);
  const [itemDetails] = createResource(refreshDetailData, fetchItemDetails);
  //   setRefreshDetailData(1);

  return (
    <div id={props.item_id}>
      <h3>
        Product Item Detail for {props.item_type}
        with id = {props.item_id}
      </h3>
      <span>{itemDetails.loading && "Loading..."}</span>
      <span>{itemDetails.error && "Error"}</span>
      {itemDetails.state == "ready" && (
        <p>Description: {itemDetails()[0].item_description}</p>
      )}
    </div>
  );

  // *** Helper functions for the code above
  async function fetchItemDetails() {
    var searchParams = JSON.stringify({
      item_id: props.item_id,
    });

    var response = await fetch(
      dataServer + `/${props.itemType}s` + "?params=" + searchParams
    );
    if (!response.ok) {
      alert(
        `Server Error: status is ${response.status} reason is ${response.statusText}`
      );
    } else {
      var data = await response.json();
      return data;
    }
  }
}
