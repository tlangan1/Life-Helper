import { FindParentElement } from "./helperFunctions";

export function itemFromImport(
  item,
  props,
  setParent,
  parent,
  setRefreshData,
  refreshData
) {
  return (
    <li
      class="item"
      item_id={item.item_id}
      item_name={item.item_name}
      onDblClick={(e) => {
        if (props.type == "task") return;

        var parentLi = FindParentElement(e.target, "li");
        setParent(() => {
          parent().push({
            item_id: parentLi.attributes.item_id.value,
            item_name: parentLi.attributes.item_name.value,
          });

          return parent();
        });
        if (props.type == "objective") props.setter("goal");
        else if (props.type == "goal") props.setter("task");
        setRefreshData((refreshData() + 1) % 2);
      }}
    >
      {props.type == "task" ? (
        <input type="checkbox" class="toggle"></input>
      ) : (
        <input type="checkbox" class="toggle" disabled></input>
      )}
      <label>{item.item_name}</label>
      <button class="destroy" onClick={(e) => affectItem(e, "delete")} />
    </li>
  );
}
