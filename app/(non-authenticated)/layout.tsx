import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base text-cloud">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
