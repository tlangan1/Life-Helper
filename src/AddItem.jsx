import "./AddItem.css";
import { Portal, Show } from "solid-js/web";
import { createSignal } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

import { affectItem, capitalizeFirstLetter } from "./helperFunctions";

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
  var [AddExistingItem, setAddExistingItem] = createSignal(false);
  //   var indefiniteArticle = setAppropriateIndefiniteArticle;
  // *** dataServer is the URL of the server that provides the data.
  var { toggleRefreshData, dataServer } = useGlobalState();

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
        <Portal mount={document.querySelector("body")}>
          <div class="popup-wrapper">
            <div class="popup">
              <p>
                {`parent_id is ${props.parent_id}`}
                <br />
                {`item_type is ${props.item_type}`}
                <br />
                {`dataServer is ${props.dataServer}`}
              </p>
              <label htmlFor="item_label">
                {capitalizeFirstLetter(props.item_type)} Name:
              </label>
              <input
                ref={itemName}
                type="text"
                name="item_label"
                id="item_label"
                minLength="10"
                maxLength="25"
                onKeyUp={updateCharacterCount}
              />
              <span>10 to 25 characters required:</span>
              <label htmlFor="item_description">
                {capitalizeFirstLetter(props.item_type)} Description:
              </label>
              <textarea
                ref={itemDescription}
                name="item_description"
                id="item_description"
              ></textarea>
              <div class="buttons">
                <button
                  class="action-button"
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
                </button>
                <button
                  class="action-button"
                  title="Click to cancel adding this item"
                  onClick={toggleAddItem}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Portal>
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

  function updateCharacterCount(e) {
    var itemValue = e.target.value;
    var itemSpan = e.target.nextElementSibling;
    var originalColor = window.getComputedStyle(itemSpan)["color"];

    if (itemValue.length < e.target.minLength) {
      itemSpan.style.color = "red";
      itemSpan.innerText = `${
        e.target.minLength - itemValue.length
      } more characters required`;
    } else {
      itemSpan.style.color = "";
      itemSpan.innerText = `${
        e.target.maxLength - itemValue.length
      } characters left`;
    }
  }
}
