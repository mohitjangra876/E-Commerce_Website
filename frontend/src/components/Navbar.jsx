import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, cartCount } = useContext(ShopContext);
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-grey-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        {isAdmin() && (
          <NavLink
            to="/admin/dashboard"
            className="flex flex-col items-center gap-1"
          >
            <p>ADMIN</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        )}
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => {
            setShowSearch(true);
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />

        {/*  DropDown Menu     */}

        <div className="group relative">
          <div className="w-5 h-5 cursor-pointer">
            <img
              className="w-5"
              src={assets.profile_icon}
              alt=""
            />
          </div>
          <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute dropdown-menu right-0 pt-3 z-50 transition-all duration-150">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
              {isAuthenticated() ? (
                <>
                  <p className="text-sm font-medium text-black">
                    {user?.name}
                  </p>
                  <Link
                    to="/profile"
                    className="cursor-pointer hover:text-black"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="cursor-pointer hover:text-black"
                  >
                    My Orders
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin/dashboard"
                      className="cursor-pointer hover:text-black"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <p
                    onClick={handleLogout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </>
              ) : (
                <Link to="/login" className="cursor-pointer hover:text-black">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        <Link to="/cart" className="relative">
          <img className="w-5 min-w-5" alt="" src={assets.cart_icon} />
          {cartCount > 0 && (
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {cartCount}
            </p>
          )}
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt=""
          className="w-5 sm:hidden cursor-pointer"
        />
      </div>

      {/* Sidebar menu for small screen  */}

      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? 'w-full' : 'w-0'
        } `}
      >
        <div className="flex flex-col text-grey-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
          {isAdmin() && (
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/admin/dashboard"
            >
              ADMIN
            </NavLink>
          )}
          {isAuthenticated() ? (
            <>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 pl-6 border"
                to="/orders"
              >
                ORDERS
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setVisible(false);
                }}
                className="py-2 pl-6 border text-left"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/login"
            >
              LOGIN
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;  
