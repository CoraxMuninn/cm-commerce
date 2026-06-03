import { APP_DESCRIPTION, SERVER_URL } from "@/lib/constants/index";
import { Metadata } from "next";
import ProductsList from "@/components/shared/products/ProductsList";
import { getLatestProducts } from "@/lib/actions/product.actions";

export const metaData: Metadata = {
  description: APP_DESCRIPTION,
  openGraph: {
    title: "CM Store",
    description: "enjoy your shopping",
    url: SERVER_URL,
  },
};

export default async function Homepage() {
  const latestProduct = await getLatestProducts();
  return (
    <>
      <ProductsList data={latestProduct} title="Newest Arrivals" />
    </>
  );
}
