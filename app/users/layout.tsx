import { ReactNode } from "react";

export const metadata = {
    title: "Users Management System",
    description: "Manage users with CRUD operations",
  };
   
  export default function UsersLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <>{children}</>;
  }
  