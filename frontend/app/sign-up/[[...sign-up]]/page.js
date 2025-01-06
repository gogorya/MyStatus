import { SignUp } from "@clerk/nextjs";
import Dashboard from "@/components/Dashboard";

export default function Page() {
  return (
    <Dashboard
      props={{ title: "Sign in", description: "Please sign in to continue" }}
    >
      <SignUp />
    </Dashboard>
  );
}
