import React, { useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here
    alert("Logged out!");
  };

  return (
    <nav className="bg-white shadow-md w-full relative z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="font-bold text-lg text-gray-800">
          Trip Expense Tracker
        </div>
        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center text-3xl font-bold items-center w-10 h-10 z-50"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {!open ? <HiBars3BottomRight /> : <RxCross2 />}
        </button>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-4 py-2"
          >
            Home
          </Link>
          <Link
            to="/expenses"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-4 py-2"
          >
            Expenses
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-4 py-2"
          >
            About
          </Link>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity duration-300 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
      {/* Mobile Links */}
      <div
        className={`flex flex-col gap-4 absolute top-full left-0 w-full bg-white shadow-md z-40 px-6 py-6 transition-all duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-4 py-2"
          onClick={() => setOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/expenses"
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-4 py-2"
          onClick={() => setOpen(false)}
        >
          Expenses
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-4 py-2"
          onClick={() => setOpen(false)}
        >
          About
        </Link>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
          onClick={() => {
            setOpen(false);
            handleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
