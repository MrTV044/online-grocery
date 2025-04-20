'use client';

import { useState, useEffect } from 'react';
import InventoryTable from '../../../component/inventory-table'; // Tabel untuk menampilkan data stok
import StoreSelector from '../../../component/store-selector'; // Selector untuk memilih toko
import { Product, Store } from '../../types/inventory';

// Simulasi data toko
const stores: Store[] = [
  { id: '1', name: 'Toko A' },
  { id: '2', name: 'Toko B' },
];

export default function InventoryPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]); // Produk yang ditampilkan
  const [loading, setLoading] = useState(false); // Status loading
  const [error, setError] = useState<string | null>(null); // Error handling

  // Fungsi untuk memilih toko
  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
  };

  // Fetch stok berdasarkan toko yang dipilih
  useEffect(() => {
    if (selectedStore) {
      setLoading(true);
      setError(null);

      // Fetch data dari API
      fetch(
        `http://localhost:8000/api/v1/inventory/store/${selectedStore.id}/stocks`,
      )
        .then((response) => response.json())
        .then((data) => {
          setProducts(
            data.map(
              (item: {
                product: { id: string; name: string };
                quantity: number;
                store: { id: string };
              }) => ({
                id: item.product.id,
                name: item.product.name,
                stock: item.quantity,
                storeId: item.store.id,
              }),
            ),
          );
        })
        .catch(() => {
          setError('Failed to fetch data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedStore]); // Hanya mem-fetch ulang ketika toko dipilih

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      {/* Selector untuk memilih toko */}
      <StoreSelector stores={stores} onSelectStore={handleStoreSelect} />

      {/* Menampilkan data stok produk */}
      {'}'}
      {loading ? (
        <div className="text-gray-500">Memuat data stok...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <InventoryTable products={products} store={selectedStore as Store} />
      )}
    </div>
  );
}
