/*
 * Clase Tarea
 * Representa una unidad individual de tarea con sus propiedades y métodos de instancia.
 */
class Tarea {
  constructor(
    id,
    descripcion,
    estado = "pendiente",
    fechaCreacion = new Date().toISOString(),
    fechaLimite = null
  ) {
    this.id = String(id);
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaLimite = fechaLimite;
    this.eliminada = false;
  }

  // Alterna el estado de la tarea entre pendiente y completada
  cambiarEstado() {
    this.estado =
      this.estado === "pendiente"
        ? "completada"
        : "pendiente";
  }

  // Marca lógicamente la tarea como eliminada
  eliminar() {
    this.eliminada = true;
  }
}