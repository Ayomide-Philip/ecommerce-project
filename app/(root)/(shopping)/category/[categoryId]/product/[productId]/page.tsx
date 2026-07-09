import { useParams } from "next/navigation";
export default function Page() {
  const params = useParams();
  const { categoryId, productId } = params;

  return (
    <div>
      <h1 className="text-4xl font-bold text-cloud">Product Details</h1>
      <p className="mt-4 text-cloud/70">
        This is the product details page for {productId} with category{" "}
        {categoryId}.
      </p>
    </div>
  );
}
