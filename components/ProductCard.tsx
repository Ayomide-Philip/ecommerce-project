/* eslint-disable @next/next/no-img-element */
type Product = {
  prod_name: string;
  product_type_name: string;
  price: number;
  detail_desc?: string;
};

type ProductCardProps = {
  product: Product;
};

const imageMap: Record<string, string> = {
  Skirt: "skirt",
  Blouse: "blouse",
  Sweater: "sweater",
  Coat: "coat",
  Trousers: "trousers",
  Shorts: "shorts",
  "T-shirt": "t-shirt",
  "Vest top": "vest-top",
  Dress: "dress",
  Top: "top",
  Shirt: "shirt",
  Jacket: "jacket",
  Cardigan: "cardigan",
  "Underwear bottom": "underwear-bottom",
  Sneakers: "sneakers",
  Socks: "socks",
  "Polo shirt": "polo-shirt",
  Blazer: "blazer",
  Tie: "tie",
  Scarf: "scarf",
  Cap: "cap",
  Watch: "watch",
  Gloves: "gloves",
  Hoodie: "hoodie",
  Slippers: "slippers",
};

export default function ProductCard({ product }: ProductCardProps) {
  const imgSrc = `/images/${imageMap[product.product_type_name] || product.product_type_name.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  return (
    <article className="group glass relative overflow-hidden rounded-[20px] p-4 transition duration-300 hover:bg-[rgba(244,244,242,0.1)]">
      <div className="relative mb-4 h-52 overflow-hidden rounded-2xl border border-black/12 bg-panel dark:border-[rgba(244,244,242,0.12)]">
        <img
          src={imgSrc}
          alt={product.prod_name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

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
