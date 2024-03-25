import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Home from './routes/Home.tsx';
import Account from './routes/dashboard/Account.tsx';
import Dashboard from './routes/dashboard/Dashboard.tsx';
import Orders from './routes/dashboard/Orders.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="home" element={<Home />} />
      <Route path="dashboard/" element={<Dashboard />} >
        <Route path="account" element={<Account />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
