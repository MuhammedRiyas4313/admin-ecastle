import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/nextAuthOptions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DashboardLayout } from "@/components/DashboardLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  const session = await getServerSession(authOptions);
  const headersList = await headers();

  if (!session) {
    const pathname = headersList.get("next-url");
    let url = "/login";
    if (pathname) {
      url = url + "?" + encodeURIComponent(pathname);
    }
    redirect(url);
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
