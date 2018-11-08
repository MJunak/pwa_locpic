import React, { Component } from 'react';
import './App.css';
import SimpleMap from './components/SimpleMap';
import { Button } from '@material-ui/core';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddPOIComponent from './components/AddPOIComponent';

const styles = theme => ({
  root: {
    position: 'relative',
    overflow: 'hidden'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    'z-index': 1000000001
  },
  fabMoveUp: {
    transform: 'translate3d(0, -46px, 0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut
    })
  },
  fabMoveDown: {
    transform: 'translate3d(0, 0, 0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  snackbar: {
    position: 'absolute'
  },
  snackbarContent: {
    width: 360
  }
});
class App extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = false;
    const { classes } = this.props;
    const fabClassName = classNames(
      classes.fab,
      open ? classes.fabMoveUp : classes.fabMoveDown
    );

    return (
      <div className="App">
        <header className="App-header" />
        <SimpleMap />

        <Button
          variant="fab"
          className={fabClassName}
          onClick={this.handleClickOpen}
          color="primary"
        >
          <AddIcon />
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Pick your Position</DialogTitle>
          <DialogContent>
            <AddPOIComponent />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
