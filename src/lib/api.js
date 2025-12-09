const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400';

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed request: ${url}`);
  }
  return response.json();
};

const extractImages = (product) => {
  const candidates = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.image,
    product.thumbnail,
  ].filter(Boolean);
  return candidates.length > 0 ? candidates : [PLACEHOLDER_IMAGE];
};

const deriveRating = (product) => {
  if (typeof product.rating === 'number') {
    return product.rating;
  }
  if (product.rating && typeof product.rating === 'object') {
    return product.rating.rate ?? product.rating.value ?? null;
  }
  return null;
};

const normalizeProduct = (product, category) => ({
  id: `${category.slug}-${product.id}`,
  sourceId: Number(product.id) || product.id,
  title: product.title || product.name || 'Untitled Product',
  description: product.description || '',
  price: Number(product.price) || 0,
  images: extractImages(product),
  category: {
    slug: category.slug,
    name: category.name,
  },
  rating: deriveRating(product),
  stock: product.stock ?? null,
  source: category.name,
});

const fetchDummyJsonCategory = async (category) => {
  const data = await fetchJson(`https://dummyjson.com/products/category/${encodeURIComponent(category)}`);
  return data.products || [];
};

const fetchClothesProducts = async (category) => {
  const endpoints = ["men%27s%20clothing", "women%27s%20clothing"];
  const collections = await Promise.all(
    endpoints.map((segment) => fetchJson(`https://fakestoreapi.com/products/category/${segment}`))
  );
  const combined = collections.flat();
  return combined.map((product) => normalizeProduct(product, category));
};

const fetchElectronicsProducts = async (category) => {
  const [smartphones, laptops] = await Promise.all([
    fetchDummyJsonCategory('smartphones'),
    fetchDummyJsonCategory('laptops'),
  ]);
  return [...smartphones, ...laptops].map((product) => normalizeProduct(product, category));
};

const fetchFurnitureProducts = async (category) => {
  const furniture = await fetchDummyJsonCategory('furniture');
  return furniture.map((product) => normalizeProduct(product, category));
};

const fetchMiscProducts = async (category) => {
  const [home, lighting] = await Promise.all([
    fetchDummyJsonCategory('home-decoration'),
    fetchDummyJsonCategory('lighting'),
  ]);
  return [...home, ...lighting].map((product) => normalizeProduct(product, category));
};

const CATEGORY_CONFIG = {
  clothes: {
    slug: 'clothes',
    name: 'Clothes',
    description: 'Adaptive apparel, modular layers, and kinetic fabrics.',
    loader: (category) => fetchClothesProducts(category),
  },
  electronics: {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Ambient tech, sonic instruments, and wearable circuits.',
    loader: (category) => fetchElectronicsProducts(category),
  },
  furniture: {
    slug: 'furniture',
    name: 'Furniture',
    description: 'Low-profile seating, floating consoles, and studio essentials.',
    loader: (category) => fetchFurnitureProducts(category),
  },
  miscellaneous: {
    slug: 'miscellaneous',
    name: 'Miscellaneous',
    description: 'Atmospheric objects, lumens, and daily carry experiments.',
    loader: (category) => fetchMiscProducts(category),
  },
};

const categoryCache = new Map();

const loadCategoryProducts = async (slug) => {
  if (!CATEGORY_CONFIG[slug]) {
    return [];
  }
  if (categoryCache.has(slug)) {
    return categoryCache.get(slug);
  }
  try {
    const spec = CATEGORY_CONFIG[slug];
    const products = await spec.loader(spec);
    categoryCache.set(slug, products);
    return products;
  } catch (error) {
    console.error(`Error fetching ${slug} products:`, error);
    categoryCache.set(slug, []);
    return [];
  }
};

export const fetchProducts = async () => {
  const productGroups = await Promise.all(
    Object.keys(CATEGORY_CONFIG).map((slug) => loadCategoryProducts(slug))
  );
  return productGroups.flat();
};

export const fetchCategories = async () =>
  Object.values(CATEGORY_CONFIG).map(({ slug, name, description }) => ({
    id: slug,
    slug,
    name,
    description,
  }));

export const fetchProductsByCategory = async (slug) => loadCategoryProducts(slug);

export const fetchProductById = async (id) => {
  if (!id) return null;
  const [slug] = id.split('-');
  const products = await fetchProductsByCategory(slug);
  return products.find((product) => product.id === id) || null;
};

