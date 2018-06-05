import React, { Component } from 'react';

import firebase from 'firebase';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Icon from '@material-ui/core/Icon';
import { Divider } from '@material-ui/core';

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 2,
    width: '100%'
  },
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  item: {}
});

class Admin extends Component {
  state = {
    orders: null,
    order: null,
    flowerDialog: false,
    name: null,
    description: null,
    image: null,
    price: null,
    email: null
  };

  componentDidMount() {
    firebase
      .database()
      .ref('flowers')
      .on('value', snapshot => {
        this.setState({ flowers: snapshot.val() });
      });
    firebase
      .database()
      .ref('orders')
      .on('value', snapshot => {
        this.setState({ orders: snapshot.val() });
      });
    firebase
      .database()
      .ref('admins')
      .on('value', snapshot => {
        this.setState({ admins: snapshot.val() });
      });
  }

  handleFlowerCreate = () => {
    const { name, description, image, price } = this.state;

    if (!name || !description || !image || price) return;

    firebase
      .storage()
      .ref(image.name)
      .put(image)
      .then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          firebase
            .database()
            .ref('flowers')
            .push({
              name,
              description,
              image: url,
              price
            })
            .then(() => {
              this.setState({
                name: null,
                description: null,
                image: null,
                price: null,
                flowerDialog: false
              });
            });
        });
      });
  };

  handleAdminCreate = () => {
    const { email } = this.state;

    if (!email) return;
    this.setState({ adminDialog: false }, () => {
      firebase
        .database()
        .ref('admins')
        .push(email);
    });
  };

  render() {
    const { classes } = this.props;
    const { orders, order, flowers, orderDialog, admins } = this.state;

    return (
      <Grid container classes={{ container: classes.container }} spacing={8}>
        <Dialog
          open={this.state.flowerDialog}
          onClose={() => {
            this.setState({ flowerDialog: false });
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
              <Grid container justify="center" classes={{ item: classes.item }}>
                <Grid item xs={12}>
                  <TextField
                    id="name"
                    label="Naam"
                    type="text"
                    onChange={event => {
                      this.setState({ name: event.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="description"
                    label="Beschrijving"
                    type="text"
                    onChange={event => {
                      this.setState({ description: event.target.value });
                    }}
                    fullWidth
                    multiline
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="description"
                    label="Afbeelding"
                    type="file"
                    onChange={event => {
                      this.setState({ image: event.target.files[0] });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="price"
                    label="Prijs"
                    type="number"
                    onChange={event => {
                      this.setState({ price: event.target.value });
                    }}
                  />
                </Grid>
              </Grid>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ flowerDialog: false });
              }}
              color="primary"
            >
              Annuleer
            </Button>
            <Button onClick={this.handleFlowerCreate} color="primary">
              Opslaan
            </Button>
          </DialogActions>
        </Dialog>
        {flowers && (
          <Grid item xs={5}>
            <Typography variant="display1">
              Bloemen
              <Button
                style={{ marginLeft: 8 }}
                color="primary"
                size="small"
                onClick={() => {
                  this.setState({ flowerDialog: true });
                }}
              >
                toevoegen
              </Button>
            </Typography>

            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell numeric>Price</TableCell>
                    <TableCell>Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(flowers).map((flowerIndex, index) => {
                    const flower = flowers[flowerIndex];
                    return (
                      <TableRow key={index}>
                        <TableCell>{flower.name}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          {flower.description}
                        </TableCell>
                        <TableCell>{flower.price}</TableCell>
                        <TableCell>
                          <Avatar src={flower.image} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        )}
        {orders && (
          <Grid item xs={5}>
            {orderDialog &&
              order && (
                <Dialog
                  aria-labelledby="simple-dialog-title"
                  open={this.state.orderDialog}
                >
                  <DialogTitle id="simple-dialog-title">
                    Bestelling bloemen
                  </DialogTitle>
                  <List>
                    {Object.keys(order.flowers).map(flowerIndex => {
                      const flower = order.flowers[flowerIndex];
                      return (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar src={flower.image} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={flower.name}
                            secondary={flower.description}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        this.setState({ orderDialog: false, order: null });
                      }}
                      color="primary"
                    >
                      Sluiten
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            <Typography variant="display1">Bestellingen</Typography>

            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell numeric>Total price</TableCell>
                    <TableCell>Order number</TableCell>
                    <TableCell>Flowers</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(orders).map((orderIndex, index) => {
                    const order = orders[orderIndex];
                    return (
                      <TableRow key={index}>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          {order.totalPrice}
                        </TableCell>
                        <TableCell>{orderIndex}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              this.setState({ orderDialog: orderIndex }, () => {
                                firebase
                                  .database()
                                  .ref(`orders/${orderIndex}`)
                                  .once('value', snapshot => {
                                    this.setState({ order: snapshot.val() });
                                  });
                              });
                            }}
                          >
                            {`${Object.keys(order.flowers).length} flowers`}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        )}
        {admins && (
          <Grid item xs={2}>
            <Dialog
              open={this.state.adminDialog}
              onClose={() => {
                this.setState({ adminDialog: false });
              }}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Admin toevoegen</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Voer hieronder het email adres in van het persoon die als
                  admin toegevoegd moet worden.
                </DialogContentText>
                <FormControl>
                  <Grid
                    container
                    justify="center"
                    classes={{ item: classes.item }}
                  >
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
                  </Grid>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    this.setState({ adminDialog: false });
                  }}
                  color="primary"
                >
                  Annuleer
                </Button>
                <Button onClick={this.handleAdminCreate} color="primary">
                  Toevoegen
                </Button>
              </DialogActions>
            </Dialog>
            <Typography variant="display1">
              Admins
              <Button
                style={{ marginLeft: 8 }}
                color="primary"
                size="small"
                onClick={() => {
                  this.setState({ adminDialog: true });
                }}
              >
                toevoegen
              </Button>
            </Typography>

            <Paper classes={{ root: classes.root }}>
              <List>
                {Object.keys(admins).map(adminIndex => {
                  const admin = admins[adminIndex];

                  return (
                    <ListItem key={adminIndex}>
                      <ListItemIcon>
                        <Icon>account_box</Icon>
                      </ListItemIcon>
                      <ListItemText primary={admin} />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(Admin);
