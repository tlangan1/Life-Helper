/** @jsxImportSource solid-js */
import "./CSS/Filters.css";

import { useGlobalState } from "./GlobalStateProvider";

export function Filters(props) {
  var { toggleRefreshData, filters, setFilters, user, itemsView } =
    useGlobalState();

  return (
    <div class="route">
      <div class="label-left-wrapper">
        <h2>Filters</h2>
        <fieldset class="label-left-wrapper">
          <legend>Assignment Filters</legend>
          <div class="control">
            <label htmlFor="chkAssignedToMe">Assigned to me: </label>
            <input
              type="checkbox"
              name="chkAssignedToMe"
              id="chkAssignedToMe"
              disabled={Object.keys(user()) == 0}
              checked={filters().assigned_to_me}
              onChange={(e) =>
                setFilters(appendFilter("assigned_to_me", e.target.checked))
              }
            />
          </div>
        </fieldset>
        <fieldset class="label-left-wrapper">
          <legend>State Filters</legend>
          <div class="control">
            <label htmlFor="selCompleted">Completed Items: </label>
            <select
              name="selCompleted"
              id="selCompleted"
              value={filters().completed_items}
              onChange={(e) =>
                setFilters(appendFilter("completed_items", e.target.value))
              }
            >
              <option value="either">Either</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="control">
            <label htmlFor="selStarted">Started Items: </label>
            <select
              name="selStarted"
              id="selStarted"
              value={filters().started_items}
              onChange={(e) =>
                setFilters(appendFilter("started_items", e.target.value))
              }
            >
              <option value="either">Either</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="control">
            <label htmlFor="selDeleted">Deleted Items: </label>
            <select
              name="selDeleted"
              id="selDeleted"
              value={filters().deleted_items}
              onChange={(e) =>
                setFilters(appendFilter("deleted_items", e.target.value))
              }
            >
              <option value="either">Either</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </fieldset>
        <fieldset class="label-left-wrapper">
          <legend>Sort Options</legend>
          <div class="control">
            <label htmlFor="selSortBy">Sort by: </label>
            <select
              name="selSortBy"
              id="selSortBy"
              value={filters().sort}
              onChange={(e) => setFilters(appendFilter("sort", e.target.value))}
            >
              <option value="item_name">Item Name</option>
              <option value="order_id">Order ID</option>
            </select>
          </div>
          <div class="control">
            <label htmlFor="selOrder">Order: </label>
            <select
              name="selOrder"
              id="selOrder"
              value={filters().order}
              onChange={(e) =>
                setFilters(appendFilter("order", e.target.value))
              }
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </fieldset>
        <a href={itemsView() == undefined ? "/" : itemsView()}>
          <button onClick={toggleRefreshData} class="action-button">
            Apply
          </button>
        </a>
      </div>
    </div>
  );

  /* *** helper functions *** */
  function appendFilter(filter_name, filter_value) {
    var new_filters = { ...filters() };
    new_filters[filter_name] = filter_value;
    return new_filters;
  }
}
