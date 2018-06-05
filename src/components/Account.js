import React, { Component } from 'react';

import firebase from 'firebase';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Account extends Component {
  state = {
    anchorEl: null
  };

  componentDidMount() {
    var user = firebase.auth().currentUser;

    this.setState({ user });
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.props.handleLogout();
    this.handleClose();
  };

  handleSettingsEdit = () => {
    const { email, user } = this.state;

    if (!email) return;
    this.setState({ settingsDialog: false }, () => {
      const oldEmail = user.email;
      user.updateEmail(email);
      firebase
        .database()
        .ref('admins')
        .orderByValue()
        .equalTo(oldEmail)
        .once('value', snapshot => {
          if (snapshot.val()) {
            Object.keys(snapshot.val()).map(index => {
              firebase
                .database()
                .ref('admins')
                .child(index)
                .set(email);
            });
          }
        });
    });
  };

  render() {
    const { admin } = this.props;
    var { user } = this.state;

    const { anchorEl } = this.state;

    const open = Boolean(anchorEl);

    return (
      <div>
        {user && (
          <Dialog
            open={this.state.settingsDialog}
            onClose={() => {
              this.setState({ settingsDialog: false });
            }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Bloemen toevoegen</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Voer hieronder die informatie in om het toe te voegen aan het
                product register.
              </DialogContentText>
              <FormControl>
                <Grid item xs={12}>
                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    onChange={event => {
                      this.setState({ email: event.target.value });
                    }}
                    defaultValue={user.email}
                  />
                </Grid>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  this.setState({ settingsDialog: false });
                }}
                color="primary"
              >
                Annuleer
              </Button>
              <Button onClick={this.handleSettingsEdit} color="primary">
                Opslaan
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Icon>account_circle</Icon>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          onClose={this.handleClose}
        >
          {admin && (
            <MenuItem component={Link} to="/admin">
              Admin
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              this.setState({ settingsDialog: true });
            }}
          >
            Settings
          </MenuItem>
          <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default Account;
