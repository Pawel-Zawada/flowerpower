import React, { Component } from 'react';

import firebase from 'firebase';
import jsPDF from 'jspdf';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

class Orders extends Component {
  state = { orders: null, orderDialog: false, order: null };
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref('orders')
          .orderByChild('customer')
          .equalTo(user.email)
          .once('value', snapshot => {
            console.log(snapshot.val());
            this.setState({
              orders: snapshot.val()
            });
          });
      }
    });
  }
  render() {
    const { orders, orderDialog, order } = this.state;
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item>
          {orderDialog &&
            order && (
              <Dialog
                aria-labelledby="simple-dialog-title"
                open={this.state.orderDialog}
              >
                <DialogTitle id="simple-dialog-title">
                  Bestellingen bloemen
                </DialogTitle>
                <List>
                  {console.log(order)}
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
              {orders && (
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
                          {order && (
                            <div>
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  this.setState(
                                    { orderDialog: orderIndex },
                                    () => {
                                      firebase
                                        .database()
                                        .ref(`orders/${orderIndex}`)
                                        .once('value', snapshot => {
                                          this.setState({
                                            order: snapshot.val()
                                          });
                                        });
                                    }
                                  );
                                }}
                              >
                                {`${Object.keys(order).length} flowers`}
                              </Button>
                              <Button
                                onClick={() => {
                                  var doc = new jsPDF({
                                    orientation: 'landscape',
                                    unit: 'in',
                                    format: [4, 2]
                                  });
                                  doc.text(JSON.stringify(order));
                                  doc.save('Factuur.pdf');
                                }}
                              >
                                PDF
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Orders);
