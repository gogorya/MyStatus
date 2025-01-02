import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { orgSlug } = await auth();
  if (orgSlug != null) {
    redirect(`/dashboard/${orgSlug}/monitors`);
  } else {
    return <div>Please create org first</div>;
  }
}
