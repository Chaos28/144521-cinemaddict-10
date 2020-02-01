export default class Comment {
  constructor(film) {
    this.id = film.id;
    this.user = film.author;
    this.comment = film.comment;
    this.date = new Date(film.date);
    this.emoji = `${film.emotion}.png`;
  }

  static parseComment(film) {
    return new Comment(film);
  }

  static parseComments(film) {
    return film.map(Comment.parseComment);
  }

  static parsePostResponce(film) {
    return new Comment(film.comments.pop());
  }
}
