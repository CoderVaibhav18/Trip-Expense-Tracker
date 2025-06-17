import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import {
  FiUser,
  FiUpload,
  FiCheck,
  FiDollarSign,
  FiFileText,
  FiX,
} from "react-icons/fi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { motion } from "framer-motion";

const AddExpense = ({ onExpenseAdded }) => {
  const { tripId } = useParams();
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
  });
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSelectAll, setIsSelectAll] = useState(false);
  const fileInputRef = useRef(null);
  const [splitAmount, setSplitAmount] = useState(0);

  // Fetch trip members on component mount
  useEffect(() => {
    const fetchTripMembers = async () => {
      try {
        setIsFetchingMembers(true);
        const response = await API.get(`/trip/${tripId}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setMembers(response.data.data);
      } catch (err) {
        setMessage({
          text: "Failed to load trip members",
          type: "error",
          err,
        });
      } finally {
        setIsFetchingMembers(false);
      }
    };

    fetchTripMembers();
  }, [tripId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate split amount
    if (name === "amount" && value && selectedMembers.length > 0) {
      const amountValue = parseFloat(value);
      if (!isNaN(amountValue)) {
        setSplitAmount(amountValue / selectedMembers.length);
      }
    }
  };

  const handleMemberChange = (memberId) => {
    setSelectedMembers((prev) => {
      let newSelection;
      if (prev.includes(memberId)) {
        newSelection = prev.filter((id) => id !== memberId);
      } else {
        newSelection = [...prev, memberId];
      }

      // Update split amount
      if (formData.amount && newSelection.length > 0) {
        const amountValue = parseFloat(formData.amount);
        if (!isNaN(amountValue)) {
          setSplitAmount(amountValue / newSelection.length);
        }
      } else {
        setSplitAmount(0);
      }

      return newSelection;
    });
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedMembers([]);
      setSplitAmount(0);
    } else {
      const allMemberIds = members.map((member) => member.id);
      setSelectedMembers(allMemberIds);

      // Update split amount
      if (formData.amount && allMemberIds.length > 0) {
        const amountValue = parseFloat(formData.amount);
        if (!isNaN(amountValue)) {
          setSplitAmount(amountValue / allMemberIds.length);
        }
      }
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setBill(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setBill(file);
    }
  };

  const removeBill = () => {
    setBill(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.amount ||
      !formData.description ||
      selectedMembers.length === 0 ||
      !bill
    ) {
      setMessage({ text: "All fields are required", type: "error" });
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setMessage({ text: "Amount must be greater than 0", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formDataObj = new FormData();

      // Append all fields to FormData
      formDataObj.append("amount", formData.amount);
      formDataObj.append("description", formData.description);

      // Append selectedMembers as JSON string
      formDataObj.append("members", JSON.stringify(selectedMembers));

      // Append the bill file
      formDataObj.append("bill", bill);

      // Make the API call with FormData
      await API.post(`/expense/add/${tripId}`, formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          // Content-Type will be set automatically to multipart/form-data
        },
      });

      setMessage({
        text: "Expense added and split successfully!",
        type: "success",
      });

      // Reset form
      setFormData({ amount: "", description: "" });
      setSelectedMembers([]);
      setBill(null);
      setIsSelectAll(false);
      setSplitAmount(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onExpenseAdded) onExpenseAdded();

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to add expense",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-6 md:mt-10 bg-white rounded-2xl shadow-xl p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700">
          Add & Split Expense
        </h2>
        <p className="text-gray-500 mt-2">
          Add an expense and split it with your trip members
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loading state for members */}
        {isFetchingMembers ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Amount Input */}
            <div className="relative">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="amount"
              >
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LiaRupeeSignSolid className="text-gray-400" size={20} />
                </div>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="w-full pl-10 pr-3 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFileText className="text-gray-400" size={20} />
                </div>
                <input
                  id="description"
                  name="description"
                  type="text"
                  className="w-full pl-10 pr-3 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Dinner, Transportation, etc."
                />
              </div>
            </div>

            {/* Split Information */}
            {splitAmount > 0 && selectedMembers.length > 0 && (
              <motion.div
                className="bg-blue-50 p-4 rounded-xl border border-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">
                    Split Details
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                    {selectedMembers.length} member
                    {selectedMembers.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3 shadow-sm">
                  <span className="flex items-center text-gray-600 font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        d="M6 6h12M6 12h12M6 18h7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <text x="2" y="19" fontSize="14" fill="currentColor">
                        ₹
                      </text>
                    </svg>
                    Each member pays:
                  </span>
                  <span className="flex items-center text-2xl font-bold text-blue-700">
                    ₹{splitAmount.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Members Selection */}
            {members.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-gray-700 font-medium">
                    Split With Members
                  </label>
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isSelectAll ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-xl">
                  {members.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => handleMemberChange(member.id)}
                        className={`w-full p-3 rounded-xl border transition-all flex items-center ${
                          selectedMembers.includes(member.id)
                            ? "bg-blue-100 border-blue-400 text-blue-700"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center w-full">
                          <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <FiUser
                              className={
                                selectedMembers.includes(member.id)
                                  ? "text-blue-500"
                                  : "text-gray-500"
                              }
                            />
                          </div>
                          <span className="font-medium truncate text-left flex-1">
                            {member.name}
                          </span>
                          {selectedMembers.includes(member.id) && (
                            <FiCheck className="text-green-500 ml-2" />
                          )}
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-yellow-700">
                  No members found for this trip
                </p>
              </div>
            )}

            {/* Bill Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Bill Image
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  bill
                    ? "border-green-300 bg-green-50"
                    : "border-blue-200 hover:border-blue-400 bg-blue-50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {bill ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                        <FiCheck className="text-green-600" size={28} />
                      </div>
                    </div>
                    <p className="font-medium text-green-700">Bill uploaded!</p>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {bill.name}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBill();
                      }}
                      className="absolute top-0 right-0 mt-1 mr-1 text-gray-400 hover:text-red-500"
                    >
                      <FiX size={20} />
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                        <FiUpload className="text-blue-600" size={28} />
                      </div>
                    </div>
                    <p className="font-medium text-gray-700">
                      Upload your bill
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag & drop or click to upload an image
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Supports JPG, PNG, or WebP formats
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Status Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 text-center ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isFetchingMembers || members.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
            isLoading || isFetchingMembers || members.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Processing...
            </div>
          ) : members.length === 0 ? (
            "No Members Available"
          ) : (
            "Add Expense & Split"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default AddExpense;
