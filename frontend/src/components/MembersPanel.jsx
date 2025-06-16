import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import API from "../api/api";
import { FiUser } from "react-icons/fi"; // Added for better visuals

const MembersPanel = ({ project, onClose }) => {
  // Renamed prop for better semantics
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await API.get(`trip/${project.id}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setMembers(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load members");
        console.error("Error fetching members:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (project) fetchMembers();
  }, [project]);

  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-xs w-full p-6 relative max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Close members panel"
        >
          <RxCross2 size={22} />
        </button>

        <h3 className="text-lg font-semibold text-blue-700 mb-2 text-center">
          <span className="block text-base text-gray-500 font-normal mb-1">
            Project:
          </span>
          <span className="text-2xl text-blue-800">{project.name}</span>
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded px-4 py-3 text-center">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <FiUser className="mx-auto text-gray-400 mb-2" size={24} />
            No members added yet
          </div>
        ) : (
          <ul className="space-y-2 overflow-y-auto max-h-[60vh] pr-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center bg-blue-50 text-blue-700 px-4 py-3 rounded-lg shadow-sm"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3 text-blue-600">
                  <FiUser size={18} />
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-blue-500 truncate">
                    {member.email}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MembersPanel;
