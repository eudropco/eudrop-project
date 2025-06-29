import Link from 'next/link';

type ProductCardProps = {
  name: string;
  originalPrice: number;
  discountedPrice: number;
  slug: string;
};

export default function ProductCard({ name, originalPrice, discountedPrice, slug }: ProductCardProps) {
  const hasDiscount = originalPrice > discountedPrice;

  return (
    <Link href={`/store/${slug}`}>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-cyan-500 transition-all duration-300 group flex flex-col h-full justify-between">
        <h3 className="text-lg font-bold text-white mb-4">{name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-cyan-400">${discountedPrice.toFixed(2)}</p>
            {hasDiscount && (
              <p className="text-md font-medium text-gray-500 line-through">${originalPrice.toFixed(2)}</p>
            )}
          </div>
          <div className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-md text-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            Details
          </div>
        </div>
      </div>
    </Link>
  );
}