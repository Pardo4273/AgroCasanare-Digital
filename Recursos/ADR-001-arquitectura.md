# ADR-001: Arquitectura de AgroCimarrudos

**Estado:** Propuesta
**Fecha:** 10 de noviembre de 2026
**Decide:** Juan David Vargas Bello

## Contexto

Proyecto individual de la asignatura Lenguaje de programación III. Debe tener base de datos, registro, inicio y cierre de sesión, recuperación de contraseña simulada y las funciones propias de una tienda de productos del campo llanero. Las tecnologías ya están elegidas: Python con Flask, HTML y CSS, MySQL y Visual Studio Code. La guía obliga a separar `frontend/` y `backend/` dentro de `Codigo/`, y a entregar un script SQL y un LEEME.txt.

Una sola persona lo construye, lo prueba y lo sustenta. Importa más que sea fácil de explicar que que escale.

## Decisión

Aplicación Flask de un solo servicio (monolito), con las pantallas generadas en el servidor con plantillas Jinja. Las plantillas y los archivos estáticos viven en `frontend/`, y Flask se configura para leerlos desde ahí. El backend se divide en módulos pequeños (blueprints): autenticación, catálogo, pedidos y administración.

## Opciones consideradas

### Opción A: Flask con plantillas Jinja (elegida)

| Dimensión | Evaluación |
| --- | --- |
| Complejidad | Baja |
| Costo | Ninguno |
| Escalabilidad | Suficiente para una finca pequeña |
| Familiaridad | Alta, es el stack ya elegido |

**Pros:** un solo proyecto para ejecutar, sesiones de Flask listas para usar, menos piezas que explicar en la sustentación.
**Contras:** el frontend queda acoplado al servidor y cada acción recarga la página.

### Opción B: API REST en Flask y frontend separado en JavaScript

| Dimensión | Evaluación |
| --- | --- |
| Complejidad | Alta |
| Costo | Más tiempo de desarrollo |
| Escalabilidad | Mayor |
| Familiaridad | Media, exige JavaScript del lado del cliente |

**Pros:** separación total de capas.
**Contras:** hay que manejar autenticación entre dos aplicaciones, más superficie de errores y más cosas que explicar. No aporta a lo que la guía evalúa.

## Análisis de las opciones

La opción B resuelve problemas que este proyecto no tiene: un solo tipo de cliente, tráfico mínimo y un único desarrollador. La opción A cubre todos los requisitos de la guía con menos código y menos riesgo.

## Estructura de carpetas

```
PROYECTO_PLATAFORMA/
├── Documentacion/
│   ├── Historias_de_Usuario_y_Requisitos.md
│   └── Documento_Proyecto.pdf            (se hace después)
├── Codigo/
│   ├── frontend/
│   │   ├── templates/                    base.html, inicio.html, auth/, catalogo/, cliente/, admin/
│   │   └── static/                       css/, img/, js/
│   └── backend/
│       ├── app.py                        punto de arranque
│       ├── config.ejemplo.py             configuración de ejemplo, sin credenciales
│       ├── requirements.txt
│       └── agrocimarrudos/
│           ├── __init__.py               crea la app y registra los módulos
│           ├── db.py                     conexión a MySQL y consultas parametrizadas
│           ├── seguridad.py              hash de contraseñas, validaciones, decoradores de acceso
│           ├── auth.py                   registro, login, logout, recuperación
│           ├── catalogo.py               listado, búsqueda y detalle
│           ├── pedidos.py                carrito, confirmación e historial
│           └── admin.py                  gestión de productos y pedidos
├── Base_de_Datos/
│   ├── script_creacion.sql
│   └── datos_prueba.sql
├── Recursos/
│   └── ADR-001-arquitectura.md
└── LEEME.txt
```

Regla de capas: las rutas (`auth.py`, `catalogo.py`, etc.) no escriben SQL. Toda consulta pasa por `db.py`, y toda validación y todo hash por `seguridad.py`. Así la seguridad queda en un solo sitio.

## Tablas previstas

| Tabla | Qué guarda |
| --- | --- |
| `usuarios` | nombre, correo único, hash de contraseña, rol (cliente o administrador), fecha de registro |
| `categorias` | nombre de la categoría |
| `productos` | nombre, descripción, precio, unidad, existencias, foto, activo, categoría |
| `pedidos` | cliente, fecha, total, estado, nota |
| `detalle_pedido` | pedido, producto, cantidad, precio unitario del momento |
| `codigos_recuperacion` | usuario, código, vencimiento, usado |

Relaciones: un usuario tiene muchos pedidos; un pedido tiene muchos productos a través de `detalle_pedido`; un producto pertenece a una categoría; un usuario tiene muchos códigos de recuperación.

## Consecuencias

- Más fácil: ejecutar, probar y demostrar todo desde una sola aplicación.
- Más difícil: si más adelante hiciera falta una app móvil, habría que extraer una API.
- Por revisar: dónde guardar las fotos de los productos (carpeta `static/img` por ahora) y si el rol administrador se crea con un script o desde la base de datos.

## Acciones siguientes

1. [ ] Confirmar la lista de productos y las decisiones pendientes de las historias de usuario.
2. [ ] Escribir `script_creacion.sql` y `datos_prueba.sql`.
3. [ ] Definir el diseño visual con la skill de frontend antes de maquetar.
4. [ ] Construir primero el acceso (HU-01 a HU-06) y después el catálogo y los pedidos.
