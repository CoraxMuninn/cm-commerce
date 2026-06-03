"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        width={1000}
        height={1000}
        alt="product image"
        className="min-h-75  object-center object-cover rounded-sm"
      />
      <div className="flex gap-1">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "cursor-pointer border rounded-sm  hover:border-orange-600",
              current === idx && "border-orange-500",
            )}
          >
            <Image src={img} alt="image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
}
