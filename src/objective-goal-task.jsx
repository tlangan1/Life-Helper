import { FindParentElement } from "./helperFunctions";
import { affectItem } from "./helperFunctions";

export function itemFromImport(
  item /* used in LifeHelperApp */,
  props /* used in LifeHelperApp */,
  setParent /* used in LifeHelperApp */,
  parent /* used in LifeHelperApp */,
  setRefreshData /* used in LifeHelperApp */,
  refreshData /* used in LifeHelperApp */,
  dataServer /* used in LifeHelperApp */
) {
  console.log(`In itemFromImport rendering item with name ${item.item_name}`);
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
      <div class="toggle">
        {props.type == "task" ? (
          <input
            type="checkbox"
            class="toggle"
            onClick={(e) =>
              affectItem(
                e,
                "start",
                item.item_id,
                1,
                dataServer,
                refreshData,
                setRefreshData
              )
            }
            disabled={item.completed_dtm}
            checked={item.started_dtm}
          ></input>
        ) : (
          <input type="checkbox" class="toggle" disabled></input>
        )}
        <span class="hide">Start</span>
      </div>
      <label
        classList={{ completed: item.completed_dtm, started: item.started_dtm }}
      >
        {item.item_name}
      </label>
      <button class="destroy" onClick={(e) => affectItem(e, "delete")} />
    </li>
  );
}
