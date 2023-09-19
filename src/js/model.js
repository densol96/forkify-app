import { async } from 'regenerator-runtime';
import { API_URL, API_KEY, RES_PER_PAGE } from './config';
import { AJAX } from './views/helpers.js';
import addRecipeView from './views/addRecipeView';

const state = {
    recipe: {},
    searchQuery: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
    bookmarks: [],
    timerID: undefined
};

const updateLocalStorage = function () {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

const getLocalStorage = function () {
    const data = localStorage.getItem("bookmarks");
    if (!data) return;
    state.bookmarks = JSON.parse(data);
}

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    }
}

const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);
        if (state.bookmarks.find(bookmark => bookmark.id === state.recipe.id)) {
            state.recipe.isInBookmarks = true;
        }
    } catch (err) {
        throw err;
    }
}

const loadSearchResults = async function (searchResult) {
    state.page = 1;
    state.searchQuery = [];
    const API_ENDPOINT = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchResult}&key=${API_KEY}`;
    try {
        const data = await AJAX(API_ENDPOINT);
        const recipes = data.data?.recipes;
        if (data.status != `success` || recipes.length == 0) throw new Error(`Unable to load  search results. Please, provide a proper name of the meal!`);
        state.searchQuery = recipes.map(searchItem => {
            return {
                id: searchItem.id,
                title: searchItem.title,
                publisher: searchItem.publisher,
                image: searchItem.image_url,
                ...(searchItem.key && { key: searchItem.key })
            }
        })
    } catch (err) {
        throw err;
    }
}

const getSearchResultsPage = function (page = state.page) {
    state.page = page;
    const start = (page - 1) * state.resultsPerPage;
    const end = page * state.resultsPerPage;

    return state.searchQuery.slice(start, end);
}

const updateLeftBar = function (resView, pagView) {
    resView.updateResults(getSearchResultsPage(state.page));
    resView._markActiveTab();
    pagView.render(state);
}

const updateCurrentPageState = function (button) {
    if (button.classList.contains("pagination__btn--next")) {
        state.page++;
    }
    else if (button.classList.contains("pagination__btn--prev")) {
        state.page--;
    }
}

const updateServings = function (button) {

    let change = 1;
    button.classList.contains("btn--decrease-servings") && (change *= -1);

    const ingredients = state.recipe.ingredients;
    const servings = state.recipe.servings;
    const targetServings = servings + change;
    if (targetServings < 1 || targetServings > 10) throw new Error(`The limit for servings display is 1 to 10!`);
    ingredients.forEach(ingredient => {
        if (!ingredient.quantity) return;
        const perOneServing = ingredient.quantity / servings;
        ingredient.quantity = perOneServing * targetServings;
    });

    state.recipe.servings = targetServings;
}

const updateBookmarks = function () {
    if (!state.recipe.isInBookmarks) {
        state.bookmarks.push(state.recipe);
        state.recipe.isInBookmarks = true;
    } else {
        const index = state.bookmarks.findIndex(bookmark => bookmark.id === state.recipe.id);
        state.bookmarks.splice(index, 1);
        state.recipe.isInBookmarks = false;
    }
    updateLocalStorage();
}

const uploadRecipe = async function (newRecipe) {
    const keys = Object.keys(newRecipe);
    const ingredients = keys
        .filter(el => el.includes("ingredient")
            && newRecipe[el].length !== 0
        )
        .map(ing => {
            const ingredientArray = newRecipe[ing].split(",");
            if (ingredientArray.length !== 3) throw new Error(`Invalid inrgedient format! Please, try again!`);
            const [quantity, unit, description] = ingredientArray;
            return { quantity: quantity ? +quantity : null, unit, description }
        })

    const recipe = {
        title: newRecipe.title,
        publisher: newRecipe.publisher,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        servings: +newRecipe.servings,
        cooking_time: +newRecipe.cookingTime,
        ingredients: ingredients
    }
    const response = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(response);
}

const clearBookmarksManually = function () {
    state.bookmarks = [];
    updateLocalStorage();
}

export {
    state, loadRecipe, loadSearchResults, getSearchResultsPage,
    updateLeftBar, updateCurrentPageState, updateServings, updateBookmarks,
    getLocalStorage, updateLocalStorage, uploadRecipe, clearBookmarksManually
};
