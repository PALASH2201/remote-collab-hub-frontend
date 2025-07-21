import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllUsers } from "../lib/api";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";
import { set } from "react-hook-form";

const AddTeamMemberDialog = ({ open, onOpenChange, onAddTeamMember }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //   const users = [
  //     { userId: 1, userFullName: "John Doe", userEmail: "sBt5w@example.com" },
  //     { userId: 2, userFullName: "Jane Smith", userEmail: "GtKtM@example.com" },
  //     { userId: 3, userFullName: "Alice Johnson", userEmail: "gV8m5@example.com" },
  //      { userId: 1, userFullName: "John Doe", userEmail: "sBt5w@example.com" },
  //     { userId: 2, userFullName: "Jane Smith", userEmail: "GtKtM@example.com" },
  //     { userId: 3, userFullName: "Alice Johnson", userEmail: "gV8m5@example.com" },
  //      { userId: 1, userFullName: "John Doe", userEmail: "sBt5w@example.com" },
  //     { userId: 2, userFullName: "Jane Smith", userEmail: "GtKtM@example.com" },
  //     { userId: 3, userFullName: "Alice Johnson", userEmail: "gV8m5@example.com" },
  //   ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const handleUserToggle = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedEmails = allUsers
      .filter((user) => selectedUserIds.includes(user.userId))
      .map((user) => user.userEmail);
    console.log("Selected Emails:", selectedEmails);
    if (selectedEmails.length === 0) {
      toast.error("Please select at least one user.");
      return;
    }
    onAddTeamMember(selectedEmails);
    onOpenChange(false);
  };

  const filteredUsers = searchQuery
    ? allUsers.filter((user) =>
        `${user.userFullName} ${user.userEmail}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : allUsers.slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose
        onClick={() => {
          setSelectedUserIds([]);
          onOpenChange(false);
        }}
      />
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Team Members</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="border rounded p-2 space-y-2 max-h-64 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-500 px-1">
                  No matching users found.
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={`user-${user.userId}`}
                      checked={selectedUserIds.includes(user.userId)}
                      onCheckedChange={() => handleUserToggle(user.userId)}
                    />
                    <label htmlFor={`user-${user.userId}`} className="text-sm">
                      <span className="font-medium">{user.userFullName}</span> –{" "}
                      {user.userEmail}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedUserIds([]);
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Selected</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
