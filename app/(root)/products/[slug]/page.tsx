import AddToCart from "@/components/shared/products/AddToCart";
import ProductImages from "@/components/shared/products/ProductImages";
import ProductPrice from "@/components/shared/products/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="col-span-2">
          <ProductImages images={product.images} />
        </div>
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} - {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p>
              {Number(product.rating)} of {product.numReviews} Reviews
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <ProductPrice
                value={Number(product.price)}
                className="text-green-700 bg-green-100 rounded-full w-20 px-5 py-2 text-center"
              />
            </div>
          </div>
          <div className="mt-10">
            <p className="font-semibold">Description:</p>
            <p>{product.description}</p>
          </div>
        </div>
        <div>
          <Card>
            <CardContent className="px-4">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <ProductPrice value={Number(product.price)} />
              </div>
              <div className="mb-3 flex justify-between">
                <div>Status</div>
                {product.stock > 0 ? (
                  <Badge variant={"outline"}>In Stock</Badge>
                ) : (
                  <Badge variant={"destructive"}>Out of Stock</Badge>
                )}
              </div>
              {product.stock > 0 && (
                <div className="flex-center">
                  <AddToCart
                    items={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      image: product.images![0],
                      gty: 1,
                      price: String(product.price),
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
