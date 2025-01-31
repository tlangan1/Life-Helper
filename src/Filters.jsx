/** @jsxImportSource solid-js */
import "./CSS/Filters.css";

import { useGlobalState } from "./GlobalStateProvider";

export function Filters(props) {
  var { toggleRefreshData, filters, setFilters } = useGlobalState();
  return (
    <div class="route">
      <div class="grouping">
        <h2>Filters</h2>
        <h3>State Filters</h3>
        <div>
          <div>
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
          <div>
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
          <div>
            <label htmlFor="selDeleted">Deleted Items: </label>
            <select
              name="selDeleted"
              id="Deleted"
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
        </div>
        <a href="./">
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
