import React from 'react';
import TableView from './table-view';

const NO_ROWS = [];

export default class TableContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.state = {
      selectedRows: NO_ROWS
    };
  }

  get allRowsSelected() {
    return (
      this.props.selectedRows.length > 0 &&
      this.props.selectedRows.length === this.props.rows.length
    );
  }

  onRowSelection(selectedRows) {
    if (this.props.onRowSelection) {
      if (selectedRows === 'all') {
        this.props.onRowSelection(this.props.rows);
      }
      else if (selectedRows === 'none') {
        this.props.onRowSelection(NO_ROWS);
      }
      else {
        this.props.onRowSelection(selectedRows.map((index) => this.props.rows[index]));
      }
    }
  }

  render() {
    return (
      <TableView
        allRowsSelected={this.allRowsSelected}
        columns={this.props.columns}
        header={this.props.header}
        onRowSelection={this.onRowSelection}
        rows={this.props.rows}
        selectedRows={this.props.selectedRows}
      />
    );
  }
}
