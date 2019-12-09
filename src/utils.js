const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getRandomIntegerNumber = (min, max) => {
  return Math.floor((max - min) * Math.random() + min);
};

const getUniqueList = (list) => {
  return list.slice().filter(() => Math.random() > 0.5).slice(0, 3);
};

const createDescription = (descriptions) => {
  return descriptions.map((descr) => {
    return `${descr}`;
  }).join(` `);
};

export {render, getRandomIntegerNumber, getUniqueList, createDescription};

