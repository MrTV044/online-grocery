'use client';

import { useEffect, useState } from 'react';
import InventoryTable from '../../../component/inventory-table';
import StoreSelector from '../../../component/store-selector';
import { Product, Store } from '../../types/inventory';

export default function InventoryPage() {
  const [stores, setStores] = useState<Store[]>([]); // Menyimpan daftar toko
  const [selectedStore, setSelectedStore] = useState<Store | null>(null); // Menyimpan toko yang dipilih
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Menyimpan produk berdasarkan toko yang dipilih

  // Fetch daftar toko dari backend
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(
          'http://localhost:8000/api/v1/inventory/store/${store.id}/stocks',
        ); // Mengambil daftar toko
        if (!res.ok) {
          console.error('Response not OK:', res.statusText);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setStores(data); // Pastikan data yang diterima adalah array
        } else {
          console.error('Data toko tidak valid', data); // Menampilkan data yang diterima
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    fetchStores();
  }, []);

  // Fungsi ketika toko dipilih
  const handleStoreSelect = async (store: Store) => {
    setSelectedStore(store); // Menyimpan toko yang dipilih

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/inventory/store/${store.id}/stocks`, // Mengambil stok produk berdasarkan toko
      );
      const data = await res.json();

      // Map data stok ke bentuk produk frontend
      type Stock = {
        product: {
          id: number | string;
          name: string;
        };
        quantity: number;
        storeId: number | string;
      };

      const products: Product[] = data.map((stock: Stock) => ({
        id: stock.product.id.toString(),
        name: stock.product.name,
        stock: stock.quantity,
        storeId: stock.storeId.toString(),
      }));

      setFilteredProducts(products); // Menyimpan produk yang difilter
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      {/* Pilih toko */}
      <StoreSelector stores={stores} onSelectStore={handleStoreSelect} />

      {/* Tabel inventory */}
      {selectedStore ? (
        <InventoryTable products={filteredProducts} store={selectedStore} />
      ) : (
        <p className="text-gray-500">Silakan pilih toko terlebih dahulu.</p>
      )}
    </div>
  );
}
