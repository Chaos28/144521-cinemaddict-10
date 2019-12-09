export const createProfileRatingTemplate = (count) => {

  let profileRating;

  switch (true) {
    case count >= 1 && count <= 10:
      profileRating = `Novice`;
      break;

    case count >= 11 && count <= 20:
      profileRating = `Fan`;
      break;

    case count >= 21:
      profileRating = `Movie Buff`;
      break;
  }

  return `<section class="header__profile profile">
            <p class="profile__rating">${profileRating}</p>
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};

