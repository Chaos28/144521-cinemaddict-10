import AbstractComponent from './abstract-component';

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};


export default class LoadMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setShowMoreButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
