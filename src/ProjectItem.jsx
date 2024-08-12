import { FindParentElement } from "./helperFunctions";
import { affectItem } from "./helperFunctions";

import { useGlobalState } from "./GlobalStateProvider";

export function ProjectItem(
  props /* used in LifeHelperApp */,
  item /* used in LifeHelperApp */,
  setParent /* used in LifeHelperApp */,
  parent /* used in LifeHelperApp */
) {
  // *** dataServer is the URL of the server that provides the data.
  var [, , , toggleRefreshData, dataServer] = useGlobalState();

  console.log(`In ProjectItem rendering item with name ${item.item_name}`);
  return (
    <li
      class="item"
      data-item_id={item.item_id}
      data-item_name={item.item_name}
      onDblClick={(e) => {
        if (props.itemType == "task") return;

        var parentLi = FindParentElement(e.target, "li");
        setParent(() => {
          parent().push({
            item_id: parentLi.attributes["data-item_id"].value,
            item_name: parentLi.attributes["data-item_name"].value,
          });

          return parent();
        });
        if (props.itemType == "objective") props.setItemType("goal");
        else if (props.itemType == "goal") props.setItemType("task");
        toggleRefreshData();
      }}
    >
      <div class="toggle">
        {props.itemType == "task" ? (
          <input
            type="checkbox"
            class="toggle"
            onClick={(e) => {
              affectItemCaller(
                e,
                "start",
                props.itemType,
                { item_id: item.item_id },
                dataServer
              );
            }}
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
      <button
        class="destroy"
        onClick={(e) => {
          affectItemCaller(
            e,
            "delete",
            props.itemType,
            { item_id: item.item_id },
            dataServer
          );
        }}
      />
    </li>
  );

  // helper functions for the code above

  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    await affectItem(e, operation, item_type, data, dataServer);
    toggleRefreshData();
  }
}
