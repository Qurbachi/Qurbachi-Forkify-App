import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
*Global state of the app
* - Search object
* - current recipe object
* - Shopping list object
* - liked recipes
*/
const state = {};

//SEARCH CONTROLLER
const controllSearch = async () => {
    //1) Get query from view
    const query = searchView.getInput();

    if(query) {
        //2) New Search object and add to view
        state.search = new Search(query);

        //3) Prepare UI for displaying result (proper animation)
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            //4) Search for the recipe
            await state.search.getResults();
    
            //5) Display the result
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Sorry, we couldn`t reciev that recipe for You :(');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controllSearch();
    console.log(state);
});

elements.searchResultsPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if(button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

//RECIPE CONTROLLER
const controllRecipe = async () => {
    //get the id from the URL
    const id = window.location.hash.replace('#', '');

    if(id) {
        //1) Prepare UI for changes
            recipeView.clearRecipe();
            renderLoader(elements.recipe);
        //2) Create a new recipe object
            state.recipe = new Recipe(id);

        try {
            //3) Get recipe and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe);
            //4) calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            //5) Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error);
            alert('Error processing recipe');
        }
    }
};

/*window.addEventListener('hashchange', controllRecipe);
window.addEventListener('load', controllRecipe);*/
['hashchange', 'load'].forEach(event => window.addEventListener(event, controllRecipe));