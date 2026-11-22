---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 1: usuarios y permisos"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 1: usuarios y permisos

::: tip Solución de referencia
Resolución de referencia de la [Práctica 1](../practica-1-usuarios-permisos), con los resultados esperados, los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

::: info Órdenes no ejecutadas
La práctica es de Oracle y no se ha podido ejecutar en un servidor Oracle. Las órdenes y los mensajes están escritos a partir de la documentación de Oracle Database 23ai y de los apuntes de la unidad; conviene probarlos antes de usarlos como modelo.
:::

## Entorno de referencia

| Elemento | Valor |
|:---|:---|
| Servidor | Oracle Database Free en el contenedor `cont-oracle` (UT1, práctica 2) |
| CDB / primera PDB | `FREE` / `FREEPDB1` |
| `ORACLE_BASE` | `/opt/oracle` |
| Cliente | SQL Developer en la máquina Linux Mint cliente |

Si el servidor Oracle está instalado directamente en la máquina (sin contenedor), las rutas pueden cambiar; vale cualquiera que el alumno o la alumna haya comprobado.

## 1. Carpeta `INFO01` en `$ORACLE_BASE`

La carpeta tiene que estar **donde la ve el proceso de Oracle** y pertenecer al usuario `oracle`. Con Oracle en un contenedor, eso significa crearla **dentro del contenedor**:

```bash
podman exec -it cont-oracle bash
echo $ORACLE_BASE            # /opt/oracle
mkdir $ORACLE_BASE/INFO01
ls -ld $ORACLE_BASE/INFO01   # drwxr-xr-x ... oracle oinstall ... /opt/oracle/INFO01
```

::: tip Error más frecuente
Crear la carpeta en el anfitrión (`/opt/oracle/INFO01` de Linux Mint) cuando Oracle está en el contenedor. El paso 3 falla entonces con:

```txt
ORA-01119: error in creating database file '/opt/oracle/INFO01/file1.dbf'
ORA-27040: file create error, unable to create file
Linux-x86_64 Error: 2: No such file or directory
```

Si la carpeta existe pero es de `root`, el error es el mismo con `Error: 13: Permission denied`. Documentar este error y su causa es una buena evidencia de 3.h.
:::

## 2. Conexión de `sys` a la primera PDB desde el cliente

Conexión en SQL Developer: usuario `sys`, rol **SYSDBA**, host la IP del servidor, puerto 1521, **nombre del servicio** `FREEPDB1`.

«Muestra los valores de la conexión»: además de la captura de la ventana de conexión, se espera una consulta que demuestre dónde se está conectado:

```sql
SELECT sys_context('USERENV', 'SESSION_USER')  AS usuario,
       sys_context('USERENV', 'CON_NAME')      AS contenedor,
       sys_context('USERENV', 'SERVICE_NAME')  AS servicio,
       sys_context('USERENV', 'IP_ADDRESS')    AS ip_cliente
FROM   dual;
```

`CON_NAME` debe ser `FREEPDB1` y `IP_ADDRESS` la del cliente: es la prueba de que la conexión es remota y a la PDB.

## 3. Tablespaces `tabs1` y `tabs2`

```sql
CREATE TABLESPACE tabs1 DATAFILE '/opt/oracle/INFO01/file1.dbf' SIZE 50M;
CREATE TABLESPACE tabs2 DATAFILE '/opt/oracle/INFO01/file2.dbf' SIZE 50M;

SELECT tablespace_name, file_name, bytes/1024/1024 AS mb
FROM   dba_data_files
WHERE  tablespace_name IN ('TABS1', 'TABS2');
```

El tamaño no lo fija el enunciado; se valora que sea coherente con la cuota de 20 MB del paso 4 (un tablespace de 10 MB no admitiría esa cuota en la práctica).

## 4. Usuario `client01`

```sql
CREATE USER client01 IDENTIFIED BY "Client_2026"
  DEFAULT TABLESPACE tabs1
  QUOTA 20M ON tabs1;
```

La contraseña va entre comillas dobles: sin comillas, Oracle la trata como un identificador, y una contraseña que empieza por un número da `ORA-00988`.

## 5. Privilegios de `client01`

```sql
GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW, CREATE SEQUENCE, CREATE PROCEDURE
  TO client01;
```

Son privilegios **de sistema**. Error frecuente: conceder los roles `CONNECT` y `RESOURCE`. Funciona, pero no es lo que pide el enunciado y da privilegios de más (`RESOURCE` incluye, por ejemplo, `CREATE TRIGGER` y `CREATE TYPE`): va contra el mínimo privilegio, que se valora en 3.h.

## 6. La vista del diccionario con el usuario

La vista es **`DBA_USERS`** (desde el propio usuario, `USER_USERS`; para ver solo nombres, `ALL_USERS`).

```sql
DESC dba_users
SELECT * FROM dba_users WHERE username = 'CLIENT01';
```

El enunciado pide **todos** los campos; la lista exacta depende de la versión (en 23ai son unos 40). Los que hay que saber interpretar:

| Campo | Valor esperado | Significado |
|:---|:---|:---|
| `USERNAME`, `USER_ID` | `CLIENT01` | Nombre (en mayúsculas) e identificador interno |
| `ACCOUNT_STATUS` | `OPEN` | Abierta; otros valores: `LOCKED`, `EXPIRED`, `EXPIRED(GRACE)`… |
| `LOCK_DATE`, `EXPIRY_DATE` | vacío / fecha | Bloqueo y caducidad de la contraseña (según el perfil) |
| `DEFAULT_TABLESPACE` | `TABS1` | Donde se crean sus objetos si no se indica otro |
| `TEMPORARY_TABLESPACE` | `TEMP` | Ordenaciones y temporales |
| `CREATED` | fecha | Creación de la cuenta |
| `PROFILE` | `DEFAULT` | Perfil de límites y contraseñas |
| `AUTHENTICATION_TYPE` | `PASSWORD` | Cómo se autentica (también `EXTERNAL`, `GLOBAL`, `NONE`) |
| `PASSWORD_VERSIONS` | `12C` | Algoritmo con el que se guarda la contraseña (la columna `PASSWORD` está vacía: el hash no se muestra) |
| `COMMON` | `NO` | Usuario local de la PDB (`YES` en `C##usucomu1`) |
| `ORACLE_MAINTAINED` | `N` | No es una cuenta interna de Oracle |
| `LAST_LOGIN` | vacío hasta que conecte | Último inicio de sesión |

Razonamiento esperado: `DBA_USERS` **no muestra la cuota ni los privilegios**. Están en otras vistas del diccionario, y consultarlas es lo que distingue el nivel 3 del 2 en 3.d:

```sql
SELECT tablespace_name, bytes, max_bytes FROM dba_ts_quotas WHERE username = 'CLIENT01';
-- TABS1  0  20971520   (max_bytes = 20 MB; -1 sería UNLIMITED)
SELECT privilege, admin_option FROM dba_sys_privs WHERE grantee = 'CLIENT01';
```

## 7. Tabla `LLIBRE` como `client01`

Nueva conexión en SQL Developer: `client01` (sin rol), servicio `FREEPDB1`.

```sql
CREATE TABLE llibre (
  codi       NUMBER(6)     CONSTRAINT llibre_pk PRIMARY KEY,
  titol      VARCHAR2(20)  NOT NULL,
  editorial  VARCHAR2(30),
  edicio     VARCHAR2(12),
  isbn       VARCHAR2(25)
);
SELECT table_name, tablespace_name FROM user_tables;    -- LLIBRE · TABS1
```

## 8. Cambio de contraseña desde `client01`

```sql
ALTER USER client01 IDENTIFIED BY "Nueva_2026" REPLACE "Client_2026";
```

Un usuario puede cambiar su propia contraseña sin el privilegio `ALTER USER`. La cláusula `REPLACE` (contraseña anterior) es obligatoria si hay una función de verificación de contraseñas en el perfil; sin ella es opcional, pero conviene acostumbrarse a ponerla. Alternativas válidas: la orden `PASSWORD` de SQL\*Plus o SQLcl, o *Restablecer contraseña* en el menú contextual de la conexión en SQL Developer. Hay que actualizar después la contraseña guardada en la conexión.

## 9. Un registro en la tabla

```sql
INSERT INTO llibre VALUES (1, 'La plaça del Diamant', 'Club Editor', '1a', '978-84-7329-187-7');
COMMIT;
```

::: tip Error frecuente
Olvidar el `COMMIT`. SQL Developer no confirma automáticamente: si `client01` no confirma, ninguna otra sesión ve la fila, y en el paso 15 `suport01` borra **0 filas**. Si una entrega muestra «0 filas eliminadas» en el paso 15, casi siempre es esto.
:::

## 10. `suport01` creado por `system`

Conexión como `system` **a la PDB** (servicio `FREEPDB1`; si se conecta a `FREE`, el usuario se intentaría crear en la raíz y daría `ORA-65096`).

```sql
CREATE USER suport01 IDENTIFIED BY "Suport_2026";
```

## 11. Tablespace por defecto de `suport01`

```sql
SELECT default_tablespace, temporary_tablespace FROM dba_users WHERE username = 'SUPORT01';
-- USERS · TEMP
SELECT property_value FROM database_properties WHERE property_name = 'DEFAULT_PERMANENT_TABLESPACE';
-- USERS
```

Se le asigna `USERS` porque es el tablespace permanente por defecto de la PDB. Para nivel 3–4: señalar que **no tiene cuota** en él, así que no podrá guardar datos en tablas propias aunque se le diera `CREATE TABLE`.

## 12. Privilegios de sistema con posibilidad de reasignarlos

```sql
GRANT CREATE SESSION, CREATE USER, CREATE ROLE TO suport01 WITH ADMIN OPTION;

SELECT privilege, admin_option FROM dba_sys_privs WHERE grantee = 'SUPORT01';
-- CREATE SESSION YES · CREATE USER YES · CREATE ROLE YES
```

Privilegios **de sistema** → `WITH ADMIN OPTION`. Si se escribe `WITH GRANT OPTION` da `ORA-01939: only the ADMIN OPTION can be specified`.

## 13. Privilegios sobre `LLIBRE` con posibilidad de reasignarlos

Lo natural es que los conceda el **propietario**:

```sql
-- conectado como client01
GRANT SELECT, INSERT, UPDATE, DELETE ON llibre TO suport01 WITH GRANT OPTION;
```

También es válido hacerlo como `system` (`GRANT ... ON client01.llibre TO suport01 WITH GRANT OPTION`), gracias al privilegio `GRANT ANY OBJECT PRIVILEGE` del rol `DBA`; en ese caso el diccionario registra a `CLIENT01` como concedente. Comprobación:

```sql
SELECT grantee, owner, table_name, privilege, grantable, grantor
FROM   dba_tab_privs
WHERE  grantee = 'SUPORT01';
-- SUPORT01 CLIENT01 LLIBRE DELETE/INSERT/SELECT/UPDATE YES CLIENT01
```

Privilegios **de objeto** → `WITH GRANT OPTION`. La diferencia con el paso 12 (`ADMIN` frente a `GRANT`, y que al revocar un privilegio de objeto se revoca **en cascada** a quien lo recibió de él, cosa que no pasa con los de sistema) es la clave de 3.f.

## 14–18. Trabajo como `suport01`

```sql
-- conectado como suport01 a FREEPDB1
DELETE FROM client01.llibre;                                      -- 1 fila eliminada
INSERT INTO client01.llibre VALUES (2, 'Tirant lo Blanc', 'Bromera', '3a', '978-84-9026-404-6');
UPDATE client01.llibre SET titol = 'Tirant lo Blanch' WHERE codi = 2;
COMMIT;
SELECT * FROM client01.llibre;
```

- Hay que escribir el esquema delante (`client01.llibre`); sin él, `ORA-00942: table or view does not exist`. Los sinónimos que lo evitan son de la práctica 3.
- `suport01` puede insertar aunque **no tiene cuota** en `TABS1`: la fila ocupa espacio del propietario de la tabla, `client01`. Explicarlo es una evidencia de nivel 4.
- El `UPDATE` con `WHERE` funciona porque `suport01` también tiene `SELECT` (sin él fallaría con `ORA-01031`; está en la guía 2 de la unidad).

## 19. Usuario común `usucomu1`

```sql
-- conexión como sys AS SYSDBA al servicio FREE (CDB$ROOT)
SHOW CON_NAME                -- CDB$ROOT
CREATE USER c##usucomu1 IDENTIFIED BY "Comu_2026" CONTAINER = ALL;
GRANT CREATE SESSION TO c##usucomu1 CONTAINER = ALL;

SELECT username, common, con_id FROM cdb_users WHERE username = 'C##USUCOMU1';
-- una fila por contenedor abierto, con COMMON = YES
```

Errores esperables, que conviene ver documentados:

- `CREATE USER usucomu1 ...` en la raíz → `ORA-65096: common user or role name must start with prefix C##` (lo fija `common_user_prefix`).
- `CREATE USER c##usucomu1 ...` conectado a la PDB → `ORA-65094: invalid local user or role name`.

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **3.c** | Falta algún usuario o el común no se crea. | Los tres usuarios, con tablespace y cuota, y el cambio de contraseña. | Explica cada cláusula y resuelve el prefijo `C##` y el contenedor correcto. | Comprueba cada usuario en el diccionario (`DBA_USERS`, `DBA_TS_QUOTAS`, `CDB_USERS`) y relaciona tablespace y cuota con la ubicación de los datos. |
| **3.d** | Solo muestra `DBA_USERS` sin interpretarla. | Explora `DBA_USERS` e identifica el tablespace por defecto. | Interpreta los campos y consulta cuotas y privilegios en las vistas adecuadas. | Distingue qué vista muestra cada cosa (`DBA_SYS_PRIVS`, `DBA_TAB_PRIVS`, `DBA_TS_QUOTAS`) y el concedente de cada privilegio. |
| **3.f** | Privilegios incompletos o confunde los tipos. | Concede todos los privilegios pedidos. | Distingue `WITH ADMIN OPTION` de `WITH GRANT OPTION` y lo comprueba en el diccionario. | Explica la diferencia al revocar (cascada en los de objeto) y por qué `UPDATE` con `WHERE` necesita `SELECT`. |
| **3.h** | No comprueba lo que puede hacer cada usuario. | Las operaciones de `suport01` funcionan y se muestran. | Comprueba también lo que **no** puede hacer cada usuario (sin esquema, sin privilegio) y usa solo los privilegios necesarios. | Documenta y explica las incidencias (carpeta en el contenedor, `COMMIT`, cuota del propietario). |

---

<small>Solucionario de elaboración propia para el módulo ASGBD, sobre la práctica adaptada de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
