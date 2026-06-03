import ProductPrice from "@/components/shared/products/ProductPrice";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/types/index";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Card className="w-full max-w-xs mx-auto overflow-hidden">
        <CardHeader className="p-0 items-center">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.images[0]}
              width={320}
              height={300}
              alt={product.name}
              priority
              className="object-center"
            />
          </Link>
        </CardHeader>
        <CardContent className="p-4 grid gap-1">
          <div className="text-xs">{product.brand}</div>
          <Link href={`/products/${product.slug}`}>
            <h2 className="text-sm font-medium truncate">{product.name}</h2>
          </Link>
          <div className="flex-between gap-4 pt-4">
            <p>{product.rating} Stars</p>
            {product.stock > 0 ? (
              <ProductPrice value={+product.price} className="text-red-400" />
            ) : (
              <p className="capitalize text-destructive">Out of stock</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
