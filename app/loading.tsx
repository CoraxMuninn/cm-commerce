import Image from "next/image";
import loader from "@/assets/loader.gif";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Image src={loader} height={50} width={50} alt="loader..." />
    </div>
  );
}
