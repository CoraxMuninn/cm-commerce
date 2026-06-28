import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export default async function UserButton() {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant="default">
        <Link href="/sign-in">
          <UserIcon />
          Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className="relative w-8 h-8 rounded-full ml-2 flex hover:bg-emerald-600! items-center justify-center bg-emerald-500 cursor-pointer"
          >
            <div>{firstInitial}</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-62 space-y-2" align="end" forceMount>
          <DropdownMenuLabel className="font-medium">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-xs text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href={"/user/profile"} className="w-full">
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/user/orders"} className="w-full">
              Order History
            </Link>
          </DropdownMenuItem>
          {session?.user?.role === "admin" && (
            <DropdownMenuItem>
              <Link href={"/admin/overview"} className="w-full">
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="py-4 px-2 w-full h-4 justify-start cursor-pointer"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
