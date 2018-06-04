import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import Authentication from './Authentication';
import Account from './Account';

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  }
};

class Topbar extends Component {
  state = { login: false };

  componentDidMount() {
    const storageLogin = localStorage.getItem('login');
    if (storageLogin) {
      this.setState({ login: storageLogin });
    }
  }

  handleLogin = data => {
    this.setState({ login: data });
    localStorage.setItem('login', data);
  };

  handleLogout = () => {
    this.setState({ login: false });
    localStorage.removeItem('login');
  };

  render() {
    const { classes } = this.props;
    const { login } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Flowerpower
            </Typography>
            {!login && <Authentication handleLogin={this.handleLogin} />}
            {login && <Account handleLogout={this.handleLogout} />}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Topbar);
