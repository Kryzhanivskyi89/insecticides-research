import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'


import { Provider } from "react-redux";
import store from "./redux/store";
import App from './App';
import './index.css';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Provider store={store}>
    <BrowserRouter >
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <App />
        {/* </PersistGate> */}
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// basename="/insecticides-research"