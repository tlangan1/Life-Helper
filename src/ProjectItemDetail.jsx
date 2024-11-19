// This is the code that was once in ProjectItem.jsx used to delete an item.
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
/>;

// This is the code that was once in ProjectItem.jsx used to start a task.
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
</div>;
