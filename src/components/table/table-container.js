import React from 'react';
import TableView from './table-view';

const NO_ROWS = [];

export default class TableContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.onSelectAllRows = this.onSelectAllRows.bind(this);
  }

  onRowSelection(index) {
    const indexOf = this.props.selectedRows.indexOf(index);
    if (indexOf === -1) {
      this.props.onRowSelection(this.props.selectedRows.concat([ index ]).sort());
    }
    else {
      const selectedRows = [...this.props.selectedRows];
      selectedRows.splice(indexOf, 1);
      this.props.onRowSelection(selectedRows);
    }
  }

  onSelectAllRows() {
    if (this.props.selectedRows.length === this.props.rows.length) {
      this.props.onRowSelection(NO_ROWS);
    }
    else {
      this.props.onRowSelection(this.props.rows.map((row, index) => index));
    }
  }

  render() {
    return (
      <TableView
        className={this.props.className}
        columns={this.props.columns}
        header={this.props.header}
        onRowSelection={this.onRowSelection}
        onSelectAllRows={this.onSelectAllRows}
        rows={this.props.rows}
        selectAllRowsChecked={
          this.props.rows.length > 1 &&
          this.props.selectedRows.length === this.props.rows.length
        }
        selectAllRowsDisabled={this.props.rows.length < 2}
        selectedRows={this.props.selectedRows}
        tfoot={this.props.tfoot}
      />
    );
  }
}
