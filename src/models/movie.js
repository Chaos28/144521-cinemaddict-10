export default class Film {
  constructor(film) {
    this.id = film[`id`];
    this.comments = film[`comments`] || ``;
    this.title = film[`film_info`][`title`];
    this.alternativeTitle = film[`film_info`][`alternative_title`];
    this.rating = film[`film_info`][`total_rating`];
    this.poster = film[`film_info`][`poster`];
    this.age = film[`film_info`][`age_rating`];
    this.director = film[`film_info`][`director`];
    this.writers = new Set(film[`film_info`][`writers`]);
    this.actors = new Set(film[`film_info`][`actors`]);
    this.releaseDate = film[`film_info`][`release`][`date`] ? new Date(film[`film_info`][`release`][`date`]) : null;
    this.country = film[`film_info`][`release`][`release_country`];
    this.duration = film[`film_info`][`runtime`] * 60 * 1000;
    this.genres = new Set(film[`film_info`][`genre`]);
    this.description = film[`film_info`][`description`] || ``;
    this.personalRating = film[`user_details`][`personal_rating`];
    this.isAddedToWatchlist = Boolean(film[`user_details`][`watchlist`]);
    this.isAlreadyWatched = Boolean(film[`user_details`][`already_watched`]);
    this.isFavorites = Boolean(film[`user_details`][`favorite`]);
    this.watchedDate = new Date(film[`user_details`][`watching_date`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.title,
        'alternative_title': this.alternativeTitle,
        'total_rating': this.rating,
        'poster': `${this.poster}`,
        'age_rating': this.age,
        'director': this.director,
        'writers': Array.from(this.writers),
        'actors': Array.from(this.actors),
        'release': {
          'date': this.releaseDate.toISOString(),
          'release_country': this.country
        },
        'runtime': Math.floor(this.duration / 60 / 1000),
        'genre': Array.from(this.genres),
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.personalRating,
        'watchlist': this.isAddedToWatchlist,
        'already_watched': this.isAlreadyWatched,
        'favorite': this.isFavorites,
        'watching_date': this.watchedDate ? this.watchedDate.toISOString() : this.watchedDate,
      }
    };
  }

  static parseFilmCard(film) {
    return new Film(film);
  }

  static parseFilmCards(film) {
    return film.map(Film.parseFilmCard);
  }

  static clone(film) {
    return new Film(film.toRAW());
  }
}
