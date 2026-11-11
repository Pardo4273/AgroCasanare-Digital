# AgroCimarrudos: historias de usuario y requisitos mínimos

Borrador de trabajo. Todas las historias están en estado **Pendiente** porque todavía no se ha construido nada. El estado se irá actualizando a medida que cada función quede probada.

Autor: Juan David Vargas Bello. Asignatura: Lenguaje de programación III.

## 1. Usuarios

| Rol | Quién es | Qué puede hacer |
| --- | --- | --- |
| Visitante | Quien entra sin cuenta | Ver la pantalla de bienvenida, registrarse, iniciar sesión, recuperar contraseña |
| Cliente | Persona o negocio con cuenta | Ver el catálogo, armar y confirmar pedidos, ver su historial |
| Administrador | Dueño o encargado de la finca | Gestionar productos y pedidos |

Supuesto a confirmar: el catálogo solo se ve con sesión iniciada, como se dijo en la sección 3.1 (el visitante solo ve la bienvenida). Si se prefiere un catálogo público, solo cambian los criterios de HU-07.

## 2. Historias de usuario

### Acceso a la plataforma

| Código | Nombre | Historia de usuario | Criterios de aceptación | Estado |
| --- | --- | --- | --- | --- |
| HU-01 | Registro de cuenta | Como visitante, quiero registrarme con mi nombre, correo y contraseña, para poder hacer pedidos. | 1. El formulario pide nombre, correo, contraseña y confirmación de contraseña.<br>2. Si falta un campo o el correo tiene formato inválido, se muestra un mensaje y no se guarda nada.<br>3. La contraseña debe tener mínimo 8 caracteres, con al menos una letra y un número.<br>4. Si el correo ya está registrado, se informa que la cuenta ya existe y no se crea otra.<br>5. Con datos válidos, el usuario queda guardado en la tabla `usuarios`, con la contraseña en hash y rol cliente.<br>6. Se muestra un mensaje de éxito y se lleva al inicio de sesión. | Pendiente |
| HU-02 | Inicio de sesión | Como usuario registrado, quiero iniciar sesión con mi correo y contraseña, para acceder a las funciones privadas. | 1. Las credenciales se validan contra los datos guardados en la base de datos.<br>2. Si son correctas, se abre la sesión: el cliente va al catálogo y el administrador a su panel.<br>3. Si son incorrectas, se muestra "Correo o contraseña incorrectos", sin decir cuál de los dos falló.<br>4. Si algún campo está vacío, se avisa antes de consultar la base de datos. | Pendiente |
| HU-03 | Cierre de sesión | Como usuario, quiero cerrar sesión, para proteger mi cuenta. | 1. La opción "Cerrar sesión" aparece en el menú mientras hay sesión.<br>2. Al usarla, la sesión se destruye y se vuelve a la pantalla de bienvenida.<br>3. Después de cerrar sesión, entrar por URL a una página privada pide iniciar sesión. | Pendiente |
| HU-04 | Solicitud de recuperación (simulada) | Como usuario que olvidó su contraseña, quiero solicitar su recuperación, para poder establecer una nueva. | 1. El formulario pide el correo y valida que no esté vacío y tenga formato correcto.<br>2. Siempre se muestra el mismo mensaje: "Si la cuenta existe, se ha enviado un mensaje de recuperación a tu correo". Existan o no la cuenta.<br>3. No se envía ningún correo real.<br>4. Si la cuenta existe, se genera un código de recuperación con vencimiento y se guarda en la base de datos.<br>5. En modo demostración, una caja marcada como "Simulación" muestra el código y el enlace que habría llegado por correo. | Pendiente |
| HU-05 | Restablecer contraseña | Como usuario que pidió la recuperación, quiero usar el código de demostración para definir una contraseña nueva. | 1. La pantalla de restablecimiento abre solo con un código válido y vigente.<br>2. Un código inválido, vencido o ya usado se rechaza con un mensaje claro.<br>3. La nueva contraseña cumple las mismas reglas del registro y la confirmación coincide.<br>4. La nueva contraseña se guarda en hash en la base de datos y el código queda invalidado.<br>5. Después del cambio, el usuario inicia sesión con la nueva contraseña y la anterior ya no funciona. | Pendiente |
| HU-06 | Protección de secciones privadas | Como dueño de la finca, quiero que las secciones privadas solo abran con una sesión válida, para que nadie ajeno vea pedidos ni datos de otros. | 1. Sin sesión, cualquier página privada redirige al inicio de sesión con un aviso.<br>2. Un cliente que escribe la URL del panel de administración recibe acceso denegado.<br>3. Un cliente solo puede ver sus propios pedidos. | Pendiente |

### Funciones del cliente

| Código | Nombre | Historia de usuario | Criterios de aceptación | Estado |
| --- | --- | --- | --- | --- |
| HU-07 | Consultar catálogo | Como cliente, quiero ver los productos disponibles con su precio y unidad de venta, para saber qué puedo pedir. | 1. La lista se carga desde la base de datos.<br>2. Cada producto muestra nombre, foto, precio, unidad de venta y existencias.<br>3. Los productos desactivados no aparecen.<br>4. Un producto sin existencias se marca "Agotado" y no se puede agregar al pedido. | Pendiente |
| HU-08 | Buscar y filtrar productos | Como cliente, quiero buscar por nombre y filtrar por categoría, para encontrar rápido lo que necesito. | 1. La búsqueda por nombre devuelve los productos que coinciden.<br>2. El filtro por categoría muestra solo esa categoría.<br>3. Si no hay resultados, se muestra un mensaje y la opción de limpiar la búsqueda.<br>4. La consulta a la base de datos es parametrizada. | Pendiente |
| HU-09 | Ver detalle de producto | Como cliente, quiero abrir un producto, para ver su descripción antes de pedirlo. | 1. El detalle muestra descripción, precio, unidad y existencias.<br>2. Si el producto no existe, se muestra un mensaje en lugar de un error técnico. | Pendiente |
| HU-10 | Armar el pedido | Como cliente, quiero agregar productos con su cantidad a un pedido, para comprar varias cosas juntas. | 1. Se pueden agregar productos, cambiar la cantidad y quitarlos.<br>2. No se permite una cantidad mayor a las existencias ni menor a 1.<br>3. El total se calcula y se actualiza con cada cambio. | Pendiente |
| HU-11 | Confirmar pedido | Como cliente, quiero confirmar mi pedido, para que la finca lo reciba. | 1. Al confirmar, se guarda el pedido y sus productos en la base de datos, con el precio del momento.<br>2. Las existencias de cada producto se descuentan.<br>3. El estado inicial es "pendiente".<br>4. Se muestra un mensaje con el número del pedido.<br>5. Un pedido sin productos no se puede confirmar. | Pendiente |
| HU-12 | Historial de pedidos | Como cliente, quiero ver mis pedidos anteriores, para saber qué pedí y en qué estado va cada uno. | 1. La lista muestra fecha, total y estado de cada pedido.<br>2. Al abrir un pedido se ven sus productos y cantidades.<br>3. Solo aparecen los pedidos del cliente con sesión iniciada. | Pendiente |

### Funciones del administrador

| Código | Nombre | Historia de usuario | Criterios de aceptación | Estado |
| --- | --- | --- | --- | --- |
| HU-13 | Crear producto | Como administrador, quiero registrar un producto nuevo, para ofrecerlo en el catálogo. | 1. El formulario pide nombre, categoría, precio, unidad, existencias y descripción. La foto es opcional.<br>2. El precio debe ser mayor a 0 y las existencias no pueden ser negativas.<br>3. El producto se guarda en la base de datos y aparece en el catálogo.<br>4. Si falta un dato obligatorio, se muestra un mensaje y no se guarda. | Pendiente |
| HU-14 | Editar producto | Como administrador, quiero cambiar el precio, las existencias o la disponibilidad de un producto, para mantener el catálogo al día. | 1. Los cambios se guardan en la base de datos y se ven de inmediato en el catálogo.<br>2. Las mismas validaciones de HU-13 aplican al editar.<br>3. Los pedidos anteriores conservan el precio con el que se hicieron. | Pendiente |
| HU-15 | Eliminar producto | Como administrador, quiero eliminar un producto que ya no vendo, para que no aparezca en el catálogo. | 1. Antes de eliminar, se pide confirmación.<br>2. Si el producto nunca se pidió, se elimina de la base de datos.<br>3. Si ya tiene pedidos, se desactiva en lugar de borrarse y se avisa al administrador. | Pendiente |
| HU-16 | Ver pedidos recibidos | Como administrador, quiero ver los pedidos de los clientes, para saber qué debo preparar. | 1. La lista muestra cliente, fecha, total y estado.<br>2. Se puede filtrar por estado.<br>3. Al abrir un pedido se ven sus productos y cantidades. | Pendiente |
| HU-17 | Cambiar estado del pedido | Como administrador, quiero actualizar el estado de un pedido, para que el cliente sepa en qué va. | 1. Los estados son pendiente, confirmado, entregado y cancelado.<br>2. El cambio se guarda en la base de datos y el cliente lo ve en su historial.<br>3. Al cancelar un pedido, las existencias de sus productos se devuelven. | Pendiente |

## 3. Requisitos mínimos

### Los que pide la guía

| Requisito | Dónde se cubre |
| --- | --- |
| Registro con validación, datos guardados en la base de datos y sin duplicados | HU-01 |
| Inicio de sesión validado contra la base de datos, con mensaje si falla | HU-02 |
| Cierre de sesión | HU-03 |
| "Olvidé mi contraseña" simulado, sin correo real, con confirmación y paso siguiente | HU-04 |
| Nueva contraseña validada y guardada en la base de datos | HU-05 |
| Secciones privadas solo para usuarios autenticados | HU-06 |
| Funciones propias de la temática, conectadas a la base de datos | HU-07 a HU-17 |

### Seguridad (sección 4 de la guía)

- Contraseñas guardadas con hash, nunca en texto plano. Se usará `generate_password_hash` y `check_password_hash` de Werkzeug, que ya viene con Flask.
- Consultas SQL parametrizadas en todo el acceso a MySQL. Nada de armar consultas pegando texto del usuario.
- Validación en el formulario y también en el servidor.
- Mensajes de error genéricos: sin contraseñas, sin consultas SQL, sin detalles internos.
- Credenciales de conexión fuera del código, en un archivo de configuración. En la entrega va solo una versión de ejemplo sin datos reales.

### Una nota para la sustentación

La simulación de HU-04 muestra el código en pantalla solo en modo demostración, y solo si la cuenta existe. En un sistema real eso revelaría qué correos tienen cuenta, así que en producción se enviaría por correo y la pantalla no mostraría nada. Hay que saber explicarlo.

## 4. Fuera del alcance

- Pagos en línea.
- Envío de correos reales.
- Cálculo de envíos o rutas de entrega.
- Aplicación móvil. El sitio sí debe verse bien en celular.

## 5. Pendientes por definir

- Si los pedidos incluyen datos de entrega o recogida en la finca.
- Lista real de productos y categorías de la finca.
- Si el catálogo es público o solo con sesión (ver sección 1).
