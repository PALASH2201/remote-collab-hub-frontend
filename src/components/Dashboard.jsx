import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LogOut, Users, FolderOpen } from "lucide-react";
import { getProjects, getTeamById } from "../lib/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [teamInfo, setTeamInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const teamIds = user.teamMemberShips.map((team) => team.teamId);
        console.log('Team IDs:', teamIds);
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
                  {user.userFullName?.slice(0,1).toUpperCase()}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {teamInfo.length > 0 ? (
            teamInfo.map((team, idx) => (
              <Card key={team.id || idx}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Information
                  </CardTitle>
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
                    {/* <p>
                      <strong>Team Members:</strong> {team.memberCount || "N/A"}
                    </p> */}
                    <p>
                      <strong>Your Role:</strong> Member
                    </p>
                  </div>
                </CardContent>
              </Card>
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

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* <p>
                  <strong>Active Projects:</strong> {projects.length}
                </p> */}
                <p>
                  <strong>Member Since:</strong>{" "}
                  {new Date().toLocaleDateString()}
                </p>
                <p>
                  <strong>User ID:</strong> {user.userId}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main> 
    </div>
  );
};

export default Dashboard;
