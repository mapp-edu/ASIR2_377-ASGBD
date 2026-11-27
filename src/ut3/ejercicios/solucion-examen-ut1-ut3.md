---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución del examen UT1–UT3"
pageClass: ejercicios-page
---

<ExportPDF />

# 🔑 Solución del examen UT1–UT3

::: tip Cómo usar esta solución
Compara tu entrega con el [enunciado del examen](./examen-ut1-ut3) y con esta página. Para cada apartado práctico tienes la solución y lo que distingue cada nivel de la rúbrica, que son los criterios con los que se ha calificado.
:::

::: info Convocatoria del 23 de noviembre
El enunciado publicado es la versión final. En la convocatoria del 23 de noviembre había además: el usuario `exNN_com_ivan` en Oracle (se crea y recibe `exNN_r_comercial` igual que Sara), límites de **2** conexiones para Lidia y **1** para Tomás, las noches (`sum(salida - entrada)`) y el porcentaje de reservas pagadas en `v_dir_mensual`, y más pruebas en las verificaciones (3.5 y 4.5). El resto de la solución es la misma.
:::

## Parte A · Clave del cuestionario

Clave rápida: 1b · 2c · 3a · 4b · 5b · 6a · 7d · 8d · 9c · 10c · 11a · 12a · 13b · 14d · 15c · 16d · 17b · 18a · 19c · 20d

Nota de la parte A = 0,2 × aciertos − 0,05 × errores, con un mínimo de 0.

| N.º | Respuesta | CE | Justificación |
|---:|:---:|---|---|
| 1 | **b** | RA1.a | El diccionario (o catálogo) son los «datos sobre los datos»: definiciones de tablas, columnas, usuarios, privilegios, espacio… En Oracle se consulta con las vistas USER_, ALL_ y DBA_; en PostgreSQL, con pg_catalog e information_schema. |
| 2 | **c** | RA1.b | Oracle Free limita los recursos (2 hilos de CPU, 2 GB de RAM, 12 GB de datos), pero incluye el SQL y PL/SQL completos. Por eso sirve para formación y desarrollo. |
| 3 | **a** | RA1.c | PrestaShop está pensado para MySQL/MariaDB, la M de LAMP, y MariaDB es libre. Oracle y SQL Server requieren licencia para producción y SQLite no es un servidor multiusuario para una web con concurrencia. |
| 4 | **b** | RA1.i | En Ubuntu 24.04 la biblioteca se renombró (transición a time_t de 64 bits) y el paquete pasó a llamarse libaio1t64, con el fichero libaio.so.1t64. Los binarios de Oracle buscan libaio.so.1, de ahí el enlace simbólico. |
| 5 | **b** | RA1.h | El instalador (OUI) escribe sus registros installActions*.log en el inventario y en %TEMP%. El alert log solo existe cuando ya hay una base de datos creada. |
| 6 | **a** | RA2.a | NORMAL espera a los usuarios, TRANSACTIONAL espera a las transacciones, IMMEDIATE hace rollback y cierra limpio, y ABORT para de golpe (recuperación de instancia al arrancar). |
| 7 | **d** | RA2.b | InnoDB es el motor por defecto: transaccional (ACID), con bloqueo por filas y claves ajenas. MyISAM no tiene transacciones ni claves ajenas; MEMORY pierde los datos al reiniciar. |
| 8 | **d** | RA2.c | CONNECTION LIMIT no se aplica a los superusuarios. Para asegurar la cuenta de administración hay que limitar desde dónde y cómo se conecta (pg_hba.conf) y usar contraseñas robustas, no confiar en este límite. |
| 9 | **c** | RA2.e | listener.ora configura el listener (en el servidor). tnsnames.ora contiene alias de conexión para los clientes y sqlnet.ora, opciones de red generales. |
| 10 | **c** | RA2.g | idle_session_timeout (desde la v14) actúa sobre sesiones inactivas fuera de transacción. idle_in_transaction_session_timeout, sobre las que dejan una transacción abierta, y statement_timeout limita la duración de cada sentencia. |
| 11 | **a** | RA3.c | En CDB$ROOT los usuarios son comunes y su nombre necesita el prefijo C## (common_user_prefix). Para un usuario local hay que cambiar a la PDB: ALTER SESSION SET CONTAINER = FREEPDB1; |
| 12 | **a** | RA3.c | En PostgreSQL usuarios y grupos son roles. CREATE USER es CREATE ROLE con LOGIN por defecto. |
| 13 | **b** | RA3.d | Los privilegios concedidos sobre columnas concretas aparecen en USER_COL_PRIVS (o DBA_COL_PRIVS), no en USER_TAB_PRIVS. |
| 14 | **d** | RA3.f | Desde la versión 15 el esquema public pertenece a pg_database_owner y PUBLIC solo tiene USAGE. Para crear objetos hay que conceder CREATE en un esquema. |
| 15 | **c** | RA3.e | Los roles por defecto se activan al iniciar sesión. Una sesión abierta no ve el rol nuevo hasta SET ROLE o hasta volver a conectar. Los privilegios concedidos directamente sí se aplican de inmediato. |
| 16 | **d** | RA3.e | DROP ROLE no tiene CASCADE. Hay que eliminar las dependencias: privilegios concedidos al rol, objetos de su propiedad (en cada base de datos) y, después, borrarlo. |
| 17 | **b** | RA3.a | Las vistas se ejecutan con los privilegios del propietario. Por eso sirven para ocultar columnas o filas. Con la opción security_invoker = true (PostgreSQL 15+) se comprobarían los permisos de luis. |
| 18 | **a** | RA3.b | Oracle resuelve primero en el esquema del usuario (donde también están sus sinónimos privados) y después en los sinónimos públicos. Así un objeto propio «tapa» al sinónimo público. |
| 19 | **c** | RA3.h | En modo tablespace, un usuario sin DATAPUMP_EXP_FULL_DATABASE obtiene solo sus propias tablas. Con ese rol se exportan todas. Es una medida de control de acceso a los datos. |
| 20 | **d** | RA3.h | El artículo 32 pide medidas técnicas que garanticen confidencialidad, integridad, disponibilidad y resiliencia, y la capacidad de restaurar los datos tras un incidente, además de verificar periódicamente esas medidas. |

## Parte B · Solución y criterios

Las soluciones están escritas con `exNN`: sustituye NN por el número de la cuenta del alumno. Las contraseñas son ejemplos.

Para cada apartado, se elige el nivel de la rúbrica (0–4) y se calcula: puntos = valor × nivel / 4.

### Ejercicio 1. Conexión a los servidores (0,5 p · RA1)

#### 1.1 Conexión a Oracle · 0,25 p

*Criterios: RA1.j (0,25)*

Conexión en la extensión SQL Developer de VS Code: tipo *Basic*, host: la IP del servidor del aula, puerto `1521`, *Service name* `FREEPDB1`, usuario `exNN`. Equivale a la cadena EZConnect `exNN/<clave>@//<IP_SERVIDOR>:1521/FREEPDB1`.

```sql
SELECT SYS_CONTEXT('USERENV', 'CON_NAME') AS contenedor,
       USER AS usuario,
       SYS_CONTEXT('USERENV', 'DB_NAME') AS bd
  FROM dual;
SELECT name FROM v$database;
SELECT instance_name, version_full, startup_time, status FROM v$instance;
```

- `CON_NAME` vale `FREEPDB1`.
- `v$database.name` vale `FREE`, porque la base de datos es la CDB.
- `v$instance` muestra la versión y la hora de arranque.

Justificación: la conexión llega primero al **listener** (proceso `tnslsnr`), que escucha en el puerto **1521/tcp**. El listener mira el servicio pedido (`FREEPDB1`) y entrega la conexión a la instancia, que crea un proceso servidor para la sesión. En el contenedor ese puerto se publica con `-p 1521:1521`.

::: tip Criterios de nivel
**Nivel 2**: conecta y muestra todos los datos pedidos. **Nivel 3**: explica el papel del listener, el puerto y el servicio. **Nivel 4**: relaciona con la publicación de puertos del contenedor o con CDB/PDB. *Nivel 1*: no conecta, o falta más de un dato.
:::

#### 1.2 Conexión a PostgreSQL · 0,25 p

*Criterios: RA1.j (0,25)*

Conexión en la extensión PostgreSQL de VS Code: servidor: la IP del servidor del aula, puerto `5432`, base de datos `exNN`, usuario `exNN`, autenticación por contraseña y modo SSL `Disable` si el servidor no tiene SSL activado. Se acepta como evidencia la captura del diálogo de conexión (sin la contraseña); no se pide `\conninfo`, que es una orden de `psql`.

```sql
SELECT version(), current_user, current_database(),
       inet_server_addr(), inet_server_port(), pg_postmaster_start_time();
```

Justificación: `pg_hba.conf` (*host-based authentication*) decide si la conexión se acepta según el tipo, la base de datos, el usuario y la dirección de origen. La primera línea que coincide fija el método (en la imagen oficial, `scram-sha-256` para conexiones remotas). Además, hace falta el privilegio `CONNECT` sobre la base de datos.

::: tip Criterios de nivel
**Nivel 2**: conecta y muestra los datos. **Nivel 3**: explica pg_hba.conf y el método de autenticación. **Nivel 4**: distingue entre autenticación (pg_hba) y autorización (CONNECT). *Nivel 1*: no conecta o falta más de un dato.
:::

### Ejercicio 2. Configuración de los SGBD (0,5 p · RA2)

#### 2.1 Parámetros de conexiones en Oracle · 0,25 p

*Criterios: RA2.g (0,25)*

```sql
SELECT name, value, issys_modifiable, ispdb_modifiable
  FROM v$parameter
 WHERE name IN ('processes', 'open_cursors');
```

- `open_cursors` es **dinámico** (`ISSYS_MODIFIABLE = IMMEDIATE`) y **modificable en la PDB** (`ISPDB_MODIFIABLE = TRUE`). El administrador, conectado a FREEPDB1 con privilegios, ejecuta `ALTER SYSTEM SET open_cursors = 500 SCOPE = BOTH;`. Se aplica sin reiniciar y queda guardado para la PDB.
- `processes` es **estático** (`FALSE`) y **solo del contenedor raíz**. Conectado como SYSDBA a CDB$ROOT: `ALTER SYSTEM SET processes = 400 SCOPE = SPFILE;` y después `SHUTDOWN IMMEDIATE` / `STARTUP` (o reiniciar el contenedor).

::: tip Criterios de nivel
**Nivel 2**: consulta y dos sentencias con SCOPE correcto y reinicio solo para `processes`. **Nivel 3**: justifica la diferencia con las columnas `issys_modifiable`/`ispdb_modifiable`. **Nivel 4**: indica el contenedor de cada una y cómo comprobar el cambio. *Nivel 1*: el mismo tratamiento para ambos, o `processes` sin reinicio.
:::

#### 2.2 Acceso por red y tiempos de espera en PostgreSQL · 0,25 p

*Criterios: RA2.e (0,15) · RA2.g (0,1)*

```sql
SELECT name, setting, unit, context
  FROM pg_settings
 WHERE name IN ('listen_addresses', 'max_connections',
                'idle_in_transaction_session_timeout', 'password_encryption');
```

```txt
# TYPE  DATABASE  USER              ADDRESS          METHOD
host    exNN      exNN_cont_lidia   192.168.50.0/24  scram-sha-256
host    exNN      all               192.168.50.0/24  reject
```

```sql
ALTER SYSTEM SET idle_in_transaction_session_timeout = '5min';
SELECT pg_reload_conf();
```

- **Orden de las líneas**: se aplica la primera que coincide. Por eso la de Lidia va antes que la de `reject`, y las dos antes de las reglas generales.
- **Aplicación**: pg_hba se aplica con una recarga. `idle_in_transaction_session_timeout` tiene contexto `user` y también basta recargar.
- **Por qué este parámetro**: una transacción abierta sin actividad mantiene bloqueos e impide que VACUUM limpie filas antiguas.
- **Contexto de otros parámetros**: `listen_addresses` y `max_connections` son `postmaster` y exigen reinicio. `password_encryption` (`scram-sha-256`) indica cómo se guardan las contraseñas nuevas.

::: tip Criterios de nivel
**Nivel 2**: consulta, las dos líneas pg_hba en el orden correcto y la sentencia del parámetro. **Nivel 3**: justifica el orden (primera coincidencia), la recarga y el riesgo de las transacciones abiertas. **Nivel 4**: tiene en cuenta las reglas generales existentes y es coherente con el ejercicio 4. *Nivel 1*: `reject` antes de la línea de Lidia, `trust`, o el parámetro equivocado (`idle_session_timeout`).
:::

### Ejercicio 3. Control de acceso en Oracle: recepción y comerciales (2,5 p · RA3)

#### 3.1 Perfil y usuarios · 0,5 p

*Criterios: RA3.c (0,3) · RA3.h (0,2)*

```sql
CREATE PROFILE exNN_perfil_hotel LIMIT
  SESSIONS_PER_USER     3
  IDLE_TIME             20
  FAILED_LOGIN_ATTEMPTS 5
  PASSWORD_LOCK_TIME    30/1440;

CREATE USER exNN_rec_pablo IDENTIFIED BY "Pablo.2026"
  DEFAULT TABLESPACE users PROFILE exNN_perfil_hotel;
CREATE USER exNN_com_sara  IDENTIFIED BY "Sara.2026"
  DEFAULT TABLESPACE users PROFILE exNN_perfil_hotel;
```

- **Unidades**: `PASSWORD_LOCK_TIME` se expresa en días (30/1440 = 30 minutos) e `IDLE_TIME`, en minutos.
- **Riesgo que reduce cada límite**: el de sesiones evita compartir cuentas; el de inactividad cierra sesiones abiertas en mostradores desatendidos; el de intentos fallidos frena la fuerza bruta.
- **Cuota**: no necesitan cuota porque trabajan con objetos de `exNN` y no crean segmentos. Un sinónimo privado no ocupa espacio.

::: tip Criterios de nivel
**Nivel 2**: perfil con los cuatro límites y unidades correctas, y los dos usuarios con el perfil. **Nivel 3**: justifica cada límite y la ausencia de cuota. **Nivel 4**: comenta `RESOURCE_LIMIT` o la política de contraseñas. *Nivel 1*: unidades erróneas (`PASSWORD_LOCK_TIME 30` = 30 días), falta el perfil o nombres sin prefijo.
:::

#### 3.2 Vistas personalizadas · 0,75 p

*Criterios: RA3.a (0,75)*

```sql
CREATE VIEW v_empleados AS
  SELECT id_empleado, nombre, departamento FROM empleados;

CREATE VIEW v_rec_clientes AS
  SELECT id_cliente, nombre, dni, telefono FROM clientes;

CREATE VIEW v_rec_reservas AS
  SELECT id_reserva, id_cliente, habitacion, entrada, salida FROM reservas;

CREATE VIEW v_com_clientes AS
  SELECT id_cliente, nombre, telefono, email, preferencias
    FROM clientes
   WHERE id_comercial = (SELECT id_empleado FROM empleados WHERE usuario_bd = USER)
  WITH CHECK OPTION;
```

- **Tipo de cada vista**: las tres primeras son **verticales** y `v_com_clientes` es **mixta**: filtra filas y oculta DNI y tarjeta.
- **Actualizable**: `v_rec_reservas` lo es porque se basa en una sola tabla, sin agregados.
- **Comercial conectado**: `USER` devuelve `EXNN_COM_SARA` en mayúsculas, igual que `empleados.usuario_bd`. Así una sola vista sirve para todos los comerciales.
- **`WITH CHECK OPTION`**: impide modificaciones que saquen la fila de la vista (ORA-01402). Con subconsultas Oracle no garantiza la comprobación completa, pero aquí el comercial solo podrá modificar `preferencias`.

::: tip Criterios de nivel
**Nivel 2**: las cuatro vistas con las columnas pedidas, y la de comerciales filtra por el usuario conectado. **Nivel 3**: justifica tipos, `USER` y `WITH CHECK OPTION`. **Nivel 4**: comenta actualizabilidad o la limitación de CHECK OPTION. *Nivel 1*: una vista por comercial con nombre fijo, `v_rec_reservas` con importe, o falta alguna vista.
:::

#### 3.3 Roles y privilegios · 0,5 p

*Criterios: RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15)*

```sql
CREATE ROLE exNN_r_hotel;
GRANT CREATE SESSION TO exNN_r_hotel;
GRANT SELECT ON v_empleados TO exNN_r_hotel;

CREATE ROLE exNN_r_recepcion;
GRANT exNN_r_hotel TO exNN_r_recepcion;
GRANT SELECT ON v_rec_clientes TO exNN_r_recepcion;
GRANT SELECT, UPDATE (habitacion) ON v_rec_reservas TO exNN_r_recepcion;

CREATE ROLE exNN_r_comercial;
GRANT exNN_r_hotel TO exNN_r_comercial;
GRANT SELECT, UPDATE (preferencias) ON v_com_clientes TO exNN_r_comercial;

GRANT exNN_r_recepcion TO exNN_rec_pablo;
GRANT exNN_r_comercial TO exNN_com_sara;
```

- **Sin privilegios sobre las tablas**: las vistas acceden a las tablas con los derechos de su propietario. Dar acceso a `clientes` dejaría ver la tarjeta y las preferencias de todos.
- **`CREATE SESSION`**: `exNN` puede concederlo porque lo tiene `WITH ADMIN OPTION`.
- **Roles**: como `exNN` los creó, los tiene con ADMIN OPTION y puede concederlos.

::: tip Criterios de nivel
**Nivel 2**: roles, anidamiento, privilegios de columna y concesión correctos. **Nivel 3**: justifica el acceso solo por vistas y los privilegios de columna. **Nivel 4**: mínimo privilegio estricto sin privilegios directos a usuarios. *Nivel 1*: privilegios sobre tablas, `UPDATE` sin columna o privilegios directos.
:::

#### 3.4 Sinónimos · 0,25 p

*Criterios: RA3.b (0,25)*

```sql
-- como exNN
CREATE PUBLIC SYNONYM exNN_mis_clientes FOR exNN.v_com_clientes;
GRANT CREATE SYNONYM TO exNN_rec_pablo;

-- como exNN_rec_pablo
CREATE SYNONYM reservas FOR exNN.v_rec_reservas;
SELECT * FROM reservas;
```

- **Orden de resolución**: Oracle busca primero en el esquema del usuario (tablas, vistas y sinónimos privados) y después en los sinónimos públicos. Si Pablo tuviera una tabla `exNN_mis_clientes`, su consulta usaría esa tabla y no el sinónimo público.
- **Permisos**: el sinónimo no da permisos. Pablo no podría usar el sinónimo público porque no tiene `SELECT` sobre `v_com_clientes`.

::: tip Criterios de nivel
**Nivel 2**: crea los dos sinónimos y concede `CREATE SYNONYM` a Pablo. **Nivel 3**: explica el orden de resolución de nombres. **Nivel 4**: añade que el sinónimo no concede privilegios y lo comprueba. *Nivel 1*: sinónimo privado en el esquema `exNN` o privilegio excesivo (`CREATE ANY SYNONYM`).
:::

#### 3.5 Verificación · 0,5 p

*Criterios: RA3.d (0,3) · RA3.h (0,2)*

```sql
-- como exNN_com_sara (comercial 2): clientes 1, 2, 5 y 7
SELECT * FROM exNN_mis_clientes;
UPDATE exNN_mis_clientes SET telefono = '600000000' WHERE id_cliente = 1;  -- ORA-01031
UPDATE exNN_mis_clientes SET preferencias = 'X' WHERE id_cliente = 3;       -- 0 filas (cliente de Iván)
SELECT * FROM session_roles;            -- EXNN_R_COMERCIAL, EXNN_R_HOTEL
COMMIT;

-- como exNN_rec_pablo (la misma conexión del 3.4)
UPDATE reservas SET habitacion = 207 WHERE id_reserva = 3;               -- 1 fila
UPDATE reservas SET salida = DATE '2026-10-20' WHERE id_reserva = 3;     -- ORA-01031
COMMIT;

-- como exNN (sesión nueva)
SELECT grantee, table_name, privilege FROM user_tab_privs_made ORDER BY 1, 2;
SELECT grantee, table_name, column_name, privilege FROM user_col_privs_made;
SELECT role, privilege FROM role_sys_privs WHERE role LIKE 'EXNN%';
SELECT role, granted_role FROM role_role_privs WHERE role LIKE 'EXNN%';
SELECT role, table_name, column_name, privilege FROM role_tab_privs WHERE role LIKE 'EXNN%';
```

Cuadro de pruebas:

| Prueba | Esperado | Obtenido |
|---|---|---|
| Sara: `SELECT` de `exNN_mis_clientes` | 1, 2, 5, 7 | ✔ |
| Sara: `UPDATE` de teléfono | ORA-01031 | ✔ |
| Sara: `UPDATE` de preferencias del cliente 3 (de Iván) | 0 filas | ✔ |
| Pablo: `UPDATE` de habitación | 1 fila | ✔ |
| Pablo: `UPDATE` de salida | ORA-01031 | ✔ |

- **Datos de salud** (`preferencias`, categoría especial del art. 9 RGPD): solo los ve el comercial de cada cliente.
- **Tarjeta**: no la ve nadie en Oracle.
- **Principios**: es la aplicación de la minimización y la confidencialidad (arts. 5 y 32). El cuadro de pruebas documenta que las medidas se han verificado.

::: tip Criterios de nivel
**Nivel 2**: pruebas de Sara y Pablo y consultas del diccionario, con su salida. **Nivel 3**: cuadro esperado/obtenido y relación con el RGPD. **Nivel 4**: interpreta cada resultado (ORA-01031 frente a 0 filas: falta de privilegio frente a fila fuera de la vista) y lo relaciona con lo que muestra el diccionario. *Nivel 1*: solo diccionario o solo pruebas, sin salida.
:::

### Ejercicio 4. Control de acceso en PostgreSQL: contabilidad y dirección (2,5 p · RA3)

#### 4.1 Usuarios y rol base · 0,5 p

*Criterios: RA3.c (0,3) · RA3.h (0,2)*

```sql
CREATE ROLE exNN_r_base NOLOGIN;
GRANT CONNECT ON DATABASE exNN TO exNN_r_base;
GRANT USAGE ON SCHEMA hotel TO exNN_r_base;

CREATE ROLE exNN_cont_lidia LOGIN PASSWORD 'Lidia.2026'
  CONNECTION LIMIT 3 VALID UNTIL '2027-06-30';
CREATE ROLE exNN_dir_tomas LOGIN PASSWORD 'Tomas.2026'
  CONNECTION LIMIT 2 VALID UNTIL '2027-06-30';
```

- **Rol base**: necesita `CONNECT` porque se revocó a `PUBLIC`, y `USAGE` en el esquema para poder acceder a sus objetos.
- **Atributos de los usuarios**: `LOGIN` permite iniciar sesión, `CONNECTION LIMIT` limita las sesiones simultáneas y `VALID UNTIL` hace caducar la contraseña. Los límites (3 y 2) dejan margen porque la extensión de VS Code puede abrir más de una conexión (explorador de objetos y editor de consultas).

::: tip Criterios de nivel
**Nivel 2**: rol base con CONNECT y USAGE y dos usuarios con LOGIN, límite y caducidad. **Nivel 3**: justifica cada atributo y privilegio. **Nivel 4**: lo compara con el perfil de Oracle del ejercicio 3. *Nivel 1*: falta CONNECT o USAGE, o faltan los límites.
:::

#### 4.2 Vistas · 0,5 p

*Criterios: RA3.a (0,5)*

```sql
CREATE VIEW hotel.v_cont_reservas AS
  SELECT r.id_reserva, c.nombre AS cliente, r.entrada, r.salida, r.importe, r.pagada
    FROM hotel.reservas r
    JOIN hotel.clientes c ON c.id_cliente = r.id_cliente;

CREATE VIEW hotel.v_cont_tarjetas AS
  SELECT id_cliente, nombre, dni, tarjeta FROM hotel.clientes;

CREATE VIEW hotel.v_dir_mensual AS
  SELECT to_char(entrada, 'YYYY-MM') AS mes,
         count(*) AS reservas,
         sum(importe) AS ingresos
    FROM hotel.reservas
   GROUP BY to_char(entrada, 'YYYY-MM');
```

- **Actualizable**: `v_cont_reservas` tiene JOIN, así que no es actualizable automáticamente. El pago se marcará sobre la tabla con `UPDATE (pagada)` y `SELECT` de las columnas del WHERE.
- **Resultado esperado**: 2026-10 → 4 reservas, 1185,00 €; 2026-11 → 4, 1069,00 €; 2026-12 → 3, 1023,00 €.

::: tip Criterios de nivel
**Nivel 2**: las tres vistas correctas (JOIN y agrupación mensual con formato `AAAA-MM`). **Nivel 3**: justifica la no actualizabilidad y la alternativa. **Nivel 4**: resultados comprobados y sin datos personales en la vista de dirección. *Nivel 1*: agrupación por fecha completa en lugar de por mes, datos personales en dirección o falta alguna vista.
:::

#### 4.3 Roles y privilegios · 0,5 p

*Criterios: RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15)*

```sql
CREATE ROLE exNN_r_contabilidad NOLOGIN;
CREATE ROLE exNN_r_direccion NOLOGIN;
GRANT exNN_r_base TO exNN_r_contabilidad, exNN_r_direccion;

GRANT SELECT ON hotel.v_cont_reservas, hotel.v_cont_tarjetas TO exNN_r_contabilidad;
GRANT SELECT (id_reserva, pagada), UPDATE (pagada) ON hotel.reservas TO exNN_r_contabilidad;
GRANT SELECT ON hotel.v_dir_mensual TO exNN_r_direccion;

GRANT exNN_r_contabilidad TO exNN_cont_lidia;
GRANT exNN_r_direccion    TO exNN_dir_tomas;

-- como exNN_cont_lidia
UPDATE hotel.reservas SET pagada = true WHERE id_reserva = 3;  -- UPDATE 1
UPDATE hotel.reservas SET importe = 0 WHERE id_reserva = 3;    -- permission denied
```

El WHERE lee `id_reserva`, así que hace falta `SELECT` sobre esa columna. `UPDATE (pagada)` impide modificar el resto de columnas.

::: tip Criterios de nivel
**Nivel 2**: roles, pertenencia, privilegios y prueba correctos. **Nivel 3**: justifica el `SELECT` de columnas del WHERE y `UPDATE (pagada)`. **Nivel 4**: mínimo privilegio estricto y prueba documentada. *Nivel 1*: `UPDATE` de toda la tabla, o Lidia no puede marcar el pago.
:::

#### 4.4 Ruta de búsqueda · 0,25 p

*Criterios: RA3.b (0,25)*

```sql
ALTER ROLE exNN_cont_lidia IN DATABASE exNN SET search_path = hotel;
ALTER ROLE exNN_dir_tomas  IN DATABASE exNN SET search_path = hotel;
-- nueva conexión como Lidia
SHOW search_path;
SELECT * FROM v_cont_reservas;
```

- **Equivalente a un sinónimo**: `search_path` hace en PostgreSQL el papel de los sinónimos.
- **Roles de grupo**: los valores de `ALTER ROLE … SET` no se heredan de los roles de grupo, así que hay que ponerlos en cada usuario.
- **Cuándo se aplica**: en la siguiente conexión.

::: tip Criterios de nivel
**Nivel 2**: configurado en los dos usuarios y comprobado. **Nivel 3**: explica la no herencia y el momento en que se aplica. **Nivel 4**: lo limita a la base de datos y lo relaciona con los sinónimos. *Nivel 1*: solo en el rol de grupo o con `SET` en la sesión.
:::

#### 4.5 Cambios en la política y verificación · 0,75 p

*Criterios: RA3.f (0,2) · RA3.g (0,15) · RA3.e (0,15) · RA3.d (0,25)*

```sql
-- 1. contabilidad ya no marca pagos
REVOKE UPDATE (pagada) ON hotel.reservas FROM exNN_r_contabilidad;
REVOKE SELECT (id_reserva, pagada) ON hotel.reservas FROM exNN_r_contabilidad;

-- 2. Tomás pasa a contabilidad
REVOKE exNN_r_direccion FROM exNN_dir_tomas;
GRANT exNN_r_contabilidad TO exNN_dir_tomas;

-- 3. borrar el rol de dirección
DROP ROLE exNN_r_direccion;   -- ERROR: privileges for view hotel.v_dir_mensual
REVOKE SELECT ON hotel.v_dir_mensual FROM exNN_r_direccion;
DROP ROLE exNN_r_direccion;

-- comprobaciones
-- como Tomás (search_path = hotel desde el 4.4)
SELECT count(*) FROM v_cont_tarjetas;                     -- 8
SELECT * FROM v_dir_mensual;                              -- permission denied
UPDATE reservas SET pagada = true WHERE id_reserva = 6;   -- permission denied
-- catálogo (como exNN): privilegios de tabla y de columna en hotel
SELECT grantee, table_name, privilege_type
  FROM information_schema.role_table_grants
 WHERE table_schema = 'hotel' AND grantee <> current_user
 ORDER BY 1, 2;
SELECT grantee, table_name, column_name, privilege_type
  FROM information_schema.column_privileges
 WHERE table_schema = 'hotel' AND grantee <> current_user
 ORDER BY 1, 2, 3;
-- pertenencia a roles (los nombres sin comillas se guardan en minúsculas)
SELECT r.rolname AS rol, m.rolname AS miembro
  FROM pg_auth_members am
  JOIN pg_roles r ON r.oid = am.roleid
  JOIN pg_roles m ON m.oid = am.member
 WHERE m.rolname LIKE 'exnn\_%'
 ORDER BY 1, 2;
```

- **Efecto inmediato**: en PostgreSQL los cambios de pertenencia a roles se aplican de inmediato, también en las sesiones abiertas de Tomás. En Oracle, un rol nuevo exige una sesión nueva o `SET ROLE`.
- **`DROP ROLE`**: falla mientras el rol tenga privilegios. `DROP OWNED BY` no lo puede ejecutar `exNN` (*Only roles with privileges of role … may drop objects owned by it*), así que se revoca de forma explícita.
- **Consideración opcional**: el nombre del usuario `exNN_dir_tomas` ya no refleja su departamento. Se puede comentar renombrarlo con `ALTER ROLE … RENAME TO`, aunque eso invalida su contraseña cifrada con MD5 (con SCRAM no).

::: tip Criterios de nivel
**Nivel 2**: los tres cambios aplicados, comprobados y consultado el catálogo. **Nivel 3**: justifica el error del `DROP ROLE` y la solución, y el efecto inmediato de los cambios de pertenencia. **Nivel 4**: también revoca el `SELECT` de columnas que ya no se necesita y comprueba con Tomás los tres efectos. *Nivel 1*: el rol no se borra, Tomás conserva dirección, o no hay verificación.
:::

## Ponderación

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

### Por resultado de aprendizaje

| RA | Test | Práctico | Total (sobre 10) | Peso del RA en el módulo |
|---|---:|---:|---:|---:|
| RA1 | 1 | 0,5 | **1,5** | 5 % |
| RA2 | 1 | 0,5 | **1,5** | 5 % |
| RA3 | 2 | 5 | **7** | 25 % |
| **Total** | **4** | **6** | **10** | |

### Por criterio de evaluación

Cuando un apartado cubre varios CE, el nivel obtenido se aplica a cada uno de ellos. Así se puede trasladar la nota de cada CE al cuaderno de evaluación.

| CE | Descripción | Instrumentos | Test | Práctico | Total |
|---|---|---|---:|---:|---:|
| RA1.a | Se ha reconocido la utilidad y función de cada uno de los elementos de un SGBD. | T1 | 0,2 | 0 | 0,2 |
| RA1.b | Se han analizado las características de los principales SGBD. | T2 | 0,2 | 0 | 0,2 |
| RA1.c | Se ha seleccionado el sistema gestor de bases de datos. | T3 | 0,2 | 0 | 0,2 |
| RA1.h | Se ha interpretado la información suministrada por los mensajes de error y ficheros de registro. | T5 | 0,2 | 0 | 0,2 |
| RA1.i | Se han resuelto las incidencias de la instalación. | T4 | 0,2 | 0 | 0,2 |
| RA1.j | Se ha verificado el funcionamiento del sistema gestor de bases de datos. | 1.1, 1.2 | 0 | 0,5 | 0,5 |
| RA2.a | Se han descrito las condiciones de inicio y parada del sistema gestor. | T6 | 0,2 | 0 | 0,2 |
| RA2.b | Se ha seleccionado el motor de base de datos. | T7 | 0,2 | 0 | 0,2 |
| RA2.c | Se han asegurado las cuentas de administración. | T8 | 0,2 | 0 | 0,2 |
| RA2.e | Se ha configurado la conectividad en red del sistema gestor. | T9, 2.2 | 0,2 | 0,15 | 0,35 |
| RA2.g | Se han definido los parámetros relativos a las conexiones. | T10, 2.1, 2.2 | 0,2 | 0,35 | 0,55 |
| RA3.a | Se han creado vistas personalizadas para cada tipo de usuario. | T17, 3.2, 4.2 | 0,2 | 1,25 | 1,45 |
| RA3.b | Se han creado sinónimos de tablas y vistas. | T18, 3.4, 4.4 | 0,2 | 0,5 | 0,7 |
| RA3.c | Se han definido y eliminado cuentas de usuario. | T11, T12, 3.1, 4.1 | 0,4 | 0,6 | 1 |
| RA3.d | Se han identificado los privilegios sobre las bases de datos y sus elementos. | T13, 3.5, 4.5 | 0,2 | 0,55 | 0,75 |
| RA3.e | Se han agrupado y desagrupado privilegios. | T15, T16, 3.3, 4.3, 4.5 | 0,4 | 0,55 | 0,95 |
| RA3.f | Se han asignado y eliminado privilegios a usuarios. | T14, 3.3, 4.3, 4.5 | 0,2 | 0,5 | 0,7 |
| RA3.g | Se han asignado y eliminado grupos de privilegios a usuarios. | 3.3, 4.3, 4.5 | 0 | 0,45 | 0,45 |
| RA3.h | Se ha garantizado el cumplimiento de los requisitos de seguridad. | T19, T20, 3.1, 3.5, 4.1 | 0,4 | 0,6 | 1 |

## Hoja de autocorrección

| Apartado | Valor | Nivel (0–4) | Puntos |
|---|---:|:---:|---:|
| Parte A (test) | 4 | — | |
| 1.1 Conexión a Oracle | 0,25 | | |
| 1.2 Conexión a PostgreSQL | 0,25 | | |
| 2.1 Parámetros de conexiones en Oracle | 0,25 | | |
| 2.2 Acceso por red y tiempos de espera en PostgreSQL | 0,25 | | |
| 3.1 Perfil y usuarios | 0,5 | | |
| 3.2 Vistas personalizadas | 0,75 | | |
| 3.3 Roles y privilegios | 0,5 | | |
| 3.4 Sinónimos | 0,25 | | |
| 3.5 Verificación | 0,5 | | |
| 4.1 Usuarios y rol base | 0,5 | | |
| 4.2 Vistas | 0,5 | | |
| 4.3 Roles y privilegios | 0,5 | | |
| 4.4 Ruta de búsqueda | 0,25 | | |
| 4.5 Cambios en la política y verificación | 0,75 | | |
| **Total** | **10** | | |

| Nivel | Descripción | Puntos del apartado |
|---|---|---|
| 0 | No entregado o sin relación con lo solicitado. | 0 % |
| 1 | Incompleto o incorrecto. Faltan elementos esenciales. | 25 % |
| 2 | Correcto y completo, pero sin justificar las decisiones. | 50 % |
| 3 | Correcto, completo y justificado. | 75 % |
| 4 | Además, coherente con el resto del ejercicio y bien comunicado. | 100 % |
