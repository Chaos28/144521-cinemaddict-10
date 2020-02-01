import he from 'he';
import FilmCardComponent from '../components/film-card';
import PopupFilmCardComponent from '../components/popup';
import {render, remove, replace} from '../utils/utils';
import {getRandomArrayItem, usersNames} from '../mock/utils';
import FilmModel from '../models/movie';

const FilmCardMode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._api = api;

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
    this._undoPersonalRatingHandler = this._undoPersonalRatingHandler.bind(this);
    this._addPersonalRatingHandler = this._addPersonalRatingHandler.bind(this);
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
    this._filmCardComponent = this._createFilmCardComponent();
    this._popupFilmCardComponent = this._createPopupFilmCardComponent();

    if (oldFilmCardComponent && oldPopupFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupFilmCardComponent, oldPopupFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  _createFilmCardComponent() {
    const filmComponent = new FilmCardComponent(this._filmCard);
    filmComponent.setClickHandler(this._showPopupFilmCard);
    filmComponent.setAlreadyWatchedButtonClickHandler(this._addToWatchedHandler);
    filmComponent.setAddToWatchlistButtonClickHandler(this._addToWatchlistHandler);
    filmComponent.setAddToFavoritesButtonClickHandler(this._addToFavoritesHandler);

    return filmComponent;
  }

  _createPopupFilmCardComponent() {
    const popupComponent = new PopupFilmCardComponent(this._filmCard);
    popupComponent.setClosePopupButtonClickHandler(() => {
      remove(this._popupFilmCardComponent);
      document.removeEventListener(`keydown`, this._commentAddingPressHandler);
    });

    popupComponent.setAlreadyWatchedButtonClickHandler(this._addToWatchedHandler);
    popupComponent.setAddToWatchlistButtonClickHandler(this._addToWatchlistHandler);
    popupComponent.setAddToFavoritesButtonClickHandler(this._addToFavoritesHandler);
    popupComponent.setUndoPersonalRatingHandler(this._undoPersonalRatingHandler);
    popupComponent.setAddPersonalRatingHandler(this._addPersonalRatingHandler);
    popupComponent.setDeleteButtonClickHandler(this._deleteClickHandler);
    popupComponent.subscribeOnEmojiImgEvents();


    return popupComponent;
  }

  _showPopupFilmCard() {
    this._onViewChange();

    this._api.getComments(this._filmCard.id)
      .then((comments) => {

        this._popupFilmCardComponent._comments = comments;
        this._filmCardMode = FilmCardMode.POPUP;
        render(this._container, this._popupFilmCardComponent);
        document.addEventListener(`keydown`, this._setEscButtonKeydownHandler);
        this._popupFilmCardComponent.recoveryListeners();
        document.addEventListener(`keydown`, this._commentAddingPressHandler);
      });
  }

  _undoPersonalRatingHandler() {

    this._popupFilmCardComponent._personalRating = 0;
    const newFilmCard = FilmModel.clone(this._filmCard);
    newFilmCard.personalRating = this._popupFilmCardComponent._personalRating;
    this._onDataChange(this, this._filmCard, newFilmCard);
    // this._popupFilmCardComponent.rerender();
  }

  _addPersonalRatingHandler(evt) {
    if (evt.target.value) {
      const mark = evt.target.value;
      this._popupFilmCardComponent._personalRating = mark * 1;
      const newFilmCard = FilmModel.clone(this._filmCard);
      newFilmCard.personalRating = this._popupFilmCardComponent._personalRating;
      this._onDataChange(this, this._filmCard, newFilmCard);
    }
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
    const newFilmCard = FilmModel.clone(this._filmCard);
    newFilmCard.isAddedToWatchlist = !this._filmCard.isAddedToWatchlist;
    this._onDataChange(
        this,
        this._filmCard,
        newFilmCard);
  }

  _addToWatchedHandler() {
    const newFilmCard = FilmModel.clone(this._filmCard);
    newFilmCard.isAlreadyWatched = !this._filmCard.isAlreadyWatched;
    this._onDataChange(
        this,
        this._filmCard,
        newFilmCard);
  }

  _addToFavoritesHandler() {
    const newFilmCard = FilmModel.clone(this._filmCard);
    newFilmCard.isFavorites = !this._filmCard.isFavorites;
    this._onDataChange(
        this,
        this._filmCard,
        newFilmCard);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._onDataChange(this, evt.target.dataset.id, null);
    this._popupFilmCardComponent._comments = this._filmCard.comments;
    this._popupFilmCardComponent.rerender();
  }
}
