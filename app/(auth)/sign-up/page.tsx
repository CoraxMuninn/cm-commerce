import SignUpForm from "@/app/(auth)/sign-up/SignUpForm";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants/index";
import { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignInPage(props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={"/"} className="flex-center">
            <Image
              src={"/images/logo.svg"}
              width={60}
              height={60}
              alt={`${APP_NAME} logo`}
              priority
            />
          </Link>
        </CardHeader>
        <CardTitle className="text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Enter your information below to sign up
        </CardDescription>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
