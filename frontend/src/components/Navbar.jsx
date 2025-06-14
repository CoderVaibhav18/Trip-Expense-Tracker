import React, { useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/project", label: "Project" },
  { to: "/expenses", label: "Expenses" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/logout')
    alert("Logged out!");
  };

  // Animated underline link style
  const linkClass =
    "relative px-4 py-2 text-gray-700 font-medium transition-colors duration-200 hover:text-blue-600 group";
  const underline =
    "absolute left-1/2 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded";

  return (
    <nav className="bg-white shadow-md w-full relative z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="font-bold text-lg text-gray-800 tracking-wide">
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
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={linkClass}
            >
              {link.label}
              <span className={underline}></span>
            </Link>
          ))}
          <button
            className="relative px-5 py-2 bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-400 text-white rounded-full font-semibold shadow-md overflow-hidden transition-transform duration-150 group hover:scale-105 focus:outline-none"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <span className="relative z-10 group-hover:tracking-wide transition-all duration-150">Logout</span>
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-150"></span>
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
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="relative px-4 py-2 text-gray-700 font-medium transition-colors duration-200 hover:text-blue-600 group"
            onClick={() => setOpen(false)}
          >
            {link.label}
            <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded"></span>
          </Link>
        ))}
         <button
          className="relative px-6 py-3 bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-400 text-white rounded-full font-semibold shadow-md overflow-hidden transition-transform duration-150 group hover:scale-105 focus:outline-none"
          onClick={() => {
            setOpen(false);
            handleLogout();
          }}
          aria-label="Logout"
        >
          <span className="relative z-10 group-hover:tracking-wide transition-all duration-150">Logout</span>
          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-150"></span>
        </button>
      </div>
      {/* Custom underline animation for links */}
      <style>
        {`
          .group:hover .group-hover\\:w-3\\/4 {
            width: 75% !important;
          }
          .group:hover .group-hover\\:left-1\\/8 {
            left: 12.5% !important;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;