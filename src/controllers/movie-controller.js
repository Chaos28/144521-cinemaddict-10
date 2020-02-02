import he from 'he';
import FilmCardComponent from '../components/film-card';
import PopupFilmCardComponent from '../components/popup';
import {render, remove, replace, RenderPosition} from '../utils/utils';
import FilmModel from '../models/movie';

const FilmCardMode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

const SHAKE_ANIMATION_TIMEOUT = 700;

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

    this._isRatingChanging = false;
    this._commentValue = null;

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
    if (this._popupFilmCardComponent) {
      document.addEventListener(`keydown`, this._setEscButtonKeydownHandler);
    }

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
    this._api.getComments(this._filmCard.id)
      .then((comments) => {

        this._popupFilmCardComponent._comments = comments;
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

      });
    // const popupComponent = new PopupFilmCardComponent(this._filmCard);
    // popupComponent.setClosePopupButtonClickHandler(() => {
    //   remove(this._popupFilmCardComponent);
    //   document.removeEventListener(`keydown`, this._commentAddingPressHandler);
    // });

    // popupComponent.setAlreadyWatchedButtonClickHandler(this._addToWatchedHandler);
    // popupComponent.setAddToWatchlistButtonClickHandler(this._addToWatchlistHandler);
    // popupComponent.setAddToFavoritesButtonClickHandler(this._addToFavoritesHandler);
    // popupComponent.setUndoPersonalRatingHandler(this._undoPersonalRatingHandler);
    // popupComponent.setAddPersonalRatingHandler(this._addPersonalRatingHandler);
    // popupComponent.setDeleteButtonClickHandler(this._deleteClickHandler);
    // popupComponent.subscribeOnEmojiImgEvents();


    return popupComponent;
  }

  _showPopupFilmCard() {
    this._onViewChange();
    this._filmCardMode = FilmCardMode.POPUP;
    render(document.body, this._popupFilmCardComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, this._setEscButtonKeydownHandler);
    this._popupFilmCardComponent.recoveryListeners();
    document.addEventListener(`keydown`, this._commentAddingPressHandler);
  }

  _undoPersonalRatingHandler() {

    this._popupFilmCardComponent._personalRating = 0;
    const newFilmCard = FilmModel.clone(this._filmCard);
    newFilmCard.personalRating = this._popupFilmCardComponent._personalRating;
    this._onDataChange(this, this._filmCard, newFilmCard);
  }

  _addPersonalRatingHandler(evt) {
    if (evt.target.value) {
      this._isRatingChanging = true;
      const mark = evt.target.value;
      const newFilmCard = FilmModel.clone(this._filmCard);
      newFilmCard.personalRating = mark * 1;
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
          comment: encodedInput,
          date: new Date().toISOString(),
          emotion: image.split(`.`).shift()
        };

        this._popupFilmCardComponent.setSending({
          flag: true,
          value: encodedInput
        });
        this._commentValue = encodedInput;
        this._onDataChange(this, this._filmCard, commentObj, this._popupFilmCardComponent);
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
    const watchedDateNow = this._popupFilmCardComponent.getIsAlreadyWatched() ? new Date() : this._filmCard.watchedDate;
    const newFilmCard = FilmModel.clone(this._filmCard);
    newFilmCard.isAlreadyWatched = !this._filmCard.isAlreadyWatched;
    newFilmCard.watchedDate = watchedDateNow;
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
    this._onDataChange(this, evt.target.dataset.id, null, this._popupFilmCardComponent);
  }

  shakeComment() {
    this._popupFilmCardComponent.getElement().querySelector(`.film-details__comment-input`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._popupFilmCardComponent.getElement().querySelector(`.film-details__comment-input`).style.border = `2px solid red`;
    setTimeout(() => {
      this._popupFilmCardComponent.getElement().querySelector(`.film-details__comment-input`).style.animation = ``;
      this._popupFilmCardComponent.setSending({flag: false, value: this._commentValue});

      this._popupFilmCardComponent.getElement().querySelector(`.film-details__comment-input`).style.border = `none`;
      this._popupFilmCardComponent.getElement().querySelector(`.film-details__comment-input`).value = this._commentValue;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakePersonalRating() {
    this._popupFilmCardComponent.getElement().querySelector(`.film-details__user-rating-score`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._popupFilmCardComponent.getElement().querySelector(`.film-details__user-rating-score`).style.border = `2px solid red`;
    setTimeout(() => {
      this._popupFilmCardComponent.getElement().querySelector(`.film-details__user-rating-score`).style.animation = ``;
      this._popupFilmCardComponent.rerender();

      this._isRatingChanging = false;

      this._popupFilmCardComponent.getElement().querySelector(`.film-details__user-rating-score`).style.border = `none`;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  destroy() {
    remove(this._filmCardComponent);
    document.removeEventListener(`keydown`, this._setEscButtonKeydownHandler);
  }
}
