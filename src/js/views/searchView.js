import { elements, elementSrtings } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchresPages.innerHTML = "";
};

const limitRecipeTitle = (title, limit = 20) => {
  const newTitle = [];
  if (title.length > 17) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    /// Return the result
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

export const renderRecipe = recipe => {
  const markup = `<li>
<a class="likes__link" href="#${recipe.recipe_id}">
    <figure class="likes__fig">
        <img src=${recipe.image_url} alt=${recipe.title}>
    </figure>
    <div class="likes__data">
        <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
        <p class="likes__author">${recipe.publisher}</p>
    </div>
</a>
</li>`;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto = ${
  type === "prev" ? page - 1 : page + 1
} >
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === "prev" ? "left" : "right"
        }"></use>
    </svg>
</button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;

  if (page === 1 && pages > 1) {
    // only button to go to next page
    button = createButton(page, "next");
  } else if (page === pages) {
    // only button to go to previous page
    button = createButton(page, "prev");
  } else if (page < pages && pages > 1) {
    // two buttons next & previous
    button = `${createButton(page, "next")} ${createButton(page, "prev")}`;
  }

  elements.searchresPages.insertAdjacentHTML("afterbegin", button);
};

export const renderRecipes = (recipes, page = 2, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  // Render Results
  recipes.slice(start, end).forEach(renderRecipe);

  // Render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
