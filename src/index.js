import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase';
import registerServiceWorker from './registerServiceWorker';

var config = {
  apiKey: 'AIzaSyASJZhCybJSdBWQBvgAx43xBMyroJNhD74',
  authDomain: 'flowerpower-f4041.firebaseapp.com',
  databaseURL: 'https://flowerpower-f4041.firebaseio.com',
  projectId: 'flowerpower-f4041',
  storageBucket: 'flowerpower-f4041.appspot.com',
  messagingSenderId: '182579779561'
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
