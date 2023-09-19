import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { timeout } from './views/helpers.js';
// Bundler will create a new .js file, therefore img paths will not work there.
// We need to import the file in order for them to render correctly in browser.
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;
        recipeView.renderSpinner();
        // 1. Loading recipe
        await model.loadRecipe(id); // await till state is updated and ready for manipulation
        const { recipe } = model.state;
        // 2.1 render the active tab 
        resultsView._markActiveTab();
        // 2.2 rendering recipe
        recipeView.render(recipe);
        // 3. Add event listeners on a loaded page
        recipeView.addServingsController(controlServings);
        recipeView.addBookMarkEvent(controlBookmarks);
    } catch (err) {
        resultsView.renderError();
        console.log(err);
    }
}

const controlSearchResults = async function () {
    // Use API to get search results in model.searQuery
    try {
        resultsView.renderSpinner();
        const query = searchView.getInput();
        // API request for results
        await model.loadSearchResults(query);
        model.updateLeftBar(resultsView, paginationView);
        resultsView._markActiveTab();
    } catch (err) {
        resultsView.renderError();
        paginationView.render(model.state);
        console.log(err);
    }
}

const controlPagination = function (button) {
    model.updateCurrentPageState(button);
    model.updateLeftBar(resultsView, paginationView);
}

const controlServings = function (button) {
    try {
        // Update the recipe servings (in state)
        model.updateServings(button);
        // Update the recipe view
        recipeView.update(model.state.recipe);
    } catch (err) {
        alert(err.message);
    }
}

const controlBookmarks = function (checker = true) {
    try {
        if (checker) {
            model.updateBookmarks();
            bookmarksView.render(model.state.bookmarks);
        }
        bookmarksView._markActiveTab();
    } catch (err) {
        alert(`There is a problem with: ${err.message}`);
    }
}

const controlAddRecipe = async function (newRecipe) {
    try {
        addRecipeView.renderSpinner();
        const recipe = await model.uploadRecipe(newRecipe);
        controlBookmarks();
        recipeView.render(model.state.recipe, true);
        addRecipeView.renderMessage();
        setTimeout(function () {
            addRecipeView._toggleModalWindow.bind(addRecipeView)
        }, 2500);
        recipeView.addServingsController(controlServings);
        recipeView.addBookMarkEvent(controlBookmarks);
        // Change ID in the URL witht reloading the page
        window.history.pushState(null, '', `#${model.state.recipe.id}`);
    } catch (err) {
        addRecipeView.renderError(err.message);
        console.log(err);
    }
}

const init = function () {
    model.getLocalStorage();
    bookmarksView.render(model.state.bookmarks);
    recipeView.addHandlerMethod(controlRecipes, () => controlBookmarks(false));
    searchView.addSearchEvent(controlSearchResults);
    searchView.addResizeEvent();
    paginationView.addPaginationEvent(controlPagination);
    addRecipeView._addFormUpload(controlAddRecipe);
}

init();