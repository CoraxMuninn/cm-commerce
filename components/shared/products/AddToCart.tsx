"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types/index";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddToCart({ items }: { items: CartItem }) {
  const router = useRouter();

  async function handleAddToCart() {
    const res = await addItemToCart(items);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(`${items.name} added to cart`, {
      action: {
        label: "Go To Cart",
        onClick: () => router.push("/cart"),
      },
      actionButtonStyle: {
        backgroundColor: "darkcyan",
        color: "white",
      },
    });
  }
  return (
    <Button
      type="button"
      className="w-full cursor-pointer"
      onClick={handleAddToCart}
    >
      Add To Cart
    </Button>
  );
}
