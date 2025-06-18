import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import {
  FiArrowLeft,
  FiDollarSign,
  FiUser,
  FiFileText,
  FiInfo,
  FiClock,
  FiTrendingDown,
  FiCheckCircle,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TripExpenses = () => {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [tripDetails, setTripDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPayer, setFilterPayer] = useState("all");

  // Fetch all data in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [tripRes, expensesRes, settlementsRes] = await Promise.all([
          API.get(`/trip/${tripId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
          API.get(`/expense/trip/${tripId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
          API.get(`/expense/trip/${tripId}/summary`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
        ]);

        setTripDetails(tripRes.data.data);
        setExpenses(expensesRes.data.data);
        setSettlements(settlementsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trip data");
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  // Improved date formatting
  const formatDateTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  // Calculate total expenses
  const totalExpenses = useMemo(
    () =>
      expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0),
    [expenses]
  );

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.paid_by_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPayer =
        filterPayer === "all" || expense.paid_by_id === parseInt(filterPayer);

      return matchesSearch && matchesPayer;
    });
  }, [expenses, searchQuery, filterPayer]);

  // Handle settle payment
  const handleSettle = useCallback((debtorId, creditorId, amount) => {
    console.log(`Settling ${amount} from ${debtorId} to ${creditorId}`);
    // API call to mark as settled would go here
    alert(
      `Marked as settled: ${debtorId} paid ₹${amount.toFixed(
        2
      )} to ${creditorId}`
    );
  }, []);

  // Unique payers for filter dropdown
  const uniquePayers = useMemo(() => {
    const payers = expenses.reduce((acc, expense) => {
      if (!acc.some((p) => p.id === expense.paid_by_id)) {
        acc.push({
          id: expense.paid_by_id,
          name: expense.paid_by_name,
        });
      }
      return acc;
    }, []);

    return [{ id: "all", name: "All Payers" }, ...payers];
  }, [expenses]);

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
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <Link
            to={`/trip`}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Back to Trips
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight text-center md:text-left">
            {tripDetails?.trip?.name || "Trip Expenses"}
          </h1>
          <div className="hidden md:block w-32"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap mb-6 border-b border-gray-200">
          <Link
            to={`/trip/${tripId}/expenses`}
            className="py-3 px-4 md:px-6 font-medium text-blue-600 border-b-2 border-blue-600"
          >
            Expenses
          </Link>
          <Link
            to={`/balance/${tripId}`}
            className="py-3 px-4 md:px-6 font-medium text-gray-500 hover:text-blue-500 transition-colors"
          >
            Balance Summary
          </Link>
          <Link
            to={`/repay/${tripId}/${tripDetails?.trip?.name}`}
            className="py-3 px-4 md:px-6 font-medium text-gray-500 hover:text-blue-500 transition-colors"
          >
            Repayment
          </Link>
          <Link
            to={`/repay-history/${tripId}/${tripDetails?.trip?.name}`}
            className="py-3 px-4 md:px-6 font-medium text-gray-500 hover:text-blue-500 transition-colors"
          >
            History
          </Link>
        </div>

        {/* Summary Card */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow p-6 mb-8 border border-blue-100"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-gray-500 flex items-center text-sm">
                <FiDollarSign className="mr-2" />
                Total Expenses
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-700 mt-2 flex items-center">
                <LiaRupeeSignSolid size={20} />
                {totalExpenses.toFixed(2)}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-gray-500 flex items-center text-sm">
                <FiUser className="mr-2" />
                Expenses Count
              </div>
              <div className="text-xl md:text-2xl font-bold text-cyan-600 mt-2">
                {expenses.length}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-gray-500 flex items-center text-sm">
                <FiFileText className="mr-2" />
                Trip Members
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-500 mt-2">
                {tripDetails?.members?.length || 0}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        {expenses.length > 0 && (
          <motion.div
            className="flex flex-col md:flex-row gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-3.5 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none appearance-none w-full md:w-48 bg-white"
                value={filterPayer}
                onChange={(e) => setFilterPayer(e.target.value)}
              >
                {uniquePayers.map((payer) => (
                  <option key={payer.id} value={payer.id}>
                    {payer.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading expenses...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <p className="text-red-600 font-semibold text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading &&
          !error &&
          filteredExpenses.length === 0 &&
          expenses.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border border-blue-100 shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow">
                <FiDollarSign className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                No Expenses Yet
              </h3>
              <p className="text-gray-600 max-w-md text-center mb-6 px-4">
                You haven't added any expenses to this trip. Start adding
                expenses to see them here.
              </p>
              <Link
                to={`/trip/${tripId}/add-expense`}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all"
              >
                Add Your First Expense
              </Link>
            </motion.div>
          )}

        {/* Filtered Empty State */}
        {!isLoading &&
          !error &&
          filteredExpenses.length === 0 &&
          expenses.length > 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border border-blue-100 shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FiSearch className="text-blue-500 mb-4" size={40} />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                No Matching Expenses
              </h3>
              <p className="text-gray-600 max-w-md text-center mb-6 px-4">
                No expenses match your search criteria. Try changing your search
                or filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterPayer("all");
                }}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

        {/* Expenses List */}
        {!isLoading && !error && filteredExpenses.length > 0 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {filteredExpenses.map((expense, idx) => (
                <ExpenseCard
                  key={idx}
                  expense={expense}
                  formatDateTime={formatDateTime}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Settlement Summary Section */}
        {settlements.length > 0 && (
          <motion.div
            className="mt-10 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
              <h3 className="text-xl font-bold text-blue-700 flex items-center">
                <FiDollarSign className="mr-2" /> Settlement Summary
              </h3>
              <div className="text-sm text-blue-600 flex items-center">
                <FiInfo className="mr-2 flex-shrink-0" />
                <span>Shows who needs to pay whom to settle all balances</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settlements.map((debtor) => (
                <div
                  key={debtor.user_id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <FiUser className="text-red-500" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {debtor.user_name}
                      </h4>
                      <p className="text-sm text-gray-500">Owes to:</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {debtor.owes.map((debt, idx) => (
                      <motion.div
                        key={`${debt.to_user_id}-${idx}`}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <div className="flex items-center min-w-0">
                          <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <FiUser className="text-green-500" />
                          </div>
                          <span className="font-medium truncate">
                            {debt.to_user_name}
                          </span>
                        </div>

                        <div className="flex items-center flex-shrink-0">
                          <span className="font-bold text-red-600 mr-3">
                            <LiaRupeeSignSolid className="inline mr-0.5" />
                            {debt.amount.toFixed(2)}
                          </span>
                          <button
                            onClick={() =>
                              handleSettle(
                                debtor.user_id,
                                debt.to_user_id,
                                debt.amount
                              )
                            }
                            className="bg-green-100 text-green-700 hover:bg-green-200 p-1.5 rounded-full transition-colors"
                            aria-label="Mark as settled"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add Expense Button */}
        {!isLoading && expenses.length > 0 && (
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to={`/trip/${tripId}/add-expense`}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow hover:shadow-xl transition-all flex items-center"
            >
              <FiDollarSign className="mr-2" size={18} />
              Add New Expense
            </Link>
          </motion.div>
        )}
      </motion.div>
      <Footer />
      <style>
        {`
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(15px);
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

// Memoized Expense Card Component
const ExpenseCard = React.memo(({ expense, formatDateTime }) => (
  <motion.div
    className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100 transition-all hover:shadow-md"
    whileHover={{ y: -3 }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="p-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center flex-wrap gap-2">
            <LiaRupeeSignSolid className="text-blue-600 flex-shrink-0" />
            <span className="truncate">{expense.amount}</span>
            <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full truncate">
              {expense.description}
            </span>
          </h3>
          <div className="mt-2 flex items-center text-gray-600 text-sm">
            <FiUser className="mr-2 flex-shrink-0" />
            <span className="font-medium">Paid by:</span>
            <span className="ml-1 text-blue-600 truncate">
              {expense.paid_by_name}
            </span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm flex-shrink-0">
          <FiClock className="mr-1.5 text-gray-400" />
          <span>{formatDateTime(expense.date)}</span>
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
              className="flex items-center bg-blue-50 px-2.5 py-1 rounded-full text-sm shadow-sm max-w-full"
            >
              <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                <FiUser className="text-blue-500 text-xs" />
              </div>
              <span className="text-blue-700 truncate">{member.name}</span>
            </div>
          ))}
        </div>
        <div className="text-sm mt-3 text-gray-500 mb-1 font-medium">
          Individual share:
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-sm font-semibold text-blue-700 shadow-sm">
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
            className="w-full h-40 object-contain cursor-pointer transition-all hover:opacity-90"
            onClick={() => window.open(expense.image_url, "_blank")}
            loading="lazy"
            decoding="async"
          />
          <div className="text-center py-2 bg-gray-50 text-xs text-gray-500">
            Click to view full size
          </div>
        </div>
      </div>
    )}
  </motion.div>
));

export default TripExpenses;
