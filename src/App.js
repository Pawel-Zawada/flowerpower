import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Topbar from './components/Topbar';

import Home from './Home';
import Products from './Products';
import Admin from './Admin';
import Orders from './Orders';

class App extends Component {
  state = { items: null };

  handleAdd = items => {
    this.setState({ items });
  };

  render() {
    const { items } = this.state;
    return (
      <BrowserRouter>
        <div>
          <Topbar items={items} />
          <Route exact path="/" component={Home} />
          <Route
            path="/products"
            render={props => <Products {...props} handleAdd={this.handleAdd} />}
            handleAdd={this.handleAdd}
          />
          <Route path="/admin" component={Admin} />
          <Route path="/orders" component={Orders} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
