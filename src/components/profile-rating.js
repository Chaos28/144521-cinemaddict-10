import {createElement} from '../utils';

const ProfileRatingStatuses = [
  {
    title: `Novice`,
    rating: 10
  },
  {
    title: `Fan`,
    rating: 20,
  },
  {
    title: `Movie Buff`,
    rating: 30
  }
];

const createProfileRatingTemplate = (count) => {

  const profileRating = ProfileRatingStatuses.find((item) => {
    return count <= item.rating;
  });

  return `<section class="header__profile profile">
            <p class="profile__rating">${profileRating.title}</p>
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};


export default class ProfileRating {
  constructor(filmCount) {
    this._filmCount = filmCount;
    this._element = null;
  }

  getTemplate() {
    return createProfileRatingTemplate(this._filmCount);
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
