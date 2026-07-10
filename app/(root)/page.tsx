import Hero from "@/components/Hero";
import Categories from "@/components/shopping/categories";
import Explainer from "@/components/Explainer";
import Recommended from "@/components/shopping/recommended";
import LandingCatalog from "@/components/shopping/rootcatalog";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <Hero />

      <main className="mx-auto w-full max-w-7xl space-y-20 px-3 py-6 pt-20 sm:px-4 sm:pt-24 md:px-6 lg:px-8 lg:py-12 lg:pt-28">
        <Categories />
        {(!session || !session?.user) && <Explainer />}
        <Recommended />
        <LandingCatalog />
      </main>
    </>
  );
}
