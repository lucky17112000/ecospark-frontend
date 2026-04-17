import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user.types";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import React from "react";
interface UserDropDownProps {
  userInfo: UserInfo;
}

const UserDropDown = ({ userInfo }: UserDropDownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="rounded-full">
          <span className="text-sm font-semibold ">
            {userInfo.name.charAt(0)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"end"} className="w-48">
        <DropdownMenuLabel className="flex flex-col items-start gap-1">
          <div className="flex flex-col space-y-1">
            <p className="font-semibold text-sm">{userInfo.name}</p>
            <p className="text-muted-foreground">{userInfo.email}</p>
            <p className="text-muted-foreground">
              {userInfo.role.toLocaleUpperCase().replace("_", " ")}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/my-profile">
            <User className="h-4 w-4 text-blue-500" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/change-password">
            <Settings className="h-4 w-4 text-blue-500" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {}}
          className="text-red-500 cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
