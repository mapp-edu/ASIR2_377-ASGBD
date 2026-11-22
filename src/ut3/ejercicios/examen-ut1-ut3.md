---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Examen UT1–UT3"
pageClass: ejercicios-page
---

# 📝 Examen UT1–UT3

Unidades 1 (Implantación de SGBD), 2 (Configuración del SGBD) y 3 (Control de acceso). Resultados de aprendizaje **RA1**, **RA2** y **RA3**.

## Instrucciones

| | |
|---|---|
| **Duración** | 2 horas: orientativamente 20 minutos para la parte A y 100 para la parte B. |
| **Parte A · Cuestionario** | 20 preguntas de respuesta única, 0,2 puntos cada una (**4 puntos**). Cada respuesta errónea resta un tercio del valor de la pregunta (0,067). Las preguntas sin contestar no restan. Sin material. |
| **Parte B · Ejercicio práctico** | 4 ejercicios sobre los servidores Oracle y PostgreSQL del aula (**6 puntos**). Puedes consultar la web del módulo y la documentación oficial de Oracle y PostgreSQL. |
| **Prohibido** | Herramientas de inteligencia artificial, mensajería, correo o cualquier comunicación con otras personas. |
| **Calificación** | Nota = A + B, sobre 10. Cada apartado práctico se califica con la rúbrica del módulo (niveles 0–4). |

::: warning Entrega de la parte B
Un único documento PDF llamado `apellidos_nombre_examen.pdf` con, para **cada apartado**:

1. las sentencias u órdenes ejecutadas, **como texto** (no como captura);
2. la salida obtenida (texto o captura legible);
3. la justificación que se pide en el apartado (lo que está en *cursiva*).

Sin la justificación, un apartado correcto se queda en el nivel 2 (50 %).
:::

## Parte A · Cuestionario (4 puntos)

Marca una sola respuesta por pregunta.

**1.** ¿Qué contiene el diccionario de datos de un SGBD? *(0,2 p · RA1.a)*

- a) Los ficheros de registro (logs) de errores
- b) Metadatos: la descripción de los objetos, usuarios, privilegios y estructura de la base de datos
- c) Las copias de seguridad
- d) Los datos de las tablas de los usuarios

**2.** ¿Qué limitaciones tiene Oracle Database 23ai Free? *(0,2 p · RA1.b)*

- a) No admite PL/SQL ni vistas
- b) Un único usuario conectado a la vez
- c) Hasta 2 hilos de CPU, 2 GB de RAM y 12 GB de datos de usuario
- d) Ninguna: es la edición Enterprise sin soporte

**3.** Una pyme quiere montar una tienda en línea con PrestaShop en un servidor LAMP y no quiere pagar licencias. ¿Qué SGBD es el más adecuado? *(0,2 p · RA1.c)*

- a) MariaDB (o MySQL Community)
- b) SQLite
- c) Microsoft SQL Server Standard
- d) Oracle Database Enterprise Edition

**4.** Al instalar en Ubuntu 24.04 un software de Oracle aparece el error «libaio.so.1: cannot open shared object file». ¿Cuál es la solución? *(0,2 p · RA1.i)*

- a) Desactivar SELinux
- b) Instalar el paquete libaio1t64 y crear el enlace libaio.so.1 que apunte a libaio.so.1t64
- c) Ampliar la memoria de intercambio (swap)
- d) Reinstalar el paquete glibc

**5.** El instalador de Oracle en Windows se cierra sin mostrar ningún mensaje. ¿Dónde hay que buscar primero la causa? *(0,2 p · RA1.h)*

- a) En el alert log de la base de datos
- b) En los registros del inventario de Oracle (por ejemplo, C:\Program Files\Oracle\Inventory\logs) y en la carpeta temporal del instalador
- c) En el fichero tnsnames.ora
- d) En el Visor de eventos, en Seguridad

**6.** ¿Qué hace SHUTDOWN IMMEDIATE en Oracle? *(0,2 p · RA2.a)*

- a) No admite conexiones nuevas, deshace las transacciones no confirmadas, desconecta a los usuarios y cierra la base de datos de forma consistente
- b) Espera a que todos los usuarios se desconecten
- c) Para la instancia sin cerrar los ficheros; en el siguiente arranque habrá recuperación
- d) Espera a que terminen las transacciones en curso

**7.** En MySQL/MariaDB, ¿qué motor de almacenamiento se usa por defecto y admite transacciones y claves ajenas? *(0,2 p · RA2.b)*

- a) MyISAM
- b) CSV
- c) MEMORY
- d) InnoDB

**8.** En PostgreSQL se ejecuta `ALTER ROLE postgres CONNECTION LIMIT 1;` ¿Qué efecto tiene? *(0,2 p · RA2.c)*

- a) Bloquea la cuenta postgres
- b) postgres solo podrá tener una conexión a la vez
- c) Limita a una conexión a todos los usuarios
- d) Ninguno: el límite de conexiones no se aplica a los superusuarios

**9.** ¿En qué fichero se configura en qué dirección y puerto escucha el listener de Oracle? *(0,2 p · RA2.e)*

- a) tnsnames.ora
- b) sqlnet.ora
- c) listener.ora
- d) spfileFREE.ora

**10.** ¿Qué parámetro de PostgreSQL cierra las sesiones que llevan un tiempo sin hacer nada y sin ninguna transacción abierta? *(0,2 p · RA2.g)*

- a) tcp_keepalives_idle
- b) idle_in_transaction_session_timeout
- c) idle_session_timeout
- d) statement_timeout

**11.** Conectado como SYSDBA a CDB$ROOT, ejecutas `CREATE USER pepe IDENTIFIED BY "x";` y obtienes ORA-65096. ¿Por qué? *(0,2 p · RA3.c)*

- a) En el contenedor raíz solo se crean usuarios comunes, cuyo nombre debe empezar por C##
- b) La contraseña es demasiado corta
- c) pepe ya existe en alguna PDB
- d) Falta indicar el tablespace por defecto

**12.** En PostgreSQL, ¿a qué equivale `CREATE USER ana;`? *(0,2 p · RA3.c)*

- a) A CREATE ROLE ana LOGIN;
- b) A CREATE SCHEMA ana;
- c) A CREATE ROLE ana SUPERUSER;
- d) A CREATE ROLE ana;

**13.** En Oracle has concedido `UPDATE (telefono) ON clientes` a un usuario. ¿En qué vista lo verá ese usuario? *(0,2 p · RA3.d)*

- a) ROLE_SYS_PRIVS
- b) USER_COL_PRIVS
- c) USER_SYS_PRIVS
- d) USER_TAB_PRIVS

**14.** En PostgreSQL 16, un usuario sin privilegios especiales ejecuta `CREATE TABLE t (x int);` en el esquema public de una base de datos que no es suya. ¿Qué ocurre? *(0,2 p · RA3.f)*

- a) Se crea la tabla, como en todas las versiones
- b) Se crea como tabla temporal
- c) Se crea en su esquema personal
- d) Error de permisos: desde PostgreSQL 15, PUBLIC ya no tiene CREATE en el esquema public

**15.** En Oracle concedes un rol a un usuario que ya está conectado. ¿Cuándo puede usar sus privilegios? *(0,2 p · RA3.e)*

- a) Cuando el DBA ejecute COMMIT
- b) Inmediatamente, en la sesión abierta
- c) En una sesión nueva o después de activarlo con SET ROLE
- d) Después de reiniciar la instancia

**16.** En PostgreSQL, `DROP ROLE ventas;` falla con «role cannot be dropped because some objects depend on it». ¿Qué hay que hacer antes? *(0,2 p · RA3.e)*

- a) Ejecutar DROP ROLE ventas CASCADE;
- b) Reiniciar el servidor
- c) Quitarle el atributo LOGIN
- d) Revocar sus privilegios (REVOKE … FROM ventas o DROP OWNED BY ventas) y reasignar sus objetos si tiene (REASSIGN OWNED)

**17.** En PostgreSQL, ana crea la vista v_resumen sobre su tabla ventas y concede SELECT de la vista a luis, que no tiene permisos sobre ventas. ¿Puede luis consultar la vista? *(0,2 p · RA3.a)*

- a) Solo si la vista es materializada
- b) Sí: por defecto la vista accede a la tabla con los permisos de su propietaria
- c) Solo si ana está conectada
- d) No: necesita SELECT sobre la tabla ventas

**18.** Un usuario de Oracle ejecuta `SELECT * FROM clientes;` sin indicar el esquema. ¿En qué orden busca Oracle el nombre? *(0,2 p · RA3.b)*

- a) Primero un objeto (tabla, vista o sinónimo privado) de su propio esquema y, si no hay, un sinónimo público
- b) Primero los sinónimos públicos y después su esquema
- c) Solo en su esquema
- d) En todos los esquemas por orden alfabético

**19.** Un usuario sin privilegios especiales ejecuta expdp con `TABLESPACES=users`. ¿Qué exporta? *(0,2 p · RA3.h)*

- a) Todas las tablas del tablespace USERS
- b) Todo el esquema, aunque esté en otros tablespaces
- c) Solo las tablas de su propio esquema que están en ese tablespace
- d) Nada: el modo tablespace solo lo pueden usar los DBA

**20.** ¿Qué exigencia del RGPD (artículo 32) está relacionada directamente con hacer copias de seguridad y probar su restauración? *(0,2 p · RA3.h)*

- a) El derecho al olvido
- b) El consentimiento explícito del interesado
- c) El nombramiento de un delegado de protección de datos
- d) La capacidad de restaurar la disponibilidad y el acceso a los datos personales de forma rápida tras un incidente

## Parte B · Ejercicio práctico (6 puntos)

### Datos de conexión

Sustituye **NN** por tu número de cuenta (por ejemplo, `ex07`) en todos los nombres. La clave te la da el profesor.

| | Oracle | PostgreSQL |
|---|---|---|
| Servidor | `10.2.26.84` | `10.2.26.84` |
| Puerto | `1521` | `5432` |
| Servicio / base de datos | `FREEPDB1` | `exNN` |
| Usuario | `exNN` | `exNN` |

::: info Tu cuenta en los servidores
Todo el grupo trabaja a la vez en los mismos servidores, por eso cada persona tiene su propia cuenta con los datos ya cargados.

- **Oracle**: puedes crear usuarios, roles, perfiles y sinónimos públicos, y conceder `CREATE SESSION`, `CREATE TABLE`, `CREATE VIEW` y `CREATE SYNONYM`. No puedes modificar ni borrar usuarios directamente. Si te equivocas, usa el procedimiento del profesor, que solo actúa sobre objetos con tu prefijo:
  `EXEC examadm.gestionar('BORRAR_USUARIO', 'exNN_xxx')`. Las acciones son `BORRAR_USUARIO`, `DESBLOQUEAR`, `BORRAR_PERFIL` y `BORRAR_SINONIMO`. Los roles los puedes borrar tú con `DROP ROLE`.
- **PostgreSQL**: tienes `CREATEROLE` y eres propietario de tu base de datos `exNN`. Solo puedes gestionar los roles que crees tú.
- No puedes cambiar la configuración de los servidores: en el ejercicio 2 las sentencias de cambio **se escriben, no se ejecutan**.
:::

### Escenario

El **Hotel Mirador del Túria** guarda en una base de datos a sus empleados, a sus clientes y las reservas. La misma base de datos está cargada en los dos servidores del aula: en Oracle, en tu esquema `EXNN`; en PostgreSQL, en el esquema `hotel` de tu base de datos `exNN`.

| Tabla | Columnas | Observaciones |
|---|---|---|
| `empleados` | `id_empleado`, `nombre`, `departamento`, `usuario_bd` | `usuario_bd` es el usuario de base de datos de cada empleado (en Oracle, en mayúsculas: `EXNN_COM_SARA`). |
| `clientes` | `id_cliente`, `nombre`, `dni`, `telefono`, `email`, `preferencias`, `tarjeta`, `id_comercial` | `preferencias` puede contener **datos de salud** (alergias, movilidad reducida). `tarjeta` es la tarjeta de pago. `id_comercial` es el empleado comercial que lleva al cliente. |
| `reservas` | `id_reserva`, `id_cliente`, `habitacion`, `entrada`, `salida`, `importe`, `pagada` | `pagada` vale `S`/`N` en Oracle y `true`/`false` en PostgreSQL. |

La política de acceso del hotel es esta:

- **Recepción** consulta los datos básicos de los clientes (nombre, DNI y teléfono) y las reservas sin importes, y lo único que puede cambiar es la **habitación** asignada.
- **Comerciales**: cada comercial ve solo a **sus** clientes (contacto y preferencias) y puede modificar únicamente sus preferencias.
- **Contabilidad** ve las reservas con su importe, ve la tarjeta de pago y marca las reservas como pagadas.
- **Dirección** solo ve estadísticas mensuales agregadas, nunca datos personales.

Recepción y comerciales trabajan con **Oracle**; contabilidad y dirección, con **PostgreSQL**.


### Ejercicio 1. Conexión a los servidores (0,5 p · RA1)

Comprueba que puedes trabajar con los dos SGBD instalados en el servidor del aula.

#### 1.1 Conexión a Oracle · 0,25 p

*Criterios: RA1.j (0,25)*

Conéctate desde tu equipo a la PDB **FREEPDB1** del servidor Oracle con tu usuario `exNN`. Muestra los datos de conexión que has usado y una consulta que muestre: el contenedor al que estás conectado, tu usuario, el nombre de la base de datos contenedora, la versión completa de Oracle y desde cuándo está arrancada la instancia.

*Justifica* qué componente del servidor recibe tu conexión antes de que llegue a la base de datos y en qué puerto escucha.

#### 1.2 Conexión a PostgreSQL · 0,25 p

*Criterios: RA1.j (0,25)*

Conéctate con `psql` (u otro cliente) a tu base de datos `exNN` del servidor PostgreSQL. Muestra la orden de conexión, `\conninfo` y una consulta que muestre la versión, tu usuario, la base de datos, la dirección y el puerto del servidor y la hora de arranque del servidor.

*Justifica* qué fichero del servidor decide si tu conexión se acepta y con qué método de autenticación.

### Ejercicio 2. Configuración de los SGBD (0,5 p · RA2)

Tu usuario no puede cambiar la configuración del servidor. Consulta los valores actuales y **escribe, sin ejecutarlas**, las sentencias que usaría el administrador, indicando cómo y dónde se aplican.

#### 2.1 Parámetros de conexiones en Oracle · 0,25 p

*Criterios: RA2.g (0,25)*

Consulta en `v$parameter` el valor de `processes` y `open_cursors`, y si cada uno se puede modificar en caliente (`issys_modifiable`) y desde la PDB (`ispdb_modifiable`).

El hotel necesita subir `open_cursors` a **500** en `FREEPDB1` y `processes` a **400**. Escribe las dos sentencias e indica para cada una desde qué contenedor se ejecuta, con qué `SCOPE` y si hay que reiniciar. *Justifica* la diferencia entre ambos parámetros con la consulta anterior.

#### 2.2 Acceso por red y tiempos de espera en PostgreSQL · 0,25 p

*Criterios: RA2.e (0,15) · RA2.g (0,1)*

Consulta en `pg_settings` el valor y el contexto de `listen_addresses`, `max_connections`, `idle_in_transaction_session_timeout` y `password_encryption`.

Escribe (sin ejecutarlos):

1. Las líneas de `pg_hba.conf` para que, desde la red de contabilidad `192.168.50.0/24`, **solo** el usuario `exNN_cont_lidia` (ejercicio 4) se pueda conectar a la base de datos `exNN`, con contraseña cifrada, y que cualquier otro usuario de esa red sea **rechazado** al intentar entrar en `exNN`.
2. La sentencia que corte las sesiones que dejan una **transacción abierta** sin actividad durante 5 minutos.

Indica cómo se aplica cada cambio y *justifícalo*.

### Ejercicio 3. Control de acceso en Oracle: recepción y comerciales (2,5 p · RA3)

Trabaja en la PDB `FREEPDB1` con tu usuario `exNN`. Los usuarios, roles, perfiles y sinónimos públicos son **globales**: su nombre debe empezar por `exNN_`. Las vistas y los sinónimos privados están en un esquema y no necesitan el prefijo.

#### 3.1 Perfil y usuarios · 0,5 p

*Criterios: RA3.c (0,3) · RA3.h (0,2)*

Crea el perfil `exNN_perfil_hotel` con estas limitaciones: como máximo **3 sesiones** simultáneas por usuario, desconexión tras **20 minutos** de inactividad, bloqueo tras **5 intentos** fallidos de inicio de sesión y bloqueo durante **30 minutos**.

Crea los usuarios `exNN_rec_pablo` (recepción), `exNN_com_sara` y `exNN_com_ivan` (comerciales), con ese perfil, tablespace por defecto `USERS` y la contraseña que elijas (indícala en la entrega). *Justifica* qué riesgo reduce cada límite y por qué estos usuarios no necesitan cuota.

#### 3.2 Vistas personalizadas · 0,75 p

*Criterios: RA3.a (0,75)*

Crea en tu esquema:

- `v_empleados`: identificador, nombre y departamento (para todo el personal).
- `v_rec_clientes`: identificador, nombre, DNI y teléfono de todos los clientes.
- `v_rec_reservas`: identificador de reserva y de cliente, habitación, entrada y salida, **sin** importe ni estado de pago. Debe permitir modificar la habitación.
- `v_com_clientes`: identificador, nombre, teléfono, correo y preferencias **solo de los clientes del comercial conectado**. Debe impedir que, a través de la vista, un cliente quede fuera de ella.

*Justifica* el tipo de cada vista y cómo se identifica al comercial conectado.

#### 3.3 Roles y privilegios · 0,5 p

*Criterios: RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15)*

Crea estos roles y concédelos:

- `exNN_r_hotel`: iniciar sesión y consultar `v_empleados`.
- `exNN_r_recepcion`: incluye `exNN_r_hotel`; consultar `v_rec_clientes` y `v_rec_reservas`, y modificar **solo** la habitación.
- `exNN_r_comercial`: incluye `exNN_r_hotel`; consultar `v_com_clientes` y modificar **solo** las preferencias.

Concede `exNN_r_recepcion` a Pablo y `exNN_r_comercial` a Sara e Iván. *Justifica* por qué no se concede ningún privilegio sobre las tablas.

#### 3.4 Sinónimos · 0,25 p

*Criterios: RA3.b (0,25)*

1. Crea el sinónimo público `exNN_mis_clientes` para `v_com_clientes`.
2. Pablo quiere escribir `SELECT * FROM reservas` para trabajar con `v_rec_reservas`. Dale **solo** el privilegio que necesita, conéctate como Pablo y crea en su esquema el sinónimo privado `reservas`.

*Justifica* qué pasaría si Pablo tuviera en su esquema una tabla llamada `exNN_mis_clientes`.

#### 3.5 Verificación · 0,5 p

*Criterios: RA3.d (0,3) · RA3.h (0,2)*

Demuestra que la política se cumple:

1. Como **Sara**: ver sus clientes (con el sinónimo público), cambiar las preferencias de uno de ellos, cambiar su teléfono, cambiar las preferencias de un cliente de Iván y leer la tarjeta de la tabla `clientes`. Consulta `SESSION_ROLES` y `USER_RESOURCE_LIMITS`.
2. Como **Pablo**: cambiar la habitación de la reserva 3 y cambiar su fecha de salida.
3. Como `exNN`, en una **sesión nueva**: privilegios concedidos sobre tus objetos (de tabla y de columna) y privilegios y roles de tus roles.

Presenta un **cuadro de pruebas** (prueba · esperado · obtenido) y *justifica* cómo protege la política los datos de salud y de pago.

### Ejercicio 4. Control de acceso en PostgreSQL: contabilidad y dirección (2,5 p · RA3)

Trabaja en tu base de datos `exNN` (esquema `hotel`) con tu usuario `exNN`, que tiene el atributo `CREATEROLE`. Los nombres de los roles empiezan por `exNN_`. En tu base de datos nadie tiene `CONNECT` salvo tú.

#### 4.1 Usuarios y rol base · 0,5 p

*Criterios: RA3.c (0,3) · RA3.h (0,2)*

Crea:

- El rol de grupo `exNN_r_base` (sin inicio de sesión) con lo imprescindible para entrar en tu base de datos y usar el esquema `hotel`.
- El usuario `exNN_cont_lidia` (contabilidad), con como máximo **2 conexiones** simultáneas.
- El usuario `exNN_dir_tomas` (dirección), con como máximo **1 conexión**.

Las dos cuentas deben caducar el **30 de junio de 2027**. *Justifica* cada atributo y cada privilegio.

#### 4.2 Vistas · 0,5 p

*Criterios: RA3.a (0,5)*

Crea en el esquema `hotel`:

- `v_cont_reservas`: cada reserva con su identificador, el **nombre** del cliente, entrada, salida, importe y si está pagada.
- `v_cont_tarjetas`: identificador, nombre, DNI y tarjeta de cada cliente.
- `v_dir_mensual`: por mes de entrada (formato `AAAA-MM`), el número de reservas, los ingresos, el total de noches y el porcentaje de reservas pagadas.

*Justifica* si `v_cont_reservas` es actualizable y cómo podrá contabilidad marcar las reservas como pagadas.

#### 4.3 Roles y privilegios · 0,5 p

*Criterios: RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15)*

Crea los roles `exNN_r_contabilidad` y `exNN_r_direccion`, miembros de `exNN_r_base`:

- **Contabilidad**: consultar `v_cont_reservas` y `v_cont_tarjetas` y marcar reservas como pagadas, sin poder cambiar ninguna otra columna.
- **Dirección**: consultar `v_dir_mensual`.

Concede cada rol a su usuario y comprueba como Lidia que puede marcar el pago de la reserva 3 pero no cambiar su importe. *Justifica* los privilegios de columna.

#### 4.4 Ruta de búsqueda · 0,25 p

*Criterios: RA3.b (0,25)*

Haz que Lidia y Tomás puedan usar las vistas sin escribir el esquema cuando se conectan a `exNN`, y compruébalo. *Justifica* por qué no se configura en los roles de grupo y cuándo se aplica el cambio.

#### 4.5 Cambios en la política y verificación · 0,75 p

*Criterios: RA3.f (0,2) · RA3.g (0,15) · RA3.e (0,15) · RA3.d (0,25)*

El hotel cambia su organización:

1. Los pagos se marcarán desde la pasarela de pago: contabilidad **deja de poder marcar** reservas como pagadas, pero sigue consultándolas.
2. Tomás pasa de dirección a **contabilidad**.
3. Ya no hay nadie en dirección: **borra el rol** `exNN_r_direccion`.

Aplica los cambios, comprueba como Lidia y como Tomás el resultado, consulta en el catálogo los privilegios de `hotel` y la pertenencia a roles, y *justifica* los errores que aparezcan y cómo los resuelves.

## Ponderación

Cada pregunta del test y cada apartado práctico están vinculados a los criterios de evaluación (CE) de los resultados de aprendizaje del módulo.

| Elemento | RA | Criterios (puntos) | Puntos |
|---|---|---|---:|
| Test, preguntas 1–5 | RA1 | RA1.a (0,2) · RA1.b (0,2) · RA1.c (0,2) · RA1.i (0,2) · RA1.h (0,2) | 1 |
| Test, preguntas 6–10 | RA2 | RA2.a (0,2) · RA2.b (0,2) · RA2.c (0,2) · RA2.e (0,2) · RA2.g (0,2) | 1 |
| Test, preguntas 11–20 | RA3 | RA3.c (0,4) · RA3.d (0,2) · RA3.f (0,2) · RA3.e (0,4) · RA3.a (0,2) · RA3.b (0,2) · RA3.h (0,4) | 2 |
| Práctico 1.1 Conexión a Oracle | RA1 | RA1.j (0,25) | 0,25 |
| Práctico 1.2 Conexión a PostgreSQL | RA1 | RA1.j (0,25) | 0,25 |
| Práctico 2.1 Parámetros de conexiones en Oracle | RA2 | RA2.g (0,25) | 0,25 |
| Práctico 2.2 Acceso por red y tiempos de espera en PostgreSQL | RA2 | RA2.e (0,15) · RA2.g (0,1) | 0,25 |
| Práctico 3.1 Perfil y usuarios | RA3 | RA3.c (0,3) · RA3.h (0,2) | 0,5 |
| Práctico 3.2 Vistas personalizadas | RA3 | RA3.a (0,75) | 0,75 |
| Práctico 3.3 Roles y privilegios | RA3 | RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15) | 0,5 |
| Práctico 3.4 Sinónimos | RA3 | RA3.b (0,25) | 0,25 |
| Práctico 3.5 Verificación | RA3 | RA3.d (0,3) · RA3.h (0,2) | 0,5 |
| Práctico 4.1 Usuarios y rol base | RA3 | RA3.c (0,3) · RA3.h (0,2) | 0,5 |
| Práctico 4.2 Vistas | RA3 | RA3.a (0,5) | 0,5 |
| Práctico 4.3 Roles y privilegios | RA3 | RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15) | 0,5 |
| Práctico 4.4 Ruta de búsqueda | RA3 | RA3.b (0,25) | 0,25 |
| Práctico 4.5 Cambios en la política y verificación | RA3 | RA3.f (0,2) · RA3.g (0,15) · RA3.e (0,15) · RA3.d (0,25) | 0,75 |

### Resumen por resultado de aprendizaje

| RA | Test | Práctico | Total (sobre 10) | Peso del RA en el módulo |
|---|---:|---:|---:|---:|
| RA1 | 1 | 0,5 | **1,5** | 5 % |
| RA2 | 1 | 0,5 | **1,5** | 5 % |
| RA3 | 2 | 5 | **7** | 25 % |
| **Total** | **4** | **6** | **10** | |

### Rúbrica de los apartados prácticos

Cada apartado se califica de 0 a 4 y se obtiene el porcentaje correspondiente de su valor. El nivel 2 es el mínimo para considerar superado el apartado.

| Nivel | Descripción | Puntos del apartado |
|---|---|---|
| 0 | No entregado o sin relación con lo solicitado. | 0 % |
| 1 | Incompleto o incorrecto. Faltan elementos esenciales. | 25 % |
| 2 | Correcto y completo, pero sin justificar las decisiones. | 50 % |
| 3 | Correcto, completo y justificado. | 75 % |
| 4 | Además, coherente con el resto del ejercicio y bien comunicado. | 100 % |
