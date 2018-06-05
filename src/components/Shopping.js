import React, { Component } from 'react';

import firebase from 'firebase';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

class Shopping extends Component {
  state = {
    anchorEl: null
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleCheckout = () => {
    const { items } = this.props;

    const mail = firebase.auth().currentUser.email;

    if (!items) return;

    firebase
      .database()
      .ref('orders')
      .push({
        customer: mail,
        totalPrice: Object.keys(items)
          .map(itemIndex => {
            return items[itemIndex].price;
          })
          .reduce(function(acc, val) {
            return acc + val;
          })
      })
      .then(snapshot => {
        console.log(Object.keys(items).map(item => item));
        firebase
          .database()
          .ref('flowers')
          .once('value', flowers => {
            console.log(flowers.val());
            for (var item in items) {
              snapshot.ref.child('flowers').push(flowers.val()[item]);
            }
          });
      });
  };

  handleClear = () => {};

  render() {
    const { anchorEl } = this.state;
    const { items } = this.props;

    const open = Boolean(anchorEl);

    return (
      <div>
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Icon>shopping_cart</Icon>
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
          {items && (
            <List dense>
              {Object.keys(items).map(itemIndex => {
                const item = items[itemIndex];
                return (
                  <ListItem key={itemIndex}>
                    <ListItemIcon>
                      <Icon>local_florist</Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={item.description}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
          <Divider />
          <MenuItem onClick={this.handleCheckout}>Checkout</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default Shopping;
