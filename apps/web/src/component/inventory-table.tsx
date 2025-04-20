// components/InventoryTable.tsx
import { useState, useEffect } from 'react';
import { Product, Store } from '../app/types/inventory';
import StockUpdateModal from './stock-updatemodal';

interface InventoryTableProps {
  products: Product[];
  store: Store;
}

export default function InventoryTable({
  products,
  store,
}: InventoryTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Menambahkan console log untuk memeriksa data yang diterima
  useEffect(() => {
    console.log('Store Data:', store); // Untuk memeriksa data store
    console.log('Products Data:', products); // Untuk memeriksa data produk
  }, [store, products]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Stok di {store ? store.name : 'Toko Belum Terpilih'}
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nama Produk</th>
            <th className="p-2 border">Stok</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border">
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.stock}</td>
              <td className="p-2 border">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    console.log('Selected Product:', product); // Log produk yang dipilih
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Perbarui Stok
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal untuk memperbarui stok */}
      {selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
