import API from './api';
import PageController from './controllers/film-board-controller';
import FilmBoardComponent from './components/films';
import NoFilmsComponent from './components/no-films';
import ProfileRatingComponent from './components/profile-rating';
import StatComponent from './components/stat';
import {render} from './utils/utils';
import FilmsModel from './models/movies';

const AUTHORIZATION = `Basic dXNlcckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

const api = new API(END_POINT, AUTHORIZATION);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

api.getFilmCards().then((filmCards) => {

  if (filmCards.length === 0) {
    render(siteMainElement, new NoFilmsComponent());
  } else {
    const filmsModel = new FilmsModel();
    filmsModel.setFilms(filmCards);
    const filmBoardComponent = new FilmBoardComponent();
    render(siteMainElement, filmBoardComponent);

    const statComponent = new StatComponent(filmsModel);
    const pageController = new PageController(filmBoardComponent, filmsModel, statComponent, api);
    pageController.render();


    const getFilmViewedCount = filmCards.filter((item) => item.isAlreadyWatched).length;

    if (getFilmViewedCount !== 0) {
      render(siteHeaderElement, new ProfileRatingComponent(getFilmViewedCount));
    } else {
      render(siteHeaderElement, new ProfileRatingComponent(getFilmViewedCount));
      siteHeaderElement.querySelector(`.profile__rating`).remove();
    }
    render(siteMainElement, statComponent);

    const footerFilmsStatisticElement = document.querySelector(`.footer__statistics > p`);
    footerFilmsStatisticElement.innerHTML = `${filmCards.length} movies inside`;
  }
});
