import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { formatCurrency } from "../utils/formatUtils";

const RepaymentHistory = () => {
  const { tripId, tripName } = useParams();
  const [repayments, setRepayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        setIsLoading(true);
        const response = await API.get(`/repayment/${tripId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setRepayments(response.data.data.repayments);
      } catch (err) {
        setError("Failed to load repayment history. Please try again.");
        console.error("Error loading repayments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepayments();
  }, [tripId]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="max-w-4xl mx-auto px-4 py-10 animate-fade-in-up"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <Link
            to={`/trip`}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Back to Trips
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight text-center md:text-left">
            {tripName || "Trip Expenses"}
          </h1>
          <div className="hidden md:block w-32"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap mb-6 border-b border-gray-200">
          <Link
            to={`/trip/${tripId}/expenses`}
            className="py-3 px-4 md:px-6 font-medium text-gray-500 hover:text-blue-500 transition-colors"
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
            to={`/repay/${tripId}/${tripName}`}
            className="py-3 px-4 md:px-6 font-medium text-gray-500 hover:text-blue-500 transition-colors"
          >
            Repayment
          </Link>
          <Link
            to={`/repay-history/${tripId}/${tripName}`}
            className="py-3 px-4 md:px-6 font-medium text-blue-600 border-b-2 border-blue-600 transition-colors"
          >
            History
          </Link>
        </div>

        {/* Header with Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                <FiCheckCircle className="text-blue-500" />
                Repayment History
              </h2>
              <p className="text-gray-600 mt-1">
                All recorded payments between trip members
              </p>
            </div>
            <div className="mt-4 md:mt-0 bg-white rounded-xl shadow-sm px-5 py-3 flex items-center">
              <MdOutlineCurrencyRupee className="text-green-500 mr-2" />
              <span className="font-medium">
                {repayments.length}{" "}
                {repayments.length === 1 ? "Payment" : "Payments"}
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">
              Loading repayment history...
            </p>
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
        {!isLoading && !error && repayments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border border-blue-100 shadow">
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow">
              <MdOutlineCurrencyRupee className="text-blue-600" size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Repayments Yet
            </h3>
            <p className="text-gray-600 max-w-md text-center mb-6">
              No repayment transactions have been recorded for this trip yet.
              Settle up to see repayment history here.
            </p>
            <Link
              to={`/repay/${tripId}`}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all"
            >
              Settle Up Now
            </Link>
          </div>
        )}

        {/* Repayments List */}
        {!isLoading && !error && repayments.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {repayments.map((r) => (
              <motion.div
                key={r.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ y: -3 }}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <FiUser className="text-green-500" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 flex items-center">
                          <span className="text-blue-600">{r.fromUser}</span>
                          <span className="mx-2 text-gray-400">→</span>
                          <span className="text-green-600">{r.toUser}</span>
                        </div>
                        <div className="flex items-center text-gray-700 font-medium mt-2">
                          {formatCurrency(r.amount)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm">
                      <FiClock className="mr-1.5 text-gray-400" />
                      <span>{formatDate(r.timestamp)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCheckCircle className="mr-2 flex-shrink-0 text-green-500" />
                      <span>Payment successful</span>
                    </div>
                    <div className="text-sm text-gray-500">ID: {r.id}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Summary */}
        {repayments.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 shadow-sm">
              <div className="text-blue-600 text-sm font-medium mb-1">
                Total Repayments
              </div>
              <div className="text-2xl font-bold text-blue-800 flex items-center">
                {formatCurrency(
                  repayments.reduce((sum, r) => sum + parseFloat(r.amount), 0)
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100 shadow-sm">
              <div className="text-green-600 text-sm font-medium mb-1">
                Payments Recorded
              </div>
              <div className="text-2xl font-bold text-green-700">
                {repayments.length}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-white p-5 rounded-xl border border-cyan-100 shadow-sm">
              <div className="text-cyan-600 text-sm font-medium mb-1">
                Unique Payers
              </div>
              <div className="text-2xl font-bold text-cyan-700">
                {new Set(repayments.map((r) => r.fromUser)).size}
              </div>
            </div>
          </div>
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

export default RepaymentHistory;
