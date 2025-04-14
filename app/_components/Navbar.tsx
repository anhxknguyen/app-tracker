import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between px-4 py-2">
      <Link href="/" className="hover:text-primary/70 w-fit font-bold">
        Application Tracker
      </Link>
      <div className="flex justify-end">
        <SignedOut>
          <div className="flex gap-2">
            <SignInButton>
              <Button className="px-8" variant="default">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
