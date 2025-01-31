export function ActionButton(props) {
  return (
    <button
      class="action-button"
      onClick={props.action}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

/* *** When the button is clicked it should remain disabled *** */
/* *** until the action is complete. *** */
