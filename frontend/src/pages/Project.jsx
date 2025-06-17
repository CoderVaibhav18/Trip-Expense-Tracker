import React, { useEffect, useState, useCallback, useMemo } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiX, FiUserPlus, FiUsers, FiEye } from "react-icons/fi";
import MembersPanel from "../components/MembersPanel";
import UserSearch from "../components/UserSearch";
import AddMembersModal from "../components/AddMembersModal.jsx"; // New component

const ProjectSection = () => {
  // State management
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [addingMembersProject, setAddingMembersProject] = useState(null); // New state for adding members

  // Memoized user list for better performance
  const filteredUsers = useMemo(() => {
    return allUsers.filter(
      (user) => !members.some((member) => member.id === user.id)
    );
  }, [allUsers, members]);

  // Combined form handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Project creation with optimized request
  const handleCreateProject = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.name.trim() || !formData.description.trim()) {
        setError("Trip name and description are required");
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        const response = await API.post(
          "/trip/create",
          {
            name: formData.name,
            description: formData.description,
            memberIds: members.map((user) => user.id),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setProjects((prev) => [...prev, response.data]);
        setFormData({ name: "", description: "" });
        setMembers([]);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create trip");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, members]
  );

  // Member management
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

  // Refresh projects data
  const refreshProjects = useCallback(async () => {
    try {
      const response = await API.get("/trip/my-trips", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProjects(response.data.data);
    } catch (err) {
      setError(
        "Failed to refresh projects: " +
          (err.response?.data?.message || err.message)
      );
    }
  }, []);

  // Data fetching
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
        setError(
          "Failed to load data: " + (err.response?.data?.message || err.message)
        );
      }
    };

    fetchData();
  }, []);

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
          <input
            type="text"
            name="name"
            placeholder="Enter new trip name"
            className="p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={formData.name}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Trip description"
            className="p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={formData.description}
            onChange={handleInputChange}
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

                {/* Replaced with optimized search component */}
                <UserSearch users={filteredUsers} onSelect={handleAddMember} />

                <button
                  type="button"
                  className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
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
            {isSubmitting ? "Creating..." : "Create Trip"}
          </button>
        </form>

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
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-blue-50 border border-blue-100 rounded-lg p-5 flex flex-col shadow hover:shadow-md transition-shadow duration-150"
              >
                <Link to={`/trip/${project.id}/expenses`}>
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
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setActiveProjectId(project)}
                    className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs transition w-max"
                  >
                    <FiEye size={14} /> Show Members
                  </button>
                  <button
                    onClick={() => setAddingMembersProject(project)}
                    className="flex items-center justify-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs transition w-max"
                  >
                    <FiUserPlus size={14} /> Add members
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Members panel for viewing members */}
        {activeProjectId && (
          <MembersPanel
            project={activeProjectId}
            onClose={() => setActiveProjectId(null)}
          />
        )}

        {/* Modal for adding members to existing trips */}
        {addingMembersProject && (
          <AddMembersModal
            project={addingMembersProject}
            allUsers={allUsers}
            onClose={() => setAddingMembersProject(null)}
            onMemberAdded={refreshProjects}
          />
        )}

        <div className="mt-10 bg-gradient-to-tr from-blue-100 via-cyan-50 to-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Why create a trip?
          </h3>
          <p className="text-gray-600 mb-2">
            Trips help you organize your group expenses efficiently. Each trip
            can represent a vacation, event, or shared activity.
          </p>
          <ul className="text-gray-500 text-left max-w-md mx-auto mb-2 space-y-1">
            <li>• Track all expenses for a specific trip in one place</li>
            <li>• Easily add and manage group members</li>
            <li>• Get a clear summary of who owes what</li>
            <li>• Keep travel finances transparent and organized</li>
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
