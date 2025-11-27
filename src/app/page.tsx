import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "./parts/Hero";
import Posters from "./parts/Posters";
import NewReleases from "./parts/NewReleases";
import FAQ from "./parts/FAQ";

export default function Home() {
  return (
    <>
      <Header />
      <Hero kind="index" />
      <Posters />
      <NewReleases />
      <FAQ />
      <Footer />
    </>
  );
}
