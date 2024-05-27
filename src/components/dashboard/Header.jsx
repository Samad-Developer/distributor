import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[#4F46E5] text-white py-4 px-6 flex justify-between items-center">
      <div>
        <h1 className='font-bold'>Distributor</h1>
      </div>
      <div>
        <Link to='/login'>Login</Link>
      </div>
    </header>
  );
};

export default Header;
