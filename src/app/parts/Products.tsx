"use client";
import { useState } from "react";
import Sidebar from "../../components/ui/Sidebars/Sidebar";
import ProductCard from "../../components/ui/Cards/ProductCard";
import Pagination from "../../components/ui/Pagination/Pagination";

import sampleData from "../data/products";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 12;
  const filtered = sampleData.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Takes full width on small screens, 1 column on large screens */}
        <aside className="lg:col-span-1">
          <Sidebar
            onSearch={(q: string) => {
              setQuery(q);
              setPage(1);
            }}
          />
        </aside>

        {/* Products Content - Takes full width on small, 3 columns on large screens */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} -{" "}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}{" "}
            results
            <div>
              <select className="bg-black px-4 py-2 rounded-md shadow-sm">
                <option>Sort by: Popularity</option>
              </select>
            </div>
          </div>

          {/* Product Grid - More responsive on smaller screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Pagination
              page={page}
              total={Math.ceil(filtered.length / pageSize)}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
