/** @jsxImportSource solid-js */

import { useGlobalState } from "./GlobalStateProvider";

export function Filters(props) {
  var { setItemType, filters, setFilters } = useGlobalState();
  return (
    <div class="route">
      <h1>Filters</h1>
      <div>
        <input
          type="checkbox"
          name="chkIncludeCompleted"
          id="chkIncludeCompleted"
          onClick={() =>
            setFilters({
              include_completed_items: !filters().include_completed_items,
            })
          }
          checked={filters().include_completed_items ? "checked" : ""}
        />
        <label htmlFor="chkIncludeCompleted">Include Completed Items</label>
      </div>
      <a href="/" onClick={() => setItemType("objective")}>
        Apply
      </a>
    </div>
  );
}
