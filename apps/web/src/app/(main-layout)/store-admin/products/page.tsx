'use client';

// app/store-admin/products/page.tsx
import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(
    'http://localhost:8000/api/v1/product/admin/products', // URL untuk mendapatkan produk
  );
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

const StoreAdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData); // Menyimpan data produk ke state
      } catch (error) {
        console.error(error); // Tangani error jika fetch gagal
      } finally {
        setLoading(false); // Selesai fetch data, set loading false
      }
    };

    getProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>; // Menampilkan loading ketika data sedang di-fetch
  }

  return (
    <div>
      <h1>Product List (Read Only)</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <div>
              {product.images.map((image, index) => (
                <img key={index} src={image} alt={product.name} width={100} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreAdminProductsPage;
