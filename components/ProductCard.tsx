type Product = {
  prod_name: string;
  product_type_name: string;
  price: number;
  detail_desc?: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="glass relative overflow-hidden rounded-[20px] p-4 transition duration-300 hover:bg-[rgba(244,244,242,0.1)]">
      <div
        role="img"
        aria-label={`${product.prod_name} placeholder image`}
        className="mb-4 h-52 rounded-2xl border border-black/12 bg-panel dark:border-[rgba(244,244,242,0.12)]"
      />

      <h3 className="font-display text-lg font-medium text-cloud">
        {product.prod_name}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-cloud/50 line-clamp-2">
        {product.detail_desc}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-sm text-accent">
          ${product.price.toFixed(2)}
        </p>
        <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/80">
          {product.product_type_name}
        </span>
      </div>
    </article>
  );
}
