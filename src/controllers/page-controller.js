import TopRatedComponent from '../components/top-rated-films';
import NavigationController from './navigation-controller';
import MostCommentedComponent from '../components/most-commented-films';
import SortComponent, {SortType} from '../components/sort';
import ShowMoreButtonComponent from '../components/show-more-button';
import {FilmListCount} from '../const';
import {render, remove, RenderPosition} from '../utils/utils';
import MovieController from './movie-controller';
import FilmModel from '../models/movie';
import Comment from '../models/comment';

const siteMainElement = document.querySelector(`.main`);

const renderFilmCards = (filmListElement, films, onDataChange, onViewChange, api) => {
  return films.map((filmCard) => {
    const movieController = new MovieController(filmListElement, onDataChange, onViewChange, api);
    movieController.render(filmCard);

    return movieController;
  });
};

export default class PageController {
  constructor(container, films, stat, api) {
    this._api = api;
    this._cont = container;
    this._container = container.getElement();
    this._filmsContainer = this._container.querySelector(`.films-list__container`);
    this._filmsModel = films;
    this._films = null;
    this._stat = stat;
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortComponent = new SortComponent();

    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._navigationController = null;

    this._showedFilmCardControllers = [];
    this._showingFilmCardCount = FilmListCount.START;
    this._showedExtraFilmCardControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._updateFilmCards = this._updateFilmCards.bind(this);
    this._removeFilmCards = this._removeFilmCards.bind(this);

    this._filmsModel.setFilterClickHandler(this._onFilterChange);
  }

  render() {
    render(siteMainElement, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._navigationController = new NavigationController(siteMainElement, this._filmsModel, this, this._stat);
    this._navigationController.render();

    this._sortComponent.setSortTypeChangeHandler((filmSortType) => {
      let sortedFilms = [];

      switch (filmSortType) {
        case SortType.YEAR_UP:
          sortedFilms = this._films.slice().sort((a, b) => b.releaseDate.getFullYear() - a.releaseDate.getFullYear());
          break;
        case SortType.RATING_UP:
          sortedFilms = this._films.slice().sort((a, b) => b.rating - a.rating);
          break;
        case SortType.DEFAULT:
          sortedFilms = this._filmsModel.getFilmsAll();
          break;
      }

      this._filmsContainer.innerHTML = ``;
      this._films = sortedFilms;
      const newFltredFilmCards = renderFilmCards(this._filmsContainer, this._films.slice(0, this._showingFilmCardCount), this._onDataChange, this._onViewChange, this._api);

      this._showedFilmCardControllers = this._showedFilmCardControllers.concat(newFltredFilmCards);
    });
    this.renderFilms(this._filmsModel.getFilmsAll());
    this.renderExtraFilms();
  }

  renderFilms(finalFilmList) {
    this._films = finalFilmList;
    this._filmsContainer.innerHTML = ``;
    const newFilmCards = renderFilmCards(this._filmsContainer, this._films.slice(0, this._showingFilmCardCount), this._onDataChange, this._onViewChange, this._api);
    this._showedFilmCardControllers = this._showedFilmCardControllers.concat(newFilmCards);
    this._renderShowMoreButton();

    render(this._container, this._topRatedComponent);
    render(this._container, this._mostCommentedComponent);
  }

  renderExtraFilms() {
    const filmListTopRatedElement = this._container.querySelector(`.top-rated .films-list__container`);
    const filmListMostCommentedElement = this._container.querySelector(`.most-commented .films-list__container`);

    const getExtraFilmCards = (filmList, sortingElement, count = FilmListCount.EXTRA) => {
      return filmList.slice().sort((a, b) => {
        if (a[sortingElement] instanceof Array) {
          return a[sortingElement].length < b[sortingElement].length ? 1 : -1;
        }
        return a[sortingElement] < b[sortingElement] ? 1 : -1;
      }).splice(0, count);
    };

    const getRandomExtraFilmCards = this._films.slice().sort(() => {
      return 0.5 - Math.random();
    }).splice(0, FilmListCount.EXTRA);

    const filmRatingFirst = this._films[0].rating;
    const filmCommentFirst = this._films[0].comments;

    const getFilmsCompareResult = (filmsBase, compareItem, firstItem) => {
      return filmsBase.every((item) => {
        return item.compareItem === firstItem;
      });
    };

    const getFiltredMostCommentedFilms = this._films.slice().filter((item) => {
      return item.comments === 0;
    });

    const getFiltredTopRatedFilms = this._films.filter((item) => {
      return item.rating === 0;
    });

    const renderFiltredExtraFilmCards = (fitredExtraFilms, allFilms, extraElement, filterItem, firstFilm, extraCardPosition) => {
      let finalFilmCards;
      if (fitredExtraFilms === allFilms.length) {
        extraElement.remove();
      } else {
        if (getFilmsCompareResult(allFilms, filterItem, firstFilm)) {
          const filtredFilms = getRandomExtraFilmCards();
          finalFilmCards = renderFilmCards(extraCardPosition, filtredFilms, this._onDataChange, this._onViewChange, this._api);
        } else {
          const extraFilms = getExtraFilmCards(allFilms, filterItem);
          finalFilmCards = renderFilmCards(extraCardPosition, extraFilms, this._onDataChange, this._onViewChange, this._api);
        }
      }
      return finalFilmCards;
    };

    const showedExtraTopRatedFilmCards = renderFiltredExtraFilmCards(getFiltredTopRatedFilms, this._filmsModel.getFilmsAll(), this._container.querySelector(`.top-rated`), `rating`, filmRatingFirst, filmListTopRatedElement);
    const showedExtraMostCommentedFilmCards = renderFiltredExtraFilmCards(getFiltredMostCommentedFilms, this._filmsModel.getFilmsAll(), this._container.querySelector(`.most-commented`), `comments`, filmCommentFirst, filmListMostCommentedElement);

    this._showedExtraFilmCardControllers = this._showedExtraFilmCardControllers.concat(showedExtraTopRatedFilmCards).concat(showedExtraMostCommentedFilmCards);
  }

  _renderShowMoreButton() {
    if (this._showingFilmCardCount >= this._films.length) {
      return;
    }

    render(this._container, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
      const previousFilmCardCount = this._showingFilmCardCount;
      this._showingFilmCardCount += FilmListCount.BY_BUTTON;
      const newFilmCards = renderFilmCards(this._filmsContainer, this._films.slice(previousFilmCardCount, this._showingFilmCardCount), this._onDataChange, this._onViewChange, this._api);
      this._showedFilmCardControllers = this._showedFilmCardControllers.concat(newFilmCards);
      if (this._showingFilmCardCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(movieController, oldFilmCard, newFilmCard, filmCardDetail = null) {
    if (newFilmCard === null) {

      this._api.deleteComment(oldFilmCard)
        .then(() => {
          const oldFilm = FilmModel.clone(movieController.getFilmsData());
          const oldFilmComments = [...filmCardDetail._comments];
          const filteredComments = oldFilmComments.filter((item) => item.id * 1 !== oldFilmCard * 1);
          oldFilm.comments = filteredComments.map((item) => item.id);
          this._filmsModel.updateFilm(oldFilm.id, oldFilm);
          this._updateFilmCards();
          filmCardDetail._comments = filteredComments;
          movieController.render(oldFilm);

        });
    } else if (filmCardDetail !== null) {
      this._api.createComment(oldFilmCard.id, newFilmCard)
        .then((responce) => {
          const newFilm = FilmModel.parseFilmCard(responce.movie);
          const newComments = Comment.parseComments(responce.comments);
          const isSuccess = this._filmsModel.updateFilm(oldFilmCard.id, newFilm);

          if (isSuccess) {
            filmCardDetail._comments = newComments;
            filmCardDetail.setSending({
              flag: false,
              value: null
            });
            this._updateFilmCards();
            movieController.render(newFilm);
          }
        })
          .catch(() => {
            movieController.shakeComment();
          });
    } else {
      this._api.updateFilmCard(oldFilmCard.id, newFilmCard)
        .then((updatedFilm) => {
          const isSuccess = this._filmsModel.updateFilm(oldFilmCard.id, updatedFilm);
          if (movieController._isRatingChanging) {
            this._updateFilmCards();
            movieController._isRatingChanging = false;

          }

          if (isSuccess) {
            this._navigationController.rerender(this._films);
            this._updateFilmCards();
            movieController.render(newFilmCard);
          }
        })
          .catch(() => {
            if (movieController._isRatingChanging) {
              movieController.shakePersonalRating();
            }
          });
    }
  }

  _updateFilmCards() {
    this._removeFilmCards();
    this.renderFilms(this._filmsModel.getFilms());
    this.renderExtraFilms();
  }

  _removeFilmCards() {
    this._showedFilmCardControllers.forEach((item) => item.destroy());
    this._showedFilmCardControllers = [];

    this._showedExtraFilmCardControllers.forEach((item) => item.destroy());
    this._showedExtraFilmCardControllers = [];
  }

  _onViewChange() {
    this._showedFilmCardControllers.forEach((item) => {
      item.setDefaultView();
    });
  }

  _onFilterChange() {
    this.renderFilms(this._filmsModel.getFilms());
  }

  hide() {
    this._cont.hide();
    this._sortComponent.hide();
  }

  show() {
    this._cont.show();
    this._sortComponent.show();
  }
}
