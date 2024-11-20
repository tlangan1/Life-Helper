import "./ProjectItem.css";
import { FindParentElement } from "./helperFunctions";
import { affectItem } from "./helperFunctions";

import { useGlobalState } from "./GlobalStateProvider";
import { ProjectItemDetail } from "./ProjectItemDetail";

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
    <div
      data-item_id={item.item_id}
      data-item_name={item.item_name}
      onDblClick={(e) => {
        if (props.itemType == "task") return;

        var parentLi = FindParentElement(e.target, "div");
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
      <input type="checkbox" name={item.item_id} id={item.item_id} />
      <label
        for={item.item_id}
        classList={{ completed: item.completed_dtm, started: item.started_dtm }}
      >
        {item.item_name}
      </label>
      <ProjectItemDetail itemType={props.itemType} item_id={item.item_id} />
    </div>
  );

  // helper functions for the code above

  async function affectItemCaller(e, operation, item_type, data, dataServer) {
    await affectItem(e, operation, item_type, data, dataServer);
    toggleRefreshData();
  }
}
