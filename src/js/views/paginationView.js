import icons from 'url:../../img/icons.svg';
import View from './view.js';
import { RES_PER_PAGE } from './../config.js'

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup() {
        // Page 1, and there are other pages
        const resultsTotal = this._data.searchQuery.length;
        const resPerPage = this._data.resultsPerPage;
        const numPages = Math.ceil(resultsTotal / resPerPage);

        const previousPage = this._data.page - 1;
        const nextPage = this._data.page + 1;

        let markup;


        if (this._data.page === 1 && numPages > 1) {
            markup = `
          <button class="btn--inline pagination__btn--next">
            <span>Page ${nextPage}</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }
        else if (this._data.page === 1) {
            markup = '';
        }
        else if (this._data.page === numPages) {
            markup = `
            <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${previousPage}</span>
          </button>
          `
        } else {
            markup = `
            <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${previousPage}</span>
          </button>
          <button class="btn--inline pagination__btn--next">
            <span>Page ${nextPage}</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }
        return markup;
    }

    addPaginationEvent(handler) {
        this._parentElement.addEventListener('click', function (event) {
            const button = event.target.closest('button');
            if (!button) return;
            handler(button);
        });
    }
}

export default new PaginationView();