import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Products from "../../parts/Products";

export default function Shop() {
  return (
    <>
      <Header />

      <main className="bg-primary">
        <div className="container mx-auto p-3">
          <Products />
        </div>
      </main>

      <Footer />
    </>
  );
}
