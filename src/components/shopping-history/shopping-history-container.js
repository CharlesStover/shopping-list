import React from 'react';
import ShoppingHistoryView from './shopping-history-view';

const NO_ROWS = [];

export default class ShoppingHistoryContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onAddSelected = this.onAddSelected.bind(this);
    this.onDeleteSelected = this.onDeleteSelected.bind(this);
    this.onRowSelection = this.onRowSelection.bind(this);
    this.state = {
      selectedRows: NO_ROWS
    };
  }

  onAddSelected() {
    this.props.onAdd(this.state.selectedRows);
    this.setState({ selectedRows: NO_ROWS });
  }

  onDeleteSelected() {
    this.props.onDelete(this.state.selectedRows);
    this.setState({ selectedRows: NO_ROWS });    
  }

  onRowSelection(selectedRows) {
    this.setState({ selectedRows });
  }

  render() {
    return (
      <ShoppingHistoryView
        header={this.props.header}
        onAddSelected={this.onAddSelected}
        onDeleteSelected={this.onDeleteSelected}
        onRowSelection={this.onRowSelection}
        rows={this.props.history}
        selectedRows={this.state.selectedRows}
      />
    );
  }
}
