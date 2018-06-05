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

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  item: {
    marginTop: 8
  }
});

class Admin extends Component {
  state = { orders: null, flowerDialog: false };

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
  }

  handleFlowerCreate = () => {
    const { name, description, image, price } = this.state;

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

  render() {
    const { classes } = this.props;
    const { orders, flowers } = this.state;

    return (
      <Grid container style={{ margin: 8 }} spacing={8}>
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
          <Grid item>
            <Typography variant="display1">
              Flowers
              <Button
                style={{ marginLeft: 8 }}
                color="primary"
                size="small"
                onClick={() => {
                  this.setState({ flowerDialog: true });
                }}
              >
                Add new
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
          <Grid item>
            <Typography variant="display1">Orders</Typography>

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
      </Grid>
    );
  }
}

export default withStyles(styles)(Admin);
