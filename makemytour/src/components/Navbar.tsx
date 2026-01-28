import React from "react";
import SignupDialog from "./SignupDialog";
import { LogOut, Plane, User, Heart, Package, Award, Search, Sparkles, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { clearUser } from "@/store";
import { useRouter } from "next/router";
import Link from "next/link";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const logout = () => {
    dispatch(clearUser());
  };
  return (
    <header className=" backdrop-blur-md py-4 sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 text-white cursor-pointer">
            <Plane className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold ">MakeMyTour</span>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-1">
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link href="/packages" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-1">
              <Package className="w-4 h-4" />
              Packages
            </Link>
            <Link href="/recommendations" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              For You
            </Link>
            <Link href="/flight-status" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Flight Status
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4 ">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Button variant="default" className="bg-white text-black hover:bg-white ring-offset-2" onClick={() => router.push("/admin")}>
                  ADMIN
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8  text-black">
                      <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/loyalty")}>
                    <Award className="mr-2 h-4 w-4" />
                    <span>Loyalty Points</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <SignupDialog
              trigger={
                <Button
                  variant="outline"
                  className="bg-blue-600  text-white hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              }
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;