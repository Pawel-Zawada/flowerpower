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

var config = {
  apiKey: 'AIzaSyASJZhCybJSdBWQBvgAx43xBMyroJNhD74',
  authDomain: 'flowerpower-f4041.firebaseapp.com',
  databaseURL: 'https://flowerpower-f4041.firebaseio.com',
  projectId: 'flowerpower-f4041',
  storageBucket: 'flowerpower-f4041.appspot.com',
  messagingSenderId: '182579779561'
};
firebase.initializeApp(config);

const dummy = {
  flowers: {
    '-LEA3ROJGZQaKxswBX8L': {
      description:
        'Deze bloemen zijn prachtig voor in de woonkamer of als cadeau.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/flowerpower-f4041.appspot.com/o/blauwe-tulpen.jpg?alt=media&token=b2576113-3123-4246-bc43-e80d2ba1aab5',
      name: 'Blauwe tulpen',
      price: 2.4
    },
    '-LEA3ROKctSTn33uIMSc': {
      description:
        'Deze bloemen zijn prachtig voor in de woonkamer of als cadeau.',
      image:
        'https://firebasestorage.googleapis.com/v0/b/flowerpower-f4041.appspot.com/o/gele-tulpen.jpg?alt=media&token=349a4157-010a-44d9-8a84-a61dd1d9928d',
      name: 'Rode tulpen',
      price: 2.4
    }
  },
  totalPrice: 4.8,
  customer: 'mail@mail.com'
};

firebase
  .database()
  .ref('orders')
  .once('value', snapshot => {
    if (snapshot.exists()) return;

    for (var i = 1; i < 4; i++) {
      firebase
        .database()
        .ref('orders')
        .push(dummy);
    }
  });

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

class Admin extends Component {
  state = { orders: null };

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

  render() {
    const { classes } = this.props;
    const { orders, flowers } = this.state;

    return (
      <Grid container style={{ margin: 8 }} spacing={8}>
        {flowers && (
          <Grid item>
            <Typography variant="display1">
              Flowers
              <Button style={{ marginLeft: 8 }} color="primary" size="small">
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
