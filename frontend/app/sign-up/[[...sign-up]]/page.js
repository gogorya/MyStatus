import Dashboard from "@/components/Dashboard";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <Dashboard
      props={{ title: "Sign in", description: "Please sign in to continue" }}
    >
      <SignUp />
    </Dashboard>
  );
}
