import {FilterType} from '../utils/utils';

export default class Films {
  constructor() {
    this._films = [];
    this._dataChangeHandler = null;
    this._changeFilterHandler = null;
    this._activeFilterType = FilterType.ALL;
  }

  getFilms() {
    return this.getFilmsByFilter();
  }

  getFilmsAll() {
    return this._films;
  }

  setFilms(films) {
    this._films = films;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._changeFilterHandler();
  }

  getFilmsByFilter() {
    switch (this._activeFilterType) {
      case FilterType.WATCHLIST:
        return this._films.filter((item) => item.isAddedToWatchlist);
      case FilterType.HISTORY:
        return this._films.filter((item) => item.isAlreadyWatched);
      case FilterType.FAVORITES:
        return this._films.filter((item) => item.isFavorites);
      default:
        return this._films;
    }
  }

  updateFilm(id, film) {
    const filmsData = [...this._films];
    const filmCardToChange = filmsData.find((item) => item.id === id);
    const indexFilm = filmsData.indexOf(filmCardToChange);
    filmsData[indexFilm] = film;
    this._films = filmsData;
    this._dataChangeHandler();
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandler = handler;
  }

  setFilterClickHandler(handler) {
    this._changeFilterHandler = handler;
  }
}
