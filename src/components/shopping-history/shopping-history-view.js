import Button from 'material-ui/Button';
import React from 'react';
import Table from '../table/table';
import './shopping-history.css';

const columns = [
  {
    title: 'Item',
    key: 'item'
  }
];

export default class ShoppingListView extends React.PureComponent {

  get tfoot() {
    if (this.props.selectedRows.length === 0) {
      return null;
    }
    return (
      <div className="shopping-history-tfoot">
        <Button
          children="Add Selected"
          color="primary"
          key={0}
          onClick={this.props.onAddSelected}
          variant="raised"
        />
        <Button
          children="Delete Selected"
          className="shopping-history-button"
          color="secondary"
          key={1}
          onClick={this.props.onDeleteSelected}
          variant="raised"
        />
      </div>
    );
  }

  render() {
    return (
      <Table
        className="shopping-history"
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
