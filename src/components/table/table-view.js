import Checkbox from 'material-ui/Checkbox';
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
    this.onCheckboxChanges = [];
  }

  isRowSelected(index) {
    return this.props.selectedRows.indexOf(index) !== -1;
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
        key={index}
        selected={this.isRowSelected(index)}
      >
        <TableCell className="checkbox">
          <Checkbox
            checked={this.isRowSelected(index)}
            onChange={this.onCheckboxChange(index)}
          />
        </TableCell>
        {this.mapColumns(row)}
      </TableRow>
    );
  }

  onCheckboxChange(index) {
    if (!this.onCheckboxChanges[index]) {
      this.onCheckboxChanges[index] = () => this.props.onRowSelection(index);
    }
    return this.onCheckboxChanges[index];
  }

  get tbody() {
    if (this.props.rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={this.props.columns.length}>
            <em children="There are no items in this list." />
          </TableCell>
        </TableRow>
      );
    }
    return this.props.rows.map(this.mapRows);
  }

  get theadCells() {
    const cells = [];
    if (this.props.rows.length > 0) {
      cells.push(
        <TableCell
          className="checkbox"
          key="thead-checkbox"
        >
          <Checkbox
            checked={this.props.selectAllRowsChecked}
            disabled={this.props.selectAllRowsDisabled}
            onChange={this.props.onSelectAllRows}
          />
        </TableCell>
      );
    }
    return cells.concat(
      this.props.columns.map(({ title }, index) =>
        <TableCell
          children={title + ':'}
          className={index > 0 ? 'action' : null}
          key={index}
        />
      )
    );
  }

  render() {
    return (
      <section>
        <header children={this.props.header} />
        <Table>
          <TableHead>
            <TableRow>
              {this.theadCells}
            </TableRow>
          </TableHead>
          <TableBody children={this.tbody} />
          <TableFooter>
            <TableRow>
              <TableCell
                children={this.props.tfoot}
                className="tfoot"
                colSpan={this.props.columns.length + 1}
                style={tfootStyle}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    );
  }
}
