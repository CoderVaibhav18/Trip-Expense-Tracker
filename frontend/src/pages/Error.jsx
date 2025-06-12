import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Error = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 flex flex-col items-center animate-fade-in-up max-w-md w-full">
          <span className="text-6xl md:text-7xl mb-4 text-blue-500">😕</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 text-center mb-6">
            The page you are looking for doesn't exist or has been moved.
            <br />
            Please check the URL or return to the homepage.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-colors duration-200 shadow"
          >
            Go Home
          </a>
        </div>
        <style>
          {`
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
        </style>
      </div>
      <Footer />
    </>
  );
};

export default Error;
