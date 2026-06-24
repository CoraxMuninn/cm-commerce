"use server";

import { ShippingAddress } from "./../../types/index";

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatError } from "@/lib/utils";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  singingImFormSchema,
  singUpFormSchema,
} from "@/lib/validators";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

// sign in the user with credentials
export async function singInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = singingImFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { succuss: true, message: "Signed in successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password." };
  }
}

// sign out user
export async function signOutUser() {
  await signOut();
}

// sign up user

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = singUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPass = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPass,
    });

    return { success: true, message: "User register successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

// get user by id
export async function getUserByID(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// update user's address

export async function updateUserAddress(address: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User Not Found");

    const newAddress = shippingAddressSchema.parse(address);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: { address: newAddress },
    });

    return {
      success: true,
      message: "User updated successfully.",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    // update user payment
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User payment updated successfully.",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
