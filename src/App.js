import React, { Component } from 'react';
import firebase from 'firebase';
import { BrowserRouter, Route } from 'react-router-dom';

import Topbar from './components/Topbar';

import Home from './Home';
import Products from './Products';

class App extends Component {
  constructor(props) {
    super(props);
    var config = {
      apiKey: 'AIzaSyASJZhCybJSdBWQBvgAx43xBMyroJNhD74',
      authDomain: 'flowerpower-f4041.firebaseapp.com',
      databaseURL: 'https://flowerpower-f4041.firebaseio.com',
      projectId: 'flowerpower-f4041',
      storageBucket: 'flowerpower-f4041.appspot.com',
      messagingSenderId: '182579779561'
    };
    firebase.initializeApp(config);
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Topbar />
          <Route exact path="/" component={Home} />
          <Route path="/products" component={Products} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
