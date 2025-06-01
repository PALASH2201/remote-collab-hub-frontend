import React from "react";
import { Calendar, List, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectCard = ({ project }) => {
  // Format the date to a readable string
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Card className="h-full transition-all hover:shadow-md hover:border-blue-300 cursor-pointer">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">{project.projectName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{project.projectDesc}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <List className="h-4 w-4 mr-2" />
            <span>{project.taskList.length} Tasks</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{project.sprintList.length} Sprints</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>Created on {formatDate(project.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;