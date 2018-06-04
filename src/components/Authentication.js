import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Authentication extends Component {
  state = {
    email: null,
    password: null,
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogin = () => {
    if (this.state.password && this.state.email) this.handleClose();
    this.props.handleLogin({
      email: this.state.email,
      password: this.state.password
    });
  };

  handleRegister = () => {
    if (this.state.password && this.state.email) this.handleClose();
    this.props.handleRegister({
      email: this.state.email,
      password: this.state.password
    });
  };

  render() {
    return (
      <div>
        <Button
          color="inherit"
          onClick={() => {
            this.handleClickOpen();
          }}
        >
          Login
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Vul hieronder uw gegevens in om in te loggen of druk op
              registreren om een nieuw account aan te maken.
            </DialogContentText>
            <form noValidate autoComplete="off">
              <FormControl>
                <Grid container justify="center">
                  <Grid item xs={12}>
                    <TextField
                      id="email"
                      label="Email"
                      type="email"
                      onChange={event => {
                        this.setState({ email: event.target.value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="password"
                      label="Wachtwoord"
                      type="password"
                      onChange={event => {
                        this.setState({ password: event.target.value });
                      }}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleRegister} color="primary">
              Register
            </Button>
            <Button onClick={this.handleLogin} color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Authentication;
