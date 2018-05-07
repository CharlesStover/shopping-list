import Table, { TableBody, TableCell, TableFooter, TableHead, TableRow } from 'material-ui/Table';
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
        <TableCell
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
          <TableCell colSpan="2">
            <em children="There are no items in this list." />
          </TableCell>
        </TableRow>
      );
    }
    return this.props.rows.map(this.mapRows);
  }

  get theadCells() {
    return this.props.columns.map(({ title }, index) =>
      <TableCell
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
          allRowsSelected={this.props.allRowsSelected}
          multiSelectable
          onRowSelection={this.props.onRowSelection}
        >
          <TableHead enableSelectAll={this.props.rows.length > 1}>
            <TableRow children={this.theadCells} />
          </TableHead>
          <TableBody
            children={this.tbody}
            deselectOnClickaway={false}
            showRowHover
          />
          <TableFooter>
            <TableRow>
              <TableCell
                children={this.props.tfoot}
                className="tfoot"
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
