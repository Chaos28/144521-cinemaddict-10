// Импортирование модулей
import PageController from './controllers/film-board-controller';
// import NavigationController from './controllers/navigation-controller';
import FilmBoardComponent from './components/films';
import NoFilmsComponent from './components/no-films';
import ProfileRatingComponent from './components/profile-rating';
import StatComponent from './components/stat';
import {FilmListCount} from './const';
import {render} from './utils/utils';
import {getRandomIntegerNumber} from './mock/utils';
import {generateFilmCards} from './mock/film-card';
import Films from './models/movies';

// поиск DOM элементов для навигации и основного контента

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

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
const films = new Films();
films.setFilms(filmographies);

const statComponent = new StatComponent(films);

if (FilmListCount.ALL === 0) {
  render(siteMainElement, new NoFilmsComponent());
} else {
  const filmBoardComponent = new FilmBoardComponent();

  render(siteMainElement, filmBoardComponent);

  const pageController = new PageController(filmBoardComponent, films, statComponent);
  pageController.render();
  render(siteMainElement, statComponent);
}

// Указание общего количества фильмов в базе

const footerFilmsStatisticElement = document.querySelector(`.footer__statistics > p`);
footerFilmsStatisticElement.innerHTML = `${filmographies.length} movies inside`;
