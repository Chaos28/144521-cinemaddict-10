import AbstractComponent from './abstract-component';

export const SortType = {
  YEAR_UP: `year-up`,
  RATING_UP: `rating-up`,
  DEFAULT: `default`
};

const createSortFilmTemplate = () => {
  return `<ul class="sort">
            <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
            <li><a href="#" data-sort-type="${SortType.YEAR_UP}" class="sort__button">Sort by date</a></li>
            <li><a href="#" data-sort-type="${SortType.RATING_UP}" class="sort__button">Sort by rating</a></li>
          </ul>`;
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this.currentFilmSortType = SortType.DEFAULT;
    this._activeSortButton = this.getElement().querySelector(`.sort__button--active`);
  }

  getTemplate() {
    return createSortFilmTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filmSortType = evt.target.dataset.sortType;

      if (this._currentFilmSortType === filmSortType) {
        return;
      }

      this._activeSortButton.classList.remove(`sort__button--active`);
      this._activeSortButton = evt.target;
      this._activeSortButton.classList.add(`sort__button--active`);
      this._currentFilmSortType = filmSortType;

      handler(this._currentFilmSortType);
    });
  }
}
