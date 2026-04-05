export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Helper to generate Product Scheme
export function generateProductSchema(product) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zynzyr.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.seoDescription || product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Zynzyr',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.sku}`,
      priceCurrency: 'MYR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Zynzyr Fashion',
      },
    },
  };
}
