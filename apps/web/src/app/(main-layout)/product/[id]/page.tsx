// app/products/[id].tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

// Fungsi untuk mengambil detail produk dari API
const fetchProductDetail = async (id: number): Promise<ProductDetail> => {
  const res = await fetch(
    `http://localhost:8000/api/v1/product/products/${id}`,
  );
  if (!res.ok) {
    throw new Error('Failed to fetch product detail');
  }
  return res.json();
};

const ProductDetailPage = () => {
  const { id } = useParams(); // ID produk dari URL params
  const [product, setProduct] = useState<ProductDetail | null>(null);

  // Menunggu sampai komponen dimuat di sisi klien
  useEffect(() => {
    if (id) {
      const getProductDetail = async () => {
        try {
          const productData = await fetchProductDetail(Number(id));
          setProduct(productData);
        } catch (error) {
          console.error('Error fetching product detail:', error);
        }
      };
      getProductDetail();
    }
  }, [id]);

  // Menangani jika produk belum ditemukan atau sedang dimuat
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <div>
        <Image
          src={product.images[0]} // Menampilkan gambar pertama produk
          alt={product.name}
          width={300}
          height={300}
        />
      </div>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
    </div>
  );
};

export default ProductDetailPage;
