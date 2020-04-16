// Global app controller

import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";

/** Global app state
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 */
const state = {};

state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

/**Search Controller */
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

    try {
      // 4) search for the results
      await state.search.getResults();

      // 5) render results on the ui
      clearLoader();
      searchView.renderRecipes(state.search.result);
    } catch (err) {
      console(err);
      alert("Something went wrong");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchresPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = +btn.dataset.goto;

    searchView.clearResults();
    searchView.renderRecipes(state.search.result, goToPage);
  }
});

/**Recipe Controller */

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selectes search recipe
    if (state.search) {
      searchView.highlightSelected(id);
    }

    //Create new recipe object
    state.recipe = new Recipe(id);

    try {
      //Get recipe data & parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Calc servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      //Render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      alert("Error processing recipe");
      console.log(err);
    }
  }
};

// List Controler
const controlList = () => {
  if (!state.list) state.list = new List();

  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);

    listView.renderItem(item);
  });
};

// Handle delete & update list item

elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  // Handle the delete event
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete from UI
    listView.deleteItem(id);
  }
  // Handle count update
  else if (e.target.matches(".shopping__count--value")) {
    const val = +e.target.value;
    state.list.updateCount(id, val);
  }
});

// [("hashchange", "load")].forEach((event) => {
//   window.addEventListener(event, controlRecipe);
//   console.log(event);
// });

window.addEventListener("hashchange", () => {
  controlRecipe();
});

window.addEventListener("load", () => {
  controlRecipe();
});

// Handling Recipe Button Clicks
elements.recipe.addEventListener("click", (e) => {
  if (state.recipe.servings > 1) {
    if (e.target.matches(".btn-decrease,.btn-decrease *")) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  }
  if (e.target.matches(".btn-increase,.btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

// Likes Controller
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;
  if (!state.likes.isLiked(currentId)) {
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.renderLike(newLike);
    likesView.toggleLike(true);
  } else {
    state.likes.deleteLike(currentId);
    likesView.deleteLike(currentId);
    likesView.toggleLike(false);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener("load", () => {
  state.likes.readStorage();
  console.log(state.likes);
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
