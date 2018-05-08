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
  }
];

export default class ShoppingListView extends React.PureComponent {

  get tfoot() {
    if (this.props.selectedRows.length > 0) {
      return (
        <form
          className="shopping-list-tfoot-form"
          onSubmit={this.props.onDeleteSelected}
        >
          <Button
            children="Delete Selected"
            color="secondary"
            type="submit"
            variant="raised"
          />
        </form>
      );
    }
    return (
      <form
        className="shopping-list-tfoot-form"
        onSubmit={this.props.onItemAdd}
      >
        <TextField
          label="Add an Item"
          name="item"
          onChange={this.props.onItemChange}
          value={this.props.itemValue}
        />
        <Button
          children="Add"
          className="shopping-list-button"
          color="primary"
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
