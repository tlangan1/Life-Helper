import { Portal } from "solid-js/web";

{
  /* <input
  class="new-item"
  onChange={(e) => {
    affectItem(
      e,
      "add",
      parent().length == 0 ? 0 : parent()[parent().length - 1].item_id,
      props.type,
      dataServer,
      refreshData,
      setRefreshData
    );
  }}
  placeholder={`Enter ${props.type}`}
  autofocus={true}
/>; */
}

export function AddItem(props) {
  return (
    <Portal>
      <label htmlFor="item_label"></label>
      <input type="text" name="item_label" id="" />
      <label htmlFor="item_description"></label>
      <textarea name="item_description" id=""></textarea>
    </Portal>
  );
}
