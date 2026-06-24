"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatCurrency, round2 } from "@/lib/utils";
import { Cart } from "@/types/index";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-2 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href={"/"}>Go Shopping.</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => {
                  const totalPrice = round2(+item.price * item.qty);
                  return (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/products/${item.slug}`}
                          className="flex items-center gap-5"
                        >
                          <Image
                            src={item.image}
                            width={60}
                            height={60}
                            alt={item.name}
                          />
                          <span>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="flex-center gap-2 pt-6">
                        <Button
                          size={"sm"}
                          className="cursor-pointer bg-rose-500! hover:bg-rose-600!"
                          type="button"
                          variant={"outline"}
                          disabled={isPending}
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeItemFromCart(
                                item.productId,
                              );

                              if (!res.success) {
                                toast.error(res.message);
                              }
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                        </Button>
                        <span className="px-3">{item.qty}</span>
                        <Button
                          size={"sm"}
                          className="cursor-pointer bg-teal-600! hover:bg-teal-700!"
                          type="button"
                          variant={"outline"}
                          disabled={isPending}
                          onClick={() =>
                            startTransition(async () => {
                              const res = await addItemToCart(item);

                              if (!res.success) {
                                toast.error(res.message);
                              }
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCurrency(totalPrice)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-lg">
                Subtotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)})
                :
                <span className="px-1 font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="cursor-pointer w-full"
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                )}{" "}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
