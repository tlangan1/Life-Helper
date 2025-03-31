import "./CSS/AddNote.css";

import { createEffect, createSignal, onMount } from "solid-js";
import { Show } from "solid-js/web";

import { useGlobalState } from "./GlobalStateProvider";

import { affectItem } from "./JS/helperFunctions";

export function AddNote(props) {
  var noteText;
  var hint;

  var [addingNote, setAddingNote] = createSignal(false);
  var [savingNote, setSavingNote] = createSignal(false);
  var { loggedIn, dataServer, itemType } = useGlobalState();
  createEffect(() => {
    if (addingNote()) document.querySelector("dialog").showModal();
  });
  var [noteLength, setNoteLength] = createSignal(0);
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
    if (addingNote()) {
      addPasteOption();
    }
  });

  return (
    <>
      <div class="add-note-buttons">
        <button
          class="action-button"
          title="Click here to add a new note"
          onClick={toggleAddingNote}
          disabled={!loggedIn()}
        >
          ✏️ Add a note
        </button>
      </div>
      <Show when={addingNote()}>
        <dialog class="popup">
          <div class="label-with-hint">
            <label htmlFor="note_text" class="block">
              Note Text (Required):
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
            ref={noteText}
            name="note_text"
            id="note_text"
            class="text-area-like"
            required
            autofocus
            minLength={minTextLength}
            maxLength={maxTextLength}
            onKeyUp={(e) => setNoteLength(e.target.innerText.length)}
            contentEditable="true"
          ></div>
          <span class="block">
            {noteLength() < minTextLength
              ? `${minTextLength - noteLength()} more characters required`
              : `${maxTextLength - noteLength()} more characters available`}
          </span>
          <div>
            <button
              class="action-button"
              onClick={(e) => {
                affectItemCaller(
                  "add",
                  "note",
                  {
                    item_type: itemType(),
                    parent_id: props.item().item_id,
                    note_text: noteText.innerHTML,
                  },
                  dataServer
                );
              }}
              disabled={noteLength() < minTextLength || savingNote()}
            >
              Save Note
            </button>
            <button class="action-button" onClick={toggleAddingNote}>
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
    document.getElementById("note_text").addEventListener("paste", (event) => {
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

  function toggleAddingNote() {
    setAddingNote(!addingNote());
    if (!addingNote()) {
      noteText.value = "";
      setNoteLength(0);
    }
  }

  function toggleSavingNote() {
    setSavingNote(!savingNote());
  }

  async function affectItemCaller(action, itemType, sentData, dataServer) {
    toggleSavingNote();
    try {
      var returnedData = await affectItem(
        action,
        itemType,
        sentData,
        dataServer
      );
      if (returnedData.success) {
        toggleAddingNote();
        props.toggleRefreshNotes();
      }
    } finally {
      toggleSavingNote();
    }
  }
}
