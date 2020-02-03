import AbstractComponent from './abstract-component';
import moment from 'moment';
import Chart from 'chart.js';
import chartjsPlugin from 'chartjs-plugin-datalabels';

const FilterStatType = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getTodayWatchedFilms = (filmCards) => {
  const endDate = moment();
  const startDate = endDate.startOf(`day`).toDate();
  const returningFilmCards = [...filmCards];
  return returningFilmCards.filter((item) => item.watchedDate > startDate);
};

const getWeekWatchedFilms = (filmCards) => {
  const endDate = moment();
  const startDate = endDate.subtract(7, `d`);
  const returningFilmCards = [...filmCards];
  return returningFilmCards.filter((item) => item.watchedDate > startDate);
};

const getMonthWatchedFilms = (filmCards) => {
  const endDate = moment();
  const startDate = endDate.subtract(30, `d`);
  const returningFilmCards = [...filmCards];
  return returningFilmCards.filter((item) => item.watchedDate > startDate);
};

const getYearWatchedFilms = (filmCards) => {
  const endDate = moment();
  const startDate = endDate.subtract(365, `d`);
  const returningFilmCards = [...filmCards];
  return returningFilmCards.filter((item) => item.watchedDate > startDate);
};

const getSortedGenres = (genres) => {
  const uniqueGenres = new Set();
  const allGenres = [];

  genres.forEach((item) => [...item.genres].forEach((element) => {
    uniqueGenres.add(element);
    allGenres.push(element);
  })
  );

  const genresMaps = [...uniqueGenres].map((element1) => {
    let genreCount = 0;
    allGenres.forEach((element2) => (element2 === element1 ? genreCount++ : ``));

    return {
      genre: element1,
      count: genreCount
    };
  });

  return genresMaps.sort((a, b) => b.count - a.count);
};

const renderChart = (filmCards) => {
  const genres = getSortedGenres(filmCards);

  const ctx = document.querySelector(`.statistic__chart`).getContext(`2d`);
  const myChart = new Chart(ctx, {
    plugins: [chartjsPlugin],
    type: `horizontalBar`,
    data: {
      labels: genres.map((el) => el.genre),
      datasets: [
        {
          data: genres.map((el) => el.count),
          backgroundColor: `#ffe800`,
          strokeColor: `#ffe800`,
          borderWidth: 1,
          datalabels: {
            anchor: `start`,
            align: `start`,
            offset: 50,
            color: `#ffffff`,
            font: {
              size: 16
            },
            formatter: (value, context) =>
              `${context.chart.data.labels[context.dataIndex]}             ${value}`
          }
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      layout: {
        padding: {
          left: 200
        }
      },
      scales: {
        xAxes: [
          {
            display: false,
            ticks: {
              stepSize: 1,
              beginAtZero: true
            }
          }
        ],
        yAxes: [
          {
            display: false,
            barPercentage: 0.5,
            categoryPercentage: 1
          }
        ]
      }
    }
  });
  return myChart;
};


const getProfileRating = () => {
  let profile = `-`;

  if (document.querySelector(`.profile__rating`)) {
    profile = document.querySelector(`.profile__rating`).textContent;

    return profile;
  }

  return profile;
};

const createStatTemplate = (filmCards) => {
  const sortedByGenre = getSortedGenres(filmCards);
  const topGenre = sortedByGenre[0] ? sortedByGenre[0].genre : `-`;
  const whatchedCount = filmCards.length;

  const totalFilmDuration = moment.duration(filmCards.reduce((accumulator, element) => accumulator + element.duration, 0));

  return `<section class="statistic visually-hidden">
            <p class="statistic__rank">
              Your rank
              <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
              <span class="statistic__rank-label">${getProfileRating()}</span>
            </p>
            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
              <p class="statistic__filters-description">Show stats:</p>
              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>
              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
              <label for="statistic-today" class="statistic__filters-label">Today</label>
              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
              <label for="statistic-week" class="statistic__filters-label">Week</label>
              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
              <label for="statistic-month" class="statistic__filters-label">Month</label>
              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
              <label for="statistic-year" class="statistic__filters-label">Year</label>
            </form>
            <div class= "statistic__updated-wrapper">
            <ul class="statistic__text-list">
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">You watched</h4>
                <p class="statistic__item-text">${whatchedCount} <span class="statistic__item-description">movies</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Total duration</h4>
<p class="statistic__item-text">${totalFilmDuration.hours() + (totalFilmDuration.days() * 24)} <span class="statistic__item-description">h</span>${totalFilmDuration.minutes()}<span class="statistic__item-description">m</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Top genre</h4>
                <p class="statistic__item-text">${topGenre}</p>
              </li>
            </ul>
            <div class="statistic__chart-wrap">
              <canvas class="statistic__chart" width="1000"></canvas>
            </div>
            </div>
          </section>`;
};

export default class Stat extends AbstractComponent {
  constructor(model) {
    super();

    this._model = model;
    this._filteredFilms = model.getFilmsAll().filter((item) => item.isAlreadyWatched);
    this._filterType = FilterStatType.ALL_TIME;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  rerender() {
    const prevElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();

    prevElement.querySelector(`.statistic__updated-wrapper`).parentElement.replaceChild(newElement.querySelector(`.statistic__updated-wrapper`), prevElement.querySelector(`.statistic__updated-wrapper`));
    this.setElement(prevElement);
    renderChart(this._filteredFilms);
  }

  _setFilterData(filter) {
    switch (filter) {
      case FilterStatType.TODAY:
        this._filteredFilms = getTodayWatchedFilms(this._model.getFilmsAll().filter((item) => item.isAlreadyWatched));
        this._filterType = FilterStatType.TODAY;
        break;
      case FilterStatType.WEEK:
        this._filteredFilms = getWeekWatchedFilms(this._model.getFilmsAll().filter((item) => item.isAlreadyWatched));
        this._filterType = FilterStatType.WEEK;
        break;
      case FilterStatType.MONTH:
        this._filteredFilms = getMonthWatchedFilms(this._model.getFilmsAll().filter((item) => item.isAlreadyWatched));
        this._filterType = FilterStatType.MONTH;
        this.rerender();
        break;
      case FilterStatType.YEAR:
        this._filteredFilms = getYearWatchedFilms(this._model.getFilmsAll().filter((item) => item.isAlreadyWatched));
        this._filterType = FilterStatType.YEAR;
        break;
      default:
        this._filteredFilms = this._model.getFilmsAll().filter((item) => item.isAlreadyWatched);
        this._filterType = FilterStatType.ALL_TIME;
        this.rerender();
    }
  }

  _filterChangeHandler(evt) {
    this._setFilterData(evt.target.value);
    this.rerender();
  }

  getTemplate() {
    return createStatTemplate(this._filteredFilms);
  }

  _setFilterListener() {
    const filters = this.getElement().querySelector(`.statistic__filters`);
    filters.addEventListener(`change`, this._filterChangeHandler);
  }

  renderChart() {
    this._setFilterData(this._filterType);
    this.rerender();
    this._setFilterListener();
  }
}
