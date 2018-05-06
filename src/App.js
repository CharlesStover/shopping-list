import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import React from 'react';
import './App.css';

const localStorageHistory = localStorage.getItem('history');
const localStorageItems = localStorage.getItem('items');
const history = localStorageHistory ? JSON.parse(localStorageHistory) : [];
const items = localStorageItems ? JSON.parse(localStorageItems) : [];

const displayDate = () => {
  const d = new Date();
  const suffix = [];
  suffix[1] = 'st';
  suffix[2] = 'nd';
  suffix[3] = 'rd';
  suffix[21] = 'st';
  suffix[22] = 'nd';
  suffix[23] = 'rd';
  suffix[31] = 'st';
  const day = d.getDate();
  return (
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()] + ' ' +
    day +
    (
      suffix.hasOwnProperty(day)
      ? suffix[day]
      : 'th'
    )
  );
};

class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.historyFilter = this.historyFilter.bind(this);
    this.item = this.item.bind(this);
    this.onAddItemButtonClick = this.onAddItemButtonClick.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onDeleteHistory = this.onDeleteHistory.bind(this);
    this.onDeleteSelected = this.onDeleteSelected.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.onTextFieldChange = this.onTextFieldChange.bind(this);
    this.state = {
      history,
      items,
      selectedRows: [],
      textFieldValue: ''
    };
  }

  get allRowsSelected() {
    return (
      this.state.items.length > 1 &&
      this.state.items.length === this.state.selectedRows.length
    );
  }

  get dataSource() {
    return this.state.history.filter(this.historyFilter);
  }

  historyFilter(item) {
    for (const i of this.state.items) {
      if (i[0] === item) {
        return false;
      }
    }
    return true;
  }

  historySort(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  isSelected(index) {
    return this.state.selectedRows.indexOf(index) !== -1;
  }

  item([ item, amount ], index) {
    return (
      <TableRow
        key={item}
        selected={this.isSelected(index)}
      >
        <TableRowColumn children={item} />
        <TableRowColumn className="amount">
          <TextField
            min={1}
            name="amount"
            onChange={(event) => this.onAmountChange(index, parseInt(event.target.value, 10))}
            onClick={this.stopPropagation}
            size={1}
            step={1}
            type="number"
            value={amount}
          />
        </TableRowColumn>
      </TableRow>
    )
  }

  itemSort(a, b) {
    if (a[0] < b[0]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }
    return 0;
  }

  onAddItemButtonClick() {
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
      history.sort(this.historySort);
      localStorage.setItem('history', JSON.stringify(history));
    }
    this.setItems(
      this.state.items.concat([[item, 1]]).sort(this.itemSort),
      {
        history,
        textFieldValue: ''
      }
    );
  }

  onAmountChange(index, amount) {
    this.setItems(
      this.state.items.slice(0, index)
      .concat([[this.state.items[index][0], amount]])
      .concat(this.state.items.slice(index + 1))
    );
  }

  onDeleteHistory() {
    const history = this.state.history.slice(0);
    history.splice(this.state.history.indexOf(this.state.textFieldValue), 1);
    localStorage.setItem('history', JSON.stringify(history));
    this.setState({
      history,
      textFieldValue: ''
    });
  }

  onDeleteSelected() {
    const items = this.state.items.slice(0);
    for (let x = this.state.selectedRows.length - 1; x >= 0; x--) {
      items.splice(this.state.selectedRows[x], 1);
    }
    this.setItems(
      items,
      { selectedRows: [] }
    )
  }

  onRowSelection(selectedRows) {
    if (selectedRows === 'all') {
      selectedRows = this.state.items.map((item, index) => index);
    }
    else if (selectedRows === 'none') {
      selectedRows = [];
    }
    this.setState({ selectedRows });
  }

  onTextFieldChange(textFieldValue) {
    this.setState({ textFieldValue });
  }

  stopPropagation(event) {
    event.stopPropagation();
    return false;
  }

  setItems(items, state = {}) {
    localStorage.setItem('items', JSON.stringify(items));
    this.setState({
      ...state,
      items
    });
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
            onRowSelection={this.onRowSelection}
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
                ? this.state.items.map(this.item)
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
                  style={{
                    textAlign: 'center'
                  }}
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
                          onClick={this.onDeleteSelected}
                          secondary
                        />
                      : [
                          <AutoComplete
                            dataSource={this.dataSource}
                            filter={AutoComplete.caseInsensitiveFilter}
                            floatingLabelText="Item"
                            key={0}
                            onUpdateInput={this.onTextFieldChange}
                            openOnFocus
                            searchText={this.state.textFieldValue}
                          />,
                          <RaisedButton
                            key={1}
                            label="Add"
                            onClick={this.onAddItemButtonClick}
                            primary
                          />,
                          new Set(this.state.history).has(this.state.textFieldValue)
                          ? <RaisedButton
                              key={2}
                              label="Delete"
                              onClick={this.onDeleteHistory}
                              secondary
                            />
                          : null
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
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
