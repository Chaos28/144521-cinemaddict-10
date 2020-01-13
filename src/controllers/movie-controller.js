import FilmCardComponent from '../components/film-card';
import PopupFilmCardComponent from '../components/popup';
import {render, remove, replace} from '../utils/utils';

const FilmCardMode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._newFilmCard = null;
    this._filmCardMode = FilmCardMode.DEFAULT;
    this._filmCardComponent = null;
    this._popupFilmCardComponent = null;

    this._setEscButtonKeydownHandler = this._setEscButtonKeydownHandler.bind(this);
  }

  setDefaultView() {
    if (this._filmCardMode !== FilmCardMode.DEFAULT) {
      remove(this._popupFilmCardComponent);
      this._filmCardMode = FilmCardMode.DEFAULT;
    }
  }

  render(filmCard) {
    this._filmCard = filmCard;
    const oldFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardComponent(filmCard);

    this._filmCardComponent.setAddToWatchlistButtonClickHandler(() => {
      this._onDataChange(this, filmCard, Object.assign({}, filmCard, {
        isAddToWatchList: !filmCard.isAddToWatchList
      }));
    });

    this._filmCardComponent.setAlreadyWatchedButtonClickHandler(() => {
      this._onDataChange(this, filmCard, Object.assign({}, filmCard, {
        isAlreadyWatched: !filmCard.isAlreadyWatched
      }));
    });

    this._filmCardComponent.setAddToFavoritesButtonClickHandler(() => {
      this._onDataChange(this, filmCard, Object.assign({}, filmCard, {
        isFavorites: !filmCard.isFavorites
      }));
    });

    const alreadyWatchedClickHandler = (() => {
      this._popupFilmCardComponent._isAlreadyWatched = !this._popupFilmCardComponent._isAlreadyWatched;
      this._onDataChange(this, this._filmCard, Object.assign({}, this._filmCard, {isAlreadyWatched: !this._popupFilmCardComponent.getIsAlreadyWatched()}));
      this._popupFilmCardComponent.rerender();
    });

    const filmCardClickHandler = () => {
      this._onViewChange();
      this._popupFilmCardComponent = new PopupFilmCardComponent(filmCard);
      this._popupFilmCardComponent.setAlreadyWatchedButtonClickHandler(alreadyWatchedClickHandler);
      render(this._container, this._popupFilmCardComponent);
      this._filmCardMode = FilmCardMode.POPUP;
      this._popupFilmCardComponent.setClosePopupButtonClickHandler(() => {
        remove(this._popupFilmCardComponent);
      });
      document.addEventListener(`keydown`, this._setEscButtonKeydownHandler);
    };

    this._filmCardComponent.setClickHandler(filmCardClickHandler);

    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  _setEscButtonKeydownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(this._popupFilmCardComponent);
      document.removeEventListener(`keydown`, this._setEscButtonKeydownHandler);
    }
  }

}
