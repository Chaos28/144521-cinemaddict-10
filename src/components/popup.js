import AbstractSmartComponent from './abstract-smart-component';
import {createDescription, getFilmDuration} from '../utils/utils';
import {EmojiImg} from '../const';
import moment from 'moment';

const getFormatedDate = (date) => moment(date).format(`YYYY/MM/DD HH:MM`);

const getGenres = (genres) => {
  return Array.from(genres).map((item) => {
    return `<span class="film-details__genre">${item}</span>`;
  }).join(`\n`);
};

const renderComments = (commentsList) => {
  return commentsList.map((item) => {
    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${item.emoji}" width="55" height="55" alt="emoji">
              </span>
              <div>
                <p class="film-details__comment-text">${item.comment}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${item.userName}</span>
                  <span class="film-details__comment-day">${getFormatedDate(item.date)}</span>
                  <button class="film-details__comment-delete" data-id = ${item.id}>Delete</button>
                </p>
              </div>
            </li>`;
  }).join(`\n`);
};

const createPopupFilmCardTemplate = (film, options, markFlag, commentsList) => {

  const {title, rating, year, duration, genres, poster, description, age, director, writers, actors, releaseDate, country, isAlreadyWatched, isAddedToWatchlist, isFavorites} = film;
  const emojiImg = options;

  const createFullNames = (names) => {
    return names.join(`, `);
  };

  const comments = commentsList;

  const allWriters = createFullNames(Array.from(writers));
  const allActors = createFullNames(Array.from(actors));
  const fullDescription = createDescription(Array.from(description));

  const getFullReleaseDate = () => `${moment(releaseDate).format(`DD MMMM`)} ${year}`;

  const getPopupFilmCardMarkTemplate = () => {
    if (markFlag) {
      return `<div class="form-details__middle-container">
              <section class="film-details__user-rating-wrap">
                <div class="film-details__user-rating-controls">
                  <button class="film-details__watched-reset" type="button">Undo</button>
                </div>

                <div class="film-details__user-score">
                  <div class="film-details__user-rating-poster">
                    <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
                  </div>

                  <section class="film-details__user-rating-inner">
                    <h3 class="film-details__user-rating-title">${title}</h3>

                    <p class="film-details__user-rating-feelings">How you feel it?</p>

                    <div class="film-details__user-rating-score">
                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
                      <label class="film-details__user-rating-label" for="rating-1">1</label>

                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
                      <label class="film-details__user-rating-label" for="rating-2">2</label>

                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
                      <label class="film-details__user-rating-label" for="rating-3">3</label>

                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
                      <label class="film-details__user-rating-label" for="rating-4">4</label>

                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
                      <label class="film-details__user-rating-label" for="rating-5">5</label>

                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
                      <label class="film-details__user-rating-label" for="rating-6">6</label>

                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
                      <label class="film-details__user-rating-label" for="rating-7">7</label>

                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
                      <label class="film-details__user-rating-label" for="rating-8">8</label>

                      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked>
                      <label class="film-details__user-rating-label" for="rating-9">9</label>

                    </div>
                  </section>
                </div>
              </section>
            </div>`;
    } else {
      return ``;
    }
  };

  return `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="${poster}" alt="">

                <p class="film-details__age">${age}</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${title}</h3>
                    <p class="film-details__title-original">Original: ${title}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${rating}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${allWriters}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${allActors}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${getFullReleaseDate()}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${getFilmDuration(duration)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${country}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
                    <td class="film-details__cell">
                      ${getGenres(genres)}
                    </td>
                  </tr>
                </table>

                <p class="film-details__film-description">
                  ${fullDescription}
                </p>
              </div>
            </div>

            <section class="film-details__controls">
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isAddedToWatchlist ? `checked` : ``}>
              <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isAlreadyWatched ? `checked` : ``}>
              <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorites ? `checked` : ``}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
          </div>

          ${getPopupFilmCardMarkTemplate()}

          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

              <ul class="film-details__comments-list">
              ${renderComments(comments)}
              </ul>

              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label">
                ${emojiImg ? `<img src="./images/emoji/${emojiImg}" width="55" height="55" class="film-details__add-emoji-img">` : ``}
                </div>
                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke">
                  <label class="film-details__emoji-label" for="emoji-gpuke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                  <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                  </label>
                </div>
              </div>
            </section>
          </div>
        </form>
      </section>`;
};

export default class PoupFilmCard extends AbstractSmartComponent {
  constructor(filmCard) {
    super();

    this._filmCard = filmCard;
    this._emojiImg = null;
    this._isAlreadyWatched = filmCard.isAlreadyWatched;
    this._comments = Array.from(this._filmCard.comments);

    this._closeButtonHandler = null;
    this._alreadyWatchedButtonHandler = null;
    this._addToWatchlistButtonHandler = null;
    this._addToFavoritesButtonHandler = null;
    this._deleteClickHandler = null;
    this._subscribeOnEmojiImgEvents();
  }

  getIsAlreadyWatched() {
    return this._isAlreadyWatched;
  }

  addComment(comment) {
    this._comments.push(comment);
  }

  getComments() {
    return this._comments;
  }

  getTemplate() {
    return createPopupFilmCardTemplate(this._filmCard, this._emojiImg, this._isAlreadyWatched, this._comments);
  }

  setClosePopupButtonClickHandler(handler) {
    this._closeButtonHandler = handler;
    this._recoveryClosePopupHandler();
  }

  setAlreadyWatchedButtonClickHandler(handler) {
    this._alreadyWatchedButtonHandler = handler;
    this._recoveryAlreadyWatchedHandler();
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._addToWatchlistButtonHandler = handler;
    this._recoveryAddToWatchlistHandler();
  }

  setAddToFavoritesButtonClickHandler(handler) {
    this._addToFavoritesButtonHandler = handler;
    this._recoveryAddToFavoritesHandler();
  }

  setDeleteButtonClickHandler(handler) {
    this._deleteClickHandler = handler;
    this._recoveryDeleteButtonHandler();
  }

  recoveryListeners() {
    this._recoveryClosePopupHandler();
    this._recoveryAlreadyWatchedHandler();
    this._recoveryAddToWatchlistHandler();
    this._recoveryAddToFavoritesHandler();
    this._recoveryDeleteButtonHandler();
    this._subscribeOnEmojiImgEvents();
  }

  _recoveryClosePopupHandler() {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonHandler);
  }

  _recoveryAlreadyWatchedHandler() {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._alreadyWatchedButtonHandler);
  }

  _recoveryAddToWatchlistHandler() {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._addToWatchlistButtonHandler);
  }

  _recoveryAddToFavoritesHandler() {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._addToFavoritesButtonHandler);
  }

  _recoveryDeleteButtonHandler() {
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtons.forEach((el) => el.addEventListener(`click`, this._deleteClickHandler));
  }

  _subscribeOnEmojiImgEvents() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._emojiImg = EmojiImg[evt.target.value];
      this.rerender();
    });
  }
}
