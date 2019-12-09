// Импортирование модулей

import {FilmList} from './const';
import {createFilmListTemplate} from './components/films';
import {createNavigationListTemplate} from './components/navigation';
import {createSortFilmTemplate} from './components/sort.js';
import {createFilmCardETemplate} from './components/film-card';
import {createPopUpFilmCardTemplate} from './components/popup';
import {createShowMoreButtonTemplate} from './components/show-more-button';
import {createProfileRatingTemplate} from './components/profile-rating';
import {render, getRandomIntegerNumber} from './utils';
import {generateFilmCards} from './mock/film-card';

// поиск DOM элементов для навигации и основного контента

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

// отрисовка DOM элементов

render(siteMainElement, createNavigationListTemplate());
render(siteMainElement, createSortFilmTemplate());
render(siteMainElement, createFilmListTemplate());

// Отрисовка ранга пользователя

const filmViewedCount = getRandomIntegerNumber(0, 30);

if (filmViewedCount !== 0) {
  render(siteHeaderElement, createProfileRatingTemplate(filmViewedCount));
} else {
  render(siteHeaderElement, createProfileRatingTemplate());
  siteHeaderElement.querySelector(`.profile__rating`).remove();
}

// Поиск DOM элемента-контейнера для карточек фильмов

const filmListElement = siteMainElement.querySelector(`.films-list`);
const filmListContainerElement = filmListElement.querySelector(`.films-list__container`);

// Генерация набора карточек фильмов

const films = generateFilmCards(FilmList.ALL_COUNT);

// Отрисовка кнопки Load More

render(filmListElement, createShowMoreButtonTemplate());

// Отрисовка карточек и реализация логики кнопки Load More

let showingFilmCardCount = FilmList.START_COUNT;
films.slice(0, showingFilmCardCount).forEach((filmCard) => render(filmListContainerElement, createFilmCardETemplate(filmCard)));
const loadMoreButtonElement = siteMainElement.querySelector(`.films-list__show-more`);
loadMoreButtonElement.addEventListener(`click`, () => {
  const previousFilmCardCount = showingFilmCardCount;
  showingFilmCardCount += FilmList.BY_BUTTON_COUNT;
  films.slice(previousFilmCardCount, showingFilmCardCount).forEach((filmCard) => render(filmListContainerElement, createFilmCardETemplate(filmCard)));

  if (showingFilmCardCount >= films.length) {
    loadMoreButtonElement.remove();
  }
});

// Поиск DOM элементов для Top Rated и Most Commented карточек фильмов

const filmListTopRatedElement = siteMainElement.querySelector(`.top-rated .films-list__container`);
const filmListMostCommentedElement = siteMainElement.querySelector(`.most-commented .films-list__container`);

// Создание функции для сортировки и отрисовки карточек в Top Rated и Most Commented

const getExtraFilmCards = (filmList, sortingElement, count = FilmList.EXTRA_COUNT) => {
  return filmList.slice().sort((a, b) => a[sortingElement] < b[sortingElement] ? 1 : -1).splice(0, count);
};

// Создание функции для отрисовки случайных карточек в Top Rated и Most Commented (если комментарии/рейтинг одинаковые)

const randomExtraFilmCards = films.slice().sort(() => {
  return 0.5 - Math.random();
}).splice(0, FilmList.EXTRA_COUNT);

// Сохранение числа комментариев и рейтинга для первых элементов списка карточек для сравнения

const filmCommentFirst = films[0].comments;
const filmRatingFirst = films[0].rating;

// Создание функции сравнения количества комментариев и рейтинга в списке карт

const filmsCompareResult = (filmsList, compareItem, firstItem) => {
  return filmsList.slice().every((item) => {
    return item.compareItem === firstItem;
  });
};

// Поиск DOM элемента для блока с Most commented

const mostCommentedElement = siteMainElement.querySelector(`.most-commented`);

// Проверка на отсутствие комментариев к фильмам

const filtredMostCommentedFilms = films.slice().filter((item) => {
  return item.comments === 0;
});

// Отрисовка карточек в Most Commented при соблюдении условий: нет комментариев, одинаковое количество, отсортированные комментарии

if (filtredMostCommentedFilms.length === films.length) {
  mostCommentedElement.remove();
} else {
  if (filmsCompareResult(films, `comments`, filmCommentFirst)) {
    randomExtraFilmCards.forEach((filmCard) => render(filmListMostCommentedElement, createFilmCardETemplate(filmCard)));
  } else {
    const mostCommentedFilms = getExtraFilmCards(films, `comments`);
    mostCommentedFilms.forEach((filmCard) => render(filmListMostCommentedElement, createFilmCardETemplate(filmCard)));
  }
}

// Поиск DOM элемента для блока с Top Rated

const topRatedElement = siteMainElement.querySelector(`.top-rated`);

// Проверка на отсутствие рейтинга у фильмов

const filtredTopRatedFilms = films.filter((item) => {
  return item.rating === 0;
});

// Отрисовка карточек в Top Rated при соблюдении условий: нет рейтинга, одинаковый рейтинг, отсортированные рейтинги

if (filtredTopRatedFilms.length === films.length) {
  topRatedElement.remove();
} else {
  if (filmsCompareResult(films, `rating`, filmRatingFirst)) {
    randomExtraFilmCards.forEach((filmCard) => render(filmListTopRatedElement, createFilmCardETemplate(filmCard)));
  } else {
    const topRatedFilms = getExtraFilmCards(films, `rating`);
    topRatedFilms.forEach((filmCard) => render(filmListTopRatedElement, createFilmCardETemplate(filmCard)));
  }
}

// Указание общего количества фильмов в базе

const footerFilmsStatisticElement = document.querySelector(`.footer__statistics > p`);
footerFilmsStatisticElement.innerHTML = `${FilmList.ALL_COUNT} movies inside`;

render(filmListElement, createPopUpFilmCardTemplate(films[0]));

// Поиск и отрисовка кнопки закрытия для попапа

const closePopupButtonElement = document.querySelector(`.film-details__close-btn`);

closePopupButtonElement.addEventListener(`click`, () => {
  const popupElement = document.querySelector(`.film-details`);
  popupElement.style.display = `none`;
});
