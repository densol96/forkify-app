import View from './view.js';
import icons from 'url:../../img/icons.svg';

export default class PreviewView extends View {

    _createPreviewItem(item) {
        return `
            <li class="preview">
                <a class="preview__link " href="#${item.id}">
                <figure class="preview__fig">
                    <img src="${item.image}" alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${item.title}</h4>
                    <p class="preview__publisher">${item.publisher}</p>
                    <div class="preview__user-generated ${!item.key ? 'hidden' : ''}">
                        <svg>
                            <use href="${icons}#icon-user"></use>
                        </svg>
                    </div>
                </div>
                </a>
            </li>
            `
    }

    _markActiveTab() {
        const id = window.location.hash;
        this._parentElement.querySelectorAll("li a").forEach(tab => {
            if (tab.classList.contains("preview__link--active") && tab.getAttribute("href") !== id) {
                tab.classList.remove("preview__link--active");
            }
            if (tab.getAttribute("href") == id) {
                tab.classList.add("preview__link--active");
            }
        })
    }
}