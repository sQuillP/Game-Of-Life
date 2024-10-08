import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';


import Home from './components/home/home';
import App from './App';
import Play from './components/Play/Play';



/**
 * TODO: 
 * 
 * Fix some pausing bugs with opening menus
 * maybe pinch/scrolling integration.
 */


const router = createBrowserRouter([
  {
    path:'/home',
    element: <Home/>
  },
  {
    path:'/play',
    element:<Play/>
  },
  {
    path:"*",
    element: <Home/>
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
