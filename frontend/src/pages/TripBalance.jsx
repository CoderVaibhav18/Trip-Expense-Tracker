import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/formatUtils";
import {
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
  FiMinusCircle,
  FiArrowLeft,
  FiInfo,
} from "react-icons/fi";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BalanceVisualization from "../components/BalanceVisualization";

const TripBalance = () => {
  const { tripId } = useParams();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripName, setTripName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch balance data
        const balanceResponse = await API.get(`/balance/${tripId}/balance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setBalances(balanceResponse.data.data.balances);

        // Fetch trip name
        const tripResponse = await API.get(`/trip/${tripId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setTripName(tripResponse.data.data.trip.name || "Your Trip");
      } catch (err) {
        setError("Failed to load trip data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  // Calculate summary metrics
  const summaryMetrics = balances.reduce(
    (acc, balance) => {
      acc.totalPaid += balance.total_paid;
      acc.totalShare += balance.total_share;
      acc.positiveBalances += balance.balance > 0 ? balance.balance : 0;
      acc.negativeBalances +=
        balance.balance < 0 ? Math.abs(balance.balance) : 0;
      return acc;
    },
    { totalPaid: 0, totalShare: 0, positiveBalances: 0, negativeBalances: 0 }
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow max-w-4xl mx-auto px-4 py-10">
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center shadow-lg">
            <FiInfo className="inline-block mr-2 text-xl" />
            {error}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/trip"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 px-4 py-2 rounded-lg shadow-sm"
            >
              <FiArrowLeft className="mr-2" />
              Back to Trips
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

        <div className="flex mb-6 border-b border-gray-200">
          <Link
            to={`/trip/${tripId}/expenses`}
            className="py-3 px-6 font-medium text-gray-500  border-blue-600 hover:text-blue-500"
          >
            Expenses
          </Link>
          <Link
            to={`/balance/${tripId}`}
            className="py-3 px-6 font-medium text-blue-600 border-b-2 border-blue-600"
          >
            Balance Summary
          </Link>
          <Link
            to={`/repay/${tripId}/${tripName}`} // Your settlement page route
            className="py-3 px-6 font-medium text-gray-500 hover:text-blue-500"
          >
            Repayment
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow border border-blue-100">
            <p className="text-sm text-blue-600 mb-1">Total Paid</p>
            <p className="text-xl font-bold text-blue-800">
              {formatCurrency(summaryMetrics.totalPaid)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-white p-4 rounded-xl shadow border border-cyan-100">
            <p className="text-sm text-cyan-600 mb-1">Total Shared</p>
            <p className="text-xl font-bold text-cyan-800">
              {formatCurrency(summaryMetrics.totalShare)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl shadow border border-green-100">
            <p className="text-sm text-green-600 mb-1">To Receive</p>
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(summaryMetrics.positiveBalances)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl shadow border border-red-100">
            <p className="text-sm text-red-600 mb-1">To Pay</p>
            <p className="text-xl font-bold text-red-700">
              {formatCurrency(summaryMetrics.negativeBalances)}
            </p>
          </div>
        </div>

        {/* Visualization */}
        <BalanceVisualization balances={balances} className="mb-8" />

        {/* Balance Table */}
        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 px-6 py-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <FiUser className="text-blue-500" /> Participant Balances
              </h2>
              <p className="text-gray-600 mt-1">
                Detailed financial breakdown for each participant
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider"
                  >
                    Participant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider"
                  >
                    Paid
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider"
                  >
                    Share
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider"
                  >
                    Net Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {balances.length > 0 ? (
                  balances.map((b) => (
                    <tr
                      key={b.user_id}
                      className="hover:bg-cyan-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-blue-100 border-2 border-blue-200 rounded-xl w-10 h-10 flex items-center justify-center shadow-sm">
                            <FiUser className="text-blue-500" size={22} />
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-semibold text-gray-900">
                              {b.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-base text-blue-700 font-medium">
                        {formatCurrency(b.total_paid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-base text-cyan-700 font-medium">
                        {formatCurrency(b.total_share)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-base font-semibold">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm
                          ${
                            b.balance > 0
                              ? "bg-green-50 text-green-700"
                              : b.balance < 0
                              ? "bg-red-50 text-red-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {b.balance > 0 && <FiTrendingUp className="mr-1.5" />}
                          {b.balance < 0 && (
                            <FiTrendingDown className="mr-1.5" />
                          )}
                          {b.balance === 0 && (
                            <FiMinusCircle className="mr-1.5" />
                          )}
                          {b.balance > 0
                            ? `+${formatCurrency(b.balance)}`
                            : formatCurrency(b.balance)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <FiInfo className="text-3xl text-blue-300 mb-2" />
                        <p className="text-lg">No balance data available</p>
                        <p className="text-sm mt-1">
                          Add expenses to see balance calculations
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5 text-sm text-blue-700 border-t flex items-center">
            <FiInfo className="mr-2 flex-shrink-0" />
            <span>
              Positive balances indicate amount owed to participant. Negative
              balances indicate amount to pay.
            </span>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 via-cyan-50 to-white rounded-2xl p-6 shadow">
          <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
            <FiInfo className="mr-2" /> How to read this summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <div className="flex items-start mb-2">
                <div className="bg-green-50 text-green-700 px-2 py-1 rounded mr-3">
                  <FiTrendingUp />
                </div>
                <div>
                  <h4 className="font-semibold text-green-700">
                    Positive Balance
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    This person should receive money as they've paid more than
                    their share
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <div className="flex items-start mb-2">
                <div className="bg-red-50 text-red-600 px-2 py-1 rounded mr-3">
                  <FiTrendingDown />
                </div>
                <div>
                  <h4 className="font-semibold text-red-600">
                    Negative Balance
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    This person needs to pay money as they've paid less than
                    their share
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default TripBalance;
