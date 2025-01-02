import { SignedIn, UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div>
      <div>Navbar</div>
      <div>
        <SignedIn>
          <OrganizationSwitcher />
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
