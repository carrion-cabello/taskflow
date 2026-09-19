/*
 * Clase GestorTareas
 * Administra la colección completa de tareas utilizando ES6+ (spread, rest, destructuring).
 */
class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  // Agrega una nueva tarea usando spread
  agregarTarea(tarea) {
    this.tareas = [
      ...this.tareas,
      tarea
    ];
  }

  // Busca una tarea utilizando find y destructuring
  buscarTareaPorId(id) {
    return this.tareas.find(
      ({ id: tareaId }) =>
        tareaId === String(id)
    );
  }

  editarTarea(id, nuevaDescripcion) {
    const tarea = this.buscarTareaPorId(id);
    if (!tarea) {
      return false;
    }
    tarea.descripcion = nuevaDescripcion;
    return true;
  }

  cambiarEstado(id) {
    const tarea = this.buscarTareaPorId(id);
    if (!tarea) {
      return false;
    }
    tarea.cambiarEstado();
    return true;
  }

  eliminarTarea(id) {
    const tarea = this.buscarTareaPorId(id);
    if (!tarea) {
      return false;
    }
    tarea.eliminar();
    this.tareas = this.tareas.filter(
      ({ eliminada }) => !eliminada
    );
    return true;
  }

  // Utiliza el operador rest (...estados) para filtrar opcionalmente por estado
  obtenerTareas(...estados) {
    if (estados.length === 0) {
      return [...this.tareas];
    }
    return this.tareas.filter(
      ({ estado }) => estados.includes(estado)
    );
  }

  // Reconstruye las instancias de Tarea al cargar datos externos o desde localStorage
  cargarTareas(datos) {
    this.tareas = datos.map(
      ({
        id,
        descripcion,
        estado,
        fechaCreacion,
        fechaLimite
      }) =>
        new Tarea(
          id,
          descripcion,
          estado,
          fechaCreacion,
          fechaLimite
        )
    );
  }
}