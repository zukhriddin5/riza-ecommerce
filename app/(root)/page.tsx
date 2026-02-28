import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/products/product-list";


const Homepage = async () => {
  const latestProduct = await getLatestProducts();

  return (
    <div>
    <ProductList data={latestProduct} title="New Products"/>
    </div>
    
  );
};
export default Homepage;