import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zynzyr.com';

  try {
    await dbConnect();
    const products = await Product.find({}).select('sku updatedAt').lean();

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${product.sku}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/collections/all`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      ...productUrls,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return at least the static pages to avoid build failure
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  }
}

