// Global app controller

import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global app state
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 */
const state = {};

const controlSearch = async () => {
  // 1) get the query from the search view
  const query = searchView.getInput();

  if (query) {
    // 2) generate a new search object
    state.search = new Search(query);

    // 3) prepare the ui for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    // 4) search for the results
    await state.search.getResults();

    // 5) render results on the ui
    clearLoader();
    searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});
