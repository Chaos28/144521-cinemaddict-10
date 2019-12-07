import {createFilmListTemplate} from './components/films';
import {createNavigationListTemplate} from './components/navigation';
import {createSortFilmTemplate} from './components/sort.js';
import {createFilmCardETemplate} from './components/film-card';
import {createPopUpFilmCardTemplate} from './components/popup';
import {createShowMoreButtonTemplate} from './components/show-more-button';
import {createProfileRatingTemplate} from './components/profile-rating';
import {render} from './utils';
import {generateFilmCards} from './mock/film-card';


const FilmList = {
  ALL_COUNT: 15,
  COUNT_ON_START: 5,
  COUNT_BY_BUTTON: 5,
  EXTRA_COUNT: 2,
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileRatingTemplate());
render(siteMainElement, createNavigationListTemplate());
render(siteMainElement, createSortFilmTemplate());

render(siteMainElement, createFilmListTemplate());

const filmListElement = siteMainElement.querySelector(`.films-list`);
const filmListContainerElement = filmListElement.querySelector(`.films-list__container`);

const films = generateFilmCards(FilmList.ALL_COUNT);

let showingFilmCardCount = FilmList.COUNT_ON_START;

films.slice(0, showingFilmCardCount).forEach((filmCard) => render(filmListContainerElement, createFilmCardETemplate(filmCard)));

render(filmListElement, createShowMoreButtonTemplate());

const loadMoareButtonElement = siteMainElement.querySelector(`.films-list__show-more`);

loadMoareButtonElement.addEventListener(`click`, () => {
  const previousFilmCardCount = showingFilmCardCount;
  showingFilmCardCount += FilmList.COUNT_BY_BUTTON;
  films.slice(previousFilmCardCount, showingFilmCardCount).forEach((filmCard) => render(filmListContainerElement, createFilmCardETemplate(filmCard)));

  if (showingFilmCardCount >= films.length) {
    loadMoareButtonElement.remove();
  }
});

const filmListTopRatedElement = siteMainElement.querySelector(`.top-rated > .films-list__container`);
const filmListMostCommentedElement = siteMainElement.querySelector(`.most-commented > .films-list__container`);

const getFilmCardExtra = (filmList, sortingElement, count = FilmList.EXTRA_COUNT) => {
  return filmList.slice().sort((a, b) => a[sortingElement] < b[sortingElement] ? 1 : -1).splice(0, count);
};

const topRatedFilms = getFilmCardExtra(films, `rating`);
const mostCommentedFilms = getFilmCardExtra(films, `comments`);

topRatedFilms.forEach((filmCard) => render(filmListTopRatedElement, createFilmCardETemplate(filmCard)));
mostCommentedFilms.forEach((filmCard) => render(filmListMostCommentedElement, createFilmCardETemplate(filmCard)));

const topRatedBlock = siteMainElement.querySelector(`.top-rated`);
const mostCommentedBlock = siteMainElement.querySelector(`.most-commented`);

const topRatedFilmsFiltred = films.filter((index) => {
  return index[`rating`] === 0;
});

const mostCommentedFiltred = films.filter((index) => {
  return index[`comments`] === 0;
});

if (topRatedFilmsFiltred.length === films.length) {
  topRatedBlock.remove();
}

if (mostCommentedFiltred.length === films.length) {
  mostCommentedBlock.remove();
}

const footerFilmsStatistic = document.querySelector(`.footer__statistics > p`);
footerFilmsStatistic.innerHTML = `${FilmList.ALL_COUNT} movies inside`;

render(filmListElement, createPopUpFilmCardTemplate(films[0]));

const closePopupButton = document.querySelector(`.film-details__close-btn`);

closePopupButton.addEventListener(`click`, () => {
  const popupElement = document.querySelector(`.film-details`);
  popupElement.style = `display: none`;
});
