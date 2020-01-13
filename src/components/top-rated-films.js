import AbstractComponent from './abstract-component';

const createTopRatedTemplate = () => {
  return `<section class="films-list--extra top-rated">
            <h2 class="films-list__title">Top rated</h2>
            <div class="films-list__container"></div>
          </section>`;
};

export default class TopRated extends AbstractComponent {
  getTemplate() {
    return createTopRatedTemplate();
  }
}
