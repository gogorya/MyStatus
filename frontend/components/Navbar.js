"use client";

// auth
import { SignedIn, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";

// hooks
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { usePathname } from "next/navigation";

// ui components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Label } from "@/components/ui/label";

// components
import { Card } from "./ui/card";

export default function Navbar() {
  const { orgSlug } = useAuth();
  const path = usePathname();
  const pathSegments = path.split("/");
  const [onDashboard, setOnDashboard] = useState(false);

  if (!onDashboard && pathSegments[1] === "dashboard") setOnDashboard(true);

  return (
    <Card className="header sticky top-5">
      <div className="grid grid-cols-3 w-full items-center p-5">
        <div className="justify-self-start">
          <Label className="text-sky-600 dark:text-sky-400 text-lg">
            MyStatus
          </Label>
        </div>

        {onDashboard && (
          <>
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
                </SignedIn>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="justify-self-end">
              <SignedIn>
                <OrganizationSwitcher />

                <UserButton />
              </SignedIn>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
