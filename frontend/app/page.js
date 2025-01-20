// Components
import Dashboard from "@/components/Dashboard";

// Authentication and navigation utilities
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { orgSlug } = await auth();

  if (orgSlug != null) {
    redirect(`/dashboard/${orgSlug}/monitors`);
  } else {
    return (
      <Dashboard
        props={{
          title: "Create org",
          description: "Please create org from the Navigation bar",
          buttonClass: "hidden",
        }}
      >
        <div className="flex justify-center p-2">
          <span className="text-sm">Please create org first</span>
        </div>
      </Dashboard>
    );
  }
}
