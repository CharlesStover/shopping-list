import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React from 'react';
import Table from '../table/table';

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
        <RaisedButton
          label="Delete Selected"
          onClick={this.props.onDeleteSelected}
          secondary
        />
      );
    }
    return (
      <form onSubmit={this.props.onItemAdd}>
        <TextField
          label="Item"
          name="item"
          onChange={this.onItemChange}
          value={this.props.itemValue}
        />
        <RaisedButton
          label="Add"
          primary
          type="submit"
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
