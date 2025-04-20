// components/StoreSelector.tsx
import { Store } from '../app/types/inventory';

interface StoreSelectorProps {
  stores: Store[]; // Pastikan stores bertipe array
  onSelectStore: (store: Store) => void; // Fungsi callback yang akan dipanggil saat toko dipilih
}

export default function StoreSelector({
  stores = [], // Default ke array kosong jika stores tidak terisi
  onSelectStore,
}: StoreSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Pilih Toko</label>
      <select
        onChange={(e) => {
          const selectedStoreId = e.target.value; // Ambil ID toko dari value
          const selectedStore = stores.find(
            (store) => store.id === selectedStoreId,
          );
          if (selectedStore) onSelectStore(selectedStore); // Panggil onSelectStore hanya jika toko ditemukan
        }}
        className="p-2 border rounded-lg"
      >
        <option value="">-- Pilih Toko --</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
}
