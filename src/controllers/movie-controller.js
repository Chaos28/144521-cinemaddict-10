import he from 'he';
import FilmCardComponent from '../components/film-card';
import PopupFilmCardComponent from '../components/popup';
import {render, remove, replace} from '../utils/utils';
import {getRandomArrayItem, usersNames} from '../mock/utils';

const FilmCardMode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmCard = null;
    this._filmCardMode = FilmCardMode.DEFAULT;
    this._filmCardComponent = null;
    this._popupFilmCardComponent = null;

    this._showPopupFilmCard = this._showPopupFilmCard.bind(this);
    this._setEscButtonKeydownHandler = this._setEscButtonKeydownHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._addToWatchedHandler = this._addToWatchedHandler.bind(this);
    this._addToFavoritesHandler = this._addToFavoritesHandler.bind(this);
    this._commentAddingPressHandler = this._commentAddingPressHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  setDefaultView() {
    if (this._filmCardMode !== FilmCardMode.DEFAULT) {
      remove(this._popupFilmCardComponent);
      this._filmCardMode = FilmCardMode.DEFAULT;
    }
  }

  getFilmsData() {
    return this._filmCard;
  }

  render(filmCard) {
    this._filmCard = filmCard;
    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupFilmCardComponent = this._popupFilmCardComponent;

    this._filmCardComponent = this._createFilmCardComponent(this._filmCard);
    this._popupFilmCardComponent = this._createPopupFilmCardComponent(this._filmCard);

    if (oldFilmCardComponent && oldPopupFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupFilmCardComponent, oldPopupFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }

  }

  _createFilmCardComponent(filmCard) {
    const filmComponent = new FilmCardComponent(filmCard);

    filmComponent.setClickHandler(this._showPopupFilmCard);
    filmComponent.setAlreadyWatchedButtonClickHandler(this._addToWatchedHandler);
    filmComponent.setAddToWatchlistButtonClickHandler(this._addToWatchlistHandler);
    filmComponent.setAddToFavoritesButtonClickHandler(this._addToFavoritesHandler);

    return filmComponent;
  }

  _createPopupFilmCardComponent(filmCard) {
    const popupComponent = new PopupFilmCardComponent(filmCard);
    popupComponent.setClosePopupButtonClickHandler(() => {
      remove(this._popupFilmCardComponent);
      document.removeEventListener(`keydown`, this._commentAddingPressHandler);
    });

    popupComponent.setAlreadyWatchedButtonClickHandler(this._addToWatchedHandler);
    popupComponent.setAddToWatchlistButtonClickHandler(this._addToWatchlistHandler);
    popupComponent.setAddToFavoritesButtonClickHandler(this._addToFavoritesHandler);
    popupComponent.setDeleteButtonClickHandler(this._deleteClickHandler);
    popupComponent.setScoreButtonClickHandler();

    return popupComponent;
  }

  _showPopupFilmCard() {
    this._onViewChange();
    this._filmCardMode = FilmCardMode.POPUP;
    render(this._container, this._popupFilmCardComponent);
    document.addEventListener(`keydown`, this._setEscButtonKeydownHandler);
    this._popupFilmCardComponent.recoveryListeners();
    document.addEventListener(`keydown`, this._commentAddingPressHandler);
  }

  _commentAddingPressHandler(evt) {
    const key = evt.key;

    if ((evt.ctrlKey || evt.metaKey) && key === `Enter`) {
      const input = this._popupFilmCardComponent.getElement().querySelector(`.film-details__comment-input`).value;
      const encodedInput = he.encode(input);
      const imageAddress = this._popupFilmCardComponent.getElement().querySelector(`.film-details__add-emoji-img`).src.split(`/`);
      const image = imageAddress[imageAddress.length - 1];
      if (encodedInput.trim() !== ``) {
        const commentObj = {
          userName: getRandomArrayItem(usersNames),
          comment: encodedInput,
          date: new Date(),
          emoji: image
        };
        this._popupFilmCardComponent.addComment(commentObj);
        this._onDataChange(this, this._filmCard, Object.assign({}, this._filmCard, {comments: this._popupFilmCardComponent.getComments()}));
        this._popupFilmCardComponent.rerender();
      }
    }
  }

  _setEscButtonKeydownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(this._popupFilmCardComponent);
      document.removeEventListener(`keydown`, this._setEscButtonKeydownHandler);
      document.removeEventListener(`keydown`, this._commentAddingPressHandler);
    }
  }

  _addToWatchlistHandler() {
    this._onDataChange(
        this,
        this._filmCard,
        Object.assign({}, this._filmCard, {isAddedToWatchlist: !this._filmCard.isAddedToWatchlist}));
  }

  _addToWatchedHandler() {
    const watchedDate = this._popupFilmCardComponent.getIsAlreadyWatched() ? new Date() : null;
    this._onDataChange(
        this,
        this._filmCard,
        Object.assign({}, this._filmCard, {isAlreadyWatched: !this._popupFilmCardComponent.getIsAlreadyWatched(), whatchedDate: watchedDate}));
  }

  _addToFavoritesHandler() {
    this._onDataChange(
        this,
        this._filmCard,
        Object.assign({}, this._filmCard, {isFavorites: !this._filmCard.isFavorites}));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._onDataChange(this, evt.target.dataset.id, null);
    this._popupFilmCardComponent._comments = this._filmCard.comments;
    this._popupFilmCardComponent.rerender();
  }
}
