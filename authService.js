import { supabase } from "../supabaseClient";

// Iniciar sesión con Email y Contraseña
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};

// Cerrar sesión
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

// Obtener la sesión activa al cargar la app
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Escuchar cambios de estado en la autenticación (Login / Logout)
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
};