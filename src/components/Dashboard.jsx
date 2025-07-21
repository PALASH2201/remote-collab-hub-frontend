import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LogOut, Users, FolderOpen } from "lucide-react";
import { addTeam, getTeamById , addTeamMember } from "../lib/api";
import CreateTeamDialog from "./CreateTeamDialog";
import AddTeamMemberDialog from "./AddTeamMemberDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CirclePlus, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamInfo, setTeamInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [addTeamMemberDialogOpen, setAddTeamMemberDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleTeamClick = (teamId) => {
    navigate(`/teams/projects/${teamId}`);
  };

  const handleAddTeamMember = async (emails) => {
    // console.log("Emails:", emails);
    // console.log("Selected Team:", selectedTeam);
    const emailsArray = {
      emails: emails,
    }
    const addTeamMemberResponse = await addTeamMember(selectedTeam, emailsArray);
    // console.log("Add Team Member Response:", addTeamMemberResponse);
    if(addTeamMemberResponse === "Invites are being processed and will be sent shortly."){
      toast.success("Invites are being processed and will be sent shortly.");
    }else{
      toast.error("Failed to add team members.");
    }
  };

  const handleCreateTeam = async (team) => {
    if (!team) return;
    const newTeam = {
      teamName: team.name,
      teamDesc: team.description,
      createdBy: user.id,
    };

    // console.log("Creating Team:", newTeam);

    const addTeamResponse = await addTeam(newTeam);
    if (addTeamResponse === "Success") {
      toast.success("Team created successfully!");
      setTeamInfo({
        ...teamInfo,
        newTeam,
      });
    } else {
      toast.error("Failed to create team.");
    }
    setCreateTeamDialogOpen(false);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const teamIds = user.teamMemberShips.map((team) => team.teamId);
        // console.log("Team IDs:", teamIds);
        const teams = [];
        for (let i = 0; i < teamIds.length; i++) {
          const userTeam = await getTeamById(teamIds[i]);
          if (userTeam !== null) {
            // console.log("User Team:", userTeam);
            teams.push(userTeam);
          }
        }
        setTeamInfo(teams);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.userFullName?.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700">{user.fullName}</span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Teams</h1>
          </div>
          <Button
            onClick={() => setCreateTeamDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> New Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {teamInfo.length > 0 ? (
            teamInfo.map((team, idx) => (
              <div
                key={team.teamId || idx}
                onClick={() => handleTeamClick(team.teamId)}
                className="cursor-pointer"
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Team Information
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTeam(team.teamId);
                              setAddTeamMemberDialogOpen(true);
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <CirclePlus />
                              <span className="pd-2">Add Team Members</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <strong>Team Name:</strong> {team.teamName}
                      </p>
                      <p>
                        <strong>Team Description:</strong>{" "}
                        {team.teamDesc || "No description available"}
                      </p>
                      <p>
                        <strong>Your Role:</strong> Member
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  {user.teamId
                    ? "Loading team information..."
                    : "You are not assigned to a team yet."}
                </p>
              </CardContent>
            </Card>
          )}
          <CreateTeamDialog
            open={createTeamDialogOpen}
            onOpenChange={setCreateTeamDialogOpen}
            onCreateTeam={handleCreateTeam}
          />
          <AddTeamMemberDialog
            open={addTeamMemberDialogOpen}
            onOpenChange={setAddTeamMemberDialogOpen}
            onAddTeamMember={handleAddTeamMember}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
