import { createSignal } from "solid-js";
import { useGlobalState } from "./GlobalStateProvider";

export function DataSource(props) {
  var { dataSource, setDataSource, dataServer } = useGlobalState();
  var [updateOccurring, setUpdateOccurring] = createSignal(false);

  var selectedDataSource = dataSource();

  return (
    <div class="route">
      <div class="label-left-wrapper">
        <h2>Select a data source</h2>
        <div class="control">
          <label for="default">Production (life_helper DB)</label>
          <input
            type="radio"
            id="production"
            name="data-source"
            value="life_helper"
            checked={dataSource() == "life_helper"}
            onChange={(e) => (selectedDataSource = e.target.value)}
          />
        </div>
        <div class="control">
          <label for="my-tasks">Testing (test_life_helper DB)</label>
          <input
            type="radio"
            id="testing"
            name="data-source"
            value="test_life_helper"
            checked={dataSource() == "test_life_helper"}
            onChange={(e) => (selectedDataSource = e.target.value)}
          />
        </div>
        <button
          class="action-button"
          onClick={() => setSelectedDataSource(selectedDataSource)}
          disabled={updateOccurring()}
        >
          Apply
        </button>
        <p class="max-paragraph-width">
          If you change the data source and you are logged in you will be
          logged. Also you will be directed to the default route "/" as the "my
          tasks" view has no meaning when logged out.
        </p>
        <p class="max-paragraph-width">
          Also, the database change, life_helper to test_life_helper or vice
          versa is persisted in the config file on the data server with a
          synchronous file operation which results in some delay. This is the
          safest way to ensure that the change is not lost between restarts of
          the Express Server without restarting the front-end application.
        </p>
      </div>
    </div>
  );

  /* *** Helper functions *** */
  async function setSelectedDataSource(databaseName) {
    setUpdateOccurring(true);
    var result = await fetch(`${dataServer}/set/data_source`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ database: databaseName }),
    });

    setUpdateOccurring(false);
    if (result.ok) {
      setDataSource(databaseName);
      window.location.href = "/";
    } else {
      alert("Failed to set data source.");
    }
  }
}
