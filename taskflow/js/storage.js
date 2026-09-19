/*
 * storage.js
 * Maneja la persistencia local de la aplicación utilizando localStorage y JSON.
 */
const STORAGE_KEY = "taskflow_tareas";

const guardarTareas = (tareas) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tareas)
    );
  } catch (error) {
    console.error("No fue posible guardar las tareas:", error);
  }
};

const cargarTareas = () => {
  try {
    const contenido = localStorage.getItem(STORAGE_KEY);
    if (!contenido) {
      return [];
    }
    const datos = JSON.parse(contenido);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("No fue posible recuperar las tareas guardadas:", error);
    return [];
  }
};