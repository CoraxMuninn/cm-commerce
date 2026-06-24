import PaymentMethodForm from "@/app/(root)/payment-method/PaymentMethodForm";
import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { getUserByID } from "@/lib/actions/user.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Method",
};

export default async function PaymentMethodPage() {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error("User not Found.");

  const user = await getUserByID(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
}
