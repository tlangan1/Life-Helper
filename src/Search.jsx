import { createSignal, Show, For } from "solid-js";

import { useGlobalState } from "./GlobalStateProvider";

export function Search() {
  var { dataServer, loggedIn, showToast } = useGlobalState();

  var [searchInput, setSearchInput] = createSignal("");
  var [results, setResults] = createSignal([]);
  var [loading, setLoading] = createSignal(false);
  var [searched, setSearched] = createSignal(false);

  return (
    <div class="route">
      <div class="label-left-wrapper">
        <h2>Search</h2>
        <form onSubmit={submitSearch}>
          <div class="control">
            <label for="item-search">Search term</label>
            <input
              id="item-search"
              class="item-search-input"
              type="search"
              value={searchInput()}
              placeholder="Search objectives, goals, and tasks"
              onInput={(event) => setSearchInput(event.currentTarget.value)}
              minLength="1"
              required
            />
          </div>
          <div class="control">
            <button
              class="action-button"
              type="submit"
              disabled={!loggedIn() || !searchInput().trim()}
            >
              Search
            </button>
            <button
              class="action-button"
              type="button"
              onClick={clearSearch}
              disabled={!searched()}
            >
              Clear
            </button>
          </div>
        </form>
        <Show when={!loggedIn()}>
          <p class="failure">You must be logged in to search.</p>
        </Show>
      </div>
      <Show when={loading()}>
        <p>Searching...</p>
      </Show>
      <Show when={searched() && !loading()}>
        <p>{results().length} result(s) found.</p>
      </Show>
      <Show when={results().length > 0}>
        <div class="search-results-list">
          <For each={results()}>
            {(item) => (
              <article class="search-result-item">
                <header class="search-result-header">
                  <h3>
                    {item.entity_name} ({item.item_id}): {item.matched_column}
                  </h3>
                </header>
                <p class="search-result-description">{item.matched_text}</p>
              </article>
            )}
          </For>
        </div>
      </Show>
    </div>
  );

  async function submitSearch(event) {
    event.preventDefault();
    const trimmed = searchInput().trim();
    if (!trimmed) return;

    setLoading(true);
    setSearched(false);
    setResults([]);

    const searchParams = {
      search_text: trimmed,
      search_locations: [
        ["objective", "item_name", "item_description"],
        ["goal", "item_name", "item_description"],
        ["task", "item_name", "item_description"],
        ["note", "note"],
        ["thought", "thought"],
      ],
    };

    const response = await fetch(
      dataServer + `/get_items/search?params=` + JSON.stringify(searchParams),
    );

    setLoading(false);
    setSearched(true);

    if (!response.ok) {
      if (response.status === 404) {
        showToast(
          "Search endpoint not found on the server. Add /get_items/search to the Express backend.",
        );
        return;
      }
      showToast(
        `Search failed: status ${response.status} – ${response.statusText}`,
      );
      return;
    }

    const data = await response.json();
    setResults(Array.isArray(data) ? data : data.items || []);
  }

  function clearSearch() {
    setSearchInput("");
    setResults([]);
    setSearched(false);
  }
}
