import React, { Component } from 'react';

import Topbar from './components/Topbar';

import Admin from './Admin';

class App extends Component {
  render() {
    return (
      <div>
        <Topbar />
        <Admin />
      </div>
    );
  }
}

export default App;
