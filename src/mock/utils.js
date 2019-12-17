const getRandomIntegerNumber = (min, max) => {
  return Math.floor((max - min) * Math.random() + min);
};

const getUniqueList = (list) => {
  return list.slice().filter(() => Math.random() > 0.5).slice(0, 3);
};

export {getRandomIntegerNumber, getUniqueList};
