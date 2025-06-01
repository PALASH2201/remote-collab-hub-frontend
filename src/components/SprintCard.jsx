import React from "react";
import { Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";

const SprintCard = ({ sprint, tasks, onStatusChange }) => {
  // Format the date to a readable string
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get badge color based on status
  const getBadgeColor = (status) => {
    switch (status) {
      case "planned":
        return "bg-yellow-200 text-yellow-800";
      case "active":
        return "bg-blue-200 text-blue-800";
      case "completed":
        return "bg-green-200 text-green-800";
      default:
        return "";
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.taskStatus === "DONE").length;
    return Math.round((completed / tasks.length) * 100);
  };

  const progressPercentage = calculateProgress();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{sprint.sprintName}</CardTitle>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                </span>
              </div>
            </div>
            <div className="mt-4 text-sm font-medium bg-blue-200 text-blue-800 border border-radius-4 px-2 py-1 rounded">
              <div className="p-2">
                Goal: {sprint.sprintGoal}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {tasks && tasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tasks.map(task => (
              <TaskCard 
                key={task.taskId} 
                task={task} 
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No tasks assigned to this sprint yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SprintCard;