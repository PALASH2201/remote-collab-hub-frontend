import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft , Plus } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { toast } from "sonner";
import { getProjects } from "../lib/api";
import { useParams } from "react-router-dom";


const Projects = () => {
  const { teamId } = useParams();
  const [projects, setProjects] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects for team ID:", teamId);
        const teamProjects = await getProjects(teamId);
        console.log("Fetched Projects:", teamProjects);
        if (teamProjects) {
          setProjects(teamProjects);
        } else {
          throw new Error("No projects found");
        }
      } catch (error) {
        toast.error("Failed to fetch projects");
      }
    };

    fetchProjects();
  }, [teamId]);

  const handleCreateProject = (project) => {
    const newProject = {
      id: crypto.randomUUID(),
      name: project.name,
      description: project.description,
      createdAt: new Date(),
      tasks: [],
      sprints: [],
    };

    setProjects((prev) => [...prev, newProject]);
    toast.success("Project created successfully!");
    setCreateDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to= {`/dashboard`}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-500 mt-1">Manage your projects and tasks</p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              No projects yet
            </h3>
            <p className="mt-1 text-gray-500">
              Create your first project to get started.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                to={`/projects/${project.projectId}`}
                key={project.projectId}
              >
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
        )}

        <CreateProjectDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateProject={handleCreateProject}
        />
      </div>
    </div>
  );
};

export default Projects;
