import { APP_NAME } from "@/lib/constants/index";
import { Copyright } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        <Copyright height={12} width={12} className="mr-1" /> {currentYear}
        <a href="https://github.com/coraxmuninn" className="block ml-1">
          CoraxMuninn
        </a>
        . All Right Reserved
      </div>
    </footer>
  );
}
