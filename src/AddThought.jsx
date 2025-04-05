import "./CSS/AddNote.css";

import { createEffect, createSignal, onMount } from "solid-js";
import { Show } from "solid-js/web";

import { useGlobalState } from "./GlobalStateProvider";

import { affectItem, addPasteOption } from "./JS/helperFunctions";

export function AddThought(props) {
  var thoughtText;
  var hint;

  //   var [addingThought, setAddingThought] = createSignal(false);
  var [savingThought, setSavingThought] = createSignal(false);
  var { user, dataServer } = useGlobalState();
  createEffect(() => {
    if (props.addOrUpdateRequested())
      document.querySelector("dialog").showModal();
  });
  var [thoughtLength, setThoughtLength] = createSignal(0);
  var minTextLength = 15;
  var maxTextLength = 1000;

  var [showHint, setShowHint] = createSignal(false);

  createEffect(() => {
    if (["add", "update"].includes(props.addOrUpdateRequested())) {
      addPasteOption(thoughtText);
    }
  });

  return (
    <>
      <div>
        <button
          class="action-button"
          title="Click here to add a new thought"
          onClick={() => {
            props.setAddOrUpdateRequested("add");
            props.setThoughtToEdit({});
          }}
        >
          ✏️ Add a thought
        </button>
      </div>
      <Show when={["add", "update"].includes(props.addOrUpdateRequested())}>
        <dialog class="popup" onDblClick={(e) => e.stopPropagation()}>
          <div class="label-with-hint">
            <label htmlFor="note_text" class="block">
              Thought Text (Required):
            </label>
            <img
              ref={hint}
              src="lightbulb.svg"
              title="Highlight, right-mouse click and paste to insert hyperlink"
              onClick={() => setShowHint(!showHint())}
              alt="Hint"
            ></img>
          </div>
          <div
            ref={thoughtText}
            name="thought_text"
            id="thought_text"
            class="text-area-like"
            required
            autofocus
            innerHTML={
              props.addOrUpdateRequested() == "update"
                ? props.thoughtToEdit().thought
                : ""
            }
            minLength={minTextLength}
            maxLength={maxTextLength}
            onKeyUp={(e) => setThoughtLength(e.target.innerText.length)}
            contentEditable="true"
          ></div>
          <span class="block">
            {thoughtLength() < minTextLength
              ? `${minTextLength - thoughtLength()} more characters required`
              : `${maxTextLength - thoughtLength()} more characters available`}
          </span>
          <div>
            <button
              class="action-button"
              onClick={(e) => {
                affectItemCaller(
                  props.addOrUpdateRequested(),
                  "thought",
                  {
                    user_login_id: user().user_login_id,
                    thought_id:
                      props.addOrUpdateRequested() == "update"
                        ? props.thoughtToEdit().thought_id
                        : null,
                    thought: thoughtText.innerHTML,
                    update_type: props.addOrUpdateRequested(),
                  },
                  dataServer
                );
              }}
              disabled={thoughtLength() < minTextLength || savingThought()}
            >
              Save Thought
            </button>
            <button
              class="action-button"
              onClick={() => {
                props.setAddOrUpdateRequested(false);
              }}
            >
              Cancel
            </button>
            <Show when={showHint()}>
              <div class="hint">
                Highlight, right-mouse click and paste to insert hyperlink
              </div>
            </Show>
          </div>
        </dialog>
      </Show>
    </>
  );

  // Disable the button while in the process of adding or updating a thought
  function toggleSavingThought() {
    setSavingThought(!savingThought());
  }

  async function affectItemCaller(action, itemType, sentData, dataServer) {
    toggleSavingThought();
    try {
      var returnedData = await affectItem(
        action,
        itemType,
        sentData,
        dataServer
      );
      if (returnedData.success) {
        props.setAddOrUpdateRequested(false);
      }
    } finally {
      props.toggleRefreshThoughts();
      toggleSavingThought();
    }
  }
}
