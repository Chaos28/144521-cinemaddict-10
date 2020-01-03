// Импортирование модулей
import PageController from './controllers/film-board';
import FilmBoardComponent from './components/films';
import NoFilmsComponent from './components/no-films';
import SortComponent from './components/sort.js';
import ProfileRatingComponent from './components/profile-rating';
import NavigationComponent from './components/navigation';
import {FilmListCount} from './const';
import {render} from './utils/utils';
import {getRandomIntegerNumber} from './mock/utils';
import {generateFilmCards} from './mock/film-card';

// поиск DOM элементов для навигации и основного контента

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

// отрисовка DOM элементов

render(siteMainElement, new NavigationComponent());

// Отрисовка ранга пользователя

const filmViewedCount = getRandomIntegerNumber(0, 30);

if (filmViewedCount !== 0) {
  render(siteHeaderElement, new ProfileRatingComponent(filmViewedCount));
} else {
  render(siteHeaderElement, new ProfileRatingComponent(filmViewedCount));
  siteHeaderElement.querySelector(`.profile__rating`).remove();
}

// Генерация набора карточек фильмов

const filmographies = generateFilmCards(FilmListCount.ALL);

if (FilmListCount.ALL === 0) {
  render(siteMainElement, new NoFilmsComponent());
} else {
  const filmBoardComponent = new FilmBoardComponent();
  render(siteMainElement, new SortComponent());
  render(siteMainElement, filmBoardComponent);

  const pageController = new PageController(filmBoardComponent);
  pageController.render(filmographies);
}

// Указание общего количества фильмов в базе

const footerFilmsStatisticElement = document.querySelector(`.footer__statistics > p`);
footerFilmsStatisticElement.innerHTML = `${filmographies.length} movies inside`;
