class Tarea {
  constructor(
    id,
    descripcion,
    estado = "pendiente",
    fechaCreacion = new Date().toISOString(),
    fechaLimite = null
  ) {
    // String() asegura que todos los identificadores se almacenen como texto.
    this.id = String(id);

    // Descripción escrita al crear la tarea.
    this.descripcion = descripcion;

    // Si no recibimos otro valor, la tarea comienza pendiente.
    this.estado = estado;

    // toISOString() produce una representación estándar de fecha y hora.
    this.fechaCreacion = fechaCreacion;

    // Una tarea puede no tener fecha límite.
    this.fechaLimite = fechaLimite;

    // La marca comienza en false porque la tarea todavía existe.
    this.eliminada = false;
  }
}

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

  cambiarEstado() {
    this.estado =
      this.estado === "pendiente"
        ? "completada"
        : "pendiente";
  }

  eliminar() {
    this.eliminada = true;
  }
}