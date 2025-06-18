import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import {
  FiArrowLeft,
  FiDollarSign,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
// import { formatCurrency } from "../utils/formatUtils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RepaymentForm = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [payees, setPayees] = useState([]);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tripName, setTripName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch trip name
        const tripResponse = await API.get(`/trip/${tripId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setTripName(tripResponse.data.data.trip?.name || "Trip");

        // Fetch payees
        const payeesResponse = await API.get(`/balance/${tripId}/trip-payee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        // Sort payees alphabetically by name
        const sortedPayees = [...payeesResponse.data.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setPayees(sortedPayees);

        if (sortedPayees.length > 0) {
          setSelectedPayee(sortedPayees[0].user_id);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load payment information"
        );
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedPayee) {
      setError("Please select a member to repay");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsSubmitting(true);

      await API.post(
        `/repayment/${tripId}`,
        {
          paidTo: selectedPayee,
          amount: parseFloat(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Redirect to balance page with success state
      navigate(`/balance/${tripId}`, {
        state: {
          success: true,
          message: "Repayment recorded successfully!",
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record repayment");
      console.error("Repayment error:", err);
    } finally {
      setIsSubmitting(false);
    }
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
            className="py-3 px-4 md:px-6 font-medium text-blue-600 border-b-2 border-blue-600 transition-colors"
          >
            Repayment
          </Link>
        </div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Record Repayment
          </h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Trip Info */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6 border border-blue-100 flex items-center">
          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <FiUser className="text-blue-500" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{tripName}</h2>
            <p className="text-sm text-gray-600">Select who you're repaying</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading payment information...</p>
          </div>
        )}

        {/* No Payees State */}
        {!isLoading && payees.length === 0 && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <FiUser className="mx-auto text-gray-400 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Payees Found
            </h3>
            <p className="text-gray-600 mb-4">
              No members have expenses to repay in this trip.
            </p>
            <button
              onClick={() => navigate(`/trip/${tripId}/expenses`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Expenses
            </button>
          </div>
        )}

        {/* Repayment Form */}
        {!isLoading && payees.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Select member to repay
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {payees.map((payee) => (
                    <motion.div
                      key={payee.user_id}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedPayee === payee.user_id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedPayee(payee.user_id)}
                    >
                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <FiUser className="text-blue-500" size={18} />
                      </div>
                      <div className="font-medium text-gray-900">
                        {payee.name}
                      </div>
                      {selectedPayee === payee.user_id && (
                        <FiCheckCircle
                          className="text-green-500 ml-auto"
                          size={18}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to repay
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex text-lg text-gray-500 items-center pointer-events-none">
                    ₹
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter the amount you're repaying to this member
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedPayee}
                  className={`w-full py-3.5 px-4 rounded-lg font-medium text-white shadow transition ${
                    isSubmitting || !selectedPayee
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Recording Payment...
                    </span>
                  ) : (
                    "Record Repayment"
                  )}
                </button>
              </div>
            </form>
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

export default RepaymentForm;
