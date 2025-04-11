"use client";

// UI components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
            <div className="flex-1 order-3 min-[667px]:order-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <SignedIn>
                    <NavigationMenuItem>
                      <Link
                        href={`/dashboard/${orgSlug}/monitors`}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Monitors
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link
                        href={`/dashboard/${orgSlug}/status-pages`}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Status Pages
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link
                        href={`/dashboard/${orgSlug}/incidents`}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Incidents
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </SignedIn>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="w-[152px] order-2 min-[667px]:order-3">
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
