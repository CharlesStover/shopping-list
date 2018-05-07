import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import React from 'react';
import './table.css';

const tfootStyle = {
  textAlign: 'center'
};

export default class TableView extends React.PureComponent {

  constructor(props) {
    super(props);
    this.mapRows = this.mapRows.bind(this);
  }

  isRowSelected(index) {
    return this.props.selectedRows.indexOf(this.props.rows[index][this.props.columns[0].key]) !== -1;
  }

  mapColumns(row, index) {
    return this.props.columns.map(
      ({ key }, index) =>
        <TableRowColumn
          children={row[key]}
          className={index > 0 ? 'action' : null}
          key={index}
        />
    );
  }

  mapRows(row, index) {
    return (
      <TableRow
        children={this.mapColumns(row)}
        key={index}
        selected={this.isRowSelected(index)}
      />
    );
  }

  get tbody() {
    if (this.props.rows.length === 0) {
      return (
        <TableRow selectable={false}>
          <TableRowColumn colSpan="2">
            <em children="There are no items in this list." />
          </TableRowColumn>
        </TableRow>
      );
    }
    return this.props.rows.map(this.mapRows);
  }

  get theadCells() {
    return this.props.columns.map(({ title }, index) =>
      <TableHeaderColumn
        children={title + ':'}
        className={index > 0 ? 'action' : null}
        key={index}
      />
    );
  }

  render() {
    return (
      <section>
        <header children={this.props.header} />
        <Table
          allRowsSelected={this.props.allItemRowsSelected}
          multiSelectable
          onRowSelection={this.props.onRowSelection}
        >
          <TableHeader enableSelectAll={this.props.rows.length > 1}>
            <TableRow children={this.theadCells} />
          </TableHeader>
          <TableBody
            children={this.tbody}
            deselectOnClickaway={false}
            showRowHover
          />
          <TableFooter>
            <TableRow>
              <TableRowColumn
                children={this.props.tfoot}
                colSpan={this.props.columns.length}
                style={tfootStyle}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    );
  }
}
