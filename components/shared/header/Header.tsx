import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants/index";
import Menu from "@/components/shared/header/Menu";

export default function Header() {
  return (
    <header className="sticky top-0 border-b backdrop-blur-md shadow-sm ">
      <div className=" flex-between wrapper">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={40}
              width={40}
              priority
            />
            <span className="hidden lg:flex items-center font-bold ml-3 text-2xl">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="space-x-1 flex-center">
          <Menu />
        </div>
      </div>
    </header>
  );
}
