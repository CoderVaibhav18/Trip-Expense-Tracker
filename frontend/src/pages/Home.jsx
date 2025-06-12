import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 mt-10 py-12 md:py-16">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5">
            Welcome to Trip Expense Tracker
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Easily manage and split your trip expenses with friends and family.
            Track spending, settle balances, and enjoy your journeys
            stress-free!
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded transition-colors duration-200 shadow"
          >
            Get Started
          </Link>
        </section>
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded shadow p-8 flex flex-col items-center">
            <span className="text-blue-500 text-3xl mb-4">💸</span>
            <h2 className="font-semibold text-lg mb-3">Add Expenses</h2>
            <p className="text-gray-500 text-center">
              Quickly add and categorize expenses for your trips.
            </p>
          </div>
          <div className="bg-white rounded shadow p-8 flex flex-col items-center">
            <span className="text-green-500 text-3xl mb-4">🤝</span>
            <h2 className="font-semibold text-lg mb-3">Split Bills</h2>
            <p className="text-gray-500 text-center">
              Effortlessly split costs among group members and keep everyone
              updated.
            </p>
          </div>
          <div className="bg-white rounded shadow p-8 flex flex-col items-center">
            <span className="text-yellow-500 text-3xl mb-4">📊</span>
            <h2 className="font-semibold text-lg mb-3">Track Balances</h2>
            <p className="text-gray-500 text-center">
              View summaries and settle up with friends at the end of your trip.
            </p>
          </div>
        </section>
        <section className="max-w-4xl mx-auto px-4 py-10 mt-8">
          <div className="bg-white rounded shadow p-6 md:p-10 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Why use Trip Expense Tracker?
            </h3>
            <p className="text-gray-600 mb-6">
              Our tool helps you keep your group travel finances organized and
              transparent. No more confusion about who owes what!
            </p>
            <ul className="text-gray-700 mb-6 space-y-2 text-left max-w-md mx-auto">
              <li>• Simple and intuitive interface</li>
              <li>• Real-time balance updates</li>
              <li>• Works great on mobile and desktop</li>
              <li>• Free to use for everyone</li>
            </ul>
            <Link
              to="/about"
              className="inline-block bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-6 py-2 rounded transition-colors duration-200 border border-blue-200"
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
