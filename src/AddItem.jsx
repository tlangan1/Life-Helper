import "./CSS/AddItem.css";
import { Show } from "solid-js/web";
import { createEffect, createSignal } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

import { affectItem, capitalizeFirstLetter } from "./JS/helperFunctions";

export function AddItem(props) {
  var itemName;
  var itemDescription;
  var [addingItem, setAddingItem] = createSignal(false);
  var [savingItem, setSavingItem] = createSignal(false);
  var [AddExistingItem, setAddExistingItem] = createSignal(false);
  //   var indefiniteArticle = setAppropriateIndefiniteArticle;
  var { loggedIn, toggleRefreshData, user, dataServer, itemType } =
    useGlobalState();
  var minTextLength = 10;
  var maxTextLength = 50;
  var [descriptionLength, setDescriptionLength] = createSignal(0);
  createEffect(() => {
    if (addingItem()) document.querySelector("dialog").showModal();
  });

  return (
    <>
      <div class="add-item-buttons">
        <button
          class="action-button inline"
          title={`Click here to add a new ${itemType()}`}
          onClick={toggleAddingItem}
          disabled={!loggedIn()}
        >
          {`Add a new ${itemType()}`}
        </button>
        <Show when={itemType() != "objective"}>
          <button
            class="action-button inline"
            title={`Click here to add an existing ${itemType()}`}
            onClick={toggleAddingExistingItem}
            disabled={!loggedIn()}
          >
            {`Add an existing ${itemType()}`}
          </button>
        </Show>
      </div>
      <Show when={addingItem()}>
        <dialog class="popup">
          <label htmlFor="item_name" class="block">
            {capitalizeFirstLetter(itemType())} Name (Required):
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
            {capitalizeFirstLetter(itemType())} Description:
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
              disabled={descriptionLength() < minTextLength || savingItem()}
              onClick={(e) => {
                affectItemCaller(
                  "add",
                  itemType(),
                  {
                    parent_id: parentID(),
                    item_name: itemName.value,
                    item_description: itemDescription.value,
                    user_login_id: user().user_login_id,
                  },
                  dataServer
                );
              }}
            >
              Save this item
            </button>
            <button
              class="action-button"
              title="Click to cancel adding this item"
              onClick={toggleAddingItem}
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
          onClick={toggleAddingExistingItem}
        >
          Cancel
        </button>
      </Show>
    </>
  );

  /* *** Helper functions for code above *** */

  function toggleAddingItem() {
    setAddingItem(!addingItem());
    if (!addingItem()) {
      itemName.value = "";
      itemDescription.value = "";
      setDescriptionLength(0);
    }
  }

  function toggleSavingItem() {
    setSavingItem(!savingItem());
  }

  function toggleAddingExistingItem() {
    setAddExistingItem(!AddExistingItem());
  }

  // not used since I added the capability of linking to an existing goal/task
  //   function setAppropriateIndefiniteArticle() {
  //     // Cspell:ignore aeiou
  //     if (itemType[0].match(/[aeiou]/)) {
  //       return "an";
  //     } else {
  //       return "a";
  //     }
  //   }

  async function affectItemCaller(action, itemType, sentData, dataServer) {
    toggleSavingItem();
    try {
      var returnedData = await affectItem(
        action,
        itemType,
        sentData,
        dataServer
      );
      if (returnedData.success) {
        toggleAddingItem();
        toggleRefreshData();
      }
    } finally {
      toggleSavingItem();
    }
  }

  function parentID() {
    return props.parent().length == 0
      ? 0
      : props.parent()[props.parent().length - 1].item_id;
  }
}
