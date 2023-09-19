import PreviewView from './previewView.js';

class BookmarksView extends PreviewView {
    _parentElement = document.querySelector(".bookmarks__list");
    _data;
    _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)"

    _generateMarkup() {
        return this._data.map(bookmark => this._createPreviewItem(bookmark)).join();
    }

    addBookmarkHandler(handler) {
        window.addEventListener("load", handler);
    }
}


export default new BookmarksView();