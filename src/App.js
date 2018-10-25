import React, { Component } from 'react';
import './App.css';
import SimpleMap from './components/SimpleMap';
import { Button } from '@material-ui/core'
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    'z-index':  1000000001
  },
  fabMoveUp: {
    transform: 'translate3d(0, -46px, 0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  fabMoveDown: {
    transform: 'translate3d(0, 0, 0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
  },
  snackbar: {
    position: 'absolute',
  },
  snackbarContent: {
    width: 360,
  },
});
class App extends Component {



  render() {

    const { open } = false;
    const { classes } = this.props;
    const fabClassName = classNames(classes.fab, open ? classes.fabMoveUp : classes.fabMoveDown);

    return (
      <div className="App">
        <header className="App-header">

        </header>
        <SimpleMap />
        <Button variant="fab" className={fabClassName} color="primary">
          <AddIcon />
        </Button>
      </div >
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
