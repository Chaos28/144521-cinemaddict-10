import Film from './models/movie';
import Comment from './models/comment';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (responce) => {
  if (responce.status >= 200 && responce.status < 300) {
    return responce;
  } else {
    throw new Error(`${responce.status}: ${responce.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilmCards() {
    return this._load({url: `movies`})
      .then((responce) => responce.json())
      .then(Film.parseFilmCards);
  }

  // createFilmCardComment(filmCard) {

  // }

  updateFilmCard(id, film) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(film.toRAW()),
      headers: new Headers({'Content-type': `application/json`})
    })
      .then((responce) => responce.json())
      .then(Film.parseFilmCard);
  }

  // deleteFilmCardComment(id) {

  // }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus).catch((err) => {
        throw err;
      });
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((responce) => responce.json())
      .then(Comment.parseComments);
  }
}
