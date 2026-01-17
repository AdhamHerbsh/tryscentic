import Hero from "@/components/parts/Hero";
import Brands from "@/components/parts/Brands";
import Posters from "@/components/parts/Posters";
import NewReleases from "@/components/parts/NewReleases";
import Features from "@/components/parts/Features";
import Testimonials from "@/components/parts/Testimonials";
import Disclaimer from "@/components/parts/Disclaimer";
import FAQ from "@/components/parts/FAQ";
import { getLatestReviews } from "@/data-access/reviews";

export default async function Home() {
  const reviews = await getLatestReviews();

  return (
    <>
      <Hero kind="index" />
      <Brands />
      <Posters />
      <NewReleases />
      <Features />
      <Testimonials reviews={reviews} />
      <Disclaimer />
      <FAQ />
    </>
  );
}
