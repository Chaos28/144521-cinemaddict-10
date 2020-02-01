import AbstractComponent from './abstract-component';
import {getFilmDuration} from '../utils/utils';

const getFullComment = (comment) => {
  const commentMulti = comment.length > 1 ? `comments` : `comment`;
  return `${comment.length} ${commentMulti}`;
};

const createFilmCardETemplate = (film) => {


  const {title, rating, duration, releaseDate, genres, poster, description, comments, isAlreadyWatched, isAddedToWatchlist, isFavorites} = film;
  const commentFull = getFullComment(comments);
  const getShortDescription = () => description.length > 140 ? `${description.slice(0, 140)} ...` : description;
  const getGenresFilm = Array.from(genres);
  const getFirstGenre = () => {
    if (getGenresFilm.length !== 0) {
      return getGenresFilm[0];
    }
    return ``;
  };

  return `<article class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${releaseDate.getFullYear()}</span>
              <span class="film-card__duration">${getFilmDuration(duration)}</span>
              <span class="film-card__genre">${getFirstGenre()}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${getShortDescription()}</p>
            <a class="film-card__comments">${commentFull}</a>
            <form class="film-card__controls">
              <button class="film-card__controls-item ${isAddedToWatchlist ? `film-card__controls-item--active` : ``} button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
              <button class="film-card__controls-item ${isAlreadyWatched ? `film-card__controls-item--active` : ``} button film-card__controls-item--mark-as-watched">Mark as watched</button>
              <button class="film-card__controls-item ${isFavorites ? `film-card__controls-item--active` : ``} button film-card__controls-item--favorite">Mark as favorite</button>
            </form>
          </article>`;
};

export default class FilmCard extends AbstractComponent {
  constructor(filmCard) {
    super();

    this._filmCard = filmCard;
  }

  getTemplate() {
    return createFilmCardETemplate(this._filmCard);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }

  setAlreadyWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }

  setAddToFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }
}
