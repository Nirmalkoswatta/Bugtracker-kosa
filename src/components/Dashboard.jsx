import React from "react";
import CreateProjectForm from "./CreateProjectForm";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import { useTheme } from "../contexts/ThemeContext";

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = React.useState(null);
  const { colors, isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen bg-gray-50 p-4 md:p-8`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-blue-700">
          Bug Tracker
        </h1>
        <p className="text-lg text-gray-500">
          Manage your projects and track bugs efficiently
        </p>
      </div>

      {/* Create Project Form */}
      <div className="mb-8 max-w-2xl mx-auto">
        <CreateProjectForm />
      </div>

      {/* Main Content */}
      {selectedProject ? (
        <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
      ) : (
        <ProjectList onSelect={setSelectedProject} />
      )}
    </div>
  );
}
