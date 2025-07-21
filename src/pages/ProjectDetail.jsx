import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ArrowLeft } from "lucide-react";
import TaskCard from "@/components/TaskCard";
import SprintCard from "@/components/SprintCard";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import CreateSprintDialog from "@/components/CreateSprintDialog";
import { toast } from "sonner";
import {
  addTask,
  getProjectById,
  updateTask,
  assignSprint,
  addSprint,
} from "../lib/api";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [createSprintDialogOpen, setCreateSprintDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const project = await getProjectById(projectId);
      if (project) {
        setProject(project);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleCreateTask = async (task) => {
    if (!project) return;

    const newTask = {
      assigneeId: crypto.randomUUID(),
      taskTitle: task.name,
      taskDesc: task.description,
      taskStatus: "TODO",
      taskPriority: task.priority,
      dueDate: new Date(),
    };

    console.log("Creating task:", newTask);

    const addTaskResponse = await addTask(project.projectId, newTask);
    if (addTaskResponse === "Success") {
      toast.success("Task created successfully!");
      setProject({
        ...project,
        taskList: [...project.taskList, newTask],
      });
    } else {
      toast.error("Failed to create task.");
    }
    setCreateTaskDialogOpen(false);
  };

  const handleCreateSprint = async (sprint) => {
    if (!project) return;

    const newSprint = {
      sprintCreator: crypto.randomUUID(),
      projectId: project.projectId,
      sprintName: sprint.name,
      sprintGoal: sprint.goal,
      startDate: new Date(sprint.startDate),
      endDate: new Date(sprint.endDate)
    };

    const addSprintResp = await addSprint(project.projectId, newSprint);
    if (addSprintResp === "Success") {
      setProject({
        ...project,
        sprintList: [...project.sprintList, newSprint],
      });
      toast.success("Sprint created successfully!");
    } else {
      toast.error("Failed to create sprint.");
      return;
    }
    setCreateSprintDialogOpen(false);
  };

  const assignTaskToSprint = async (taskId, sprintId) => {
    if (!project) return;
    const taskToSend = project.taskList.find((task) => task.taskId === taskId);
    if (!taskToSend) return;
    const resp = await assignSprint(taskId, sprintId);
    if (resp === "Success") {
      const updatedTasks = project.taskList.map((task) =>
        task.taskId === taskId ? { ...task, sprintId: sprintId } : task
      );
      setProject({
        ...project,
        taskList: updatedTasks,
      });
      toast.success("Task assigned to sprint successfully!");
    } else {
      toast.error("Failed to assign task to sprint.");
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    if (!project) return;

    const taskToSend = project.taskList.find((task) => task.taskId === taskId);
    if (!taskToSend) return;
    const updatedTask = { ...taskToSend, taskStatus: newStatus };

    const resp = await updateTask(taskId, updatedTask);
    if (resp === "Success") {
      toast.success("Task status updated successfully!");
      const updatedTaskList = project.taskList.map((task) =>
        task.taskId === taskId ? { ...task, taskStatus: newStatus } : task
      );
      setProject({
        ...project,
        taskList: updatedTaskList,
      });
    } else {
      toast.error("Failed to update task status.");
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Project not found</h2>
          <Link to="/" className="mt-4 text-blue-600 hover:underline block">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Filter tasks by sprint
  const getTasksForSprint = (sprintId) => {
    return project.taskList.filter((task) => task.sprintId === sprintId);
  };

  // Get tasks not assigned to any sprint
  const getUnassignedTasks = () => {
    return project.taskList.filter((task) => !task.sprintId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to= {`/teams/projects/${project.teamId}`}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {project.projectName}
            </h1>
            <p className="text-gray-500 mt-1">{project.projectDesc}</p>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="mt-8">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="sprints">Sprints</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">Tasks</h2>
              <Button
                onClick={() => setCreateTaskDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </div>

            {project.taskList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  No tasks yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Create your first task for this project.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => setCreateTaskDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Task
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">To Do</h3>
                  <div className="space-y-3">
                    {project.taskList
                      .filter((task) => task.taskStatus === "TODO")
                      .map((task) => (
                        <TaskCard
                          key={task.taskId}
                          task={task}
                          sprints={project.sprintList}
                          onStatusChange={updateTaskStatus}
                          onAssignToSprint={assignTaskToSprint}
                        />
                      ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">
                    In Progress
                  </h3>
                  <div className="space-y-3">
                    {project.taskList
                      .filter((task) => task.taskStatus === "IN_PROGRESS")
                      .map((task) => (
                        <TaskCard
                          key={task.taskId}
                          task={task}
                          sprints={project.sprintList}
                          onStatusChange={updateTaskStatus}
                          onAssignToSprint={assignTaskToSprint}
                        />
                      ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Completed</h3>
                  <div className="space-y-3">
                    {project.taskList
                      .filter((task) => task.taskStatus === "DONE")
                      .map((task) => (
                        <TaskCard
                          key={task.taskId}
                          task={task}
                          sprints={project.sprintList}
                          onStatusChange={updateTaskStatus}
                          onAssignToSprint={assignTaskToSprint}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sprints" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">Sprints</h2>
              <Button
                onClick={() => setCreateSprintDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Sprint
              </Button>
            </div>

            {project.sprintList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  No sprints yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Create your first sprint to organize your tasks.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => setCreateSprintDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Sprint
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {project.sprintList.map((sprint) => (
                  <SprintCard
                    key={sprint.sprintId}
                    sprint={sprint}
                    tasks={getTasksForSprint(sprint.sprintId)}
                    onStatusChange={updateTaskStatus}
                  />
                ))}

                {getUnassignedTasks().length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Unassigned Tasks
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {getUnassignedTasks().map((task) => (
                        <TaskCard
                          key={task.taskId}
                          task={task}
                          sprints={project.sprintList}
                          onStatusChange={updateTaskStatus}
                          onAssignToSprint={assignTaskToSprint}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CreateTaskDialog
          open={createTaskDialogOpen}
          onOpenChange={setCreateTaskDialogOpen}
          onCreateTask={handleCreateTask}
        />

        <CreateSprintDialog
          open={createSprintDialogOpen}
          onOpenChange={setCreateSprintDialogOpen}
          onCreateSprint={handleCreateSprint}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
