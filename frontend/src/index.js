import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const backendUrl = 'https://afc-housekeeping-project.onrender.com'; // Your Render backend URL

ReactDOM.render(
  <React.StrictMode>
    <App backendUrl={backendUrl} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();