type Product = {
  name: string;
  brand: string;
  price: string;
  category: string;
  whyMatch?: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="glass relative overflow-hidden rounded-[20px] p-4">
      {product.whyMatch ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cloud">
          {product.whyMatch}
        </span>
      ) : null}

      <div
        role="img"
        aria-label={`${product.name} placeholder image`}
        className="mb-4 h-52 rounded-2xl border border-black/12 bg-panel dark:border-[rgba(244,244,242,0.12)]"
      />

      <p className="font-mono text-xs uppercase tracking-[0.14em] text-cloud/55">
        {product.brand}
      </p>
      <h3 className="mt-2 font-display text-xl font-medium text-cloud">
        {product.name}
      </h3>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-sm text-accent">{product.price}</p>
        <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/80">
          {product.category}
        </span>
      </div>
    </article>
  );
}
