import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector(".upload");
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnAddRecipe = document.querySelector(".nav__btn--add-recipe");
    _btnCloseModal = document.querySelector(".btn--close-modal");
    _btnUploadModal = document.querySelector(".btn upload__btn");
    _originalFormInnerHTML = this._parentElement.innerHTML;
    _message = "Your recipe has been added succesfully! :)";
    constructor() {
        super();
        this._addShowModal();
        this._addCloseModal();
    }

    _restoreOriginalForm() {
        this._parentElement.innerHTML = this._originalFormInnerHTML;
    }

    _toggleModalWindow() {
        if (!this._window.classList.contains("hidden")) {
            setTimeout(this._restoreOriginalForm.bind(this), 500);
        }
        this._window.classList.toggle("hidden");
        this._overlay.classList.toggle("hidden");
    }

    _addShowModal() {
        this._btnAddRecipe.addEventListener("click", this._toggleModalWindow.bind(this));
    }

    _addCloseModal() {
        this._btnCloseModal.addEventListener("click", this._toggleModalWindow.bind(this));
        this._overlay.addEventListener("click", this._toggleModalWindow.bind(this));
        const thisReference = this;
        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !thisReference._window.classList.contains("hidden")) {
                console.log(`Trigerred!`);
                thisReference._toggleModalWindow.call(thisReference);
            }
        })
    }

    _addFormUpload(handler) {
        const thisObject = this;
        this._parentElement.addEventListener("submit", function (e) {
            e.preventDefault();
            const pairArrayKeyValue = [...new FormData(this)];
            const validated = thisObject.#validateFormInput(pairArrayKeyValue);
            if (validated) {
                const data = Object.fromEntries(pairArrayKeyValue);
                handler(data);
            }

        })
    }

    #validateFormInput(formInput) {
        for (let [field, input] of formInput) {
            if (field === 'sourceUrl' && input.length < 5) {
                alert(`The source url should be at least 5 characters logn! Try again!`);
                return false;
            }
            else if (field === 'servings' && (input < 1 || input > 10)) {
                alert(`Servings should be in a range from 1 to 10! Try again!`);
            }
        }
        return true;
    }
}
export default new AddRecipeView();