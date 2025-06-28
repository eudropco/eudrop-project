import Link from 'next/link'; // Next.js'in link bileşenini çağırıyoruz

type ProductCardProps = {
  name: string;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  slug: string; // Ürünün link adresi için (örn: "netflix-premium")
};

export default function ProductCard({ name, originalPrice, discountedPrice, imageUrl, slug }: ProductCardProps) {
  const hasDiscount = originalPrice > discountedPrice;

  // Tüm kartı bir Link bileşeni ile sarmalıyoruz
  return (
    <Link href={`/store/${slug}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-300 group flex flex-col h-full">
        <div className="w-full h-40 bg-gray-700 flex items-center justify-center p-4">
          <img src={imageUrl} alt={name} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white flex-grow">{name}</h3>
          <div className="flex justify-between items-center mt-4">
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
      </div>
    </Link>
  );
}