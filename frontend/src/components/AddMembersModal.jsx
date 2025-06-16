import React, { useState, useEffect } from "react";
import { FiUser, FiX, FiPlus, FiCheck } from "react-icons/fi";
import API from "../api/api";

const AddMembersModal = ({ project, allUsers, onClose, onMemberAdded }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addingUserId, setAddingUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch current members
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [project.id]);

  // Filter out existing members
  const existingMemberIds = new Set(members.map((member) => member.id));
  const availableUsers = allUsers.filter(
    (user) => !existingMemberIds.has(user.id)
  );

  // Add member to trip
  const handleAddMember = async (userId) => {
    try {
      setIsAdding(true);
      setAddingUserId(userId);
      setError(null);

      await API.post(
        `/trip/${project.id}/add-member`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Update local state
      const newMember = allUsers.find((user) => user.id === userId);
      setMembers((prev) => [...prev, newMember]);

      setSuccessMessage(`${newMember.name} added successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Refresh parent projects if needed
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setIsAdding(false);
      setAddingUserId(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative max-h-[80vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Close modal"
        >
          <FiX size={22} />
        </button>

        <h3 className="text-lg font-semibold text-blue-700 mb-4 text-center">
          Add Members to {project.name}
        </h3>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded px-3 py-2 mb-4 text-center text-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded px-3 py-2 mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <h4 className="font-medium text-blue-700 mb-2">Current Members</h4>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {member.name}
              </div>
            ))}
            {members.length === 0 && (
              <span className="text-gray-500 text-sm">No members yet</span>
            )}
          </div>
        </div>

        <div className="border-t border-blue-100 pt-4">
          <h4 className="font-medium text-blue-700 mb-2">Available Users</h4>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : availableUsers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              All users are already members
            </div>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {availableUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between bg-blue-50 text-blue-700 px-4 py-2 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center mr-3 text-blue-600">
                      <FiUser size={18} />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-blue-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddMember(user.id)}
                    disabled={isAdding && addingUserId === user.id}
                    className={`px-3 py-1 rounded text-sm ${
                      isAdding && addingUserId === user.id
                        ? "bg-blue-300 text-white cursor-wait"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {isAdding && addingUserId === user.id ? "Adding..." : "Add"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
