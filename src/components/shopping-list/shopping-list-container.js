import React from 'react';
import ShoppingListView from './shopping-list-view';

const NO_ROWS = [];

/*
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
*/

export default class ShoppingListerContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onDeleteSelected = this.onDeleteSelected.bind(this);
    this.onItemAdd = this.onItemAdd.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.state = {
      itemValue: '',
      selectedRows: NO_ROWS
    };
  }

  onDeleteSelected(e) {
    e.preventDefault();
    this.props.onDelete(this.state.selectedRows);
    this.setState({ selectedRows: NO_ROWS });
    return false;
  }

  onItemAdd(e) {
    e.preventDefault();
    if (!/^\s*$/.test(this.state.itemValue)) {
      this.props.onAdd(this.state.itemValue.replace(/\s+$/, ''));
      this.setState({ itemValue: '' });
    }
    else if (this.state.itemValue !== '') {
      this.setState({ itemValue: '' });
    }
    return false;
  }

  onItemChange({ target: { value } }) {
    this.setState({
      itemValue: value.replace(/^\s+/, '')
    });
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

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  render() {
    return (
      <ShoppingListView
        header={this.props.header}
        itemValue={this.state.itemValue}
        onDeleteSelected={this.onDeleteSelected}
        onItemAdd={this.onItemAdd}
        onItemChange={this.onItemChange}
        onRowSelection={this.onRowSelection}
        rows={this.props.list}
        selectedRows={this.state.selectedRows}
      />
    );
  }
}