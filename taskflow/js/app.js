/*
 * app.js
 * Archivo principal que conecta la lógica de negocio, DOM, eventos, asincronía y APIs.
 */
const gestor = new GestorTareas();

// Referencias del DOM
const formulario = document.querySelector("#formTarea");
const descripcion = document.querySelector("#descripcion");
const fechaLimite = document.querySelector("#fechaLimite");
const contadorCaracteres = document.querySelector("#contadorCaracteres");
const estadoProceso = document.querySelector("#estadoProceso");
const btnAgregar = document.querySelector("#btnAgregar");
const btnCargarApi = document.querySelector("#btnCargarApi");
const listaTareas = document.querySelector("#listaTareas");
const mensajeError = document.querySelector("#mensajeError");
const notificacion = document.querySelector("#notificacion");
const totalTareas = document.querySelector("#totalTareas");
const totalPendientes = document.querySelector("#totalPendientes");
const totalCompletadas = document.querySelector("#totalCompletadas");

// Funciones auxiliares y asíncronas
const esperar = (milisegundos) =>
  new Promise((resolver) => {
    setTimeout(resolver, milisegundos);
  });

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

const mostrarNotificacion = (mensaje) => {
  setTimeout(() => {
    notificacion.textContent = mensaje;
    notificacion.hidden = false;

    setTimeout(() => {
      notificacion.hidden = true;
      notificacion.textContent = "";
    }, 2500);
  }, 2000);
};

const calcularTiempoRestante = (fecha) => {
  if (!fecha) {
    return "Sin fecha límite";
  }

  const ahora = new Date();
  const limite = new Date(`${fecha}T23:59:59`);

  if (Number.isNaN(limite.getTime())) {
    return "Fecha no válida";
  }

  const diferencia = limite.getTime() - ahora.getTime();

  if (diferencia <= 0) {
    return "Vencida";
  }

  const segundosTotales = Math.floor(diferencia / 1000);
  const dias = Math.floor(segundosTotales / 86400);
  const horas = Math.floor((segundosTotales % 86400) / 3600);
  const minutos = Math.floor((segundosTotales % 3600) / 60);
  const segundos = segundosTotales % 60;

  return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
};

const actualizarResumen = () => {
  const tareas = gestor.obtenerTareas();
  const pendientes = gestor.obtenerTareas("pendiente").length;
  const completadas = gestor.obtenerTareas("completada").length;

  totalTareas.textContent = String(tareas.length);
  totalPendientes.textContent = String(pendientes);
  totalCompletadas.textContent = String(completadas);
};

const actualizarContadoresRegresivos = () => {
  const contadores = document.querySelectorAll(".contador-regresivo");
  contadores.forEach((contador) => {
    const fecha = contador.dataset.fechaLimite;
    contador.textContent = calcularTiempoRestante(fecha);
  });
};

// Renderizado dinámico de la interfaz
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
        const descripcionSegura = escaparHTML(descripcionTarea);
        const textoEstado = estado === "completada" ? "Completada" : "Pendiente";
        const claseEstado = estado === "completada" ? "text-bg-success" : "text-bg-warning";
        const textoBotonEstado = estado === "completada" ? "Marcar pendiente" : "Completar";

        return `
          <article class="tarea tarea--${estado} border rounded-3 p-3 mb-3 bg-white">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
              <div class="flex-grow-1">
                <div class="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3">
                  <h3 class="tarea__titulo h5 mb-0">${descripcionSegura}</h3>
                  <span class="badge ${claseEstado}">${textoEstado}</span>
                </div>

                <dl class="row small mb-0">
                  <dt class="col-sm-4 text-body-secondary">Creada</dt>
                  <dd class="col-sm-8">${formatearFechaCreacion(fechaCreacion)}</dd>

                  <dt class="col-sm-4 text-body-secondary">Fecha límite</dt>
                  <dd class="col-sm-8">${limite || "Sin fecha límite"}</dd>

                  <dt class="col-sm-4 text-body-secondary">Tiempo restante</dt>
                  <dd class="col-sm-8 contador-regresivo fw-semibold" data-fecha-limite="${limite || ""}">
                    ${calcularTiempoRestante(limite)}
                  </dd>
                </dl>
              </div>

              <div class="d-flex flex-md-column flex-wrap gap-2 align-self-md-start">
                <button type="button" class="btn btn-sm btn-outline-success" data-accion="estado" data-id="${id}">
                  ${textoBotonEstado}
                </button>
                <button type="button" class="btn btn-sm btn-outline-primary" data-accion="editar" data-id="${id}">
                  Editar
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" data-accion="eliminar" data-id="${id}">
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

const actualizarAplicacion = () => {
  guardarTareas(gestor.obtenerTareas());
  renderizarTareas();
};

// Evento Submit: Crear tarea de forma asíncrona
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (btnAgregar.disabled) {
    return;
  }

  mensajeError.textContent = "";
  const descripcionValor = descripcion.value.trim();
  const fechaLimiteValor = fechaLimite.value || null;

  if (descripcionValor === "") {
    mensajeError.textContent = "La descripción no puede quedar vacía.";
    return;
  }

  estadoProceso.textContent = "Agregando tarea...";
  btnAgregar.disabled = true;

  await esperar(700);

  const nuevaTarea = new Tarea(
    Date.now(),
    descripcionValor,
    "pendiente",
    new Date().toISOString(),
    fechaLimiteValor
  );

  gestor.agregarTarea(nuevaTarea);
  actualizarAplicacion();

  formulario.reset();
  contadorCaracteres.textContent = "0";
  estadoProceso.textContent = "";
  btnAgregar.disabled = false;

  mostrarNotificacion("La tarea fue agregada a TaskFlow.");

  try {
    await guardarTareaApi(nuevaTarea);
  } catch (error) {
    mensajeError.textContent = "La tarea quedó guardada localmente, pero no pudo enviarse a la API.";
  }
});

// Evento Click: Delegación de eventos para editar, cambiar estado y eliminar
listaTareas.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) {
    return;
  }

  const { accion, id } = boton.dataset;
  mensajeError.textContent = "";

  if (accion === "estado") {
    gestor.cambiarEstado(id);
    actualizarAplicacion();
    return;
  }

  if (accion === "editar") {
    const tarea = gestor.buscarTareaPorId(id);
    if (!tarea) {
      return;
    }

    const nuevaDescripcion = prompt("Edita la descripción:", tarea.descripcion);
    if (nuevaDescripcion === null) {
      return;
    }

    const descripcionEditada = nuevaDescripcion.trim();
    if (descripcionEditada === "") {
      mensajeError.textContent = "La descripción no puede quedar vacía.";
      return;
    }

    if (descripcionEditada.length > 100) {
      mensajeError.textContent = "La descripción no puede superar 100 caracteres.";
      return;
    }

    gestor.editarTarea(id, descripcionEditada);
    actualizarAplicacion();
    return;
  }

  if (accion === "eliminar") {
    gestor.eliminarTarea(id);
    actualizarAplicacion();
  }
});

// Evento Keyup: Actualizar contador de caracteres en tiempo real
descripcion.addEventListener("keyup", () => {
  contadorCaracteres.textContent = String(descripcion.value.length);
});

// Eventos Mouseover / Mouseout: Efecto visual al pasar el cursor
listaTareas.addEventListener("mouseover", (evento) => {
  const tarjeta = evento.target.closest(".tarea");
  if (!tarjeta || tarjeta.contains(evento.relatedTarget)) {
    return;
  }
  tarjeta.classList.add("tarea--resaltada");
});

listaTareas.addEventListener("mouseout", (evento) => {
  const tarjeta = evento.target.closest(".tarea");
  if (!tarjeta || tarjeta.contains(evento.relatedTarget)) {
    return;
  }
  tarjeta.classList.remove("tarea--resaltada");
});

// Consumo de API externa (GET)
btnCargarApi.addEventListener("click", async () => {
  mensajeError.textContent = "";
  btnCargarApi.disabled = true;
  btnCargarApi.textContent = "Cargando...";

  try {
    const datos = await obtenerTareasApi();
    let cantidadNuevas = 0;

    datos.forEach(({ id, title, completed }) => {
      const idLocal = `api-${id}`;
      if (gestor.buscarTareaPorId(idLocal)) {
        return;
      }

      const tarea = new Tarea(
        idLocal,
        title,
        completed ? "completada" : "pendiente",
        new Date().toISOString(),
        null
      );

      gestor.agregarTarea(tarea);
      cantidadNuevas += 1;
    });

    actualizarAplicacion();

    let mensajeImportacion = "No se agregaron tareas nuevas.";
    if (cantidadNuevas === 1) {
      mensajeImportacion = "1 tarea nueva importada.";
    } else if (cantidadNuevas > 1) {
      mensajeImportacion = `${cantidadNuevas} tareas nuevas importadas.`;
    }

    mostrarNotificacion(mensajeImportacion);
  } catch (error) {
    mensajeError.textContent = "No fue posible obtener las tareas de la API.";
  } finally {
    btnCargarApi.disabled = false;
    btnCargarApi.textContent = "Obtener tareas API";
  }
});

// Intervalo para actualizar la cuenta regresiva de forma periódica cada segundo
setInterval(actualizarContadoresRegresivos, 1000);

// Inicialización al cargar la página
const iniciarAplicacion = () => {
  const tareasGuardadas = cargarTareas();
  gestor.cargarTareas(tareasGuardadas);
  renderizarTareas();
};

iniciarAplicacion();