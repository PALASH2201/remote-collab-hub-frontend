import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Check, Clock, ArrowRightCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TaskCard = ({ task, sprints, onStatusChange, onAssignToSprint }) => {
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
      case "TODO":
        return "bg-gray-200 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-200 text-blue-800";
      case "DONE":
        return "bg-green-200 text-green-800";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-200 text-red-800";
      case "MEDIUM":
        return "bg-yellow-200 text-yellow-800";
      case "LOW":
        return "bg-green-200 text-green-800";
      default:
        return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "TODO":
        return "To Do";
      case "IN_PROGRESS":
        return "In Progress";
      case "DONE":
        return "Completed";
      default:
        return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "LOW":
        return "Low";
      case "MEDIUM":
        return "Medium";
      case "HIGH":
        return "High";
      default:
        return priority;
    }
  };
  
  // Get sprint for this task if assigned
  const getSprintForTask = () => {
    if (!task.sprintId || !sprints) return null;
    return sprints.find(sprint => sprint.sprintId === task.sprintId);
  };
  
  const sprint = getSprintForTask();
  // console.log("Sprints for task:",sprint);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-900">{task.taskTitle}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {task.taskStatus !== "TODO" && (
                <DropdownMenuItem onClick={() => onStatusChange(task.taskId, "TODO")}>
                  Mark as To Do
                </DropdownMenuItem>
              )}
              {task.taskStatus !== "IN_PROGRESS" && (
                <DropdownMenuItem onClick={() => onStatusChange(task.taskId, "IN_PROGRESS")}>
                  <ArrowRightCircle className="h-4 w-4 mr-2" />
                  Mark as In Progress
                </DropdownMenuItem>
              )}
              {task.taskStatus !== "DONE" && (
                <DropdownMenuItem onClick={() => onStatusChange(task.taskId, "DONE")}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Completed
                </DropdownMenuItem>
              )}
              {sprints && sprints.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Assign to Sprint</DropdownMenuLabel>
                  {sprints.map(sprint => (
                    <DropdownMenuItem 
                      key={sprint.sprintId}
                      onClick={() => {
                        // console.log("Sprint ID:", sprint.sprintId);
                        onAssignToSprint(task.taskId, sprint.sprintId)
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {sprint.sprintName}
                    </DropdownMenuItem>
                  ))}
                  {task.sprintId && (
                    <DropdownMenuItem onClick={() => onAssignToSprint(task.taskId, null)}>
                      Remove from sprint
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {task.taskDesc && (
          <p className="text-sm text-gray-500 mt-2">{task.taskDesc}</p>
        )}

        <div className="flex flex-wrap items-center mt-3 gap-2">
          <Badge variant="secondary" className={getBadgeColor(task.taskStatus)}>
            {getStatusText(task.taskStatus)}
          </Badge>
          <Badge variant="secondary" className={getPriorityColor(task.taskPriority)}>
            {getPriorityText(task.taskPriority)}
          </Badge>
          {sprint && (
            <Badge variant="outline" className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {sprint.sprintName}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Created on {formatDate(task.createdAt)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;