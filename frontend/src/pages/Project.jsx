import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";



const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (selectedMembers.length === 0) {
      setError("Select at least one member");
      return;
    }
    setProjects([
      ...projects,
      {
        name: projectName.trim(),
        description: description.trim(),
        members: selectedMembers,
        createdAt: new Date().toISOString(),
      },
    ]);
    setProjectName("");
    setDescription("");
    setSelectedMembers([]);
    setError("");
  };

  useEffect(() => {
    API.get("/trip/my-trips", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      setProjects(res.data.data);
    });
  });

  return (
    <section className="max-w-3xl mx-auto mt-10 px-4 py-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center">
        Your Projects
      </h2>
      <form onSubmit={handleCreateProject} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter new project name"
          className="p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          placeholder="Project description"
          className="p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        
        <button
          type="submit"
          className="bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-400 text-white font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform duration-150"
        >
          Create Project
        </button>
      </form>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded px-4 py-2 mb-4 text-sm text-center">
          {error}
        </div>
      )}
      <div className="mb-4 text-gray-600 text-center">
        Total Projects:{" "}
        <span className="font-bold text-blue-600">{projects.length}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400 py-8">
            No projects created yet.
          </div>
        ) : (
          projects.map((project, idx) => (
            <Link
              key={idx}
              to='/'
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
          Why create a project?
        </h3>
        <p className="text-gray-600 mb-2">
          Projects help you organize your trips and group expenses efficiently.
          Each project can represent a trip, event, or group activity.
        </p>
        <ul className="text-gray-500 text-left max-w-md mx-auto mb-2 space-y-1">
          <li>• Track all expenses for a specific trip in one place</li>
          <li>• Easily add and manage group members</li>
          <li>• Get a clear summary of who owes what</li>
          <li>• Keep your travel finances transparent and organized</li>
        </ul>
        <p className="text-blue-500 font-medium mt-2">
          Start by creating your first project above!
        </p>
      </div>
    </section>
  );
};

export default ProjectSection;
