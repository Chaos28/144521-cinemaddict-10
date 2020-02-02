import AbstractComponent from './abstract-component';
import {FilterType} from '../utils/utils';

const createNavigationListTemplate = (allFilmsCard) => {

  const getNavigationWatchlistCount = allFilmsCard.filter((item) => {
    return item.isAddedToWatchlist;
  });

  const getNavigationisAlreadyWatchedCount = allFilmsCard.filter((item) => {
    return item.isAlreadyWatched;
  });

  const getNavigationisFavoritesCount = allFilmsCard.filter((item) => {
    return item.isFavorites;
  });

  return `<nav class="main-navigation">
            <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
            <a href="#watchlist" class="main-navigation__item" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${getNavigationWatchlistCount.length}</span></a>
            <a href="#history" class="main-navigation__item" data-filter-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${getNavigationisAlreadyWatchedCount.length}</span></a>
            <a href="#favorites" class="main-navigation__item" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${getNavigationisFavoritesCount.length}</span></a>
            <a href="#stats" class="main-navigation__item main-navigation__item--additional" data-filter-type="${FilterType.STATS}">Stats</a>
          </nav>`;
};


export default class Navigation extends AbstractComponent {
  constructor(allFilmsCard) {
    super();

    this._allFilmsCard = allFilmsCard;

  }
  getTemplate() {
    return createNavigationListTemplate(this._allFilmsCard);
  }

  setFiltersButtonClickHandler(handler) {
    const filterButtonClickHandler = (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      const activeFilter = this.getElement().querySelector(`.main-navigation__item--active`);
      activeFilter.classList.remove(`main-navigation__item--active`);
      const currentFilter = evt.target;
      currentFilter.classList.add(`main-navigation__item--active`);
      const filterData = evt.target.dataset.filterType;
      handler(filterData);
    };

    this.getElement().addEventListener(`click`, filterButtonClickHandler);
  }
}
