import React, {useState, useEffect  } from "react";
import { getInventario, actualizarStock } from "../services/dataService";

export default function InventarioList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      const data = await getInventario();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, stockActual) => {
    const nuevoStock = prompt("Nuevo stock:", stockActual);
    if (nuevoStock !== null) {
      await actualizarStock(id, parseFloat(nuevoStock));
      cargarInventario();
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Stock de Insumos</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Insumo</th>
            <th className="p-2">Stock Actual</th>
            <th className="p-2">Mínimo</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b">
              <td className="p-2 font-medium">{item.nombre}</td>
              <td className={`p-2 ${item.stock_actual <= item.stock_minimo ? "text-red-500 font-bold" : ""}`}>
                {item.stock_actual} {item.unidad_medida}
              </td>
              <td className="p-2 text-gray-500">{item.stock_minimo} {item.unidad_medida}</td>
              <td className="p-2">
                <button 
                  onClick={() => handleUpdate(item.id, item.stock_actual)}
                  className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Ajustar Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}