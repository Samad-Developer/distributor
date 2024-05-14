import React from 'react';
import { Menu, List } from 'antd';
import { Link } from 'react-router-dom'; // for navigation
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content area */}
        <div className="flex-1 px-5 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
