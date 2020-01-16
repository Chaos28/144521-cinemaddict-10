import TopRatedComponent from '../components/top-rated-films';
import MostCommentedComponent from '../components/most-commented-films';
import SortComponent, {SortType} from '../components/sort';
import ShowMoreButtonComponent from '../components/show-more-button';
import {FilmListCount} from '../const';
import {render, remove, RenderPosition} from '../utils/utils';
import MovieController from './movie-controller';

const siteMainElement = document.querySelector(`.main`);

const renderFilmCards = (filmListElement, films, onDataChange, onViewChange) => {
  return films.map((filmCard) => {
    const movieController = new MovieController(filmListElement, onDataChange, onViewChange);
    movieController.render(filmCard);

    return movieController;
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._filmsContainer = null;

    this._films = [];
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortComponent = new SortComponent();

    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();

    this._showedFilmCardControllers = [];
    this._showingFilmCardCount = FilmListCount.START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(films) {
    this._films = films;
    const container = this._container.getElement();
    this._filmsContainer = this._container.getElement().querySelector(`.films-list__container`);
    const newFilmCards = renderFilmCards(this._filmsContainer, this._films.slice(0, this._showingFilmCardCount), this._onDataChange, this._onViewChange);
    this._showedFilmCardControllers = this._showedFilmCardControllers.concat(newFilmCards);
    this._renderShowMoreButton();
    render(siteMainElement, this._sortComponent, RenderPosition.AFTERBEGIN);

    this._sortComponent.setSortTypeChangeHandler((filmSortType) => {
      let sortedFilms = [];

      switch (filmSortType) {
        case SortType.YEAR_UP:
          sortedFilms = films.slice().sort((a, b) => b.year - a.year);
          break;
        case SortType.RATING_UP:
          sortedFilms = films.slice().sort((a, b) => b.rating - a.rating);
          break;
        case SortType.DEFAULT:
          sortedFilms = films.slice(0, this._showingFilmCardCount);
          break;
      }

      this._filmsContainer.innerHTML = ``;
      this._films = sortedFilms;
      const newFltredFilmCards = renderFilmCards(this._filmsContainer, this._films.slice(0, this._showingFilmCardCount), this._onDataChange, this._onViewChange);
      this._showedFilmCardControllers = this._showedFilmCardControllers.concat(newFltredFilmCards);
    });

    render(container, this._topRatedComponent);
    render(container, this._mostCommentedComponent);

    const filmListTopRatedElement = container.querySelector(`.top-rated .films-list__container`);
    const filmListMostCommentedElement = container.querySelector(`.most-commented .films-list__container`);

    // Создание функции для сортировки и отрисовки карточек в Top Rated и Most Commented

    const getExtraFilmCards = (filmList, sortingElement, count = FilmListCount.EXTRA) => {
      return filmList.slice().sort((a, b) => a[sortingElement] < b[sortingElement] ? 1 : -1).splice(0, count);
    };

    // Создание функции для отрисовки случайных карточек в Top Rated и Most Commented (если комментарии/рейтинг одинаковые)

    const getRandomExtraFilmCards = films.slice().sort(() => {
      return 0.5 - Math.random();
    }).splice(0, FilmListCount.EXTRA);

    // Сохранение числа комментариев и рейтинга для первых элементов списка карточек для сравнения

    const filmRatingFirst = films[0].rating;
    const filmCommentFirst = films[0].comments;

    // Создание функции сравнения количества комментариев и рейтинга в списке карт

    const getFilmsCompareResult = (filmsBase, compareItem, firstItem) => {
      return filmsBase.every((item) => {
        return item.compareItem === firstItem;
      });
    };

    // Проверка на отсутствие комментариев к фильмам

    const getFiltredMostCommentedFilms = films.slice().filter((item) => {
      return item.comments === 0;
    });

    // Проверка на отсутствие рейтинга у фильмов

    const getFiltredTopRatedFilms = films.filter((item) => {
      return item.rating === 0;
    });

    // Функция Отрисовки карточек в Most Commented и Top Rated при соблюдении условий: нет комментариев/оценок, одинаковое количество, отсортированные комментарии/лценки

    const renderFiltredExtraFilmCards = (fitredExtraFilms, allFilms, extraElement, filterItem, firstFilm, extraCardPosition) => {
      if (fitredExtraFilms === allFilms.length) {
        extraElement.remove();
      } else {
        if (getFilmsCompareResult(allFilms, filterItem, firstFilm)) {
          const filtredFilms = getRandomExtraFilmCards();
          renderFilmCards(extraCardPosition, filtredFilms, this._onDataChange, this._onViewChange);
        } else {
          const extraFilms = getExtraFilmCards(allFilms, filterItem);
          renderFilmCards(extraCardPosition, extraFilms, this._onDataChange, this._onViewChange);
        }
      }
    };

    renderFiltredExtraFilmCards(getFiltredTopRatedFilms, films, container.querySelector(`.top-rated`), `rating`, filmRatingFirst, filmListTopRatedElement);
    renderFiltredExtraFilmCards(getFiltredMostCommentedFilms, films, container.querySelector(`.most-commented`), `comments`, filmCommentFirst, filmListMostCommentedElement);
  }

  _renderShowMoreButton() {
    if (this._showingFilmCardCount >= this._films.length) {
      return;
    }
    const container = this._container.getElement();
    render(container, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
      const previousFilmCardCount = this._showingFilmCardCount;
      this._showingFilmCardCount += FilmListCount.BY_BUTTON;
      const newFilmCards = renderFilmCards(this._filmsContainer, this._films.slice(previousFilmCardCount, this._showingFilmCardCount), this._onDataChange, this._onViewChange);
      this._showedFilmCardControllers = this._showedFilmCardControllers.concat(newFilmCards);
      if (this._showingFilmCardCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(movieController, oldFilmCard, newFilmCard) {
    const index = this._films.findIndex((it) => it === oldFilmCard);
    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilmCard, this._films.slice(index + 1));
    movieController.render(this._films[index]);

  }

  _onViewChange() {
    this._showedFilmCardControllers.forEach((item) => {
      item.setDefaultView();
    });
  }
}
