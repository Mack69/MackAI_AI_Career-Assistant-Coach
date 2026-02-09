import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";


const header = () => {
  return (
    <header className="fixed top-0 w-full border-b bg-background/70 backdrop-blur-lg z-50 supports-[backdrop-filter]:bg-background/80 ">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Mack AI logo"
            width={200}
            height={50}
            className="h-18 py-2 w-auto object-contain"
          />
        </Link>
        <div>
          <SignedIn>
            <Link href={'/dashboard'}><Button><LayoutDashboard className="h-4 w-4"/>Industry Insights</Button></Link>
          </SignedIn>
        </div>
      </nav>

      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default header;
