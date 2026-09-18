class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  agregarTarea(tarea) {
    this.tareas = [
      ...this.tareas,
      tarea
    ];
  }

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

  obtenerTareas(...estados) {
    if (estados.length === 0) {
      return [...this.tareas];
    }

    return this.tareas.filter(
      ({ estado }) => estados.includes(estado)
    );
  }
}
