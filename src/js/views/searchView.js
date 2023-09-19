import View from './view.js';
class SearchView extends View {
    _parentElement = document.querySelector('.search');
    #inputForm = document.querySelector('.search input');
    #formButton = document.querySelector('.search button');
    #initialPlaceholder = 'Search over 1,000,000 recipes...';

    getInput() {
        const input = this.#inputForm.value;
        this._clear();
        return input;
    }

    _clear() {
        this.#inputForm.value = '';
    }

    addSearchEvent(handler) {
        this._parentElement.addEventListener('submit', function (event) {
            event.preventDefault();
            handler();
        });
    }

    addResizeEvent() {
        window.addEventListener('resize', () => {
            if (window.innerWidth < 780) {
                this.#inputForm.placeholder = 'Search...';
            }
            else {
                this.#inputForm.placeholder = this.#initialPlaceholder;
            }
        })
    }
}



export default new SearchView();