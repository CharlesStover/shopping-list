import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import React from 'react';
import Table from '../table/table';
import './shopping-list.css';

const columns = [
  {
    title: 'Item',
    key: 'item'
  },
  {
    title: 'Quantity',
    key: 'qty'
  },
  {
    title: 'Delete',
    key: 'action'
  }
];

export default class ShoppingListView extends React.PureComponent {

  get tfoot() {
    if (this.props.selectedRows.length > 0) {
      return (
        <Button
          label="Delete Selected"
          onClick={this.props.onDeleteSelected}
          secondary
          variant="raised"
        />
      );
    }
    return (
      <form onSubmit={this.props.onItemAdd}>
        <TextField
          label="Add an Item"
          name="item"
          onChange={this.props.onItemChange}
          value={this.props.itemValue}
        />
        <Button
          className="shopping-list-button"
          label="Add"
          primary
          type="submit"
          variant="raised"
        />
      </form>
    );
  }

  render() {
    return (
      <Table
        columns={columns}
        header={this.props.header}
        onRowSelection={this.props.onRowSelection}
        rows={this.props.rows}
        selectedRows={this.props.selectedRows}
        tfoot={this.tfoot}
      />
    );
  }
}
