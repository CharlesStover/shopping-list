import Button from 'material-ui/Button';
import React from 'react';
import Table from '../table/table';

const columns = [
  {
    title: 'Item',
    key: 'item'
  },
  {
    title: 'Action',
    key: 'action'
  }
];

export default class ShoppingListView extends React.PureComponent {

  get tfoot() {
    if (this.props.selectedRows.length < 2) {
      return null;
    }
    return [
      <Button
        key={0}
        label="Add Selected"
        onClick={this.props.onAddSelected}
        primary
        variant="raised"
      />,
      <Button
        key={1}
        label="Delete Selected"
        onClick={this.props.onDeleteSelected}
        secondary
        variant="raised"
      />
    ];
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
