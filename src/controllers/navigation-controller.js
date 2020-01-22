import NavigationComponent from '../components/navigation';
import {render, replace, RenderPosition} from '../utils/utils';

export default class NavigationController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._navigation = null;
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
    this._model.setFilter(filterType);
  }

  _onDataChange() {
    this.rerender();
  }
}
