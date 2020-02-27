// Global app controller

import string from "./models/Search";
import axios from "axios";

import { add, multiply, ids } from "./views/searchView";
//import * as x from "./views/searchView";
console.log(string);

console.log(add(1, 18));
console.log(multiply(1, 2));

console.log(ids);

async function getResults(query) {
  const res = await axios(
    `https://forkify-api.herokuapp.com/api/search?&q=${query}`
  );
  console.log(res);
}

getResults("pizza");
