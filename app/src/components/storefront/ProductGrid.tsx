import { ProductCard } from './ProductCard';

interface ProductGridItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  sector: string;
  productType: string;
  priceCents: number;
}

interface ProductGridProps {
  products: ProductGridItem[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = 'No products found.' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-white/40 text-center py-16">{emptyMessage}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          slug={product.slug}
          title={product.title}
          shortDescription={product.shortDescription}
          sector={product.sector}
          productType={product.productType}
          priceCents={product.priceCents}
        />
      ))}
    </div>
  );
}
