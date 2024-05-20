import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/authentication/Login'; 
import Dashboard from '../pages/dashboard/Dashboard';
import LocationConfiguration from '../pages/dashboard/LocationConfiguration';
import Customer from '../screens/setting/Customer';
import Company from '../screens/setting/Company';
import Branch from '../screens/setting/Branch';

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard/>}>
          {/* <Route path='dashboard' element={<Check1 />}/> */}
          <Route path='customer' element={<Customer />}/>
          <Route path='branch' element={<Branch />}/>
          <Route path='company' element={<Company />}/>
          <Route path='SetupLocationConfig' element={<LocationConfiguration />}/>
        </Route>
        {/* Add any other routes here */}
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;
