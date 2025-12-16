export async function getProducts() {
  const products = await fetch("https://fakestoreapi.com/products");
  return products.json();
}
