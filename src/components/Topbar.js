import React, { Component } from 'react';

import firebase from 'firebase';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Authentication from './Authentication';
import Account from './Account';
import Shopping from './Shopping';

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
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ login: user });
      } else {
        this.setState({ login: false });
      }
    });
  }

  handleLogin = ({ email, password }) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.warning(errorCode, errorMessage);
      });
  };

  handleRegister = ({ email, password }) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.warning(errorCode, errorMessage);
      });
  };

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.warning(errorCode, errorMessage);
      });
  };

  handleAdd = items => {
    this.setState({ items }, () => {
      console.log(this.state);
    });
  };

  generateData = () => {
    const flowers = {
      'Blauwe tulpen':
        'https://firebasestorage.googleapis.com/v0/b/flowerpower-f4041.appspot.com/o/blauwe-tulpen.jpg?alt=media&token=b2576113-3123-4246-bc43-e80d2ba1aab5',
      'Rode tulpen':
        'https://firebasestorage.googleapis.com/v0/b/flowerpower-f4041.appspot.com/o/gele-tulpen.jpg?alt=media&token=349a4157-010a-44d9-8a84-a61dd1d9928d',
      'Gele tulpen':
        'https://firebasestorage.googleapis.com/v0/b/flowerpower-f4041.appspot.com/o/rode-tulpen.jpg?alt=media&token=b4ea67b7-cd59-44c1-969d-672ed8844bd4'
    };
    Object.keys(flowers).map(flower => {
      const image = flowers[flower];
      const newRef = firebase
        .database()
        .ref('flowers')
        .push();

      newRef.set({
        name: flower,
        price: 2.4,
        description:
          'Deze bloemen zijn prachtig voor in de woonkamer of als cadeau.',
        image
      });

      return;
    });
  };

  render() {
    const { classes, items } = this.props;
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
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/products">
              Producten
            </Button>
            <Button color="secondary" onClick={this.generateData}>
              Generate data
            </Button>
            {!login && (
              <Authentication
                handleRegister={this.handleRegister}
                handleLogin={this.handleLogin}
              />
            )}
            {login && <Shopping items={items} handleAdd={this.handleAdd} />}
            {login && <Account handleLogout={this.handleLogout} />}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Topbar);
