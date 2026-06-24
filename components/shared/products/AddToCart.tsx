"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types/index";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function AddToCart({
  cart,
  item,
}: {
  cart?: Cart;
  item: CartItem;
}) {
  const router = useRouter();

  // transition hook
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart() {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res?.success) {
        toast.error(res?.message);
        return;
      }

      toast.success(res.message, {
        action: {
          label: "Go To Cart",
          onClick: () => router.push("/cart"),
        },
        actionButtonStyle: {
          backgroundColor: "darkcyan",
          color: "white",
        },
      });
    });
  }

  // handleRemoveFromCart func
  async function handleRemoveFromCart() {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      const showToast = res.success ? toast.success : toast.error;

      showToast(res.message);

      return;
    });
  }

  // check item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type="button"
        variant={"outline"}
        onClick={handleRemoveFromCart}
        className="cursor-pointer"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-4">{existItem.qty}</span>
      <Button
        type="button"
        variant={"outline"}
        onClick={handleAddToCart}
        className="cursor-pointer"
      >
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus />}
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      className="w-full cursor-pointer"
      onClick={handleAddToCart}
    >
      {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus />} Add
      To Cart
    </Button>
  );
}
