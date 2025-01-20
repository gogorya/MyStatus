import Dashboard from "@/components/Dashboard";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <Dashboard
      props={{ title: "Sign in", description: "Please sign in to continue" }}
    >
      <SignIn />
    </Dashboard>
  );
}
