import {createDescription} from '../utils';
import {createElement} from '../utils';

const getFullComment = (comment) => {
  const commentMulti = comment > 1 ? `comments` : `comment`;
  return `${comment} ${commentMulti}`;
};

const createFilmCardETemplate = (film) => {

  const {title, rating, year, duration, genres, poster, description, comments} = film;

  const commentFull = getFullComment(comments);
  const fullDescription = createDescription(Array.from(description));
  const genreFilm = Array.from(genres);

  return `<article class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${year}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genreFilm[0]}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${fullDescription}</p>
            <a class="film-card__comments">${commentFull}</a>
            <form class="film-card__controls">
              <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
              <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
              <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
            </form>
          </article>`;
};

export default class FilmCard {
  constructor(filmCard) {
    this._filmCard = filmCard;

    this._element = null;
  }

  getTemplate() {
    return createFilmCardETemplate(this._filmCard);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
