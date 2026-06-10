"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatError } from "@/lib/utils";
import { singingImFormSchema, singUpFormSchema } from "@/lib/validators";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
