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
            <label htmlFor="selCanceled">Canceled Items: </label>
            <select
              name="selCanceled"
              id="selCanceled"
              value={filters().canceled_items}
              onChange={(e) =>
                setFilters(appendFilter("canceled_items", e.target.value))
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
              <option value="item_id">Item ID</option>
              <option value="order_id">Order ID</option>
            </select>
          </div>
          <div class="control">
            <label htmlFor="selDirection">Direction: </label>
            <select
              name="selDirection"
              id="selDirection"
              value={filters().direction}
              onChange={(e) =>
                setFilters(appendFilter("direction", e.target.value))
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
