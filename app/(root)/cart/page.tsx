import CartTable from "@/app/(root)/cart/CartTable";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
}
