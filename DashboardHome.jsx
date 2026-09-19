import React, { useState, useEffect } from "react";
import { getResumenFinanciero } from "../services/dataService";

export default function DashboardHome() {
  const [resumen, setResumen] = useState({ ingresosUSD: 0, gastosUSD: 0, balanceUSD: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumenFinanciero()
      .then((data) => {
        setResumen(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) {
    return <div className="text-slate-400">Cargando métricas financieras...</div>;
  }

  return (
    <div className="space-y-6">
      {/* TARJETAS MÉTRICAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Balance / Cash Flow */}
        <div className="bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-slate-400 text-xs uppercase font-semibold">Balance Total</p>
          <h3 className="text-2xl font-bold text-white mt-1">
            ${resumen.balanceUSD.toFixed(2)}
          </h3>
          <span className="text-emerald-400 text-xs font-semibold mt-2 inline-block">
            +12.5% vs mes anterior
          </span>
        </div>

        {/* Card 2: Ingresos */}
        <div className="bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-slate-400 text-xs uppercase font-semibold">Ingresos Totales</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">
            ${resumen.ingresosUSD.toFixed(2)}
          </h3>
          <span className="text-slate-500 text-xs mt-2 inline-block">Ventas acumuladas</span>
        </div>

        {/* Card 3: Gastos */}
        <div className="bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-slate-400 text-xs uppercase font-semibold">Gastos Operativos</p>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">
            ${resumen.gastosUSD.toFixed(2)}
          </h3>
          <span className="text-rose-400 text-xs font-semibold mt-2 inline-block">
            Nómina, insumos y servicios
          </span>
        </div>

        {/* Card 4: Estado Operativo */}
        <div className="bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-slate-400 text-xs uppercase font-semibold">Estado de Caja</p>
          <h3 className="text-xl font-bold text-blue-400 mt-1">Operativa</h3>
          <span className="text-blue-400 text-xs mt-2 inline-block">Sincronizado con Supabase</span>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: TABLA DE TRANSACCIONES Y DESGLOSE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de Movimientos Recientes */}
        <div className="lg:col-span-2 bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-4">Transacciones Recientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/40 border-b border-slate-800">
                <tr>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-medium text-white">Venta Combo Hamburguesa #102</td>
                  <td className="p-3 text-slate-400">Ventas Directas</td>
                  <td className="p-3 text-emerald-400 font-semibold">+$18.50</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs border border-emerald-500/20">
                      Completado
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-medium text-white">Compra de Carne y Queso</td>
                  <td className="p-3 text-slate-400">Insumos</td>
                  <td className="p-3 text-rose-400 font-semibold">-$85.00</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-rose-500/10 text-rose-400 rounded-md text-xs border border-rose-500/20">
                      Procesado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Estilo Donut / Resumen de Costos */}
        <div className="bg-[#1e293b]/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-2">Distribución de Gastos</h3>
          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/50 text-center space-y-2">
            <p className="text-slate-400 text-sm">Mayor costo registrado</p>
            <p className="text-xl font-bold text-blue-400">Materia Prima / Insumos (45%)</p>
          </div>
          <div className="space-y-2 text-xs text-slate-400 pt-4">
            <div className="flex justify-between">
              <span>Insumos</span>
              <span className="text-white font-medium">45%</span>
            </div>
            <div className="flex justify-between">
              <span>Nómina</span>
              <span className="text-white font-medium">30%</span>
            </div>
            <div className="flex justify-between">
              <span>Servicios y Mantenimiento</span>
              <span className="text-white font-medium">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}