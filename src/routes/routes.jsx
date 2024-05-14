import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/authentication/Login'; 
import Dashboard from '../pages/dashboard/Dashboard';
import LocationConfiguration from '../pages/dashboard/LocationConfiguration';

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard/>}>
          {/* <Route path='dashboard' element={<Check1 />}/> */}
          {/* <Route path='setting' element={<Check1 />}/> */}
          <Route path='SetupLocationConfig' element={<LocationConfiguration />}/>
        </Route>
        {/* Add any other routes here */}
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;
