import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiX, FiPlus, FiUserPlus, FiUsers } from "react-icons/fi";

const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized API call handler
  const handleCreateProject = useCallback(
    async (e) => {
      e.preventDefault();
      if (!projectName.trim() || !description.trim()) {
        setError("Project name and description are required");
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        const response = await API.post(
          "/trip/create",
          {
            name: projectName,
            description: description,
            memberIds: members.map((user) => user.id),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setProjects((prev) => [...prev, response.data]);
        setProjectName("");
        setDescription("");
        setMembers([]);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create project");
      } finally {
        setIsSubmitting(false);
      }
    },
    [projectName, description, members]
  );

  // Optimized member handling
  const handleAddMember = useCallback((user) => {
    setMembers((prev) =>
      prev.some((member) => member.id === user.id)
        ? prev
        : [...prev, { id: user.id, name: user.name, email: user.email }]
    );
  }, []);

  const handleRemoveMember = useCallback((id) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  }, []);

  // Combined API calls with error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          API.get("/trip/my-trips", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
          API.get("/user/get-all-users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
        ]);

        setProjects(projectsRes.data.data);
        setAllUsers(usersRes.data.data);
      } catch (err) {
        setError("Failed to load data", err);
      }
    };

    fetchData();
  }, [isSubmitting]);

  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto mt-10 px-4 py-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center">
          Your Trips
        </h2>

        <form
          onSubmit={handleCreateProject}
          className="flex flex-col gap-4 mb-8"
        >
          {/* ... (form inputs remain same) ... */}
          <input
            type="text"
            placeholder="Enter new trip name"
            className="p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <textarea
            placeholder="Trip description"
            className="p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiUsers className="mr-2" /> Team Members
              </label>
              <span className="text-xs text-gray-500">
                {members.length} added
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {member.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    aria-label={`Remove ${member.name}`}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>

            {isAddingMember ? (
              <div className="flex flex-col gap-2 bg-blue-50 border border-blue-100 rounded-lg p-4 shadow mt-2">
                <div className="mb-2 text-blue-700 font-semibold text-center">
                  Select members to add
                </div>
                <div className="max-h-56 overflow-y-auto flex flex-col gap-2">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="flex items-center justify-between bg-gradient-to-r from-cyan-100 via-blue-50 to-white border border-cyan-200 text-cyan-700 hover:bg-cyan-200 hover:text-cyan-900 font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-150"
                      onClick={() => handleAddMember(user)}
                    >
                      <span className="truncate">{user.name}</span>
                      <span className="ml-2 text-xs text-gray-500 truncate">
                        {user.email}
                      </span>
                      <FiPlus className="ml-2" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-4 bg-gradient-to-r from-gray-200 via-gray-100 to-white border border-gray-300 text-gray-700 hover:bg-gray-300 hover:text-gray-900 font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-150"
                  onClick={() => setIsAddingMember(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingMember(true)}
                className="flex items-center text-cyan-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                <FiUserPlus className="mr-1" size={16} /> Add team member
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold px-6 py-3 rounded-lg shadow transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </button>
        </form>

        {/* ... (rest of the component remains same) ... */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded px-4 py-2 mb-4 text-sm text-center">
            {error}
          </div>
        )}
        <div className="mb-4 text-gray-600 text-center">
          Total Trips:{" "}
          <span className="font-bold text-blue-600">{projects.length}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-2 text-center text-gray-400 py-8">
              No trips created yet.
            </div>
          ) : (
            projects.map((project, idx) => (
              <Link
                key={idx}
                to="/"
                className="bg-blue-50 border border-blue-100 rounded-lg p-5 flex flex-col shadow hover:shadow-md transition-shadow duration-150"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-blue-700">
                    {project.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  {project.description}
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="mt-10 bg-gradient-to-tr from-blue-100 via-cyan-50 to-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Why create a trip?
          </h3>
          <p className="text-gray-600 mb-2">
            Trips help you organize your trips and group expenses
            efficiently. Each project can represent a trip, event, or group
            activity.
          </p>
          <ul className="text-gray-500 text-left max-w-md mx-auto mb-2 space-y-1">
            <li>• Track all expenses for a specific trip in one place</li>
            <li>• Easily add and manage group members</li>
            <li>• Get a clear summary of who owes what</li>
            <li>• Keep your travel finances transparent and organized</li>
          </ul>
          <p className="text-blue-500 font-medium mt-2">
            Start by creating your first trip above!
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProjectSection;
