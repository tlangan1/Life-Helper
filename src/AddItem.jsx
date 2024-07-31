import { affectItem } from "./helperFunctions";

export function AddItem(props) {
  return (
    <input
      class="new-item"
      onChange={(e) => {
        affectItem(
          e,
          "add",
          props.parent().length == 0
            ? 0
            : props.parent()[props.parent().length - 1].item_id,
          props.type,
          props.dataServer,
          props.refreshData,
          props.setRefreshData
        );
      }}
      placeholder={`Enter ${props.type}`}
      autofocus={true}
    />
  );
}
