import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { Session } from "next-auth";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: Session | null = await auth();
  return (
    <div className="min-h-screen bg-base text-cloud">
      <Navbar session={session!} />
      {children}
      <Footer />
    </div>
  );
}
