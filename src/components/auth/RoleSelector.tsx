import React from "react";
import { UserRole } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RoleSelectorProps {
  value: UserRole;
  onChange: (value: UserRole) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  showAdminOption?: boolean;
}

const RoleSelector = ({
  value,
  onChange,
  disabled = false,
  label = "Role",
  className = "",
  showAdminOption = false,
}: RoleSelectorProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label htmlFor="role-selector">{label}</Label>}
      <Select
        value={value}
        onValueChange={(val) => onChange(val as UserRole)}
        disabled={disabled}
      >
        <SelectTrigger
          id="role-selector"
          className="bg-cvup-lightblue border-gray-700 text-white"
        >
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent className="bg-cvup-blue border-gray-700 text-white">
          {showAdminOption && (
            <SelectItem value="admin" className="hover:bg-cvup-lightblue">
              Admin
            </SelectItem>
          )}
          <SelectItem value="supervisor" className="hover:bg-cvup-lightblue">
            Supervisor
          </SelectItem>
          <SelectItem value="participant" className="hover:bg-cvup-lightblue">
            Participant
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
