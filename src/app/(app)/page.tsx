"use client";
import Hero from "./parts/Hero";
import Posters from "./parts/Posters";
import NewReleases from "./parts/NewReleases";
import FAQ from "./parts/FAQ";

export default function Home() {
  return (
    <>
      <Hero kind="index" />
      <Posters />
      <NewReleases />
      <FAQ />
    </>
  );
}
