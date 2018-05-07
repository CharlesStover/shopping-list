import React from 'react';
import ShoppingHistory from './components/shopping-history/shopping-history';
import ShoppingList from './components/shopping-list/shopping-list';
import displayDate from './constants/display-date';
import historySort from './constants/history-sort';
import listSort from './constants/list-sort';
import './App.css';

const NO_HISTORY = [];
const NO_LIST = [];

class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.filterListFromHistory = this.filterListFromHistory.bind(this);
    this.onListAdd = this.onListAdd.bind(this);
    const localStorageHistory = localStorage.getItem('history');
    const localStorageList = localStorage.getItem('list');
    this.state = {
      history:
        localStorageHistory ?
          JSON.parse(localStorageHistory) :
          NO_HISTORY,
      list:
        localStorageList ?
          JSON.parse(localStorageList) :
          NO_LIST
    };
  }

  filterListFromHistory({ item: historyItem }) {
    for (const { item: listItem } of this.state.list) {
      if (listItem === historyItem) {
        return false;
      }
    }
    return true;
  }

  onHistoryAdd() {
  }

  onHistoryDelete(history) {
    localStorage.setItem('history', JSON.stringify(history));
    this.setState({ history });
  }

  onListAdd(item) {
    const history = [...this.state.history];
    let found = false;
    for (const { item: historyItem } of history) {
      if (item === historyItem) {
        found = true;
        break;
      }
    }
    if (!found) {
      history.push({ item });
      history.sort(historySort);
      localStorage.setItem('history', JSON.stringify(history));
    }
    const list = this.state.list.concat([ {
      item,
      qty: 1
    } ]);
    list.sort(listSort);
    localStorage.setItem('list', JSON.stringify(list));
    this.setState({ history, list });
  }

  onListDelete(rows) {
    const rowsSet = new Set(rows);
    const list = this.state.list.filter(
      ({ item }) =>
        !rowsSet.has(item)
    );
    localStorage.setItem('list', JSON.stringify(list));
    this.setState({ list });
  }

  onHistorySubmit(e) {
    e.preventDefault();
    return false;
  }

  onTextFieldChange({ target: { value: itemValue } }) {
    this.setState({ itemValue });
  }

  stopPropagation(e) {
    e.stopPropagation();
    return false;
  }

  get unusedHistory() {
    return this.state.history.filter(this.filterItemsFromHistory);
  }

  render() {
    return [
      <ShoppingList
        header={[
          <div
            children={process.env.PHONE || ''}
            key={0}
          />,
          <h1
            children="Shopping List:"
            key={1}
          />,
          <div
            children={displayDate()}
            key={2}
          />
        ]}
        key={0}
        list={this.state.list}
        onAdd={this.onListAdd}
        onDelete={this.onListDelete}
      />,
      <ShoppingHistory
        header={
          <h2 children="History:" />
        }
        history={this.state.history.filter(this.filterListFromHistory)}
        key={1}
      />,
      <div
        children="Notes:"
        id="notes"
        key={2}
      />
    ];
  }
}

export default App;
