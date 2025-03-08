import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  deleteSku,
  editSKU,
  AppDispatch,
  addSKU,
} from "../../store/index";
import { SKU } from "../../types/index";

const SKUsTable = () => {
  const skus = useSelector((state: RootState) => state.app.skus);
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSku, setEditingSku] = useState<SKU | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (skuId: string) => {
    if (window.confirm("Are you sure you want to delete this SKU?")) {
      dispatch(deleteSku(skuId));
    }
  };

  const handleEdit = (sku: SKU) => {
    setEditingSku({ ...sku });
    setIsAdding(false);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSku({
      id: "",
      label: "",
      class: "",
      department: "",
      price: 0,
      cost: 0,
    });
    setIsAdding(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingSku) {
      const { id, label, class: skuClass, department, price, cost } = editingSku;
      const errors = [];

      if (!id.trim()) errors.push("ID is required");
      if (!label.trim()) errors.push("Label is required");
      if (!skuClass.trim()) errors.push("Class is required");
      if (!department.trim()) errors.push("Department is required");
      if (price <= 0) errors.push("Price must be greater than 0");
      if (cost < 0) errors.push("Cost cannot be negative");

      if (isAdding && skus.some((s) => s.id === id)) {
        errors.push("SKU ID already exists! Please use a unique ID.");
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      // Save the SKU based on mode (add or edit)
      if (isAdding) {
        dispatch(addSKU(editingSku));
      } else {
        dispatch(editSKU(editingSku));
      }
      setIsModalOpen(false);
      setEditingSku(null);
      setIsAdding(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingSku) {
      const { name, value } = e.target;
      setEditingSku({
        ...editingSku,
        [name]: name === "price" || name === "cost" ? parseFloat(value) || 0 : value,
      });
    }
  };

  return (
    <div className="p-4 bg-gray-200">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add SKU
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Label</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Class</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Department</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cost</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {skus.map((sku) => (
            <tr key={sku.id}>
              <td className="px-6 py-4 whitespace-nowrap">{sku.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sku.label}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sku.class}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sku.department}</td>
              <td className="px-6 py-4 whitespace-nowrap">${sku.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">${sku.cost.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  onClick={() => handleEdit(sku)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sku.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && editingSku && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{isAdding ? "Add SKU" : "Edit SKU"}</h3>
            <div className="mb-4">
              <label className="block mb-1">ID</label>
              <input
                type="text"
                name="id"
                value={editingSku.id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isAdding} 
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Label</label>
              <input
                type="text"
                name="label"
                value={editingSku.label}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Class</label>
              <input
                type="text"
                name="class"
                value={editingSku.class}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={editingSku.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={editingSku.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Cost</label>
              <input
                type="number"
                name="cost"
                value={editingSku.cost}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                step="0.01"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSku(null);
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

export default SKUsTable;