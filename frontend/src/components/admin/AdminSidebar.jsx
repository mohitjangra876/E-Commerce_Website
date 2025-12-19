import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            to="/"
            className="block py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded mb-4"
          >
            ← Back to Store
          </Link>
          <Link
            to="/admin/dashboard"
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            Products
          </Link>
          <Link
            to="/admin/orders"
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            Orders
          </Link>
          <Link
            to="/admin/categories"
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            Categories
          </Link>
          <Link
            to="/admin/users"
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            Users
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left py-2 px-4 hover:bg-red-600 rounded mt-4"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
