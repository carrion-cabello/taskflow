/*
 * api.js
 * Gestiona el consumo de servicios externos mediante fetch (GET y POST) con control de errores.
 */
const API_URL = "https://jsonplaceholder.typicode.com/todos";

const obtenerTareasApi = async () => {
  try {
    const respuesta = await fetch(`${API_URL}?_limit=5`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    return await respuesta.json();
  } catch (error) {
    console.error("No fue posible obtener tareas desde la API:", error);
    throw error;
  }
};

const guardarTareaApi = async (tarea) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: tarea.descripcion,
        completed: tarea.estado === "completada",
        userId: 1
      })
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    return await respuesta.json();
  } catch (error) {
    console.error("No fue posible enviar la tarea a la API:", error);
    throw error;
  }
};