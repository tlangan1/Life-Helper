import "./AddItem.css";
import { Portal, Show } from "solid-js/web";
import { createSignal } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

import { affectItem } from "./helperFunctions";

// <input
//   class="new-item"
//   onChange={(e) => {
//     affectItemCaller(
//       e,
//       "add",
//       parent().length == 0 ? 0 : parent()[parent().length - 1].item_id,
//       props.type,
//       dataServer
//     );
//   }}
//   placeholder={`Enter ${props.type}`}
//   autofocus={true}
// />;

export function AddItem(props) {
  var itemName;
  var itemDescription;
  var [AddItem, setAddItem] = createSignal(false);
  var indefiniteArticle = setAppropriateIndefiniteArticle;
  // *** dataServer is the URL of the server that provides the data.
  var [, , , toggleRefreshData, dataServer] = useGlobalState();

  return (
    <>
      <a
        title={`Click here to add ${indefiniteArticle()} ${props.item_type}`}
        onClick={toggleAddItem}
      >
        {`Add ${indefiniteArticle()} ${props.item_type}`}
      </a>
      <Show when={AddItem()}>
        <Portal mount={document.querySelector("body")}>
          <div class="popup">
            <p>
              {`parent_id is ${props.parent_id}`}
              <br />
              {`item_type is ${props.item_type}`}
              <br />
              {`dataServer is ${props.dataServer}`}
            </p>
            <label htmlFor="item_label"></label>
            <input
              ref={itemName}
              type="text"
              name="item_label"
              id="item_label"
            />
            <label htmlFor="item_description"></label>
            <textarea
              ref={itemDescription}
              name="item_description"
              id="item_description"
            ></textarea>
            <a
              title="Click to save this item"
              onClick={(e) =>
                saveItem(
                  e,
                  "add",
                  props.item_type,
                  {
                    parent_id: props.parent_id,
                    item_name: itemName.value,
                    item_description: itemDescription.value,
                  },
                  dataServer
                )
              }
            >
              Save this item
            </a>
          </div>
        </Portal>
      </Show>
    </>
  );

  /* *** Helper functions for code above *** */

  function toggleAddItem() {
    setAddItem(!AddItem());
  }

  function setAppropriateIndefiniteArticle() {
    // Cspell:ignore aeiou
    if (props.item_type[0].match(/[aeiou]/)) {
      return "an";
    } else {
      return "a";
    }
  }

  function saveItem(e, operation, item_type, data, dataServer) {
    affectItemCaller(e, operation, item_type, data, dataServer);
    setAddItem(false);
  }

  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    await affectItem(e, operation, item_type, data, dataServer);
    toggleRefreshData();
  }
}
