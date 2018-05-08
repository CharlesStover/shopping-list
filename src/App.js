import React from 'react';
import ShoppingHistory from './components/shopping-history/shopping-history';
import ShoppingList from './components/shopping-list/shopping-list';
import displayDate from './constants/display-date';
import itemSort from './constants/item-sort';
import './App.css';

const NO_HISTORY = [];
const NO_LIST = [];

class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.filterListFromHistory = this.filterListFromHistory.bind(this);
    this.onHistoryAdd = this.onHistoryAdd.bind(this);
    this.onHistoryDelete = this.onHistoryDelete.bind(this);
    this.onListAdd = this.onListAdd.bind(this);
    this.onListDelete = this.onListDelete.bind(this);
    this.onListQuantityChange = this.onListQuantityChange.bind(this);
    const localStorageHistory = window.localStorage.getItem('history');
    const localStorageList = window.localStorage.getItem('list');
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

  onHistoryAdd(indices) {
    const unusedHistory = this.unusedHistory;
    const list = this.state.list.concat(
      indices.map(
        (index) => ({
          item: unusedHistory[index].item,
          qty: 1
        })
      )
    );
    list.sort(itemSort);
    window.localStorage.setItem('list', JSON.stringify(list));
    this.setState({ list });
  }

  onHistoryDelete(indices) {
    const history = [ ...this.state.history ];
    const unusedHistory = this.unusedHistory;
    for (const index of indices) {
      const item = unusedHistory[index].item;
      history.splice(history.findIndex((historyItem) => historyItem === item), 1);
    }
    window.localStorage.setItem('history', JSON.stringify(history));
    this.setState({ history });
  }

  onListAdd(item) {
    const history = [ ...this.state.history ];
    let found = false;
    for (const { item: historyItem } of history) {
      if (item === historyItem) {
        found = true;
        break;
      }
    }
    if (!found) {
      history.push({ item });
      history.sort(itemSort);
      window.localStorage.setItem('history', JSON.stringify(history));
    }
    const list = this.state.list.concat([ {
      item,
      qty: 1
    } ]);
    list.sort(itemSort);
    window.localStorage.setItem('list', JSON.stringify(list));
    this.setState({ history, list });
  }

  onListDelete(rows) {
    const list = this.state.list.filter((item, row) => rows.indexOf(row) === -1);
    window.localStorage.setItem('list', JSON.stringify(list));
    this.setState({ list });
  }

  onListQuantityChange(index, qty) {
    const list = [ ...this.state.list ];
    list[index] = { ...list[index] };
    list[index].qty = qty;
    window.localStorage.setItem('list', JSON.stringify(list));
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
    return this.state.history.filter(this.filterListFromHistory);
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
        onQuantityChange={this.onListQuantityChange}
      />,
      <ShoppingHistory
        header={
          <h2 children="History:" />
        }
        history={this.unusedHistory}
        key={1}
        onAdd={this.onHistoryAdd}
        onDelete={this.onHistoryDelete}
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
