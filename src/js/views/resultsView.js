import icons from 'url:../../img/icons.svg';
import PreviewView from './previewView.js';

class ResultsView extends PreviewView {
	_parentElement = document.querySelector(".results");
	_errorMessage = "No recipes found for your query.. Try again!";
	_data;

	updateResults(resultArray) {
		this._clear();
		resultArray.forEach(this.#renderResult.bind(this));
	}

	#renderResult(result) {
		const userGeneratedIcon = `
			<div class="preview__user-generated">
				<svg>
					<use href="${icons}#icon-user"></use>
				</svg>
			</div>`

		const markup = `
        <li class="preview" style="background-color: white">
            <a class="preview__link " href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
				${result.key ? userGeneratedIcon : ''}
              </div>
            </a>
          </li>
          `
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
}

export default new ResultsView();