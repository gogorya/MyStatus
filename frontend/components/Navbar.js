"use client";

// UI components
import { Label } from "@/components/ui/label";
import { Card } from "./ui/card";

// Hooks
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Clerk and utilities
import { SignedIn, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { orgSlug } = useAuth();
  const path = usePathname();
  const pathSegments = path.split("/");

  // States
  const [onDashboard, setOnDashboard] = useState(false);

  if (
    !onDashboard &&
    (pathSegments[1] === "dashboard" || pathSegments[1] === "")
  )
    setOnDashboard(true);

  return (
    <Card className="header flex sticky top-5">
      <div className="flex w-full flex-wrap order-1 justify-between items-center">
        <div className="w-[152px]">
          <Label className="text-sky-600 dark:text-sky-400 text-lg">
            MyStatus
          </Label>
        </div>

        {onDashboard ? (
          <>
            <div className="flex-1 order-3 min-[675px]:order-2">
              <SignedIn>
                <div className="flex justify-center space-x-2">
                  <Link
                    className="navbar-item"
                    href={`/dashboard/${orgSlug}/monitors`}
                    passHref
                  >
                    <Label className="cursor-pointer">Monitors</Label>
                  </Link>
                  <Link
                    className="navbar-item"
                    href={`/dashboard/${orgSlug}/status-pages`}
                    passHref
                  >
                    <Label className="cursor-pointer whitespace-nowrap">
                      Status Pages
                    </Label>
                  </Link>
                  <Link
                    className="navbar-item"
                    href={`/dashboard/${orgSlug}/incidents`}
                    passHref
                  >
                    <Label className="cursor-pointer">Incidents</Label>
                  </Link>
                </div>
              </SignedIn>
            </div>

            <div className="w-[152px] order-2 min-[675px]:order-3">
              <SignedIn>
                <OrganizationSwitcher />
                <UserButton />
              </SignedIn>
            </div>
          </>
        ) : (
          <>
            <div></div>
            <div></div>
          </>
        )}
      </div>
    </Card>
  );
}
