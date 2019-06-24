import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import test from './test.ts';
import registerServiceWorker from './registerServiceWorker';
console.log(test)
ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();

