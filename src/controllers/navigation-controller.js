import NavigationComponent from '../components/navigation';
import {render, replace, RenderPosition, FilterType} from '../utils/utils';

export default class NavigationController {
  constructor(container, model, pageController, stat) {
    this._container = container;
    this._model = model;
    this._navigation = null;
    this._pageController = pageController;
    this._stat = stat;
    this._activeFilter = FilterType.ALL;
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  render() {
    this._navigation = new NavigationComponent(this._model.getFilmsAll());
    this._navigation.setFiltersButtonClickHandler(this._onFilterChange);
    render(this._container, this._navigation, RenderPosition.AFTERBEGIN);
    this._model.setDataChangeHandler(this._onDataChange);
  }

  rerender() {
    const newNavComp = new NavigationComponent(this._model.getFilmsAll());
    replace(newNavComp, this._navigation);
    this._navigation = newNavComp;
    this._navigation.setFiltersButtonClickHandler(this._onFilterChange);
  }

  _onFilterChange(filterType) {
    if (filterType === `stats`) {
      this._pageController.hide();
      this._stat.show();
      this._stat.renderChart();
      this._activeFilter = filterType;
    } else if (this._activeFilter === `stats`) {
      this._stat.hide();
      this._pageController.show();
      this._activeFilter = filterType;
      this._model.setFilter(filterType);
    } else {
      this._activeFilter = filterType;
      this._model.setFilter(filterType);
    }
  }

  _onDataChange() {
    this.rerender();
  }
}
