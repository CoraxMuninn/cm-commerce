"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatError, round2 } from "@/lib/utils";
import { cartItemSchema, insertCartSchema } from "@/lib/validators";
import { CartItem } from "@/types/index";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// calculate cart price
function calcPrice(items: CartItem[]) {
  const itemsPrice = round2(
    items.reduce((acc, item) => {
      acc = acc + +item.price * item.qty;
      return acc;
    }, 0),
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

export async function addItemToCart(data: CartItem) {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart session not found");

    // get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // add to database
      await prisma.cart.create({
        data: newCart,
      });

      // revalidate product page
      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart.`,
      };
    } else {
      // check if item already exists in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      );

      if (existItem) {
        // stock check
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // increase quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId,
        )!.qty = existItem.qty + 1;
      } else {
        // if item dose not exist in cart
        // check stock
        if (product.stock < 1) throw new Error("we are run out of stock");

        //add item to cart.items
        cart.items.push(item);
      }

      // save to db
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? "updated in cart" : "added to"}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  //check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) throw new Error("Cart session not found");

  // get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from db
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  //convert to decimal and return
  return {
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  };
}

export async function removeItemFromCart(productId: string) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart session not found");

    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    // get user cart
    const cart = await getMyCart();

    if (!cart) throw new Error("Cart not found");

    // check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId,
    );

    if (!exist) throw new Error("Item not found");

    // check if only one in qty
    if (exist.qty === 1) {
      // remove product
      cart.items = (cart.items as CartItem[]).filter(
        (item) => item.productId !== exist.productId,
      );
    } else {
      // decrease qty
      (cart.items as CartItem[]).find(
        (item) => item.productId === productId,
      )!.qty = exist.qty - 1;
    }

    // update cart in db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/products/${product.slug}`);

    return {
      succuss: true,
      message: `${product.name} was removed from the cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
