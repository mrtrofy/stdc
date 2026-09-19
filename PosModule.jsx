import React, { useState, useEffect } from "react";
import { getProductos, registrarVenta } from "../services/dataService";

export default function PosModule() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("Efectivo USD");

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const totalUSD = carrito.reduce(
    (acc, item) => acc + item.precio_usd * item.cantidad,
    0
  );

  const handleCobrar = async () => {
    if (carrito.length === 0) return;

    try {
      await registrarVenta({
        carrito,
        metodoPago,
        totalUSD,
        totalBs: totalUSD * 36.5, // Tasa de ejemplo
      });
      alert("¡Venta registrada con éxito!");
      setCarrito([]);
    } catch (err) {
      alert("Error al procesar la venta");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* SECCIÓN IZQUIERDA: Catálogo de productos */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Catálogo de Productos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {productos.length === 0 ? (
            <p className="text-slate-400 col-span-full py-8 text-center bg-[#1e293b]/50 rounded-2xl border border-slate-800">
              No hay productos registrados en el inventario.
            </p>
          ) : (
            productos.map((prod) => (
              <button
                key={prod.id}
                onClick={() => agregarAlCarrito(prod)}
                className="p-4 bg-[#1e293b] border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/80 text-left transition duration-200 group flex flex-col justify-between h-28 shadow-lg"
              >
                <p className="font-semibold text-white group-hover:text-blue-400 transition line-clamp-2">
                  {prod.nombre}
                </p>
                <p className="text-emerald-400 font-bold text-lg mt-2">
                  ${prod.precio_usd.toFixed(2)}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: Carrito / Facturación (Dark Aesthetic) */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-200 flex flex-col justify-between h-fit min-h-[480px]">
        <div>
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
            <h3 className="text-xl font-bold text-white">Orden Actual</h3>
            <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              {carrito.length} {carrito.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* LISTA DE ÍTEMS EN CARRITO */}
          <ul className="divide-y divide-slate-800 my-2 max-h-64 overflow-y-auto pr-1 space-y-1">
            {carrito.length === 0 ? (
              <li className="py-12 text-center text-slate-500 text-sm">
                Selecciona productos del catálogo para agregar
              </li>
            ) : (
              carrito.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-semibold text-white">{item.nombre}</p>
                    <p className="text-xs text-slate-400">
                      {item.cantidad} x ${item.precio_usd.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-emerald-400 font-bold text-base">
                    ${(item.precio_usd * item.cantidad).toFixed(2)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* CONTROLES DE PAGO Y TOTAL */}
        <div className="border-t border-slate-700/60 pt-4 space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 font-semibold text-lg">Total:</span>
            <span className="text-3xl font-extrabold text-emerald-400">
              ${totalUSD.toFixed(2)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Método de Pago
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white font-medium rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="Efectivo USD" className="bg-slate-900 text-white p-2">
                Efectivo USD
              </option>
              <option value="Pago Móvil" className="bg-slate-900 text-white p-2">
                Pago Móvil
              </option>
              <option value="Zelle" className="bg-slate-900 text-white p-2">
                Zelle
              </option>
              <option value="Punto de Venta" className="bg-slate-900 text-white p-2">
                Punto de Venta
              </option>
            </select>
          </div>

          <button
            onClick={handleCobrar}
            disabled={carrito.length === 0}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Completar Venta
          </button>
        </div>
      </div>
    </div>
  );
}