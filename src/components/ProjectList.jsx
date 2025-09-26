import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjects } from "../store/projectsSlice";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function ProjectList({ onSelect }) {
  const projects = useSelector(state => state.projects.projects);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const projectsRef = ref(db, "projects");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      const userProjects = data
        ? Object.values(data).filter(
            p => p.members && Object.keys(p.members).includes(user.email)
          )
        : [];
      dispatch(setProjects(userProjects));
    });
    return () => unsubscribe();
  }, [dispatch, user.email]);

  // Filter projects by search
  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          className="w-full max-w-md px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-400"
          placeholder="Enter project name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* No Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Found</h3>
          <p className="text-gray-500">Try a different search or create a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow border border-blue-100 group"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {project.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  {project.members ? Object.keys(project.members).length : 1} member
                  {project.members && Object.keys(project.members).length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors shadow-sm"
                  onClick={() => onSelect && onSelect(project)}
                >
                  View
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors shadow-sm border border-gray-200"
                  // onClick={() => handleEdit(project)}
                  disabled
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors shadow-sm border border-red-200"
                  // onClick={() => handleDelete(project)}
                  disabled
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
