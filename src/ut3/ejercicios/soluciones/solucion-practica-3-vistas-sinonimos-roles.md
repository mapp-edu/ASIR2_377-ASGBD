---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 3: vistas, sinónimos y roles"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 3: vistas, sinónimos y roles

::: tip Solución de referencia
Resolución de referencia de la [Práctica 3](../practica-3-vistas-sinonimos-roles), con los resultados esperados, los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

La práctica se puede hacer con PostgreSQL o con Oracle. La solución tiene una parte para cada uno:

- **[PostgreSQL](#solucion-con-postgresql):** todas las órdenes y salidas se han obtenido en **PostgreSQL 16**.
- **[Oracle](#solucion-con-oracle):** misma estructura, adaptada a Oracle a partir de su documentación; **no se ha podido ejecutar**. Conviene probarla antes de usarla como modelo.

No hay un único diseño correcto. Lo que se evalúa es que cada tipo de usuario vea **exactamente** lo que dicen los requisitos y que la tabla de pruebas lo demuestre.

## Diseño de las vistas

| Vista | Base | Tipo | Columnas | Filas | Privilegios del rol |
|:---|:---|:---|:---|:---|:---|
| `v_rec_pacientes` | `pacientes` | vertical | id, nombre, teléfono | todas | `SELECT` |
| `v_rec_citas` | `citas` | vertical | id, paciente, médico, fecha | todas | `SELECT`, `INSERT`, `UPDATE (fecha)` |
| `v_med_pacientes` | `pacientes` | vertical y horizontal | id, nombre, DNI, teléfono, diagnóstico | solo pacientes con cita del médico conectado | `SELECT`, `UPDATE (diagnostico)` |
| `v_con_citas` | `citas` | vertical | id, paciente, fecha, importe, pagada | todas | `SELECT`, `UPDATE (pagada)` |
| `v_con_pacientes` | `pacientes` | vertical | id, nombre, IBAN | todas | `SELECT` |
| `v_dir_estadisticas` | `citas` + `medicos` | agregada | médico, mes, n.º de citas, importe total | — | `SELECT` |

Decisiones que conviene ver justificadas:

- **Una vista por tabla** cuando el usuario tiene que modificar datos: una vista con `JOIN` no es actualizable en PostgreSQL. Por eso contabilidad tiene dos vistas y no una con citas e IBAN juntos.
- **El privilegio de modificación por columna** (`UPDATE (fecha)`, `UPDATE (diagnostico)`, `UPDATE (pagada)`) es lo que hace que recepción solo pueda cambiar la fecha y el médico solo el diagnóstico. Una vista con todas las columnas y `UPDATE` sin columnas no cumple los requisitos.
- **El filtro del médico** usa una subconsulta en el `WHERE` en lugar de un `JOIN`: así la vista sigue siendo actualizable y cada paciente aparece una sola vez aunque tenga varias citas.
- **Recepción ve el `id_paciente`**: lo necesita para crear citas. El nombre del paciente identifica a la persona, pero no es un dato de salud.

## Solución con PostgreSQL

### Datos de partida

Datos de prueba: 6 pacientes, 3 médicos y 10 citas. Laura García (`med_garcia`) tiene citas con los pacientes 1, 2, 5 y 6; Jordi López (`med_lopez`), con los pacientes 1, 2 y 4. La paciente 1 es de los dos, lo que sirve para comprobar el filtro.

```sql
-- como postgres
CREATE ROLE clinica LOGIN PASSWORD 'Clinica_2026';
CREATE DATABASE clinica OWNER clinica;
\c clinica
CREATE SCHEMA clinica AUTHORIZATION clinica;
SET ROLE clinica;
SET search_path = clinica;
-- CREATE TABLE medicos / pacientes / citas: como en el enunciado
INSERT INTO medicos VALUES
 (1, 'Laura García', 'Medicina general', 'med_garcia'),
 (2, 'Jordi López',  'Cardiología',      'med_lopez'),
 (3, 'Sara Ferrer',  'Dermatología',     'med_ferrer');
-- 6 pacientes y 10 citas
```

En PostgreSQL, `current_user` devuelve el nombre en minúsculas, igual que se guarda en `usuario_bd`.

### Parte 1. Vistas

#### 1–2. Creación

```sql
-- como clinica, en el esquema clinica
CREATE VIEW v_rec_pacientes AS
  SELECT id_paciente, nombre, telefono FROM pacientes;

CREATE VIEW v_rec_citas AS
  SELECT id_cita, id_paciente, id_medico, fecha FROM citas;

CREATE VIEW v_med_pacientes AS
  SELECT id_paciente, nombre, dni, telefono, diagnostico
  FROM pacientes p
  WHERE id_paciente IN (SELECT c.id_paciente
                        FROM citas c JOIN medicos m ON m.id_medico = c.id_medico
                        WHERE m.usuario_bd = current_user)
  WITH CHECK OPTION;

CREATE VIEW v_con_citas AS
  SELECT id_cita, id_paciente, fecha, importe, pagada FROM citas;

CREATE VIEW v_con_pacientes AS
  SELECT id_paciente, nombre, iban FROM pacientes;

CREATE VIEW v_dir_estadisticas AS
  SELECT m.nombre AS medico, to_char(c.fecha, 'YYYY-MM') AS mes,
         count(*) AS num_citas, sum(c.importe) AS importe_total
  FROM citas c JOIN medicos m ON m.id_medico = c.id_medico
  GROUP BY m.nombre, to_char(c.fecha, 'YYYY-MM');
```

La vista del médico funciona aunque la consulte otro usuario porque, en PostgreSQL, una vista accede a las tablas con los permisos de su **propietario** (`clinica`), pero `current_user` sigue siendo el usuario conectado. Explicarlo es una evidencia de nivel 4 en 3.a.

#### 3. Vistas actualizables

```sql
SELECT table_name, is_updatable, is_insertable_into, check_option
FROM information_schema.views WHERE table_schema = 'clinica' ORDER BY 1;
```

```txt
     table_name     | is_updatable | is_insertable_into | check_option
--------------------+--------------+--------------------+--------------
 v_con_citas        | YES          | YES                | NONE
 v_con_pacientes    | YES          | YES                | NONE
 v_dir_estadisticas | NO           | NO                 | NONE
 v_med_pacientes    | YES          | YES                | CASCADED
 v_rec_citas        | YES          | YES                | NONE
 v_rec_pacientes    | YES          | YES                | NONE
```

- Son actualizables las vistas sobre **una sola tabla**, sin `GROUP BY`, `DISTINCT` ni funciones de agregado. `v_dir_estadisticas` no lo es, y el error lo explica:

  ```txt
  ERROR:  cannot update view "v_dir_estadisticas"
  DETAIL:  Views containing GROUP BY are not automatically updatable.
  ```

- «Actualizable» no significa que cualquier inserción funcione: en `v_rec_pacientes` un `INSERT` fallaría porque falta `dni`, que es `NOT NULL`. Señalarlo es una evidencia de nivel 4.
- `WITH CHECK OPTION` solo tiene sentido en la vista que **filtra filas**, `v_med_pacientes`. Prueba con un usuario que no es médico (el propietario):

  ```txt
  clinica=> INSERT INTO clinica.v_med_pacientes VALUES (7, 'Prueba', '77777777G', NULL, NULL);
  ERROR:  new row violates check option for view "v_med_pacientes"
  DETAIL:  Failing row contains (7, Prueba, 77777777G, null, null, null).
  ```

#### 4. Vistas en el diccionario

```sql
\dv clinica.*
SELECT viewname, definition FROM pg_views WHERE schemaname = 'clinica';
```

```txt
 v_med_pacientes |  SELECT id_paciente, nombre, dni, telefono, diagnostico
                 |    FROM clinica.pacientes p
                 |   WHERE (id_paciente IN ( SELECT c.id_paciente
                 |            FROM (clinica.citas c JOIN clinica.medicos m ON ((m.id_medico = c.id_medico)))
                 |           WHERE ((m.usuario_bd)::text = CURRENT_USER)));
```

### Parte 2. Roles

#### 5–7. Jerarquía, privilegios y usuarios

```sql
-- como postgres, en la base de datos clinica
REVOKE CONNECT ON DATABASE clinica FROM PUBLIC;

CREATE ROLE personal_clinica NOLOGIN;
GRANT CONNECT ON DATABASE clinica TO personal_clinica;
GRANT USAGE ON SCHEMA clinica TO personal_clinica;

CREATE ROLE recepcion    NOLOGIN IN ROLE personal_clinica;
CREATE ROLE medico       NOLOGIN IN ROLE personal_clinica;
CREATE ROLE contabilidad NOLOGIN IN ROLE personal_clinica;
CREATE ROLE direccion    NOLOGIN IN ROLE personal_clinica;

SET ROLE clinica;      -- los privilegios sobre las vistas los concede su propietario
GRANT SELECT                         ON clinica.v_rec_pacientes    TO recepcion;
GRANT SELECT, INSERT, UPDATE (fecha) ON clinica.v_rec_citas        TO recepcion;
GRANT SELECT, UPDATE (diagnostico)   ON clinica.v_med_pacientes    TO medico;
GRANT SELECT, UPDATE (pagada)        ON clinica.v_con_citas        TO contabilidad;
GRANT SELECT                         ON clinica.v_con_pacientes    TO contabilidad;
GRANT SELECT                         ON clinica.v_dir_estadisticas TO direccion;
RESET ROLE;

CREATE ROLE rec_marta  LOGIN PASSWORD 'Marta_2026'  IN ROLE recepcion;
CREATE ROLE med_garcia LOGIN PASSWORD 'Garcia_2026' IN ROLE medico;
CREATE ROLE med_lopez  LOGIN PASSWORD 'Lopez_2026'  IN ROLE medico;
CREATE ROLE con_pau    LOGIN PASSWORD 'Pau_2026'    IN ROLE contabilidad;
CREATE ROLE dir_elena  LOGIN PASSWORD 'Elena_2026'  IN ROLE direccion;
```

- `REVOKE CONNECT ... FROM PUBLIC`: por defecto **cualquier** rol puede conectarse a cualquier base de datos. Quitarlo y dárselo solo a `personal_clinica` es lo que convierte ese rol en «lo común a todos». Es la decisión que más separa el nivel 3 del 2 en 3.e.
- `LOGIN` es un atributo de cada usuario y no se hereda (lo dicen las orientaciones del enunciado). No cuenta como «privilegio directo».

#### 8. Privilegios de los roles y roles de los usuarios

```sql
\dp clinica.*
```

```txt
 Schema  |        Name        | Type  |    Access privileges    |    Column privileges
---------+--------------------+-------+-------------------------+--------------------------
 clinica | citas              | table |                         |
 clinica | medicos            | table |                         |
 clinica | pacientes          | table |                         |
 clinica | v_con_citas        | view  | clinica=arwdDxt/clinica+| pagada:
         |                    |       | contabilidad=r/clinica  |   contabilidad=w/clinica
 clinica | v_con_pacientes    | view  | clinica=arwdDxt/clinica+|
         |                    |       | contabilidad=r/clinica  |
 clinica | v_dir_estadisticas | view  | clinica=arwdDxt/clinica+|
         |                    |       | direccion=r/clinica     |
 clinica | v_med_pacientes    | view  | clinica=arwdDxt/clinica+| diagnostico:
         |                    |       | medico=r/clinica        |   medico=w/clinica
 clinica | v_rec_citas        | view  | clinica=arwdDxt/clinica+| fecha:
         |                    |       | recepcion=ar/clinica    |   recepcion=w/clinica
 clinica | v_rec_pacientes    | view  | clinica=arwdDxt/clinica+|
         |                    |       | recepcion=r/clinica     |
```

Las tablas no tienen ningún privilegio concedido: solo el propietario accede a ellas. Leyenda: `r` = `SELECT`, `a` = `INSERT`, `w` = `UPDATE`.

```sql
SELECT grantee, table_name, column_name, privilege_type
FROM information_schema.column_privileges
WHERE table_schema = 'clinica' AND grantee <> 'clinica' AND privilege_type = 'UPDATE';
```

```txt
   grantee    |   table_name    | column_name | privilege_type
--------------+-----------------+-------------+----------------
 contabilidad | v_con_citas     | pagada      | UPDATE
 medico       | v_med_pacientes | diagnostico | UPDATE
 recepcion    | v_rec_citas     | fecha       | UPDATE
```

```sql
SELECT r.rolname AS rol, m.rolname AS miembro
FROM pg_auth_members am
JOIN pg_roles r ON r.oid = am.roleid
JOIN pg_roles m ON m.oid = am.member
WHERE r.rolname IN ('personal_clinica','recepcion','medico','contabilidad','direccion')
ORDER BY 1, 2;
```

```txt
       rol        |   miembro
------------------+--------------
 contabilidad     | con_pau
 direccion        | dir_elena
 medico           | med_garcia
 medico           | med_lopez
 personal_clinica | contabilidad
 personal_clinica | direccion
 personal_clinica | medico
 personal_clinica | recepcion
 recepcion        | rec_marta
```

En PostgreSQL 16, `\du` ya no muestra la columna «Member of»; para ver la pertenencia hay que usar `\drg` o consultar `pg_auth_members`.

### Parte 3. `search_path` en lugar de sinónimos

#### 9. `SELECT * FROM pacientes` con la vista de cada uno

Solución: un esquema por puesto, con vistas que **se llaman como las tablas**, y el `search_path` de cada usuario apuntando a su esquema.

```sql
SET ROLE clinica;
CREATE SCHEMA recepcion;  CREATE SCHEMA medico;  CREATE SCHEMA contabilidad;  CREATE SCHEMA direccion;

CREATE VIEW recepcion.pacientes    AS SELECT * FROM clinica.v_rec_pacientes;
CREATE VIEW recepcion.citas        AS SELECT * FROM clinica.v_rec_citas;
CREATE VIEW medico.pacientes       AS SELECT * FROM clinica.v_med_pacientes;
CREATE VIEW contabilidad.citas     AS SELECT * FROM clinica.v_con_citas;
CREATE VIEW contabilidad.pacientes AS SELECT * FROM clinica.v_con_pacientes;
CREATE VIEW direccion.estadisticas AS SELECT * FROM clinica.v_dir_estadisticas;

GRANT USAGE ON SCHEMA recepcion TO recepcion;          -- y así con cada esquema y su rol
GRANT SELECT                         ON recepcion.pacientes    TO recepcion;
GRANT SELECT, INSERT, UPDATE (fecha) ON recepcion.citas        TO recepcion;
GRANT SELECT, UPDATE (diagnostico)   ON medico.pacientes       TO medico;
GRANT SELECT, UPDATE (pagada)        ON contabilidad.citas     TO contabilidad;
GRANT SELECT                         ON contabilidad.pacientes TO contabilidad;
GRANT SELECT                         ON direccion.estadisticas TO direccion;
RESET ROLE;

ALTER ROLE rec_marta  SET search_path = recepcion;
ALTER ROLE med_garcia SET search_path = medico;
ALTER ROLE med_lopez  SET search_path = medico;
ALTER ROLE con_pau    SET search_path = contabilidad;
ALTER ROLE dir_elena  SET search_path = direccion;
```

::: tip El `search_path` no se hereda del rol
Lo natural sería `ALTER ROLE medico SET search_path = medico`, pero **no funciona**: la configuración de un rol solo se aplica a quien inicia sesión con ese rol, no a sus miembros. Comprobado: con el `search_path` fijado en `medico` y no en `med_lopez`, `SHOW search_path` devuelve `"$user", public` para `med_lopez`. Hay que fijarlo en cada usuario. Detectarlo es una evidencia de nivel 4 en 3.b.
:::

Diferencias con un sinónimo de Oracle que se esperan en la respuesta:

| | Sinónimo (Oracle) | `search_path` (PostgreSQL) |
|:---|:---|:---|
| Qué es | Un objeto: un alias de otro objeto concreto | Una variable de sesión: la lista de esquemas donde buscar los nombres |
| Alcance | Privado (un usuario) o público (todos) | Por sesión, por usuario o por base de datos |
| Nombre distinto del original | Sí (`pacientes` → `v_rec_pacientes`) | No: el objeto se tiene que llamar así; por eso hacen falta las vistas «puente» |
| Quién puede cambiarlo | Quien tiene privilegio para crear o borrar sinónimos | El propio usuario, en cualquier momento (`SET search_path`) |

#### 10. Un sinónimo no concede ningún privilegio

En PostgreSQL, el equivalente es comprobar que encontrar el objeto por su nombre no da acceso:

```txt
clinica=> SET search_path = clinica;
SET
clinica=> SELECT * FROM pacientes;
ERROR:  permission denied for table pacientes
```

`rec_marta` resuelve `pacientes` a la tabla `clinica.pacientes`, pero no tiene privilegios sobre ella. Un sinónimo, igual que el `search_path`, solo dice **dónde** está el objeto; el control de acceso se hace siempre sobre el objeto final.

### Parte 4. Comprobación

#### 11. Tabla de pruebas

Resultados obtenidos en PostgreSQL 16, cada usuario conectado con su cuenta y su `search_path`:

| Usuario | Operación | Esperado | Obtenido |
|:---|:---|:---|:---|
| `rec_marta` | `SELECT * FROM pacientes` | id, nombre y teléfono | ✅ 6 filas, 3 columnas |
| `rec_marta` | `SELECT diagnostico FROM pacientes` | error | ✅ `column "diagnostico" does not exist` |
| `rec_marta` | `SELECT * FROM clinica.pacientes` | error | ✅ `permission denied for table pacientes` |
| `rec_marta` | `INSERT INTO citas VALUES (11, 5, 3, DATE '2026-11-20')` | permitido | ✅ `INSERT 0 1` |
| `rec_marta` | `UPDATE citas SET fecha = ... WHERE id_cita = 11` | permitido | ✅ `UPDATE 1` |
| `rec_marta` | `UPDATE citas SET id_medico = 1 WHERE id_cita = 11` | error | ✅ `permission denied for view citas` |
| `rec_marta` | `DELETE FROM citas WHERE id_cita = 11` | error | ✅ `permission denied for view citas` |
| `med_garcia` | `SELECT ... FROM pacientes` | pacientes 1, 2, 5 y 6 | ✅ 4 filas, con diagnóstico |
| `med_garcia` | `UPDATE pacientes SET diagnostico = ... WHERE id_paciente = 1` | permitido | ✅ `UPDATE 1` |
| `med_garcia` | `UPDATE pacientes SET telefono = '0' WHERE id_paciente = 1` | error | ✅ `permission denied for view pacientes` |
| `med_garcia` | `SELECT iban FROM pacientes` | error | ✅ `column "iban" does not exist` |
| `med_garcia` | `SELECT * FROM clinica.citas` | error | ✅ `permission denied for table citas` |
| `con_pau` | citas con importe, pagada e IBAN (`JOIN` de sus dos vistas) | permitido | ✅ |
| `con_pau` | `UPDATE citas SET pagada = 'S' WHERE id_cita = 4` | permitido | ✅ `UPDATE 1` |
| `con_pau` | `UPDATE citas SET importe = 0 WHERE id_cita = 4` | error | ✅ `permission denied for view citas` |
| `con_pau` | `SELECT telefono FROM pacientes` | error | ✅ `column "telefono" does not exist` |
| `con_pau` | `SELECT diagnostico FROM clinica.v_med_pacientes` | error | ✅ `permission denied for view v_med_pacientes` |
| `dir_elena` | `SELECT * FROM estadisticas` | citas e importe por médico y mes | ✅ 6 filas |
| `dir_elena` | `SELECT * FROM clinica.v_rec_pacientes` | error | ✅ `permission denied for view v_rec_pacientes` |
| `dir_elena` | `UPDATE estadisticas SET num_citas = 0` | error | ✅ `cannot update view "v_dir_estadisticas"` |

Dos matices que conviene que el alumnado explique:

- `column "diagnostico" does not exist` no es un error de permisos: para ese usuario, la columna **no existe**, porque su vista no la tiene. Es la vista vertical haciendo su trabajo.
- Intentar acceder a la tabla original es la prueba más importante: demuestra que los usuarios solo tienen privilegios sobre las vistas.

#### 12. `med_garcia` no ve los pacientes de `med_lopez`

```txt
med_garcia                                   med_lopez
 current_user | id_paciente | nombre          id_paciente | nombre
--------------+-------------+--------------   ------------+------------
 med_garcia   |           1 | Ana Martí                 1 | Ana Martí
 med_garcia   |           2 | Pere Soler                2 | Pere Soler
 med_garcia   |           5 | Carmen Ruiz               4 | Marc Vidal
 med_garcia   |           6 | Joan Climent
```

Y si `med_garcia` intenta modificar a un paciente de `med_lopez`:

```txt
clinica=> UPDATE pacientes SET diagnostico = 'X' WHERE id_paciente = 4;
UPDATE 0
```

No da error: para ella, el paciente 4 no existe en su vista. Los pacientes compartidos (1 y 2) los ven los dos porque los dos les han atendido, y es correcto según los requisitos.

### Parte 5. Cambios en la plantilla

#### 13. `rec_marta` pasa a contabilidad

```sql
REVOKE recepcion FROM rec_marta;
GRANT contabilidad TO rec_marta;
ALTER ROLE rec_marta SET search_path = contabilidad;
```

En PostgreSQL el cambio de rol es **inmediato**, incluso en una sesión ya abierta. Comprobado con una sesión de `rec_marta` abierta antes del cambio:

```txt
[sesión abierta]  SELECT count(*) FROM pacientes;          -- 6   (antes del cambio)
[sesión abierta]  SELECT count(*) FROM recepcion.citas;    -- ERROR: permission denied for schema recepcion
[sesión abierta]  SELECT count(*) FROM contabilidad.citas; -- 11
```

El `search_path` nuevo se aplica en la siguiente sesión. No olvidar cambiarlo es parte de la tarea: si no, `rec_marta` sigue buscando en `recepcion` y todas sus consultas fallan.

#### 14. Recepción ya no puede crear citas

```sql
SET ROLE clinica;
REVOKE INSERT ON clinica.v_rec_citas FROM recepcion;
REVOKE INSERT ON recepcion.citas     FROM recepcion;
```

Para comprobar que afecta a **todos** los miembros hace falta otra persona en recepción, porque `rec_marta` ya se ha ido. Con un usuario nuevo, `rec_jose`, miembro de `recepcion`:

```txt
clinica=> INSERT INTO citas VALUES (12, 6, 1, DATE '2026-11-25');
ERROR:  permission denied for view citas
clinica=> SELECT count(*) FROM citas;
 count
-------
    11
```

Con el diseño de dos niveles (vistas en `clinica` y vistas «puente») hay que revocar en los dos. Es una desventaja del diseño que se puede mencionar.

#### 15. Eliminar el puesto de dirección

```txt
postgres=# DROP ROLE direccion;
ERROR:  role "direccion" cannot be dropped because some objects depend on it
DETAIL:  privileges for view clinica.v_dir_estadisticas
privileges for schema direccion
privileges for view direccion.estadisticas
```

Orden correcto:

```sql
DROP ROLE dir_elena;              -- el usuario se puede borrar: no tiene objetos ni privilegios propios
DROP OWNED BY direccion;          -- revoca sus privilegios (y borraría sus objetos, si tuviera)
DROP ROLE direccion;
DROP SCHEMA direccion CASCADE;    -- como clinica: el esquema puente ya no sirve
```

`DROP OWNED BY` actúa solo en la base de datos actual; si el rol tuviera privilegios en otras, habría que repetirlo en cada una. Alternativa equivalente: `REVOKE` explícito de cada privilegio.

## Solución con Oracle

::: info Órdenes no ejecutadas
Adaptación de la solución anterior a Oracle Database 23ai en la PDB `FREEPDB1`, escrita a partir de la documentación de Oracle. Conviene probarla antes de usarla como modelo.
:::

### Datos de partida y vistas

```sql
-- como system, en FREEPDB1
CREATE USER clinica IDENTIFIED BY "Clinica_2026" QUOTA UNLIMITED ON users;
GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW TO clinica;
```

- Tipos: `INT` → `NUMBER(…)`, `VARCHAR` → `VARCHAR2`.
- **`usuario_bd` en mayúsculas** (`'MED_GARCIA'`), porque `USER` devuelve el nombre en mayúsculas. Si se guarda en minúsculas, la vista del médico sale vacía: es el error más frecuente de la versión Oracle.

Las vistas son las mismas, con `USER` en lugar de `current_user`:

```sql
CREATE VIEW v_med_pacientes AS
  SELECT id_paciente, nombre, dni, telefono, diagnostico
  FROM pacientes
  WHERE id_paciente IN (SELECT c.id_paciente
                        FROM citas c JOIN medicos m ON m.id_medico = c.id_medico
                        WHERE m.usuario_bd = USER)
  WITH CHECK OPTION;
```

Vistas actualizables: `USER_UPDATABLE_COLUMNS` indica qué columnas de cada vista admiten `INSERT`, `UPDATE` y `DELETE`. `v_dir_estadisticas` no es actualizable (`GROUP BY`): `ORA-01732: data manipulation operation not legal on this view`. La documentación de Oracle advierte de que `WITH CHECK OPTION` no está garantizado si la vista contiene subconsultas; en este diseño no es un problema porque el médico solo puede modificar `diagnostico`, que no interviene en el filtro. Mencionarlo es una evidencia de nivel 4.

Diccionario: `SELECT view_name, text FROM user_views;` (como `clinica`).

### Roles y usuarios

```sql
-- como system
CREATE ROLE personal_clinica;
GRANT CREATE SESSION TO personal_clinica;
CREATE ROLE recepcion;     GRANT personal_clinica TO recepcion;
CREATE ROLE medico;        GRANT personal_clinica TO medico;
CREATE ROLE contabilidad;  GRANT personal_clinica TO contabilidad;
CREATE ROLE direccion;     GRANT personal_clinica TO direccion;

-- como clinica
GRANT SELECT                         ON v_rec_pacientes    TO recepcion;
GRANT SELECT, INSERT, UPDATE (fecha) ON v_rec_citas        TO recepcion;
GRANT SELECT, UPDATE (diagnostico)   ON v_med_pacientes    TO medico;
GRANT SELECT, UPDATE (pagada)        ON v_con_citas        TO contabilidad;
GRANT SELECT                         ON v_con_pacientes    TO contabilidad;
GRANT SELECT                         ON v_dir_estadisticas TO direccion;

-- como system
CREATE USER rec_marta  IDENTIFIED BY "Marta_2026";   GRANT recepcion    TO rec_marta;
CREATE USER med_garcia IDENTIFIED BY "Garcia_2026";  GRANT medico       TO med_garcia;
CREATE USER med_lopez  IDENTIFIED BY "Lopez_2026";   GRANT medico       TO med_lopez;
CREATE USER con_pau    IDENTIFIED BY "Pau_2026";     GRANT contabilidad TO con_pau;
CREATE USER dir_elena  IDENTIFIED BY "Elena_2026";   GRANT direccion    TO dir_elena;
```

En Oracle, «lo común a todos» es `CREATE SESSION`: sin él nadie puede conectarse. Los roles concedidos son roles por defecto, así que se activan al iniciar sesión.

Diccionario:

```sql
SELECT grantee, table_name, privilege FROM dba_tab_privs
 WHERE owner = 'CLINICA' ORDER BY grantee;                 -- privilegios de tabla y vista
SELECT grantee, table_name, column_name, privilege FROM dba_col_privs
 WHERE owner = 'CLINICA';                                  -- UPDATE por columna
SELECT grantee, privilege FROM dba_sys_privs WHERE grantee = 'PERSONAL_CLINICA';
SELECT grantee, granted_role FROM dba_role_privs
 WHERE granted_role IN ('PERSONAL_CLINICA','RECEPCION','MEDICO','CONTABILIDAD','DIRECCION');
-- y, conectado como cada usuario: SELECT * FROM session_roles;
```

Los privilegios de `UPDATE` por columna **no** aparecen en `DBA_TAB_PRIVS`, sino en `DBA_COL_PRIVS`: si una entrega dice que el médico «no tiene UPDATE», suele ser por esto.

### Sinónimos

```sql
-- como system (CREATE ANY SYNONYM y CREATE PUBLIC SYNONYM)
CREATE SYNONYM rec_marta.pacientes  FOR clinica.v_rec_pacientes;
CREATE SYNONYM rec_marta.citas      FOR clinica.v_rec_citas;
CREATE SYNONYM med_garcia.pacientes FOR clinica.v_med_pacientes;
CREATE SYNONYM med_lopez.pacientes  FOR clinica.v_med_pacientes;
CREATE SYNONYM con_pau.citas        FOR clinica.v_con_citas;
CREATE SYNONYM con_pau.pacientes    FOR clinica.v_con_pacientes;
CREATE PUBLIC SYNONYM estadisticas  FOR clinica.v_dir_estadisticas;
```

Razonamiento esperado:

- **Privados** para `pacientes` y `citas`: un sinónimo público tiene un único destino para todos los usuarios, y aquí cada puesto necesita una vista distinta con el mismo nombre.
- **Público** para `estadisticas`: un objeto que no tiene equivalente en otros puestos. Solo lo podrá consultar quien tenga privilegio sobre la vista.
- Orden de resolución de un nombre: objeto del propio esquema → sinónimo privado → sinónimo público.

Prueba de que un sinónimo no da privilegios:

```sql
CREATE PUBLIC SYNONYM tabla_pacientes FOR clinica.pacientes;   -- como system
SELECT * FROM tabla_pacientes;                                  -- como rec_marta
-- ORA-00942: table or view does not exist
DROP PUBLIC SYNONYM tabla_pacientes;
```

Oracle responde que el objeto «no existe» en lugar de «sin permisos», para no revelar su existencia.

### Comprobación

La tabla de pruebas es la misma que en PostgreSQL; cambian los mensajes:

| Situación | Mensaje en Oracle |
|:---|:---|
| Columna que no está en la vista | `ORA-00904: "DIAGNOSTICO": invalid identifier` |
| Acceso directo a la tabla | `ORA-00942: table or view does not exist` |
| `UPDATE` de una columna no concedida, o `DELETE` sin privilegio | `ORA-01031: insufficient privileges` |
| Paciente de otro médico | `0 rows updated.` |
| Modificar la vista de estadísticas | `ORA-01732: data manipulation operation not legal on this view` |

### Cambios en la plantilla

```sql
-- 13
REVOKE recepcion FROM rec_marta;
GRANT contabilidad TO rec_marta;
DROP SYNONYM rec_marta.pacientes;   DROP SYNONYM rec_marta.citas;
CREATE SYNONYM rec_marta.pacientes FOR clinica.v_con_pacientes;
CREATE SYNONYM rec_marta.citas     FOR clinica.v_con_citas;
-- 14 (como clinica)
REVOKE INSERT ON v_rec_citas FROM recepcion;
-- 15
DROP USER dir_elena;
DROP ROLE direccion;
DROP PUBLIC SYNONYM estadisticas;
```

Diferencias con PostgreSQL que se espera ver explicadas:

- **Cuándo tiene efecto:** en Oracle, conceder o revocar privilegios de sistema o de objeto tiene efecto inmediato, pero conceder o revocar **un rol** solo tiene efecto en las sesiones nuevas o tras un `SET ROLE`. En PostgreSQL, el cambio de rol es inmediato (paso 13).
- **Borrar un rol:** en Oracle `DROP ROLE` revoca automáticamente sus privilegios y lo quita a sus usuarios, sin pasos previos. Lo que hay que hacer antes es borrar `dir_elena` (con `CASCADE` si tuviera sinónimos privados u otros objetos en su esquema) y el sinónimo público, que quedaría apuntando a una vista que ya nadie puede usar. En PostgreSQL hay que revocar antes los privilegios (`DROP OWNED BY`).

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **3.a** | Faltan vistas o algún perfil ve datos que no debe (diagnóstico, IBAN). | Una o varias vistas por perfil, con las filas y columnas pedidas; la del médico filtra por la cuenta conectada. | Indica el tipo de cada vista, cuáles son actualizables y por qué, y aplica `WITH CHECK OPTION` donde tiene sentido. | Justifica el diseño (una tabla por vista para poder modificar, subconsulta en el filtro, `UPDATE` por columna) y explica por qué funciona `current_user` o `USER` dentro de la vista. |
| **3.b** | No hay sinónimos ni solución equivalente. | Sinónimos públicos y privados (o `search_path`) que funcionan. | Explica cuándo usar cada tipo y demuestra que un sinónimo no da privilegios. | Detecta y resuelve los límites (un sinónimo público tiene un único destino; el `search_path` no se hereda del rol). |
| **3.d** | No consulta el diccionario. | Muestra los privilegios de cada rol y los roles de cada usuario. | Interpreta la salida, incluidos los privilegios por columna. | Usa las vistas adecuadas para cada cosa y lo relaciona con la tabla de pruebas. |
| **3.e** | Privilegios concedidos a usuarios o sin jerarquía. | Un rol por puesto y `personal_clinica` concedido a todos ellos. | Retira un privilegio a un rol y elimina un rol, explicando lo que hace falta antes. | Resuelve lo común de verdad (`CONNECT` retirado a `PUBLIC` en PostgreSQL; `CREATE SESSION` solo en el rol común en Oracle). |
| **3.g** | Algún usuario recibe privilegios directos. | Cada usuario tiene solo su rol; se retira y se asigna un rol a `rec_marta`. | Comprueba el efecto del cambio de rol. | Explica cuándo tiene efecto el cambio en cada SGBD y actualiza también sinónimos o `search_path`. |
| **3.h** | No hay tabla de pruebas o solo prueba lo permitido. | Tabla de pruebas con una operación permitida y dos prohibidas por usuario, y la prueba de los dos médicos. | Incluye el acceso directo a las tablas y explica cada resultado. | Relaciona el resultado con el mínimo privilegio y con los datos especialmente protegidos del RGPD. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
