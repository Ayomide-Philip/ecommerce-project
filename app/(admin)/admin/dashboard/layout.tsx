import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || !session?.user) return redirect("/admin/login");
  if (session?.user?.role !== "admin") return redirect("/admin/login");
  return <AdminShell session={session}>{children}</AdminShell>;
}
