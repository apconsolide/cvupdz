import React, { useState } from "react";
import { UserData } from "@/lib/api/admin";
import { UserRole } from "@/types/auth";
import { updateUserRole } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import RoleSelector from "@/components/auth/RoleSelector";

interface UserRoleManagerProps {
  user: UserData;
  onRoleUpdated: () => void;
}

const UserRoleManager = ({ user, onRoleUpdated }: UserRoleManagerProps) => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (user.role as UserRole) || "participant",
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleUpdateRole = async () => {
    if (selectedRole === user.role) return;

    try {
      setIsUpdating(true);
      await updateUserRole(user.id, selectedRole);

      toast({
        title: "Role updated",
        description: `${user.fullName}'s role has been updated to ${selectedRole}`,
        variant: "default",
      });

      onRoleUpdated();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="bg-cvup-blue border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">
          Manage User Role
        </CardTitle>
        <CardDescription className="text-gray-400">
          Update role for {user.fullName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-400">Current Role</p>
              <p className="text-white capitalize">
                {user.role || "participant"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Email</p>
              <p className="text-white">{user.email}</p>
            </div>
          </div>

          <RoleSelector
            value={selectedRole}
            onChange={handleRoleChange}
            showAdminOption={true}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdateRole}
          disabled={isUpdating || selectedRole === user.role}
          className="w-full bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
        >
          {isUpdating ? "Updating..." : "Update Role"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserRoleManager;
