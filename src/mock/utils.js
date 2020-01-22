const comments = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Good movie!`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `Not Bad`
];

const emojiImg = [
  `puke.png`,
  `sleeping.png`,
  `angry.png`,
  `smile.png`,
  `trophy.png`];

const usersNames = [
  `Tim Macoveev`,
  `John Doe`,
  `Janna d'Arc`,
  `Vladimir`,
  `Alexandr`
];

const getRandomIntegerNumber = (min, max) => {
  return Math.floor((max - min) * Math.random() + min);
};

const getUniqueList = (list) => {
  return list.slice().filter(() => Math.random() > 0.5).slice(0, 3);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomCommentDate = () => new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 10)));

const getRandomComment = () => {
  return {
    userName: getRandomArrayItem(usersNames),
    comment: getRandomArrayItem(comments),
    date: getRandomCommentDate(),
    emoji: getRandomArrayItem(emojiImg)
  };
};

const getComments = (count) => {
  return new Array(count).fill(``).map((item, index) => {
    return Object.assign({}, getRandomComment(), {id: index});
  });
};

export {getRandomIntegerNumber, getUniqueList, getRandomArrayItem, usersNames, getComments};
