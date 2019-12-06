import {createFilmListTemplate} from './components/films';
import {createNavigationListTemplate} from './components/navigation';
import {createSortFilmTemplate} from './components/sort.js';
import {createFilmCardETemplate} from './components/film-card';
// import {createPopUpFilmCardTemplate} from './components/popup';
import {createShowMoreButtonTemplate} from './components/show-more-button';
import {createProfileRatingTemplate} from './components/profile-rating';
import {render} from './utils';

const FilmList = {
  COUNT: 5,
  EXTRA_COUNT: 2
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileRatingTemplate(), `beforeend`);
render(siteMainElement, createNavigationListTemplate(), `beforeend`);
render(siteMainElement, createSortFilmTemplate(), `beforeend`);

render(siteMainElement, createFilmListTemplate(), `beforeend`);

const filmListElement = siteMainElement.querySelector(`.films-list`);
const filmListContainerElement = filmListElement.querySelector(`.films-list__container`);
const filmListExtraElement = siteMainElement.querySelector(`.films`).querySelectorAll(`.films-list--extra`);

const filmCardTemplates = new Array(FilmList.COUNT).fill(``).map(createFilmCardETemplate).join(``);
const filmCardExtraTemplates = new Array(FilmList.EXTRA_COUNT).fill(``).map(createFilmCardETemplate).join(``);

render(filmListContainerElement, filmCardTemplates, `beforeend`);

filmListExtraElement.forEach((item) => {
  const ExtraElement = item.querySelector(`.films-list__container`);
  render(ExtraElement, filmCardExtraTemplates, `beforeend`);
});

render(filmListElement, createShowMoreButtonTemplate(), `beforeend`);
