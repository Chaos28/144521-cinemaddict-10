import FilmCardComponent from '../components/film-card';
import PopUpFilmCardComponent from '../components/popup';
import SortComponent, {SortType} from '../components/sort';
import ShowMoreButtonComponent from '../components/show-more-button';
import {FilmListCount, Key} from '../const';
import {render, remove, RenderPosition} from '../utils/utils';

const siteMainElement = document.querySelector(`.main`);

const renderFullFilmCards = (filmCard, position, container) => {
  const filmCardComponent = new FilmCardComponent(filmCard);
  const popUpFilmCardComponent = new PopUpFilmCardComponent(filmCard);

  render(position, filmCardComponent);

  filmCardComponent.setClickHandler(() => {
    elementFilmCardClickHandler(container, popUpFilmCardComponent);
    document.addEventListener(`keydown`, setEscButtonKeydownHadler);
  });
};

// создание обработчика отрисовки попапа и кнопки закрытия в попапе

const elementFilmCardClickHandler = (container, cardComponent) => {
  if (document.querySelector(`.film-details`) === null) {
    render(container, cardComponent);
  }

  cardComponent.setClosePopupButtonClickHandler(() => {
    remove(cardComponent);
  });
};

const setEscButtonKeydownHadler = () => {
  const isEscKey = (evt) => evt.key === Key.ESCAPE || evt.key === Key.ESC;

  if (isEscKey) {
    document.querySelector(`.film-details`).remove();
    document.removeEventListener(`keydown`, setEscButtonKeydownHadler);
  }
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortComponent = new SortComponent();
  }

  render(films) {
    render(siteMainElement, this._sortComponent, RenderPosition.AFTERBEGIN);
    const container = this._container.getElement();

    const filmListElement = container.querySelector(`.films-list`);
    const filmListContainerElement = filmListElement.querySelector(`.films-list__container`);

    // Отрисовка кнопки Load More

    const renderShowMoreButton = () => {
      if (showingFilmCardCount >= films.length) {
        return;
      }

      render(filmListElement, this._showMoreButtonComponent);

      this._showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
        const previousFilmCardCount = showingFilmCardCount;
        showingFilmCardCount += FilmListCount.BY_BUTTON;
        films.slice(previousFilmCardCount, showingFilmCardCount).forEach((filmCard) => renderFullFilmCards(filmCard, filmListContainerElement, container));

        if (showingFilmCardCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    render(filmListElement, this._showMoreButtonComponent);

    // Отрисовка карточек и реализация логики кнопки Load More

    let showingFilmCardCount = FilmListCount.START;
    films.slice(0, showingFilmCardCount).forEach((filmCard) => renderFullFilmCards(filmCard, filmListContainerElement, container));
    renderShowMoreButton();

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
          sortedFilms = films.slice(0, showingFilmCardCount);
          break;
      }

      document.querySelector(`.films-list .films-list__container`).innerHTML = ``;
      sortedFilms.forEach((filmCard) => renderFullFilmCards(filmCard, filmListContainerElement, container));
    });

    // Поиск DOM элементов для Top Rated и Most Commented карточек фильмов

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

    const filmCommentFirst = films[0].comments;
    const filmRatingFirst = films[0].rating;

    // Создание функции сравнения количества комментариев и рейтинга в списке карт

    const getFilmsCompareResult = (filmsBase, compareItem, firstItem) => {
      return filmsBase.every((item) => {
        return item.compareItem === firstItem;
      });
    };

    // Поиск DOM элемента для блока с Most commented

    const mostCommentedElement = container.querySelector(`.most-commented`);

    // Проверка на отсутствие комментариев к фильмам

    const getFiltredMostCommentedFilms = films.slice().filter((item) => {
      return item.comments === 0;
    });

    // Поиск DOM элемента для блока с Top Rated

    const topRatedElement = container.querySelector(`.top-rated`);

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
          getRandomExtraFilmCards.forEach((filmCard) => renderFullFilmCards(filmCard, extraCardPosition, container));
        } else {
          const extraFilms = getExtraFilmCards(films, filterItem);
          extraFilms.forEach((filmCard) => renderFullFilmCards(filmCard, extraCardPosition, container));
        }
      }
    };

    renderFiltredExtraFilmCards(getFiltredMostCommentedFilms, films, mostCommentedElement, `rating`, filmRatingFirst, filmListTopRatedElement);
    renderFiltredExtraFilmCards(getFiltredTopRatedFilms, films, topRatedElement, `comments`, filmCommentFirst, filmListMostCommentedElement);
  }
}
