// Импортирование модулей

import {FilmListCount} from './const';
import FilmBoardComponent from './components/films';
import ProfileRatingComponent from './components/profile-rating';
import NavigationComponent from './components/navigation';
import SortComponent from './components/sort.js';
import FilmCardComponent from './components/film-card';
import ShowMoreButtonComponent from './components/show-more-button';
import {render} from './utils';
import {getRandomIntegerNumber} from './mock/utils';
import {generateFilmCards} from './mock/film-card';
import PopUpFilmCardComponent from './components/popup';
import NoFilmsComponent from './components/no-films';

// поиск DOM элементов для навигации и основного контента

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

// отрисовка DOM элементов

render(siteMainElement, new NavigationComponent().getElement());
render(siteMainElement, new SortComponent().getElement());

// Отрисовка ранга пользователя

const filmViewedCount = getRandomIntegerNumber(0, 30);

if (filmViewedCount !== 0) {
  render(siteHeaderElement, new ProfileRatingComponent(filmViewedCount).getElement());
} else {
  render(siteHeaderElement, new ProfileRatingComponent(filmViewedCount).getElement());
  siteHeaderElement.querySelector(`.profile__rating`).remove();
}

// Генерация набора карточек фильмов

const filmography = generateFilmCards(FilmListCount.ALL);

if (FilmListCount.ALL === 0) {
  render(siteMainElement, new NoFilmsComponent().getElement());
} else {

  // Поиск DOM элемента-контейнера для карточек фильмов

  const filmBoardComponent = new FilmBoardComponent();
  render(siteMainElement, filmBoardComponent.getElement());

  const filmListElement = filmBoardComponent.getElement().querySelector(`.films-list`);
  const filmListContainerElement = filmListElement.querySelector(`.films-list__container`);


  // Отрисовка кнопки Load More

  const showMoreButtonComponent = new ShowMoreButtonComponent();

  render(filmListElement, showMoreButtonComponent.getElement());

  // Функция создания компонентов карточки и попапа с их отрисовкой и созданием обработчиков

  const renderFullFilmCards = (filmCard, position) => {
    const popUpFilmCardComponent = new PopUpFilmCardComponent(filmCard);
    const filmCardComponent = new FilmCardComponent(filmCard);

    render(position, filmCardComponent.getElement());

    const filmCardPosterElement = filmCardComponent.getElement().querySelector(`.film-card__poster`);
    const filmCardTitleElement = filmCardComponent.getElement().querySelector(`.film-card__title`);
    const filmCardCommentElement = filmCardComponent.getElement().querySelector(`.film-card__comments`);

    filmCardPosterElement.addEventListener(`click`, () => {
      elementFilmCardClickHandler(popUpFilmCardComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });
    filmCardTitleElement.addEventListener(`click`, () => {
      elementFilmCardClickHandler(popUpFilmCardComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });
    filmCardCommentElement.addEventListener(`click`, () => {
      elementFilmCardClickHandler(popUpFilmCardComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });
  };

  // обработчик кнопки закрытия в попапе

  const elementFilmCardClickHandler = (filmCardComp) => {
    render(filmListContainerElement, filmCardComp.getElement());

    const closePopupButtonElement = filmCardComp.getElement().querySelector(`.film-details__close-btn`);
    closePopupButtonElement.addEventListener(`click`, () => {
      filmCardComp.getElement().remove();
      filmCardComp.removeElement();
    });
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      document.querySelector(`.film-details`).remove();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  // Отрисовка карточек и реализация логики кнопки Load More

  let showingFilmCardCount = FilmListCount.START;
  filmography.slice(0, showingFilmCardCount).forEach((filmCard) => renderFullFilmCards(filmCard, filmListContainerElement));

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const previousFilmCardCount = showingFilmCardCount;
    showingFilmCardCount += FilmListCount.BY_BUTTON;
    filmography.slice(previousFilmCardCount, showingFilmCardCount).forEach((filmCard) => renderFullFilmCards(filmCard, filmListContainerElement));

    if (showingFilmCardCount >= filmography.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });

  // Поиск DOM элементов для Top Rated и Most Commented карточек фильмов

  const filmListTopRatedElement = filmBoardComponent.getElement().querySelector(`.top-rated .films-list__container`);
  const filmListMostCommentedElement = filmBoardComponent.getElement().querySelector(`.most-commented .films-list__container`);

  // Создание функции для сортировки и отрисовки карточек в Top Rated и Most Commented

  const getExtraFilmCards = (filmList, sortingElement, count = FilmListCount.EXTRA) => {
    return filmList.slice().sort((a, b) => a[sortingElement] < b[sortingElement] ? 1 : -1).splice(0, count);
  };

  // Создание функции для отрисовки случайных карточек в Top Rated и Most Commented (если комментарии/рейтинг одинаковые)

  const getRandomExtraFilmCards = filmography.slice().sort(() => {
    return 0.5 - Math.random();
  }).splice(0, FilmListCount.EXTRA);

  // Сохранение числа комментариев и рейтинга для первых элементов списка карточек для сравнения

  const filmCommentFirst = filmography[0].comments;
  const filmRatingFirst = filmography[0].rating;

  // Создание функции сравнения количества комментариев и рейтинга в списке карт

  const getFilmsCompareResult = (films, compareItem, firstItem) => {
    return films.every((item) => {
      return item.compareItem === firstItem;
    });
  };

  // Поиск DOM элемента для блока с Most commented

  const mostCommentedElement = filmBoardComponent.getElement().querySelector(`.most-commented`);

  // Проверка на отсутствие комментариев к фильмам

  const getFiltredMostCommentedFilms = filmography.slice().filter((item) => {
    return item.comments === 0;
  });

  // Поиск DOM элемента для блока с Top Rated

  const topRatedElement = filmBoardComponent.getElement().querySelector(`.top-rated`);

  // Проверка на отсутствие рейтинга у фильмов

  const getFiltredTopRatedFilms = filmography.filter((item) => {
    return item.rating === 0;
  });

  // Функция Отрисовки карточек в Most Commented и Top Rated при соблюдении условий: нет комментариев/оценок, одинаковое количество, отсортированные комментарии/лценки

  const renderFiltredExtraFilmCards = (fitredExtraFilms, allFilms, extraElement, filterItem, firstFilm, extraCardPosition) => {
    if (fitredExtraFilms === allFilms.length) {
      extraElement.remove();
    } else {
      if (getFilmsCompareResult(allFilms, filterItem, firstFilm)) {
        getRandomExtraFilmCards.forEach((filmCard) => renderFullFilmCards(filmCard, extraCardPosition));
      } else {
        const extraFilms = getExtraFilmCards(filmography, filterItem);
        extraFilms.forEach((filmCard) => renderFullFilmCards(filmCard, extraCardPosition));
      }
    }
  };

  renderFiltredExtraFilmCards(getFiltredMostCommentedFilms, filmography, mostCommentedElement, `rating`, filmRatingFirst, filmListTopRatedElement);
  renderFiltredExtraFilmCards(getFiltredTopRatedFilms, filmography, topRatedElement, `comments`, filmCommentFirst, filmListMostCommentedElement);
}
// Указание общего количества фильмов в базе

const footerFilmsStatisticElement = document.querySelector(`.footer__statistics > p`);
footerFilmsStatisticElement.innerHTML = `${filmography.length} movies inside`;
