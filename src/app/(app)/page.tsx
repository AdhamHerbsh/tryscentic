import Hero from "@/components/parts/Hero";
import Posters from "@/components/parts/Posters";
import NewReleases from "@/components/parts/NewReleases";
import FAQ from "@/components/parts/FAQ";
import Brands from "@/components/parts/Brands";
import Features from "@/components/parts/Features";

export default async function Home() {
  return (
    <>
      <Hero kind="index" />
      <Brands />
      <Posters />
      <NewReleases />
      <Features />
      <FAQ />
    </>
  );
}
