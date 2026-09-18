const gestor = new GestorTareas();

const formulario =
  document.querySelector("#formTarea");

const descripcion =
  document.querySelector("#descripcion");

const fechaLimite =
  document.querySelector("#fechaLimite");

const contadorCaracteres =
  document.querySelector("#contadorCaracteres");

const estadoProceso =
  document.querySelector("#estadoProceso");

const btnAgregar =
  document.querySelector("#btnAgregar");

const btnCargarApi =
  document.querySelector("#btnCargarApi");

const listaTareas =
  document.querySelector("#listaTareas");

const mensajeError =
  document.querySelector("#mensajeError");

const notificacion =
  document.querySelector("#notificacion");

const totalTareas =
  document.querySelector("#totalTareas");

const totalPendientes =
  document.querySelector("#totalPendientes");

const totalCompletadas =
  document.querySelector("#totalCompletadas");

const escaparHTML = (texto) => {
  const elemento = document.createElement("div");
  elemento.textContent = String(texto);
  return elemento.innerHTML;
};

const formatearFechaCreacion = (fechaISO) => {
  const fecha = new Date(fechaISO);

  if (Number.isNaN(fecha.getTime())) {
    return "Fecha no disponible";
  }

  return fecha.toLocaleString("es-CL");
};

const actualizarResumen = () => {
  const tareas = gestor.obtenerTareas();

  const pendientes =
    gestor.obtenerTareas("pendiente").length;

  const completadas =
    gestor.obtenerTareas("completada").length;

  totalTareas.textContent = String(tareas.length);
  totalPendientes.textContent = String(pendientes);
  totalCompletadas.textContent = String(completadas);
};

const renderizarTareas = () => {
  const tareas = gestor.obtenerTareas();

  if (tareas.length === 0) {
    listaTareas.innerHTML = `
      <div class="border rounded-3 bg-body-tertiary text-center p-5">
        <h3 class="h5">No hay tareas registradas</h3>
        <p class="text-body-secondary mb-0">
          Agrega la primera tarea desde el formulario.
        </p>
      </div>
    `;

    actualizarResumen();
    return;
  }

  listaTareas.innerHTML = tareas
    .map(
      ({
        id,
        descripcion: descripcionTarea,
        estado,
        fechaCreacion,
        fechaLimite: limite
      }) => {
        const descripcionSegura =
          escaparHTML(descripcionTarea);

        const textoEstado =
          estado === "completada"
            ? "Completada"
            : "Pendiente";

        const claseEstado =
          estado === "completada"
            ? "text-bg-success"
            : "text-bg-warning";

        const textoBotonEstado =
          estado === "completada"
            ? "Marcar pendiente"
            : "Completar";

        return `
          <article
            class="tarea tarea--${estado} border rounded-3 p-3 mb-3 bg-white"
          >
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
              <div class="flex-grow-1">
                <div class="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3">
                  <h3 class="tarea__titulo h5 mb-0">
                    ${descripcionSegura}
                  </h3>

                  <span class="badge ${claseEstado}">
                    ${textoEstado}
                  </span>
                </div>

                <dl class="row small mb-0">
                  <dt class="col-sm-4 text-body-secondary">Creada</dt>
                  <dd class="col-sm-8">
                    ${formatearFechaCreacion(fechaCreacion)}
                  </dd>

                  <dt class="col-sm-4 text-body-secondary">Fecha límite</dt>
                  <dd class="col-sm-8">
                    ${limite || "Sin fecha límite"}
                  </dd>

                  <dt class="col-sm-4 text-body-secondary">Tiempo restante</dt>
                  <dd
                    class="col-sm-8 contador-regresivo fw-semibold"
                    data-fecha-limite="${limite || ""}"
                  >
                    Se calculará en el paso de asincronía
                  </dd>
                </dl>
              </div>

              <div class="d-flex flex-md-column flex-wrap gap-2 align-self-md-start">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-success"
                  data-accion="estado"
                  data-id="${id}"
                >
                  ${textoBotonEstado}
                </button>

                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary"
                  data-accion="editar"
                  data-id="${id}"
                >
                  Editar
                </button>

                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  data-accion="eliminar"
                  data-id="${id}"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        `;
      }
    )
    .join("");

  actualizarResumen();
};

formulario.addEventListener(
  "submit",
  (evento) => {
    evento.preventDefault();

    mensajeError.textContent = "";

    const descripcionValor =
      descripcion.value.trim();

    const fechaLimiteValor =
      fechaLimite.value || null;

    if (descripcionValor === "") {
      mensajeError.textContent =
        "La descripción no puede quedar vacía.";
      return;
    }

    const nuevaTarea = new Tarea(
      Date.now(),
      descripcionValor,
      "pendiente",
      new Date().toISOString(),
      fechaLimiteValor
    );

    gestor.agregarTarea(nuevaTarea);
    renderizarTareas();

    formulario.reset();
    contadorCaracteres.textContent = "0";
  }
);
listaTareas.addEventListener(
  "click",
  (evento) => {
    const boton = evento.target.closest(
      "button[data-accion]"
    );

    if (!boton) {
      return;
    }

    const {
      accion,
      id
    } = boton.dataset;

    mensajeError.textContent = "";

    if (accion === "estado") {
      gestor.cambiarEstado(id);
      renderizarTareas();
      return;
    }

    if (accion === "editar") {
      const tarea =
        gestor.buscarTareaPorId(id);

      if (!tarea) {
        return;
      }

      const nuevaDescripcion = prompt(
        "Edita la descripción:",
        tarea.descripcion
      );

      if (nuevaDescripcion === null) {
        return;
      }

      const descripcionEditada =
        nuevaDescripcion.trim();

      if (descripcionEditada === "") {
        mensajeError.textContent =
          "La descripción no puede quedar vacía.";
        return;
      }

      if (descripcionEditada.length > 100) {
        mensajeError.textContent =
          "La descripción no puede superar 100 caracteres.";
        return;
      }

      gestor.editarTarea(
        id,
        descripcionEditada
      );

      renderizarTareas();
      return;
    }

    if (accion === "eliminar") {
      gestor.eliminarTarea(id);
      renderizarTareas();
    }
  }
);
descripcion.addEventListener(
  "keyup",
  () => {
    contadorCaracteres.textContent =
      String(descripcion.value.length);
  }
);

listaTareas.addEventListener(
  "mouseover",
  (evento) => {
    const tarjeta =
      evento.target.closest(".tarea");

    if (!tarjeta) {
      return;
    }

    if (
      tarjeta.contains(
        evento.relatedTarget
      )
    ) {
      return;
    }

    tarjeta.classList.add(
      "tarea--resaltada"
    );
  }
);

listaTareas.addEventListener(
  "mouseout",
  (evento) => {
    const tarjeta =
      evento.target.closest(".tarea");

    if (!tarjeta) {
      return;
    }

    if (
      tarjeta.contains(
        evento.relatedTarget
      )
    ) {
      return;
    }

    tarjeta.classList.remove(
      "tarea--resaltada"
    );
  }
);