import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./parts/Hero";
import Posters from "./parts/Posters";
import NewReleases from "./parts/NewReleases";
import FAQ from "./parts/FAQ";

export default async function Home() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("in de");
    }, 4000);
  });

  return (
    <>
      <Header />

      <Hero />

      <Posters />

      <NewReleases />

      <FAQ />

      <Footer />
    </>
  );
}
