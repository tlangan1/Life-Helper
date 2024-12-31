import "./AddItem.css";
import { Show } from "solid-js/web";
import { createEffect, createSignal } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

import { affectItem, capitalizeFirstLetter } from "./helperFunctions";

export function AddItem(props) {
  var itemName;
  var itemDescription;
  var [AddItem, setAddItem] = createSignal(false);
  var [AddExistingItem, setAddExistingItem] = createSignal(false);
  //   var indefiniteArticle = setAppropriateIndefiniteArticle;
  // *** dataServer is the URL of the server that provides the data.
  var { toggleRefreshData, dataServer } = useGlobalState();
  var minTextLength = 10;
  var maxTextLength = 50;
  var [descriptionLength, setDescriptionLength] = createSignal(0);
  createEffect(() => {
    if (AddItem()) document.querySelector("dialog").showModal();
  });

  return (
    <>
      <div class="add-item-buttons">
        <button
          class="action-button inline"
          title={`Click here to add a new ${props.item_type}`}
          onClick={toggleAddItem}
        >
          {`Add a new ${props.item_type}`}
        </button>
        <Show when={props.item_type != "objective"}>
          <button
            class="action-button inline"
            title={`Click here to add an existing ${props.item_type}`}
            onClick={toggleAddExistingItem}
          >
            {`Add an existing ${props.item_type}`}
          </button>
        </Show>
      </div>
      <Show when={AddItem()}>
        <dialog class="popup">
          <label htmlFor="item_name" class="block">
            {capitalizeFirstLetter(props.item_type)} Name (Required):
          </label>
          <input
            // The ref is used to get the value of the input field in the saveItem function.
            // item_name: itemName.value
            ref={itemName}
            type="text"
            name="item_name"
            id="item_name"
            minLength={minTextLength}
            maxLength={maxTextLength}
            onKeyUp={(e) => setDescriptionLength(e.target.value.length)}
            required
            autofocus
            size={maxTextLength}
            // pattern=".{10,50}"
          />
          <span></span>
          <span class="block">
            {descriptionLength() < minTextLength
              ? `${
                  minTextLength - descriptionLength()
                } more characters required`
              : `${
                  maxTextLength - descriptionLength()
                } more characters available`}
          </span>
          <label htmlFor="item_description" class="block">
            {capitalizeFirstLetter(props.item_type)} Description:
          </label>
          <textarea
            // The ref is used to get the value of the input field in the saveItem function.
            // item_description: itemDescription.value
            ref={itemDescription}
            name="item_description"
            id="item_description"
            rows="5"
            minLength={15}
          ></textarea>
          <div class="buttons">
            <button
              class="action-button save"
              title="Click to save this item"
              disabled={descriptionLength() < minTextLength}
              onClick={(e) =>
                saveItem(
                  e,
                  "add",
                  props.item_type,
                  {
                    parent_id: parentID(),
                    item_name: itemName.value,
                    item_description: itemDescription.value,
                  },
                  dataServer
                )
              }
            >
              Save this item
            </button>
            <button
              class="action-button"
              title="Click to cancel adding this item"
              onClick={toggleAddItem}
            >
              Cancel
            </button>
          </div>
        </dialog>
      </Show>
      <Show when={AddExistingItem()}>
        <p>Existing Item Popup</p>
        <button
          class="action-button"
          title="Click to cancel adding this item"
          onClick={toggleAddExistingItem}
        >
          Cancel
        </button>
      </Show>
    </>
  );

  /* *** Helper functions for code above *** */

  function toggleAddItem() {
    setAddItem(!AddItem());
    // if (AddItem()) {
    //   item_name.focus();
    // }
  }
  function toggleAddExistingItem() {
    setAddExistingItem(!AddExistingItem());
  }

  // not used since I added the capability of linking to an existing goal/task
  //   function setAppropriateIndefiniteArticle() {
  //     // Cspell:ignore aeiou
  //     if (props.item_type[0].match(/[aeiou]/)) {
  //       return "an";
  //     } else {
  //       return "a";
  //     }
  //   }

  function saveItem(e, operation, item_type, data, dataServer) {
    affectItemCaller(e, operation, item_type, data, dataServer);
    setAddItem(false);
  }

  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    await affectItem(e, operation, item_type, data, dataServer);
    toggleRefreshData();
  }

  function parentID() {
    return props.parent().length == 0
      ? 0
      : props.parent()[props.parent().length - 1].item_id;
  }
}
