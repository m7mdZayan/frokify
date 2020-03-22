export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResList: document.querySelector(".results__list"),
  searchRes: document.querySelector(".results"),
  searchresPages: document.querySelector(".results__pages")
};

export const elementSrtings = {
  loader: "loader"
};

export const renderLoader = parent => {
  const loader = `<div class=${elementSrtings.loader}>
  <svg>
    <use href="img/icons.svg#icon-cw"></use>
  </svg>
</div> `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementSrtings.loader}`);

  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};
