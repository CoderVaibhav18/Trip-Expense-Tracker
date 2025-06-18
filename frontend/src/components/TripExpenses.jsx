import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import {
  FiArrowLeft,
  FiDollarSign,
  FiUser,
  FiFileText,
  FiImage,
  FiClock,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Navbar from "./Navbar";
import Footer from "./Footer";

const TripExpenses = () => {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [tripDetails, setTripDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch trip details
        const tripResponse = await API.get(`/trip/${tripId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setTripDetails(tripResponse.data.data);

        // Fetch expenses
        const expensesResponse = await API.get(`/expense/trip/${tripId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setExpenses(expensesResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load expenses");
        console.error("Error loading expenses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [tripId]);

  // Improved date formatting
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  return (
    <>
      <Navbar />
      <motion.div
        className="max-w-4xl mx-auto px-4 py-10 animate-fade-in-up"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <Link
            to={`/trip`}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Back to Trip
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight text-center md:text-left">
            {tripDetails?.trip?.name || "Trip Expenses"}
          </h1>
          <div className="hidden md:block w-32"></div>
        </div>
        <div className="flex mb-6 border-b border-gray-200">
          <Link
            to={`/trip/${tripId}/expenses`}
            className="py-3 px-6 font-medium text-blue-600 border-b-2 border-blue-600"
          >
            Expenses
          </Link>
          <Link
            to={`/balance/${tripId}`}
            className="py-3 px-6 font-medium text-gray-500  border-blue-600"
          >
            Balance Summary
          </Link>
          <Link
            to={`/balance/${tripId}/settle`} // Your settlement page route
            className="py-3 px-6 font-medium text-gray-500 hover:text-blue-500"
          >
            Settle Up
          </Link>
        </div>

        {/* Summary Card */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 mb-8 border border-blue-100"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-gray-500 flex items-center">
                <FiDollarSign className="mr-2" />
                Total Expenses
              </div>
              <div className="text-2xl font-bold text-blue-700 mt-2 flex items-center">
                <LiaRupeeSignSolid size={24} />
                {totalExpenses.toFixed(2)}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-gray-500 flex items-center">
                <FiUser className="mr-2" />
                Expenses Count
              </div>
              <div className="text-2xl font-bold text-cyan-600 mt-2">
                {expenses.length}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-gray-500 flex items-center">
                <FiFileText className="mr-2" />
                Trip Members
              </div>
              <div className="text-2xl font-bold text-blue-500 mt-2">
                {tripDetails?.members?.length || 0}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading expenses...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow">
            <p className="text-red-600 font-semibold text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && expenses.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border border-blue-100 shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow">
              <FiDollarSign className="text-blue-600" size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Expenses Yet
            </h3>
            <p className="text-gray-600 max-w-md text-center mb-6">
              You haven't added any expenses to this trip. Start adding expenses
              to see them here.
            </p>
            <Link
              to={`/trip/${tripId}/add-expense`}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all"
            >
              Add Your First Expense
            </Link>
          </motion.div>
        )}

        {/* Expenses List */}
        {!isLoading && !error && expenses.length > 0 && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {expenses.map((expense) => (
              <motion.div
                key={expense.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl"
                whileHover={{
                  y: -4,
                  boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.10)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <LiaRupeeSignSolid className="mr-1 text-blue-600" />
                        {expense.amount}
                        <span className="ml-3 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {expense.description}
                        </span>
                      </h3>
                      <div className="mt-2 flex items-center text-gray-600">
                        <FiUser className="mr-2" />
                        <span className="font-medium">Paid by:</span>
                        <span className="ml-2 text-blue-600">
                          {expense.paid_by_name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center text-gray-500">
                      <FiClock className="mr-1 text-gray-400" />
                      <span className="text-sm">
                        {formatDateTime(expense.date)}
                      </span>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="mt-4">
                    <div className="text-sm text-gray-500 mb-2 font-medium">
                      Split with:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {expense?.members?.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-sm shadow-sm"
                        >
                          <div className="bg-gray-200 border-2 border-dashed rounded-full w-6 h-6 flex items-center justify-center mr-2">
                            <FiUser className="text-blue-500 text-xs" />
                          </div>
                          <span className="text-blue-700">{member.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm mt-4 text-gray-500 mb-2 font-medium">
                      Split amount:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-base font-semibold text-blue-700 shadow-sm">
                        <LiaRupeeSignSolid className="mr-1" />
                        {(expense.amount / expense.members.length).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bill Image */}
                {expense.image_url && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="overflow-hidden rounded-lg border border-gray-200 max-w-xs mx-auto">
                      <img
                        src={expense.image_url}
                        alt={`Bill for ${expense.description}`}
                        className="w-full h-48 object-contain cursor-pointer transition-all hover:opacity-90"
                        onClick={() => window.open(expense.image_url, "_blank")}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="text-center py-2 bg-gray-50 text-sm text-gray-500">
                        Click to view full size
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Add Expense Button */}
        {!isLoading && expenses.length > 0 && (
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to={`/trip/${tripId}/add-expense`}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center"
            >
              <FiDollarSign className="mr-2" size={20} />
              Add New Expense
            </Link>
          </motion.div>
        )}
      </motion.div>
      <Footer />
      <style>
        {`
          .animate-fade-in-up {
            animation: fadeInUp 0.7s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default TripExpenses;
