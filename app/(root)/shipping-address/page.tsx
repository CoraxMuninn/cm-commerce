import ShippingAddressForm from "@/app/(root)/shipping-address/ShippingAddressForm";
import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserByID } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types/index";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shipping Address",
};

export default async function ShippingAddressPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error("userId not found");

  const user = await getUserByID(userId);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
}
