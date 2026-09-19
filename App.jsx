import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import PosModule from "./components/PosModule";
import InventarioList from "./components/InventarioList";
import DashboardHome from "./components/DashboardHome";
import { getSession, onAuthStateChange, logoutUser } from "./services/authService";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modulo, setModulo] = useState("dashboard");

  useEffect(() => {
    getSession().then((sessionData) => {
      setSession(sessionData);
      setLoading(false);
    });

    const { data: authListener } = onAuthStateChange((activeSession) => {
      setSession(activeSession);
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="animate-pulse font-medium">Cargando sistema...</p>
      </div>
    );
  }

  if (!session) {
    return <Login onLoginSuccess={(newSession) => setSession(newSession)} />;
  }

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-200 overflow-hidden font-sans">
      {/* BARRA LATERAL (Sidebar) */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
              F
            </div>
            <span className="font-bold text-xl tracking-wide text-white">FOOD - POS</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setModulo("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                modulo === "dashboard"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              📊 Dashboard / Finanzas
            </button>

            <button
              onClick={() => setModulo("pos")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                modulo === "pos"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              🛒 Punto de Venta (POS)
            </button>

            <button
              onClick={() => setModulo("inventario")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                modulo === "inventario"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              📦 Inventario / Insumos
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="px-2 text-xs text-slate-500">
            Usuario: <span className="text-slate-300 font-medium">{session.user.email}</span>
          </div>
          <button
            onClick={() => logoutUser().then(() => setSession(null))}
            className="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium rounded-xl transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* HEADER SUPERIOR */}
        <header className="h-16 border-b border-slate-800 bg-[#111827]/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-white uppercase tracking-wider">
            {modulo === "dashboard" && "Panel Financiero & Métricas"}
            {modulo === "pos" && "Caja / Punto de Venta"}
            {modulo === "inventario" && "Control de Inventario e Insumos"}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModulo("pos")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-blue-600/20 transition"
            >
              + Nueva Venta
            </button>
          </div>
        </header>

        {/* CONTENIDO DE MÓDULOS */}
        <main className="p-6 flex-1 bg-[#0b0f19]">
          {modulo === "dashboard" && <DashboardHome />}
          {modulo === "pos" && <PosModule />}
          {modulo === "inventario" && <InventarioList />}
        </main>
      </div>
    </div>
  );
}