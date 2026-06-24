"use client";

import { useRouter } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order.actions";

export default function PlaceOrderForm() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  }

  function PlaceOrderButton() {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full cursor-pointer">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{" "}
        Place Order
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full px-3">
      <PlaceOrderButton />
    </form>
  );
}
