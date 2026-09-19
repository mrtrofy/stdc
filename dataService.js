import { supabase } from "../supabaseClient";

/* ==========================================================================
   MÓDULO: INVENTARIO / INSUMOS
   ========================================================================== */

export const getInventario = async () => {
  const { data, error } = await supabase
    .from("inventario")
    .select("*, categorias(nombre)")
    .order("nombre", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const actualizarStock = async (id, nuevoStock) => {
  const { data, error } = await supabase
    .from("inventario")
    .update({ stock_actual: nuevoStock, updated_at: new Date() })
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

/* ==========================================================================
   MÓDULO: PRODUCTOS / MENÚ
   ========================================================================== */

export const getProductos = async () => {
  const { data, error } = await supabase
    .from("productos")
    .select("*, categorias(nombre)")
    .eq("activo", true);

  if (error) throw new Error(error.message);
  return data;
};

/* ==========================================================================
   MÓDULO: VENTAS Y CAJA (CONTABILIDAD)
   ========================================================================== */

export const registrarVenta = async ({ carrito, metodoPago, totalUSD, totalBs }) => {
  // 1. Crear la venta principal
  const { data: venta, error: errorVenta } = await supabase
    .from("ventas")
    .insert([
      {
        monto_total_usd: totalUSD,
        monto_total_bs: totalBs,
        metodo_pago: metodoPago
      }
    ])
    .select();

  if (errorVenta) throw new Error(errorVenta.message);

  const ventaId = venta[0].id;

  // 2. Insertar cada ítem del carrito en el detalle
  const detalles = carrito.map(item => ({
    venta_id: ventaId,
    producto_id: item.id,
    cantidad: item.cantidad,
    precio_unitario: item.precio_usd
  }));

  const { error: errorDetalle } = await supabase
    .from("detalle_ventas")
    .insert(detalles);

  if (errorDetalle) throw new Error(errorDetalle.message);

  return venta[0];
};

/* ==========================================================================
   MÓDULO: GASTOS OPERATIVOS
   ========================================================================== */

export const registrarGasto = async (gastoData) => {
  const { data, error } = await supabase
    .from("gastos")
    .insert([gastoData])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

export const getResumenFinanciero = async () => {
  const { data: ventas } = await supabase.from("ventas").select("monto_total_usd");
  const { data: gastos } = await supabase.from("gastos").select("monto_usd");

  const totalIngresos = ventas?.reduce((acc, v) => acc + Number(v.monto_total_usd), 0) || 0;
  const totalGastos = gastos?.reduce((acc, g) => acc + Number(g.monto_usd), 0) || 0;

  return {
    ingresosUSD: totalIngresos,
    gastosUSD: totalGastos,
    balanceUSD: totalIngresos - totalGastos
  };
};