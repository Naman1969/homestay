import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext'; // Import UserContextProvider
import AccountPage from './pages/AccountPage';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';

// Set axios defaults
axios.defaults.baseURL= "http://localhost:4000";
//axios.defaults.baseURL = "http://127.0.0.1:4000";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <UserContextProvider> {/* Wrap your Routes in UserContextProvider */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage/>} />
          
        <Route path="/account/places" element={<PlacesPage/>} />
        <Route path="/account/places/new" element={<PlacesFormPage/>} />
        <Route path="/account/places/:id" element={<PlacesFormPage/>} />
          {/*<Route path="/account/:subpage?" element={<AccountPage/>} />
          <Route path="/account/booking" element={<AccountPage/>} />
          <Route path="/account/places/:id" element={<PlacesPage/>} />
          */}
          {/*<Route path="/account/:subpage/:action" element={<AccountPage/>} />*/}
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
