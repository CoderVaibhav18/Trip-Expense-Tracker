import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const UserSearch = ({ users, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full p-2 pl-10 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      <div className="max-h-56 overflow-y-auto flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No matching users found
          </div>
        ) : (
          filtered.map((user) => (
            <button
              key={user.id}
              type="button"
              className="flex items-center justify-between bg-white border border-blue-100 text-blue-700 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg transition-colors"
              onClick={() => onSelect(user)}
            >
              <span className="text-left">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </span>
              <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs">
                Add
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSearch;