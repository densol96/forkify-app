import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './view.js';


class RecipeView extends View {
    _parentElement = document.querySelector('.recipe');
    _data;
    _errorMessage = 'We could not find that recipe! Please, try a different one!';
    #message = 'PLACEHOLDER';
    #servingsButtonsPanel;
    #bookmarkButton;

    _generateMarkup() {
        const userGenerated = `
            `

        const bookMarkState = this._data.isInBookmarks ? "icon-bookmark-fill" : "icon-bookmark";
        return `
            <figure class="recipe__fig">
            <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
            <h1 class="recipe__title">
                <span>${this._data.title}</span>
            </h1>
            </figure>

            <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
                <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
                <span class="recipe__info-text">servings</span>

                <div class="recipe__info-buttons">
                <button class="btn--tiny btn--decrease-servings">
                    <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                    <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                </button>
                </div>
            </div>
            <div class="recipe__user-generated" ${this._data.key ? userGenerated : 'style="opacity: 0"'}>
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round">
                <svg class="">
                <use href="${icons}#${bookMarkState}"></use>
                </svg>
            </button>
            </div>

            <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
                ${this._data.ingredients.map(this.#generateSingleIngredient).join('')}
                </ul>
                </div>

                <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
                    directions at their website.
                </p>
                <a
                    class="btn--small recipe__btn"
                    href="${this._data.sourceUrl}"
                    target="_blank"
                >
                    <span>Directions</span>
                    <svg class="search__icon">
                    <use href="${icons}.svg#icon-arrow-right"></use>
                    </svg>
                </a>
                </div>
                `;

    }

    #generateSingleIngredient(ingArg) {
        return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ingArg.quantity ? new Fraction(ingArg.quantity).toString() : ''}</div>
                <div class="recipe__description">
                    <span class="recipe__unit">${ingArg.unit}</span>
                    ${ingArg.description};
                </div>
            </li>
            `
    }

    addHandlerMethod(handler, activeBookmarHandler) {
        ['load', 'hashchange'].forEach(eventType => {
            window.addEventListener(eventType, handler);
            window.addEventListener(eventType, activeBookmarHandler);
        })
    }

    addServingsController(handler) {
        this.#servingsButtonsPanel = document.querySelector(".recipe__info-buttons");
        this.#servingsButtonsPanel.addEventListener('click', function (event) {
            const targetButton = event.target.closest("button");
            if (!targetButton) return;
            handler(targetButton);
        })
    }

    addBookMarkEvent(handler) {
        this.#bookmarkButton = document.querySelector(".btn--round");
        this.#bookmarkButton.addEventListener("click", () => {
            this.#markOrUnmark();
            handler();
        })
    }

    #markOrUnmark() {
        const icon = this.#bookmarkButton.querySelector("use");
        if (!this._data.isInBookmarks) {
            icon.setAttribute("href", `${icons}#icon-bookmark-fill`);
        } else {
            icon.setAttribute("href", `${icons}#icon-bookmark`);
        }
    }

}



export default new RecipeView();