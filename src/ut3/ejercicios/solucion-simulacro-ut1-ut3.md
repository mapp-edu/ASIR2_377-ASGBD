---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución del simulacro UT1–UT3"
pageClass: ejercicios-page
---

# 🔑 Solución del simulacro UT1–UT3

::: tip Cómo usar esta solución
Intenta primero el [simulacro](./simulacro-ut1-ut3) en las condiciones del examen y corrígelo después con esta página. Para cada apartado práctico, además de la solución, tienes lo que distingue cada nivel de la rúbrica: compáralo con tu entrega para calcular tu nota.
:::

## Parte A · Clave del cuestionario

Clave rápida: 1d · 2a · 3b · 4d · 5b · 6a · 7c · 8c · 9b · 10b · 11c · 12a · 13c · 14b · 15a · 16c · 17d · 18d · 19a · 20d

Nota de la parte A = 0,2 × aciertos − 0,0667 × errores, con un mínimo de 0.

| N.º | Respuesta | CE | Justificación |
|---:|:---:|---|---|
| 1 | **d** | RA1.a | El nivel interno (o físico) describe el almacenamiento. El conceptual describe la estructura lógica de toda la base de datos y el externo, las vistas de cada grupo de usuarios. |
| 2 | **a** | RA1.b | PostgreSQL usa la licencia PostgreSQL (libre, tipo BSD/MIT). Las otras tres son ediciones gratuitas de productos propietarios: gratuito no es lo mismo que libre. |
| 3 | **b** | RA1.d | podman-docker solo añade un envoltorio: la orden docker llama a podman. Podman y Docker usan imágenes OCI compatibles, no hace falta convertirlas. |
| 4 | **d** | RA1.h | El texto entre paréntesis es el estado del HEALTHCHECK de la imagen: starting mientras se crea o abre la base de datos, healthy cuando ya acepta conexiones. Hay que esperar (o seguir docker logs) antes de conectar. |
| 5 | **b** | RA1.j | 1521/tcp es el puerto del listener de Oracle y 5432/tcp el de PostgreSQL. 1433 es SQL Server y 3306, MySQL/MariaDB. |
| 6 | **a** | RA2.a | En NOMOUNT se lee el SPFILE y se crea la instancia (SGA y procesos). En MOUNT se abren los ficheros de control. En OPEN se abren los ficheros de datos y los redo log. |
| 7 | **c** | RA2.a | Desde PostgreSQL 9.5 el modo por defecto es fast. smart espera a los clientes e immediate no hace una parada limpia (habrá recuperación en el siguiente arranque). |
| 8 | **c** | RA2.e | Campos: tipo (host = TCP/IP), base de datos, usuario, dirección de origen y método. scram-sha-256 pide contraseña con intercambio cifrado. |
| 9 | **b** | RA2.g | max_connections tiene contexto postmaster (se ve en pg_settings.context): solo se lee al arrancar. ALTER SYSTEM lo escribe en postgresql.auto.conf, pero hace falta reiniciar. |
| 10 | **b** | RA2.f | Si no se indica, se asigna el tablespace permanente por defecto de la base de datos (DATABASE_PROPERTIES, DEFAULT_PERMANENT_TABLESPACE), que en FREEPDB1 es USERS. TEMP es temporal. |
| 11 | **c** | RA3.c | ORA-01045: user lacks CREATE SESSION privilege. Sin CREATE SESSION (directo o mediante un rol) no se puede iniciar sesión. Una cuenta bloqueada daría ORA-28000. |
| 12 | **a** | RA3.f | Las dos permiten volver a conceder lo recibido, pero se aplican a cosas distintas y se comportan distinto al revocar: la de objetos se revoca en cascada y la de sistema no. |
| 13 | **c** | RA3.f | En Oracle (y en PostgreSQL con CASCADE) la revocación de un privilegio sobre objetos concedido con GRANT OPTION arrastra a quienes lo recibieron de ese usuario. Con privilegios de sistema y ADMIN OPTION no hay cascada. |
| 14 | **b** | RA3.d | USER_SYS_PRIVS: privilegios de sistema concedidos al usuario. SESSION_PRIVS muestra todos los activos en la sesión, incluidos los que llegan por roles; USER_TAB_PRIVS, privilegios sobre objetos; DBA_ROLE_PRIVS, roles concedidos. |
| 15 | **a** | RA3.a | Horizontal: restringe filas (WHERE). Vertical: restringe columnas. La que guarda los datos es una vista materializada. |
| 16 | **c** | RA3.a | Con WITH CHECK OPTION, un INSERT o UPDATE a través de la vista que dejara la fila fuera de la vista se rechaza (ORA-01402 en Oracle). Para solo lectura existe WITH READ ONLY. |
| 17 | **d** | RA3.b | Un sinónimo no da permisos. Sin SELECT sobre ventas.clientes, Oracle responde ORA-00942 (como si no existiera), aunque el sinónimo sea público. |
| 18 | **d** | RA3.e | Un rol sin LOGIN funciona como grupo. La pertenencia tiene INHERIT por defecto, así que luis usa los privilegios del grupo de inmediato. SET ROLE solo hace falta con NOINHERIT. |
| 19 | **a** | RA3.h | El artículo 9 del RGPD incluye los datos relativos a la salud entre las categorías especiales. Hay que limitar al máximo quién accede (minimización) y reforzar las medidas de seguridad. |
| 20 | **d** | RA3.f | Si la sentencia lee columnas (en WHERE o en la parte derecha del SET), hace falta SELECT sobre ellas. Por eso se concede, por ejemplo, SELECT (id, precio), UPDATE (precio). |

## Parte B · Solución y criterios

Las soluciones están escritas con `exNN`: sustituye NN por tu número de cuenta. Las contraseñas son ejemplos. Hay otras soluciones válidas; lo importante es que cumplan la política de acceso y que justifiques tus decisiones.

Para cada apartado, elige el nivel de la rúbrica (0–4) que corresponde a tu entrega y calcula: puntos = valor × nivel / 4.

### Ejercicio 1. Conexión a los servidores (0,5 p · RA1)

#### 1.1 Conexión a Oracle · 0,25 p

*Criterios: RA1.j (0,25)*

Cadena de conexión (EZConnect): `exNN/<clave>@//<IP_SERVIDOR>:1521/FREEPDB1` (en SQL Developer: host, puerto 1521, *nombre de servicio* `FREEPDB1`).

```sql
SELECT SYS_CONTEXT('USERENV', 'CON_NAME') AS contenedor, USER AS usuario FROM dual;
SELECT banner_full FROM v$version;
SELECT instance_name, host_name, status FROM v$instance;
```

Resultado esperado: `FREEPDB1`, `EXNN`, *Oracle Database 23ai Free Release 23.0.0.0.0 …* (o 26ai, según la imagen), instancia `FREE` en estado `OPEN`.

Justificación: Oracle Free es una base de datos contenedora (CDB) llamada `FREE`. Los datos de las aplicaciones y los usuarios locales, como `exNN`, están en la base de datos enchufable `FREEPDB1`, que el listener publica como un servicio propio. En el servicio `FREE` (contenedor raíz) solo existen usuarios comunes `C##…`.

::: tip Criterios de nivel
**Nivel 2**: conecta y muestra contenedor, usuario, versión e instancia. **Nivel 3**: además explica CDB/PDB y por qué el servicio es FREEPDB1. **Nivel 4**: documenta con claridad los datos de conexión (host, puerto, servicio, herramienta). *Nivel 1*: no conecta, o conecta pero falta más de un dato.
:::

#### 1.2 Conexión a PostgreSQL · 0,25 p

*Criterios: RA1.j (0,25)*

```bash
psql -h <IP_SERVIDOR> -p 5432 -U exNN -d exNN
```

```sql
SELECT version(), current_user, current_database(), inet_server_port();
\conninfo
```

Justificación: al preparar el examen se revocó `CONNECT` sobre cada base de datos a `PUBLIC`. Solo su propietario `exMM` (y quien él autorice) puede conectarse. El intento falla con *FATAL: permission denied for database "exMM" — User does not have CONNECT privilege*.

::: tip Criterios de nivel
**Nivel 2**: conecta y muestra versión, usuario, base de datos y puerto. **Nivel 3**: explica el privilegio CONNECT (y lo comprueba). **Nivel 4**: documentación clara y coherente con el 1.1.
:::

### Ejercicio 2. Configuración de los SGBD (0,5 p · RA2)

#### 2.1 Parámetros de conexiones en Oracle · 0,25 p

*Criterios: RA2.g (0,25)*

```sql
SELECT name, value, isdefault, issys_modifiable, ispdb_modifiable
  FROM v$parameter
 WHERE name IN ('processes', 'sessions', 'open_cursors');
```

`processes` aparece con `ISSYS_MODIFIABLE = FALSE` (estático) e `ISPDB_MODIFIABLE = FALSE` (solo se cambia en el contenedor raíz). Por eso:

```sql
-- conectado como SYSDBA a CDB$ROOT (servicio FREE)
ALTER SYSTEM SET processes = 300 SCOPE = SPFILE;
SHUTDOWN IMMEDIATE
STARTUP
```

Hay que reiniciar la instancia (en el contenedor: `docker restart <contenedor>` también vale). `sessions` se deriva de `processes` si no se ha fijado de forma explícita, así que también aumenta.

::: tip Criterios de nivel
**Nivel 2**: consulta correcta y sentencia `ALTER SYSTEM … SCOPE=SPFILE` con reinicio. **Nivel 3**: justifica con `issys_modifiable`/`ispdb_modifiable` por qué hace falta CDB$ROOT, SPFILE y reinicio. **Nivel 4**: menciona la relación processes–sessions o cómo verificarlo después. *Nivel 1*: `SCOPE=MEMORY`/`BOTH` sin reinicio, o ejecutarlo en la PDB.
:::

#### 2.2 Acceso por red y tiempos de espera en PostgreSQL · 0,25 p

*Criterios: RA2.e (0,15) · RA2.g (0,1)*

```sql
SELECT name, setting, unit, context
  FROM pg_settings
 WHERE name IN ('listen_addresses', 'port', 'max_connections', 'idle_session_timeout');
```

```txt
# TYPE  DATABASE  USER             ADDRESS        METHOD
host    exNN      exNN_adm_jordi   10.0.20.0/24   scram-sha-256
```

```sql
ALTER SYSTEM SET idle_session_timeout = '15min';
SELECT pg_reload_conf();
```

- `pg_hba.conf` se lee en orden y se aplica **la primera línea que coincide**. La línea debe ir antes de las reglas generales (por ejemplo, `host all all all scram-sha-256` en la imagen oficial). Para que solo valga desde esa red, habría que evitar que otra línea general le deje entrar desde otro sitio, o añadir una línea `reject` para ese usuario después de la suya.
- Los cambios en `pg_hba.conf` se aplican con una recarga (`pg_ctl reload`, `SELECT pg_reload_conf()` o `docker kill -s HUP`).
- `idle_session_timeout` tiene contexto `user`: basta recargar y se aplica a las sesiones nuevas. En cambio, `listen_addresses`, `port` y `max_connections` tienen contexto `postmaster` y exigen reinicio.

::: tip Criterios de nivel
**Nivel 2**: consulta y línea pg_hba correctas (tipo host, BD, usuario, red, scram-sha-256) y sentencia del tiempo de espera. **Nivel 3**: explica el orden de pg_hba (primera coincidencia), la recarga y el contexto de cada parámetro. **Nivel 4**: tiene en cuenta las reglas generales existentes (reject o restricción) y es coherente con el ejercicio 4. *Nivel 1*: método `trust`/`md5` sin justificar, red o usuario equivocados, o confundir `idle_session_timeout` con `idle_in_transaction_session_timeout`.
:::

### Ejercicio 3. Control de acceso en Oracle: secretaría y profesorado (2,5 p · RA3)

#### 3.1 Perfil y usuarios · 0,5 p

*Criterios: RA3.c (0,3) · RA3.h (0,2)*

```sql
CREATE PROFILE exNN_perfil_personal LIMIT
  SESSIONS_PER_USER     2
  IDLE_TIME             15
  FAILED_LOGIN_ATTEMPTS 3
  PASSWORD_LOCK_TIME    1/24;

CREATE USER exNN_sec_rosa  IDENTIFIED BY "Rosa.2026"
  DEFAULT TABLESPACE users PROFILE exNN_perfil_personal;
CREATE USER exNN_prof_ana  IDENTIFIED BY "Ana.2026"
  DEFAULT TABLESPACE users PROFILE exNN_perfil_personal;
CREATE USER exNN_prof_marc IDENTIFIED BY "Marc.2026"
  DEFAULT TABLESPACE users PROFILE exNN_perfil_personal;
```

- `IDLE_TIME` se expresa en minutos y `PASSWORD_LOCK_TIME` en días (1/24 = 1 hora).
- Los usuarios no necesitan cuota: no van a crear tablas.
- El perfil se asigna en el `CREATE USER` porque la cuenta de examen no tiene `ALTER USER`.

Justificación de cada límite:

- **Sesiones**: impide compartir credenciales y abrir conexiones en masa.
- **Inactividad**: cierra sesiones olvidadas en equipos desatendidos.
- **Intentos y bloqueo**: frenan los ataques de fuerza bruta contra las contraseñas.

Los límites de recursos (`SESSIONS_PER_USER`, `IDLE_TIME`) solo se aplican con `RESOURCE_LIMIT = TRUE`, que es el valor por defecto.

::: tip Criterios de nivel
**Nivel 2**: perfil con los cuatro límites y unidades correctas, y tres usuarios con ese perfil. **Nivel 3**: justifica cada límite desde la seguridad. **Nivel 4**: comenta unidades, `RESOURCE_LIMIT` o el uso de contraseñas robustas. *Nivel 1*: unidades erróneas (por ejemplo, `PASSWORD_LOCK_TIME 1` = 1 día), falta el perfil en algún usuario o nombres sin prefijo.
:::

#### 3.2 Vistas personalizadas · 0,75 p

*Criterios: RA3.a (0,75)*

```sql
CREATE VIEW v_profesores AS
  SELECT id_profesor, nombre, idioma FROM profesores;

CREATE VIEW v_sec_alumnos AS
  SELECT id_alumno, nombre, dni, telefono, email, id_tutor FROM alumnos;

CREATE VIEW v_prof_alumnos AS
  SELECT id_alumno, nombre, telefono, email, observaciones
    FROM alumnos
   WHERE id_tutor = (SELECT id_profesor FROM profesores WHERE usuario_bd = USER)
  WITH CHECK OPTION;
```

- `v_profesores` y `v_sec_alumnos` son **verticales**: ocultan columnas. `v_sec_alumnos` es actualizable porque se basa en una sola tabla sin agregados ni DISTINCT. Las columnas que no aparecen (`observaciones`, `iban`) quedan a NULL en los INSERT.
- `v_prof_alumnos` es **mixta**: es horizontal porque filtra filas y vertical porque oculta el DNI y el IBAN.
- `USER` devuelve el usuario de la sesión **en mayúsculas** (`EXNN_PROF_ANA`), que es como está guardado en `profesores.usuario_bd`. Una sola vista sirve para todo el profesorado.
- `WITH CHECK OPTION` impide un `UPDATE`/`INSERT` que deje la fila fuera de la vista (ORA-01402). Oracle advierte que con subconsultas en el WHERE la comprobación puede no ser completa. Aquí el riesgo queda cubierto, además, porque el profesorado solo tendrá `UPDATE (observaciones)`.

::: tip Criterios de nivel
**Nivel 2**: las tres vistas funcionan con las columnas pedidas, y la de profesorado filtra por el usuario conectado. **Nivel 3**: justifica el tipo de cada vista, el uso de `USER` en mayúsculas y `WITH CHECK OPTION`. **Nivel 4**: comenta la actualizabilidad de las vistas o la limitación de CHECK OPTION con subconsultas. *Nivel 1*: el filtro de profesorado usa un nombre fijo (una vista por docente), `v_sec_alumnos` muestra IBAN u observaciones, o falta alguna vista.
:::

#### 3.3 Roles y privilegios · 0,5 p

*Criterios: RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15)*

```sql
CREATE ROLE exNN_r_personal;
GRANT CREATE SESSION TO exNN_r_personal;
GRANT SELECT ON v_profesores TO exNN_r_personal;

CREATE ROLE exNN_r_secretaria;
GRANT exNN_r_personal TO exNN_r_secretaria;
GRANT SELECT, INSERT, UPDATE ON v_sec_alumnos TO exNN_r_secretaria;
GRANT SELECT, INSERT ON matriculas TO exNN_r_secretaria;

CREATE ROLE exNN_r_profesorado;
GRANT exNN_r_personal TO exNN_r_profesorado;
GRANT SELECT, UPDATE (observaciones) ON v_prof_alumnos TO exNN_r_profesorado;

GRANT exNN_r_secretaria  TO exNN_sec_rosa;
GRANT exNN_r_profesorado TO exNN_prof_ana, exNN_prof_marc;
```

- `exNN` puede conceder `CREATE SESSION` porque lo recibió `WITH ADMIN OPTION`. Puede conceder los roles porque quien crea un rol lo recibe con `ADMIN OPTION`.
- Los roles anidados evitan repetir los privilegios comunes: si mañana todo el personal necesita una vista más, se concede una vez a `exNN_r_personal`.
- Los roles concedidos son roles por defecto, así que se activan al iniciar sesión.

::: tip Criterios de nivel
**Nivel 2**: tres roles con los privilegios pedidos, anidamiento y concesión a los usuarios. **Nivel 3**: justifica el anidamiento y el privilegio de columna. **Nivel 4**: aplica el mínimo privilegio sin excesos (nada de `UPDATE` de toda la vista, ni privilegios directos, ni acceso a la tabla `alumnos`). *Nivel 1*: privilegios concedidos directamente a los usuarios, `UPDATE` sin limitar a la columna, o acceso a `alumnos` en vez de a las vistas.
:::

#### 3.4 Sinónimos · 0,25 p

*Criterios: RA3.b (0,25)*

```sql
-- como exNN
CREATE PUBLIC SYNONYM exNN_mis_alumnos FOR exNN.v_prof_alumnos;
GRANT CREATE SYNONYM TO exNN_sec_rosa;

-- como exNN_sec_rosa
CREATE SYNONYM alumnos FOR exNN.v_sec_alumnos;
SELECT * FROM alumnos;
```

`exNN` puede conceder `CREATE SYNONYM` porque lo tiene `WITH ADMIN OPTION`. El sinónimo de Rosa no necesita cuota porque no ocupa espacio. Un sinónimo es solo un nombre alternativo y **no concede privilegios**: Rosa ve los datos porque su rol tiene `SELECT` sobre la vista. Un usuario sin ese privilegio recibiría ORA-00942 aunque use el sinónimo público.

::: tip Criterios de nivel
**Nivel 2**: crea los dos sinónimos y concede `CREATE SYNONYM` a Rosa. **Nivel 3**: explica que el sinónimo no da permisos (y lo demuestra). **Nivel 4**: comenta el orden de resolución de nombres o la diferencia público/privado. *Nivel 1*: el sinónimo privado se crea en el esquema `exNN` (no le sirve a Rosa) o se concede un privilegio excesivo (`CREATE ANY SYNONYM`, `CREATE PUBLIC SYNONYM`).
:::

#### 3.5 Verificación · 0,5 p

*Criterios: RA3.d (0,3) · RA3.h (0,2)*

```sql
-- como exNN_prof_ana
SELECT * FROM exNN_mis_alumnos;                     -- alumnos 1, 2 y 6
UPDATE exNN_mis_alumnos SET observaciones = 'Revisado' WHERE id_alumno = 1;  -- 1 fila
UPDATE exNN_mis_alumnos SET telefono = '600000000' WHERE id_alumno = 1;      -- ORA-01031
UPDATE exNN_mis_alumnos SET observaciones = 'X' WHERE id_alumno = 3;         -- 0 filas
SELECT iban FROM exNN.alumnos;                      -- ORA-00942
SELECT * FROM session_roles;           -- EXNN_R_PROFESORADO, EXNN_R_PERSONAL
SELECT * FROM user_resource_limits;
COMMIT;

-- como exNN (en una sesión nueva, para tener activos los roles creados)
SELECT grantee, table_name, privilege FROM user_tab_privs_made ORDER BY 1, 2;
SELECT grantee, table_name, column_name, privilege FROM user_col_privs_made;
SELECT role, privilege FROM role_sys_privs WHERE role LIKE 'EXNN%';
SELECT role, granted_role FROM role_role_privs WHERE role LIKE 'EXNN%';
SELECT role, table_name, column_name, privilege FROM role_tab_privs WHERE role LIKE 'EXNN%';
```

| Prueba (como Ana) | Esperado | Obtenido |
|---|---|---|
| `SELECT` de `exNN_mis_alumnos` | Solo 1, 2 y 6 | ✔ |
| `UPDATE` de observaciones (alumno 1) | 1 fila | ✔ |
| `UPDATE` de teléfono | ORA-01031 | ✔ |
| `UPDATE` de observaciones (alumno 3, de Marc) | 0 filas | ✔ |
| `SELECT iban FROM exNN.alumnos` | ORA-00942 | ✔ |
| `SESSION_ROLES` | R_PROFESORADO y R_PERSONAL | ✔ |
| `USER_RESOURCE_LIMITS` | SESSIONS_PER_USER 2, IDLE_TIME 15 | ✔ |

- **RGPD**: aplica la *minimización* (art. 5.1.c) y la *confidencialidad* (arts. 5.1.f y 32). Las observaciones, que pueden contener datos de salud (categoría especial, art. 9), solo las ve el tutor. El IBAN no lo ve ni secretaría ni el profesorado.
- **Cuadro de pruebas**: deja constancia de las medidas y de que se ha comprobado que funcionan (responsabilidad proactiva).

::: tip Criterios de nivel
**Nivel 2**: realiza las pruebas como Ana y las consultas al diccionario, con su salida. **Nivel 3**: presenta el cuadro de pruebas con esperado/obtenido y relaciona la política con el RGPD (minimización, datos de salud). **Nivel 4**: interpreta los errores (ORA-01031 frente a ORA-00942, 0 filas por el filtro de la vista) y comprueba también a Rosa o Marc. *Nivel 1*: solo consultas del diccionario o solo pruebas, sin salida.
:::

### Ejercicio 4. Control de acceso en PostgreSQL: administración y dirección (2,5 p · RA3)

#### 4.1 Usuarios y rol base · 0,5 p

*Criterios: RA3.c (0,3) · RA3.h (0,2)*

```sql
CREATE ROLE exNN_r_base NOLOGIN;
GRANT CONNECT ON DATABASE exNN TO exNN_r_base;
GRANT USAGE ON SCHEMA academia TO exNN_r_base;

CREATE ROLE exNN_adm_jordi LOGIN PASSWORD 'Jordi.2026'
  CONNECTION LIMIT 2 VALID UNTIL '2027-06-30';
CREATE ROLE exNN_dir_elena LOGIN PASSWORD 'Elena.2026'
  CONNECTION LIMIT 1 VALID UNTIL '2027-06-30';
```

- **Rol base**: sin `CONNECT` no se puede abrir sesión en la base de datos, porque se revocó a `PUBLIC`. Sin `USAGE` en el esquema no se puede acceder a ningún objeto de `academia`, aunque se tengan privilegios sobre él.
- **`CONNECTION LIMIT`**: limita las sesiones simultáneas.
- **`VALID UNTIL`**: hace caducar la contraseña, lo que es útil para cuentas temporales o de curso. Equivale en parte a un perfil de Oracle.

::: tip Criterios de nivel
**Nivel 2**: rol base con CONNECT y USAGE, y dos usuarios con LOGIN, límite y caducidad. **Nivel 3**: justifica CONNECT/USAGE y cada atributo. **Nivel 4**: relaciona con el perfil de Oracle del ejercicio 3 o con la seguridad de las cuentas. *Nivel 1*: falta CONNECT o USAGE (los usuarios no podrán trabajar), o no hay límites.
:::

#### 4.2 Vistas · 0,5 p

*Criterios: RA3.a (0,5)*

```sql
CREATE VIEW academia.v_adm_matriculas AS
  SELECT m.id_matricula, a.nombre AS alumno, p.idioma, m.curso, m.fecha,
         m.importe, m.pagada
    FROM academia.matriculas m
    JOIN academia.alumnos a    ON a.id_alumno   = m.id_alumno
    JOIN academia.profesores p ON p.id_profesor = m.id_profesor;

CREATE VIEW academia.v_adm_cobros AS
  SELECT id_alumno, nombre, dni, iban FROM academia.alumnos;

CREATE VIEW academia.v_dir_estadisticas AS
  SELECT p.idioma, m.curso, count(*) AS matriculas, sum(m.importe) AS facturado,
         round(100.0 * count(*) FILTER (WHERE m.pagada) / count(*), 1) AS pct_pagadas
    FROM academia.matriculas m
    JOIN academia.profesores p ON p.id_profesor = m.id_profesor
   GROUP BY p.idioma, m.curso;
```

- `v_adm_matriculas` **no es actualizable automáticamente** porque tiene JOIN: *Views that do not select from a single table or view are not automatically updatable*. Para marcar el pago se concederá `UPDATE (pagada)` sobre la tabla, con `SELECT` de las columnas que use el WHERE (apartado 4.3).
- `v_dir_estadisticas` solo da datos agregados, sin datos personales.

::: tip Criterios de nivel
**Nivel 2**: las tres vistas devuelven lo pedido (JOIN, agregados y porcentaje). **Nivel 3**: justifica la no actualizabilidad y la solución con privilegio de columna. **Nivel 4**: nombres de columna claros, porcentaje correcto con decimales, y comenta que dirección no ve datos personales. *Nivel 1*: estadísticas sin GROUP BY, o con datos personales.
:::

#### 4.3 Roles y privilegios · 0,5 p

*Criterios: RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15)*

```sql
CREATE ROLE exNN_r_administracion NOLOGIN;
CREATE ROLE exNN_r_direccion NOLOGIN;
GRANT exNN_r_base TO exNN_r_administracion, exNN_r_direccion;

GRANT SELECT ON academia.v_adm_matriculas, academia.v_adm_cobros TO exNN_r_administracion;
GRANT SELECT (id_matricula, pagada), UPDATE (pagada)
   ON academia.matriculas TO exNN_r_administracion;
GRANT SELECT ON academia.v_dir_estadisticas TO exNN_r_direccion;

GRANT exNN_r_administracion TO exNN_adm_jordi;
GRANT exNN_r_direccion      TO exNN_dir_elena;
```

- `UPDATE (pagada)` limita la modificación a esa columna.
- El `SELECT (id_matricula, pagada)` hace falta porque `UPDATE … WHERE id_matricula = 3` lee la columna `id_matricula`. Sin él, el UPDATE fallaría con *permission denied*.
- Las vistas se ejecutan con los permisos de su propietario (`exNN`), así que no hace falta dar acceso a las tablas `alumnos` ni `profesores`.
- Como `exNN` creó los roles, tiene `ADMIN OPTION` sobre ellos (PostgreSQL 16) y puede concederlos.

::: tip Criterios de nivel
**Nivel 2**: roles, pertenencia a `exNN_r_base`, privilegios y concesión correctos (Jordi puede marcar el pago). **Nivel 3**: justifica `UPDATE (pagada)` y el `SELECT` de columnas del WHERE. **Nivel 4**: mínimo privilegio estricto (sin `SELECT` de toda la tabla `matriculas`) y explica el modelo de permisos de las vistas. *Nivel 1*: `UPDATE` de toda la tabla, o no se puede marcar el pago.
:::

#### 4.4 Ruta de búsqueda · 0,25 p

*Criterios: RA3.b (0,25)*

```sql
ALTER ROLE exNN_adm_jordi IN DATABASE exNN SET search_path = academia;
ALTER ROLE exNN_dir_elena IN DATABASE exNN SET search_path = academia;
```

- PostgreSQL no tiene sinónimos: el equivalente para no escribir el esquema es `search_path`.
- Los valores de configuración de un rol (`ALTER ROLE … SET`) **no se heredan** de los roles de los que es miembro, así que hay que ponerlos en cada usuario.
- Se aplican en la **siguiente** conexión.
- `IN DATABASE exNN` evita que afecte a otras bases de datos.

::: tip Criterios de nivel
**Nivel 2**: `search_path` configurado en los dos usuarios y comprobado con `SHOW search_path`. **Nivel 3**: explica que no se hereda del grupo y que se aplica al reconectar. **Nivel 4**: lo limita a la base de datos y lo relaciona con los sinónimos de Oracle. *Nivel 1*: lo pone solo en el rol de grupo, o usa `SET search_path` en una sesión.
:::

#### 4.5 Cambios en la política y verificación · 0,75 p

*Criterios: RA3.f (0,2) · RA3.c (0,15) · RA3.e (0,15) · RA3.d (0,25)*

```sql
-- como exNN_adm_jordi
SELECT * FROM v_adm_matriculas;
UPDATE matriculas SET pagada = true WHERE id_matricula = 3;  -- UPDATE 1
UPDATE matriculas SET importe = 0 WHERE id_matricula = 3;    -- permission denied

-- como exNN: 1. quitar el IBAN
CREATE OR REPLACE VIEW academia.v_adm_cobros AS
  SELECT id_alumno, nombre, dni FROM academia.alumnos;  -- ERROR: cannot drop columns from view
DROP VIEW academia.v_adm_cobros;
CREATE VIEW academia.v_adm_cobros AS
  SELECT id_alumno, nombre, dni FROM academia.alumnos;
GRANT SELECT ON academia.v_adm_cobros TO exNN_r_administracion;

-- 2. suprimir la dirección
DROP ROLE exNN_dir_elena;
DROP ROLE exNN_r_direccion;   -- ERROR: privileges for view academia.v_dir_estadisticas
REVOKE SELECT ON academia.v_dir_estadisticas FROM exNN_r_direccion;
DROP ROLE exNN_r_direccion;

-- verificación
\dp academia.*
\drg exNN*
SELECT grantee, table_name, column_name, privilege_type
  FROM information_schema.column_privileges
 WHERE table_schema = 'academia' AND grantee LIKE 'exNN\_%';
```

- **IBAN**: `CREATE OR REPLACE VIEW` no puede quitar columnas, hay que borrar la vista y volverla a crear. Al hacerlo se pierden sus privilegios y hay que concederlos de nuevo. Otra solución válida es crear una vista nueva sin IBAN y revocar `SELECT` de la antigua.
- **`DROP ROLE`**: no se puede borrar un rol que tiene privilegios concedidos. `DROP OWNED BY exNN_r_direccion` **no** funciona aquí: *Only roles with privileges of role … may drop objects owned by it*, porque `exNN` tiene ADMIN sobre el rol pero no lo hereda. Hay que revocar explícitamente. La pertenencia a `exNN_r_base` desaparece al borrar el rol.
- **Catálogo**: `\dp` debe mostrar que `exNN_r_direccion` ya no aparece y que `v_adm_cobros` ya no tiene IBAN.

::: tip Criterios de nivel
**Nivel 2**: pruebas como Jordi, cambios aplicados (el IBAN ya no es accesible y la dirección está borrada) y consulta del catálogo. **Nivel 3**: justifica los errores (`cannot drop columns from view`, dependencias del rol) y la solución elegida. **Nivel 4**: vuelve a conceder los privilegios de la vista recreada y comprueba el resultado final con el catálogo y con Jordi. *Nivel 1*: el IBAN sigue accesible, el rol no se borra, o falta la verificación.
:::

## Ponderación

| Elemento | RA | Criterios (puntos) | Puntos |
|---|---|---|---:|
| Test, preguntas 1–5 | RA1 | RA1.a (0,2) · RA1.b (0,2) · RA1.d (0,2) · RA1.h (0,2) · RA1.j (0,2) | 1 |
| Test, preguntas 6–10 | RA2 | RA2.a (0,4) · RA2.e (0,2) · RA2.g (0,2) · RA2.f (0,2) | 1 |
| Test, preguntas 11–20 | RA3 | RA3.c (0,2) · RA3.f (0,6) · RA3.d (0,2) · RA3.a (0,4) · RA3.b (0,2) · RA3.e (0,2) · RA3.h (0,2) | 2 |
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
| Práctico 4.5 Cambios en la política y verificación | RA3 | RA3.f (0,2) · RA3.c (0,15) · RA3.e (0,15) · RA3.d (0,25) | 0,75 |

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
| RA1.d | Se ha identificado el software necesario para llevar a cabo la instalación. | T3 | 0,2 | 0 | 0,2 |
| RA1.h | Se ha interpretado la información suministrada por los mensajes de error y ficheros de registro. | T4 | 0,2 | 0 | 0,2 |
| RA1.j | Se ha verificado el funcionamiento del sistema gestor de bases de datos. | T5, 1.1, 1.2 | 0,2 | 0,5 | 0,7 |
| RA2.a | Se han descrito las condiciones de inicio y parada del sistema gestor. | T6, T7 | 0,4 | 0 | 0,4 |
| RA2.e | Se ha configurado la conectividad en red del sistema gestor. | T8, 2.2 | 0,2 | 0,15 | 0,35 |
| RA2.f | Se han definido las características por defecto de las bases de datos. | T10 | 0,2 | 0 | 0,2 |
| RA2.g | Se han definido los parámetros relativos a las conexiones. | T9, 2.1, 2.2 | 0,2 | 0,35 | 0,55 |
| RA3.a | Se han creado vistas personalizadas para cada tipo de usuario. | T15, T16, 3.2, 4.2 | 0,4 | 1,25 | 1,65 |
| RA3.b | Se han creado sinónimos de tablas y vistas. | T17, 3.4, 4.4 | 0,2 | 0,5 | 0,7 |
| RA3.c | Se han definido y eliminado cuentas de usuario. | T11, 3.1, 4.1, 4.5 | 0,2 | 0,75 | 0,95 |
| RA3.d | Se han identificado los privilegios sobre las bases de datos y sus elementos. | T14, 3.5, 4.5 | 0,2 | 0,55 | 0,75 |
| RA3.e | Se han agrupado y desagrupado privilegios. | T18, 3.3, 4.3, 4.5 | 0,2 | 0,55 | 0,75 |
| RA3.f | Se han asignado y eliminado privilegios a usuarios. | T12, T13, T20, 3.3, 4.3, 4.5 | 0,6 | 0,5 | 1,1 |
| RA3.g | Se han asignado y eliminado grupos de privilegios a usuarios. | 3.3, 4.3 | 0 | 0,3 | 0,3 |
| RA3.h | Se ha garantizado el cumplimiento de los requisitos de seguridad. | T19, 3.1, 3.5, 4.1 | 0,2 | 0,6 | 0,8 |

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
