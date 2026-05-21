/* ==============================================
   AgroCasanare Digital - script.js
   Parcial Práctico - Programación II
   Corporación Universitaria Remington - Yopal
   Estudiante: David Vargas
   ============================================== */

/* -----------------------------------------------
   CONSTANTES Y CONFIGURACIÓN GLOBAL
   ----------------------------------------------- */

/** IVA aplicado en Colombia: 19% */
const IVA_PORCENTAJE = 0.19;

/** Tiempo en ms para ocultar el mensaje de bienvenida (5 segundos) */
const TIEMPO_BIENVENIDA_MS = 5000;

/* -----------------------------------------------
   1. AÑO DINÁMICO EN EL PIE DE PÁGINA
   Usa la fecha actual del sistema para mostrar
   el año correcto sin necesidad de actualizaciones manuales.
   ----------------------------------------------- */

/**
 * Actualiza el elemento #anioActual con el año en curso.
 * Se llama al cargar la página.
 */
function mostrarAnioActual() {
  const elementoAnio = document.getElementById("anioActual");
  if (elementoAnio) {
    const anioHoy = new Date().getFullYear();
    elementoAnio.textContent = anioHoy;
  }
}

/* -----------------------------------------------
   2. MENSAJE DE BIENVENIDA
   Muestra un mensaje personalizado durante 5 segundos
   al cargar la página. El usuario también puede cerrarlo.
   ----------------------------------------------- */

/**
 * Inicializa el mensaje de bienvenida:
 * - Lo muestra al cargar la página.
 * - Lo oculta automáticamente tras TIEMPO_BIENVENIDA_MS.
 * - Permite cerrarlo manualmente con el botón ×.
 */
function inicializarBienvenida() {
  const divBienvenida = document.getElementById("bienvenida");
  const botonCerrar   = document.getElementById("cerrarBienvenida");

  if (!divBienvenida) return;

  // Función auxiliar que agrega la clase de ocultado y elimina el elemento
  const ocultarBienvenida = () => {
    divBienvenida.classList.add("ocultar");
    // Esperar a que termine la animación antes de eliminar del DOM
    divBienvenida.addEventListener(
      "animationend",
      () => divBienvenida.remove(),
      { once: true }
    );
  };

  // Ocultar automáticamente después de 5 segundos
  const temporizadorBienvenida = setTimeout(ocultarBienvenida, TIEMPO_BIENVENIDA_MS);

  // El botón × también puede cerrar el mensaje antes del tiempo
  if (botonCerrar) {
    botonCerrar.addEventListener("click", () => {
      clearTimeout(temporizadorBienvenida); // cancelar el temporizador automático
      ocultarBienvenida();
    });
  }
}

/* -----------------------------------------------
   3. MENÚ HAMBURGUESA (toggle en móvil)
   Agrega o elimina la clase 'activo' en el nav
   usando classList.toggle al pulsar el botón.
   ----------------------------------------------- */

/**
 * Inicializa el comportamiento del menú hamburguesa:
 * - Muestra/oculta la navegación en vista móvil.
 * - Actualiza el atributo aria-expanded para accesibilidad.
 * - Cierra el menú al hacer clic en un enlace interno.
 */
function inicializarMenuHamburguesa() {
  const botonHamburguesa = document.getElementById("botonHamburguesa");
  const menuNavegacion   = document.getElementById("menuNavegacion");

  if (!botonHamburguesa || !menuNavegacion) return;

  // Alternar visibilidad del menú al pulsar el botón hamburguesa
  botonHamburguesa.addEventListener("click", () => {
    // classList.toggle agrega la clase si no existe, o la elimina si ya está
    const estaAbierto = menuNavegacion.classList.toggle("activo");
    botonHamburguesa.classList.toggle("activo", estaAbierto);
    botonHamburguesa.setAttribute("aria-expanded", estaAbierto.toString());
    botonHamburguesa.setAttribute(
      "aria-label",
      estaAbierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
  });

  // Cerrar el menú al hacer clic en cualquier enlace de navegación interno
  const enlacesNav = menuNavegacion.querySelectorAll(".navegacion__enlace");
  enlacesNav.forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menuNavegacion.classList.remove("activo");
      botonHamburguesa.classList.remove("activo");
      botonHamburguesa.setAttribute("aria-expanded", "false");
      botonHamburguesa.setAttribute("aria-label", "Abrir menú de navegación");
    });
  });
}

/* -----------------------------------------------
   4. COTIZADOR DE PRODUCTOS
   Valida el formulario, calcula subtotal + IVA
   y muestra el resumen del pedido.
   ----------------------------------------------- */

/**
 * Formatea un número como precio en pesos colombianos.
 * Ejemplo: 125000 → "$ 125.000"
 * @param {number} valor - Número entero a formatear
 * @returns {string} Precio formateado con separador de miles
 */
function formatearPrecio(valor) {
  return "$ " + valor.toLocaleString("es-CO");
}

/**
 * Limpia el estado visual de error de un campo.
 * @param {HTMLElement} campoEntrada - El input o select
 * @param {HTMLElement} spanError   - El span donde se muestra el error
 */
function limpiarError(campoEntrada, spanError) {
  campoEntrada.classList.remove("error");
  spanError.textContent = "";
}

/**
 * Muestra un mensaje de error en un campo del formulario.
 * @param {HTMLElement} campoEntrada - El input o select con error
 * @param {HTMLElement} spanError   - El span donde se muestra el error
 * @param {string}      mensaje     - Texto del mensaje de error
 */
function mostrarError(campoEntrada, spanError, mensaje) {
  campoEntrada.classList.add("error");
  spanError.textContent = mensaje;
}

/**
 * Valida todos los campos del formulario de cotización.
 * No utiliza alert(); los errores se muestran en pantalla.
 * @returns {boolean} true si el formulario es válido, false si hay errores
 */
function validarFormulario() {
  // Obtener referencias a los campos
  const inputNombre    = document.getElementById("nombreCliente");
  const selectProducto = document.getElementById("productoSeleccionado");
  const inputCantidad  = document.getElementById("cantidadPedido");

  const spanErrorNombre   = document.getElementById("errorNombre");
  const spanErrorProducto = document.getElementById("errorProducto");
  const spanErrorCantidad = document.getElementById("errorCantidad");

  let formularioValido = true;

  // --- Validar nombre: no puede estar vacío ---
  const nombreIngresado = inputNombre.value.trim();
  if (nombreIngresado === "") {
    mostrarError(inputNombre, spanErrorNombre, "Por favor, ingresa tu nombre completo.");
    formularioValido = false;
  } else {
    limpiarError(inputNombre, spanErrorNombre);
  }

  // --- Validar producto: debe seleccionarse uno ---
  const productoSeleccionado = selectProducto.value;
  if (productoSeleccionado === "") {
    mostrarError(selectProducto, spanErrorProducto, "Por favor, selecciona un producto del catálogo.");
    formularioValido = false;
  } else {
    limpiarError(selectProducto, spanErrorProducto);
  }

  // --- Validar cantidad: entero mayor a cero ---
  const cantidadIngresada = parseInt(inputCantidad.value, 10);
  if (
    isNaN(cantidadIngresada)    ||
    cantidadIngresada <= 0      ||
    !Number.isInteger(cantidadIngresada)
  ) {
    mostrarError(inputCantidad, spanErrorCantidad, "La cantidad debe ser un número entero mayor a cero.");
    formularioValido = false;
  } else {
    limpiarError(inputCantidad, spanErrorCantidad);
  }

  return formularioValido;
}

/**
 * Calcula el total del pedido con IVA y muestra el resumen
 * dentro del div #resultado.
 * Subtotal = precio × cantidad
 * Total    = subtotal + (subtotal × IVA_PORCENTAJE)
 */
function calcularPedido() {
  // Primero validar; si hay errores, no continuar
  const formularioEsValido = validarFormulario();
  if (!formularioEsValido) return;

  // Leer valores del formulario
  const nombreCliente      = document.getElementById("nombreCliente").value.trim();
  const valorProducto      = document.getElementById("productoSeleccionado").value;
  const cantidad           = parseInt(document.getElementById("cantidadPedido").value, 10);

  // Separar nombre del producto y precio unitario
  // El value del option tiene el formato "NombreProducto|precio"
  const partes             = valorProducto.split("|");
  const nombreProducto     = partes[0];
  const precioUnitario     = parseInt(partes[1], 10);

  // Cálculos
  const subtotal           = precioUnitario * cantidad;
  const montoIva           = Math.round(subtotal * IVA_PORCENTAJE);
  const totalConIva        = subtotal + montoIva;

  // Construir HTML del resumen del pedido
  const htmlResumen = `
    <div class="resultado__fila">
      <span class="resultado__etiqueta">Cliente</span>
      <span class="resultado__valor">${nombreCliente}</span>
    </div>
    <div class="resultado__fila">
      <span class="resultado__etiqueta">Producto</span>
      <span class="resultado__valor">${nombreProducto}</span>
    </div>
    <div class="resultado__fila">
      <span class="resultado__etiqueta">Cantidad</span>
      <span class="resultado__valor">${cantidad} kg/litros</span>
    </div>
    <div class="resultado__fila">
      <span class="resultado__etiqueta">Precio unitario</span>
      <span class="resultado__valor">${formatearPrecio(precioUnitario)}</span>
    </div>
    <div class="resultado__fila">
      <span class="resultado__etiqueta">Subtotal</span>
      <span class="resultado__valor">${formatearPrecio(subtotal)}</span>
    </div>
    <div class="resultado__fila">
      <span class="resultado__etiqueta">IVA (19 %)</span>
      <span class="resultado__valor">${formatearPrecio(montoIva)}</span>
    </div>
    <div class="resultado__fila resultado__fila--total">
      <span class="resultado__etiqueta">TOTAL A PAGAR</span>
      <span class="resultado__valor">${formatearPrecio(totalConIva)}</span>
    </div>
  `;

  // Insertar el resumen en el DOM
  const divResultado        = document.getElementById("resultado");
  const divContenidoResult  = document.getElementById("contenidoResultado");

  divContenidoResult.innerHTML = htmlResumen;

  // Mostrar el bloque de resultado (estaba oculto con `hidden`)
  divResultado.removeAttribute("hidden");

  // Desplazar suavemente hasta el resultado para que el usuario lo vea
  divResultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Inicializa el cotizador: asocia el evento click al botón "Calcular pedido".
 */
function inicializarCotizador() {
  const botonCalcular = document.getElementById("botonCalcular");
  if (botonCalcular) {
    botonCalcular.addEventListener("click", calcularPedido);
  }

  // También permitir calcular al presionar Enter en los campos del formulario
  const camposFormulario = document.querySelectorAll(
    "#formularioCotizador .campo__entrada"
  );
  camposFormulario.forEach((campo) => {
    campo.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        evento.preventDefault();
        calcularPedido();
      }
    });
  });
}

/* -----------------------------------------------
   5. PUNTO DE ENTRADA PRINCIPAL
   Todas las funciones se inicializan aquí al
   cargar el DOM completamente.
   ----------------------------------------------- */

/**
 * Función principal que inicializa todas las funcionalidades
 * del sitio web. Se ejecuta cuando el DOM está listo.
 */
function inicializarSitio() {
  mostrarAnioActual();       // Actualizar año en el footer
  inicializarBienvenida();   // Mostrar mensaje de bienvenida
  inicializarMenuHamburguesa(); // Activar menú hamburgesa
  inicializarCotizador();    // Activar cotizador de productos
}

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", inicializarSitio);
