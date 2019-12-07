const getfilmViewedCount = (min, max) => {
  return Math.floor((max - min) * Math.random() + min);
};

const filmViewedCount = getfilmViewedCount(0, 30);

let profileRating;

switch (true) {
  case filmViewedCount >= 1 && filmViewedCount <= 10:
    profileRating = `Novice`;
    break;

  case filmViewedCount >= 11 && filmViewedCount <= 20:
    profileRating = `Fan`;
    break;

  case filmViewedCount >= 21:
    profileRating = `Movie Buff`;
    break;
  default:
    filmViewedCount = null;
}

export const createProfileRatingTemplate = () => {
  return `
    <section class="header__profile profile">
      <p class="profile__rating">${profileRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};

