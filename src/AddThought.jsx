import "./CSS/AddNote.css";

import { createEffect, createSignal, onMount } from "solid-js";
import { Show } from "solid-js/web";

import { useGlobalState } from "./GlobalStateProvider";

import { affectItem } from "./JS/helperFunctions";

export function AddThought(props) {
  var thoughtText;
  var hint;

  var [addingThought, setAddingThought] = createSignal(false);
  var [savingThought, setSavingThought] = createSignal(false);
  var { loggedIn, dataServer, itemType } = useGlobalState();
  createEffect(() => {
    if (addingThought()) document.querySelector("dialog").showModal();
  });
  var [thoughtLength, setThoughtLength] = createSignal(0);
  var minTextLength = 15;
  var maxTextLength = 1000;

  var [showHint, setShowHint] = createSignal(false);

  var range, start, end;

  document.addEventListener("selectionchange", (event) => {
    range = window.getSelection().getRangeAt(0);
    start = window.getSelection().getRangeAt(0).startOffset;
    end = window.getSelection().getRangeAt(0).endOffset;
  });

  createEffect(() => {
    if (addingThought()) {
      addPasteOption();
    }
  });

  return (
    <>
      <div>
        <button
          class="action-button"
          title="Click here to add a new thought"
          onClick={toggleAddingThought}
        >
          ✏️ Add a thought
        </button>
      </div>
      <Show when={addingThought()}>
        <dialog class="popup">
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
                  "add",
                  "thought",
                  {
                    thought_text: thoughtText.innerHTML,
                  },
                  dataServer
                );
              }}
              disabled={thoughtLength() < minTextLength || savingThought()}
            >
              Save Thought
            </button>
            <button class="action-button" onClick={toggleAddingThought}>
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

  function addPasteOption() {
    document
      .getElementById("thought_text")
      .addEventListener("paste", (event) => {
        event.preventDefault();
        /* *** Important Note *** */
        // If you use the debugger here you will loose focus and the readText will not work
        /* *** Important Note *** */
        navigator.clipboard.readText().then((clipText) => {
          console.log(clipText);
          doPaste(clipText, event);
        });
        if (window.getSelection().toString()) {
          let paste = (event.clipboardData || window.clipboardData).getData(
            "text"
          );
          doPaste(paste, event);
        }

        function isValidHttpUrl(string) {
          let url;

          try {
            url = new URL(string);
          } catch (_) {
            return false;
          }

          return url.protocol === "http:" || url.protocol === "https:";
        }

        function doPaste(paste, event) {
          if (isValidHttpUrl(paste)) {
            var span = document.createElement("span");
            span.setAttribute("contenteditable", "false");
            var a = document.createElement("a");
            a.href = paste;
            a.title = paste;
            a.target = "_blank";
            range.surroundContents(a);
            range.surroundContents(span);
          }
        }
      });
  }

  function toggleAddingThought() {
    setAddingThought(!addingThought());
    if (!addingThought()) {
      thoughtText.value = "";
      setThoughtLength(0);
    }
  }

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
        toggleAddingThought();
        props.toggleRefreshThoughts();
      }
    } finally {
      toggleSavingThought();
    }
  }
}
