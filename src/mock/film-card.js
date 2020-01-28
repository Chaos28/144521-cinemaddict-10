import {getRandomIntegerNumber, getRandomArrayItem, getUniqueList, getComments} from '../mock/utils';
import {MAX_RATING} from '../const';

const FILM_TITLES = [
  `Back to the Future`,
  `Watchmen`,
  `A Fistful of Dollars`,
  `Scott Pilgrim vs. the World`,
  `Terminator 2`,
  `Star Wars: Episode 2`,
  `Prestige`,
  `Indiana Jones`,
  `Blade Runner`,
  `The Matrix`,
  `Constantine`,
  `Green Mile`,
  `Forrest Gump`,
  `Pulp Fiction`,
  `Once Upon a Time in… Hollywood`
];

const FILM_DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const FILM_POSTERS = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`
];

const FILM_GENRES = [
  `Music`,
  `Action`,
  `Adventure`,
  `Comedy`,
  `Drama`,
  `Horror`,
  `Science Fiction`,
  `Western`
];

const COUNTRIES = [
  `USA`,
  `France`,
  `Tokyo`,
  `Japan`,
  `China`,
  `Canada`
];

const DIRECTOR_NAMES = [
  `Robert Zemeckis`,
  `Alfred Hitchcock`,
  `Christopher Nolan`,
  `Woody Allen`,
  `David Fincher`,
  `Quentin Tarantino`,
  `James Cameron`,
  `George Lucas`,
  `Steven Spielberg`,
  `Martin Scorsese`
];

const WRITER_NAMES = [
  `Billy Wilder`,
  `Joel Coen`,
  `Robert Towne`,
  `Francis Ford Coppola`,
  `William Goldman`
];

const ACTOR_NAMES = [
  `Alan Rickman`,
  `Benedict Cumberbatch`,
  `Vincent Cassel`,
  `Viggo Mortensen`,
  `James McAvoy`
];

const getRandomRating = (max) => {
  return +(max * Math.random()).toFixed(1);
};

const getMillisecondsFromMinutes = (minutes) => {
  return minutes * 60 * 1000;
};

const generateFilmCard = () => {

  const duration = getRandomIntegerNumber(getMillisecondsFromMinutes(60), getMillisecondsFromMinutes(120));

  const releaseDate = new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 10000)));

  const whatchedDate = new Date(new Date().setDate(new Date().getDate() - (Math.random() * Math.round((new Date() - releaseDate) / (1000 * 60 * 60 * 24)))));

  const isAlreadyWatched = Math.random() > 0.5;

  return {
    title: getRandomArrayItem(FILM_TITLES),
    rating: getRandomRating(MAX_RATING),
    duration,
    genres: new Set(getUniqueList(FILM_GENRES)),
    poster: getRandomArrayItem(FILM_POSTERS),
    description: new Set(getUniqueList(FILM_DESCRIPTIONS)),
    comments: getComments(getRandomIntegerNumber(0, 30)),
    age: `${getRandomIntegerNumber(10, 19)} +`,
    director: getRandomArrayItem(DIRECTOR_NAMES),
    writers: new Set(getUniqueList(WRITER_NAMES)),
    actors: new Set(getUniqueList(ACTOR_NAMES)),
    releaseDate,
    country: getRandomArrayItem(COUNTRIES),
    isAddedToWatchlist: Math.random() > 0.5,
    isFavorites: Math.random() > 0.5,
    isAlreadyWatched,
    whatchedDate: isAlreadyWatched ? whatchedDate : null,
  };
};

const generateFilmCards = (count) => {
  return new Array(count).fill(``).map((item, index) => {
    return Object.assign({}, generateFilmCard(), {id: index});
  });
};

export {generateFilmCard, generateFilmCards};
