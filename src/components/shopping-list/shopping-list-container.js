import TextField from 'material-ui/TextField';
import React from 'react';
import ShoppingListView from './shopping-list-view';

const NO_ROWS = [];

const qtyInputProps = {
  min: 1,
  size: 1,
  step: 1
};

export default class ShoppingListerContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onDeleteSelected = this.onDeleteSelected.bind(this);
    this.onItemAdd = this.onItemAdd.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onQuantityChanges = [];
    this.onRowSelection = this.onRowSelection.bind(this);
    this.state = {
      itemValue: '',
      selectedRows: NO_ROWS
    };
  }

  get list() {
    return this.props.list.map(
      (item, index) => ({
        ...item,
        qty: (
          <TextField
            inputProps={qtyInputProps}
            name="amount"
            onChange={this.onQuantityChange(index)}
            onClick={this.stopPropagation}
            type="number"
            value={item.qty}
          />
        )
      })
    );
  }

  onDeleteSelected(e) {
    e.preventDefault();
    this.props.onDelete(this.state.selectedRows);
    this.setState({
      selectedRows: NO_ROWS
    });
    return false;
  }

  onItemAdd(e) {
    e.preventDefault();
    if (!/^\s*$/.test(this.state.itemValue)) {
      const value = this.state.itemValue.replace(/\s+$/, '');
      const index = this.props.list.findIndex((item) => item.item === value);
      if (index === -1) {
        this.props.onAdd(value);
      }
      else {
        this.props.onQuantityChange(index, this.props.list[index].qty + 1);
      }
      this.setState({
        itemValue: '',
        selectedRows: NO_ROWS
      });
    }
    else if (this.state.itemValue !== '') {
      this.setState({
        itemValue: ''
      });
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
          this.props.onQuantityChange(index, parseInt(value, 10));
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
        rows={this.list}
        selectedRows={this.state.selectedRows}
      />
    );
  }
}