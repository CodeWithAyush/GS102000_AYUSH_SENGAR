import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  deleteStore,
  editStore,
  addStore,
  AppDispatch,
} from "../../store";
import { Store } from "../../types";

const StoresTable = () => {
  const stores = useSelector((state: RootState) => state.app.stores);
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (storeId: string) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      dispatch(deleteStore(storeId));
    }
  };

  const handleEdit = (store: Store) => {
    setEditingStore({ ...store });
    setIsAdding(false);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingStore({ id: "", label: "", city: "", state: "", seqNo: 0 });
    setIsAdding(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingStore) {
      const { id, label, city, state, seqNo } = editingStore;
      const errors = [];

      if (!id.trim()) {
        errors.push("ID is required");
      }
      if (!label.trim()) {
        errors.push("Label is required");
      }
      if (!city.trim()) {
        errors.push("City is required");
      }
      if (!state.trim()) {
        errors.push("State is required");
      }

      if (seqNo < 0) {
        errors.push("Seq No must be a non-negative number");
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      if (isAdding && stores.some((s) => s.id === id)) {
        alert("Store ID already exists! Please use a unique ID.");
        return;
      }

      if (isAdding) {
        dispatch(addStore(editingStore));
      } else {
        dispatch(editStore(editingStore));
      }

      setIsModalOpen(false);
      setEditingStore(null);
      setIsAdding(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingStore) {
      const { name, value } = e.target;
      setEditingStore({
        ...editingStore,
        [name]: name === "seqNo" ? parseInt(value) || 0 : value,
      });
    }
  };

  return (
    <div className="p-4 bg-gray-200">
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-2xl font-semibold">Stores</h2> */}
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Store
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              Label
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              City
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              State
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stores.map((store) => (
            <tr key={store.id}>
              <td className="px-6 py-4 whitespace-nowrap">{store.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{store.label}</td>
              <td className="px-6 py-4 whitespace-nowrap">{store.city}</td>
              <td className="px-6 py-4 whitespace-nowrap">{store.state}</td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  onClick={() => handleEdit(store)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {isModalOpen && editingStore && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {isAdding ? "Add Store" : "Edit Store"}
            </h3>
            <div className="mb-4">
              <label className="block mb-1">ID</label>
              <input
                type="text"
                name="id"
                value={editingStore.id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isAdding} // ID is editable only when adding
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Seq No</label>
              <input
                type="number"
                name="seqNo"
                value={editingStore.seqNo}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Label</label>
              <input
                type="text"
                name="label"
                value={editingStore.label}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">City</label>
              <input
                type="text"
                name="city"
                value={editingStore.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">State</label>
              <input
                type="text"
                name="state"
                value={editingStore.state}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingStore(null);
                  setIsAdding(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoresTable;
