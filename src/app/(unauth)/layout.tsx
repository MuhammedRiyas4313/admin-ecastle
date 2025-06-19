import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/nextAuthOptions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import '../globals.css'

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const headersList = await headers();

  if (session) {
    const pathname = headersList.get("next-url");
    let url = "/";
    if (pathname) {
      url = url + "?" + encodeURIComponent(pathname);
    }
    redirect(url);
  }

  return <>{children}</>;
}
