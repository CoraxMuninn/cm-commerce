import { APP_NAME } from "@/lib/constants/index";
import Image from "next/image";
import logo from "@/public/images/logo.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="flex-center flex-col gap-5 min-h-screen -mt-10">
        <Image
          src={logo}
          alt={`${APP_NAME} logo`}
          height={48}
          width={48}
          priority
        />
        <div className="flex-center flex-row space-x-2 text-red-600">
          <h3 className="text-xl">NOT FOUND</h3> |
          <p className="flex text-md ml-2"> Couldn't find requested page</p>
        </div>
        <Button size={"sm"} className="cursor-pointer uppercase">
          <Link href="/">Go to home</Link>
        </Button>
      </div>
    </>
  );
}
