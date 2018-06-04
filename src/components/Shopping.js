import React, { Component } from 'react';

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
import { SIGTTIN } from 'constants';

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

  handleLogout = () => {
    this.props.handleLogout();
    this.handleClose();
  };

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
          <MenuItem onClick={this.handleClose}>Clear</MenuItem>
          <MenuItem onClick={this.handleLogout}>Checkout</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default Shopping;
