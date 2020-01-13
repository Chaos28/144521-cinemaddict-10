import AbstractComponent from './abstract-component';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    oldElement.querySelector(`.film-details__inner`).parentElement.replaceChild(newElement.querySelector(`.film-details__inner`), oldElement.querySelector(`.film-details__inner`));
    this.setElement(oldElement);

    this.recoveryListeners();
  }
}
