"use client";

import { SignedIn, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Label } from "@/components/ui/label";

export default function Navbar() {
  const { orgSlug } = useAuth();

  return (
    <div className="">
      <NavigationMenu className="p-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Label className="text-sky-600">MyStatus</Label>
          </NavigationMenuItem>
          <SignedIn>
            <NavigationMenuItem>
              <Link
                href={`/dashboard/${orgSlug}/monitors`}
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
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
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Status Pages
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <OrganizationSwitcher />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <UserButton />
            </NavigationMenuItem>
          </SignedIn>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
