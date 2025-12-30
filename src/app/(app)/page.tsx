"use client";
import Hero from "../../components/parts/Hero";
import Posters from "../../components/parts/Posters";
import NewReleases from "../../components/parts/NewReleases";
import FAQ from "../../components/parts/FAQ";

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
