import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
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

export const renderRecipes = recipes => {
  recipes.forEach(renderRecipe);
};
