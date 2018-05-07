import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import React from 'react';
import displayDate from './constants/display-date';
import historySort from './constants/history-sort';
import itemSort from './constants/item-sort';
import './App.css';

const tfootStyle = {
  textAlign: 'center'
};

class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.filterItemsFromHistory = this.filterItemsFromHistory.bind(this);
    this.mapHistory = this.mapHistory.bind(this);
    this.mapItems = this.mapItems.bind(this);
    this.onAddItemButtonClick = this.onAddItemButtonClick.bind(this);
    this.onDeleteHistories = [];
    this.onDeleteHistory = this.onDeleteHistory.bind(this);
    this.onDeleteSelectedItems = this.onDeleteSelectedItems.bind(this);
    this.onHistoryRowSelection = this.onHistoryRowSelection.bind(this);
    this.onItemRowSelection = this.onItemRowSelection.bind(this);
    this.onQuantityChanges = [];
    this.onTextFieldChange = this.onTextFieldChange.bind(this);
    const localStorageHistory = localStorage.getItem('history');
    const localStorageItems = localStorage.getItem('items');
    this.state = {
      history:
        localStorageHistory ?
          JSON.parse(localStorageHistory) :
          [],
      items:
        localStorageItems ?
          JSON.parse(localStorageItems) :
          [],
      selectedHistoryRows: [],
      selectedItemRows: [],
      textFieldValue: ''
    };
  }

  get allHistoryRowsSelected() {
    return (
      this.unusedHistory.length > 1 &&
      this.unusedHistory.length === this.state.selectedHistoryRows.length
    );
  }

  get allItemRowsSelected() {
    return (
      this.state.items.length > 1 &&
      this.state.items.length === this.state.selectedItemRows.length
    );
  }

  filterItemsFromHistory(historyItem) {
    for (const [ item ] of this.state.items) {
      if (item === historyItem) {
        return false;
      }
    }
    return true;
  }

  isHistorySelected(item) {
    return this.state.selectedHistoryRows.indexOf(item) !== -1;
  }

  isItemSelected(item) {
    return this.state.selectedItemRows.indexOf(item) !== -1;
  }

  mapHistory(item, index) {
    return (
      <TableRow
        key={item}
        selected={this.isHistorySelected(item)}
      >
        <TableRowColumn children={item} />
        <TableRowColumn className="amount">
          <RaisedButton
            label="Delete"
            onClick={this.onDeleteHistory(index)}
            secondary
          />
        </TableRowColumn>
      </TableRow>
    );
  }

  mapItems([ item, amount ], index) {
    return (
      <TableRow
        key={item}
        selected={this.isItemSelected(item)}
      >
        <TableRowColumn children={item} />
        <TableRowColumn className="amount">
          <TextField
            min={1}
            name="amount"
            onChange={this.onQuantityChange(index)}
            onClick={this.stopPropagation}
            size={1}
            step={1}
            type="number"
            value={amount}
          />
        </TableRowColumn>
      </TableRow>
    );
  }

  onAddItemButtonClick() {
    if (!/^\s*$/.test(this.state.textFieldValue)) {
      const item = this.state.textFieldValue;
      const history = this.state.history.slice(0);
      let found = false;
      for (const h of history) {
        if (item === h) {
          found = true;
          break;
        }
      }
      if (!found) {
        history.push(item);
        history.sort(historySort);
        localStorage.setItem('history', JSON.stringify(history));
      }
      this.setItems(
        this.state.items.concat([ [ item, 1 ] ]).sort(itemSort),
        {
          history,
          textFieldValue: ''
        }
      );
    }
  }

  onDeleteHistory(index) {
    if (!this.onDeleteHistories[index]) {
      this.onDeleteHistories[index] = () => {
        const history = this.state.history.slice(0);
        history.splice(index, 1);
        localStorage.setItem('history', JSON.stringify(history));
        this.setState({ history });
      };
    }
    return this.onDeleteHistories[index];
  }

  onDeleteSelectedItems() {
    const items = this.state.items.slice(0);
    for (let x = this.state.selectedRows.length - 1; x >= 0; x--) {
      items.splice(this.state.selectedRows[x], 1);
    }
    this.setItems(
      items,
      { selectedRows: [] }
    )
  }

  onHistoryRowSelection(selectedRows) {
    if (selectedRows === 'all') {
      this.setState({ selectedHistoryRows: this.unusedHistory });
    }
    else if (selectedRows === 'none') {
      this.setState({ selectedHistoryRows: [] });
    }
    else {
      this.setState({ selectedHistoryRows: selectedRows.map((index) => this.unusedHistory[index]) });
    }
  }

  onItemRowSelection(selectedRows) {
    if (selectedRows === 'all') {
      this.setState({ selectedItemRows: this.state.items.map(([ item ], index) => item) });
    }
    else if (selectedRows === 'none') {
      this.setState({ selectedItemRows: [] });
    }
    else {
      this.setState({ selectedItemRows: selectedRows.map((index) => this.state.items[index]) });
    }
  }

  onQuantityChange(index) {
    if (!this.onQuantityChanges[index]) {
      this.onQuantityChanges[index] =
        ({ target: { value } }) =>
          this.setItems(
            this.state.items.slice(0, index)
            .concat([ [ this.state.items[index][0], parseInt(value, 10) ] ])
            .concat(this.state.items.slice(index + 1))
          );
    }
    return this.onQuantityChanges[index];
  }

  onTextFieldChange({ target: { value: textFieldValue } }) {
    this.setState({ textFieldValue });
  }

  stopPropagation(e) {
    e.stopPropagation();
    return false;
  }

  setItems(items, state = {}) {
    localStorage.setItem('items', JSON.stringify(items));
    this.setState({
      ...state,
      items
    });
  }

  get unusedHistory() {
    return this.state.history.filter(this.filterItemsFromHistory);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <header>
            <div children={process.env.PHONE || ''} />
            <h1>Shopping List:</h1>
            <div children={displayDate()} />
          </header>
          <Table
            allRowsSelected={this.allRowsSelected}
            multiSelectable
            onRowSelection={this.onItemRowSelection}
          >
            <TableHeader enableSelectAll={this.state.items.length > 1}>
              <TableRow>
                <TableHeaderColumn children="Item:" />
                <TableHeaderColumn
                  children="Quantity:"
                  className="amount"
                />
              </TableRow>
            </TableHeader>
            <TableBody
              deselectOnClickaway={false}
              showRowHover
            >
              {
                this.state.items.length > 0
                ? this.state.items.map(this.mapItems)
                : <TableRow selectable={false}>
                    <TableRowColumn colSpan="2">
                      <em children="There are no items on the shopping list." />
                    </TableRowColumn>
                  </TableRow>
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowColumn
                  colSpan="2"
                  style={tfootStyle}
                >
                  <div id="controls">
                    {
                      this.state.selectedRows === 'all' ||
                      (
                        Array.isArray(this.state.selectedRows) &&
                        this.state.selectedRows.length
                      )
                      ? <RaisedButton
                          label="Delete Selected"
                          onClick={this.onDeleteSelectedItems}
                          secondary
                        />
                      : [
                          <TextField
                            label="Item"
                            key={0}
                            name="item"
                            onChange={this.onTextFieldChange}
                          />,
                          <RaisedButton
                            key={1}
                            label="Add"
                            onClick={this.onAddItemButtonClick}
                            primary
                          />
                        ]
                    }
                  </div>
                  <div
                    children="Notes:"
                    id="notes"
                  />
                </TableRowColumn>
              </TableRow>
            </TableFooter>
          </Table>
          <header>
            <h2>History:</h2>
          </header>
          <Table
            multiSelectable
            onRowSelection={this.onHistoryRowSelection}
          >
            <TableHeader enableSelectAll={false}>
              <TableRow>
                <TableHeaderColumn children="Item:" />
                <TableHeaderColumn
                  children="Delete:"
                  className="amount"
                />
              </TableRow>
            </TableHeader>
            <TableBody showRowHover>
              {
                this.unusedHistory.length > 0
                ? this.unusedHistory.map(this.mapHistory)
                : <TableRow>
                    <TableRowColumn colSpan="2">
                      <em children="There are no items on the shopping list." />
                    </TableRowColumn>
                  </TableRow>
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowColumn
                  colSpan={2}
                  style={tfootStyle}
                >
                  {
                    new Set(this.state.history).has(this.state.textFieldValue)
                      ? <RaisedButton
                          key={2}
                          label="Delete"
                          onClick={this.onDeleteHistory}
                          secondary
                        />
                      : null
                  }
                </TableRowColumn>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
