import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router} from "react-router-dom"
import {Provider} from "react-redux"
import { store } from './Redux/Store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <Router>
    <App />
    </Router>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
