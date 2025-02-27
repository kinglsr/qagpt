"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
import Statuspage from "./Statuspage";

// create navbar with class names from styles folder themes.css ceate a link with the logo and a link with the name of the app and clark profile
// include flex-between ,backgroung light900 dark 200 fixedd z-50 w-full sm:px-12 dark:shadow-none shadow-light-300 don't use anchor tag in nextjs

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo1.svg"
          alt="QAGPT"
          width={33}
          height={33}
          className="rounded-full"
        />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          QA <span className="text-primary-500">GPT</span>
        </p>
      </Link>
      <Statuspage />
      <div className="flex flex-1 justify-center gap-5">
        <SignedOut>
          <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
            Welcome to <span className="text-primary-500">QA GPT</span>
          </p>
        </SignedOut>
        <SignedIn>
          <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
            Welcome <span className="text-primary-500">{user?.firstName}</span>
          </p>
        </SignedIn>
      </div>

      <div className="flex-between gap-5">
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link href="/sign-in">
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <Image
                  src="/assets/icons/account.svg"
                  alt="login"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
              </Button>
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: "h-10 w-10" },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <Theme />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
