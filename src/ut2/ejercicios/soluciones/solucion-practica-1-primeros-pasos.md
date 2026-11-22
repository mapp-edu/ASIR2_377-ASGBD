---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 1: primeros pasos en la administración de Oracle"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 1: primeros pasos en la administración de Oracle

::: tip Solución de referencia
Resolución de referencia de la [Práctica 1](../practica-1-primeros-pasos), con los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

## Entorno de referencia

| Elemento | Valor |
|:---|:---|
| Servidor | Linux Mint con podman y la imagen `container-registry.oracle.com/database/free` |
| Contenedor | `cont-oracle`, puerto `1521` publicado, `ORACLE_PWD=1234` |
| SID / CDB | `FREE` |
| Primera PDB | `FREEPDB1` |
| Cliente | Linux Mint con SQL Developer |

Las rutas que dependen de la versión de la imagen se indican con `<versión>`: `23ai` en las imágenes 23.4 a 23.9 y `26ai` en las más recientes (`latest`). Al corregir, da por buena la ruta que obtenga el alumno o la alumna **siempre que la haya comprobado** con la orden que se indica.

::: info Órdenes de Oracle no ejecutadas
Las órdenes de esta solución se han escrito a partir de la documentación de Oracle y de los materiales de la unidad, pero no se han podido ejecutar en un servidor Oracle. Conviene repasarlas en el aula antes de usarlas como modelo.
:::

## Desde el sistema operativo

### 1. Variables `ORACLE_SID`, `ORACLE_HOME` y `ORACLE_BASE`

Hay que obtenerlas **sin entrar en Oracle**. En el contenedor, las variables las fija la propia imagen, así que basta con leer el entorno:

```bash
# Desde el anfitrión, sin entrar en el contenedor
podman exec cont-oracle env | grep ORACLE

# O bien, dentro del contenedor
podman exec -it cont-oracle bash
echo $ORACLE_SID $ORACLE_HOME $ORACLE_BASE
cat /etc/oratab | grep -v '^#'
```

Resultado esperado:

```txt
ORACLE_SID=FREE
ORACLE_BASE=/opt/oracle
ORACLE_HOME=/opt/oracle/product/<versión>/dbhomeFree
```

`/etc/oratab` confirma la relación entre el SID y su `ORACLE_HOME` (`FREE:/opt/oracle/product/<versión>/dbhomeFree:N`).

- `ORACLE_SID`: identifica la instancia con la que trabajan las herramientas locales (`sqlplus / as sysdba`).
- `ORACLE_HOME`: directorio del software (binarios, `network/admin`, `dbs`).
- `ORACLE_BASE`: raíz de la instalación; de ella cuelgan `oradata` (datos) y `diag` (registros).

::: tip Criterio de corrección
No vale `SELECT ... FROM v$instance` ni `SHOW PARAMETER`: el enunciado pide hacerlo sin entrar en Oracle. Una respuesta de nivel 3 explica para qué sirve cada variable; una de nivel 4 explica además de dónde salen en el contenedor (variables definidas por la imagen, visibles también con `podman inspect`).
:::

### 2. Ficheros `listener.ora`, `sqlnet.ora` y `tnsnames.ora`

```bash
find / \( -name listener.ora -o -name sqlnet.ora -o -name tnsnames.ora \) 2>/dev/null
ls -l $ORACLE_HOME/network/admin/
```

Lo habitual es encontrar **más de un fichero de cada tipo**, y lo importante es saber distinguirlos:

| Ubicación | Qué es |
|:---|:---|
| `$ORACLE_HOME/network/admin/` | Ficheros que usa Oracle. En la imagen del contenedor suelen ser **enlaces simbólicos** (`ls -l` muestra `->`) hacia el directorio de configuración persistente. |
| `/opt/oracle/oradata/dbconfig/FREE/` | Ficheros reales, dentro del volumen de datos, para que la configuración sobreviva si se recrea el contenedor. |
| `$ORACLE_HOME/network/admin/samples/` | Plantillas de ejemplo. Oracle no las lee. |

La respuesta correcta no es un número fijo: depende de la imagen. Se valora que identifique cuál está en uso. Se puede confirmar con:

```bash
lsnrctl status | grep -i "parameter file"     # listener.ora que usa el listener
tnsping FREEPDB1                              # muestra el sqlnet.ora usado y cómo resuelve el alias
```

- `listener.ora`: configuración del proceso listener del **servidor** (direcciones y puerto 1521).
- `tnsnames.ora`: agenda de alias del **cliente** (alias → host, puerto y servicio). Contiene, como mínimo, `FREE` y `FREEPDB1`.
- `sqlnet.ora`: reglas de red (orden de resolución de nombres, seguridad, tiempos de espera).

### 3. Fichero SPFILE

```bash
find / -name "spfile*.ora" 2>/dev/null
ls -l $ORACLE_HOME/dbs/
```

- Nombre: `spfileFREE.ora` (formato `spfile<SID>.ora`).
- Ubicación: Oracle lo busca en `$ORACLE_HOME/dbs/`. En el contenedor, el fichero real suele estar en el directorio de configuración persistente (`/opt/oracle/oradata/dbconfig/FREE/`) y en `$ORACLE_HOME/dbs/` hay un enlace simbólico.

Comprobación posterior (cuando ya se pueda entrar en SQL\*Plus):

```sql
SQL> SHOW PARAMETER spfile
```

::: tip Criterio de corrección
Error frecuente: confundir `spfileFREE.ora` con `orapwFREE` (fichero de contraseñas) o editar el SPFILE con un editor. El SPFILE es binario y solo se modifica con `ALTER SYSTEM`.
:::

## Con SQL Developer

### 4. Conexión desde la máquina cliente como `sys` a la primera PDB

Datos de la conexión nueva:

| Campo | Valor |
|:---|:---|
| Usuario | `sys` |
| Contraseña | `1234` |
| Rol | **SYSDBA** (con `sys` es obligatorio; si no, `ORA-28009`) |
| Nombre del host | IP del servidor Linux Mint (no `localhost`) |
| Puerto | `1521` |
| Tipo | **Nombre del servicio**: `FREEPDB1` (no SID) |

Comprobaciones previas si falla:

```bash
# En el cliente: ¿llega al puerto?
nc -zv <ip-servidor> 1521

# En el servidor: ¿está publicado el puerto y el listener tiene el servicio?
podman ps                                  # 0.0.0.0:1521->1521/tcp
podman exec cont-oracle lsnrctl status     # Service "freepdb1" has 1 instance(s)
sudo ufw status                            # el cortafuegos debe permitir 1521/tcp
```

Una vez conectado, la hoja de trabajo debe mostrar:

```sql
SHOW CON_NAME      -- FREEPDB1
SHOW USER          -- USER es "SYS"
```

Errores típicos: `ORA-12514` (servicio no registrado o mal escrito: se ha puesto SID en lugar de nombre de servicio), `ORA-12541` / `IO Error: The Network Adapter could not establish the connection` (puerto cerrado o IP incorrecta), `ORA-01017` (contraseña) y `ORA-28009` (falta el rol SYSDBA).

### 5. Tablespaces creados en la instalación

```sql
SELECT tablespace_name, contents, status
FROM   dba_tablespaces
ORDER  BY tablespace_name;
```

Resultado esperado en `FREEPDB1`:

| Tablespace | Contenido | Para qué sirve |
|:---|:---|:---|
| `SYSTEM` | PERMANENT | Diccionario de datos de la PDB y objetos de `SYS`. No deben crearse en él objetos de usuario. |
| `SYSAUX` | PERMANENT | Auxiliar de `SYSTEM`: componentes como AWR, el repositorio del optimizador, etc. |
| `UNDOTBS1` | UNDO | Información de deshacer: `ROLLBACK`, lectura consistente y *flashback*. Cada PDB tiene el suyo (*local undo*). |
| `TEMP` | TEMPORARY | Ordenaciones, `JOIN` grandes, tablas temporales. Usa *tempfiles*. |
| `USERS` | PERMANENT | Tablespace por defecto para los datos de los usuarios. |

### 6. Tablespace simple `T1` de 10 MB

Primero se averigua la ruta de los ficheros de la PDB:

```sql
SELECT file_name FROM dba_data_files;
-- /opt/oracle/oradata/FREE/FREEPDB1/system01.dbf ...
```

```sql
CREATE SMALLFILE TABLESPACE t1
  DATAFILE '/opt/oracle/oradata/FREE/FREEPDB1/t1_01.dbf' SIZE 10M;
```

::: warning Detalle importante de Oracle 23ai y posteriores
Desde la versión 23ai, si no se indica nada, `CREATE TABLESPACE` crea un tablespace **BIGFILE**, que solo admite **un** datafile. Si `T1` se crea sin `SMALLFILE`, el paso 8 falla con `ORA-32771: cannot add file to bigfile tablespace`. Por eso la solución usa `SMALLFILE`, que es además lo que pide el enunciado con «simple». Se puede comprobar el tipo por defecto con:

```sql
SELECT property_value FROM database_properties WHERE property_name = 'DEFAULT_TBS_TYPE';
```

Si el alumno o la alumna encuentra este error, lo documenta y lo resuelve (borrando y recreando `T1` como `SMALLFILE`), es una muy buena evidencia de nivel 3–4 en 2.f y 2.h.
:::

### 7. Tablespace autoextensible `T2` de 20 MB

```sql
CREATE TABLESPACE t2
  DATAFILE '/opt/oracle/oradata/FREE/FREEPDB1/t2_01.dbf' SIZE 20M
  AUTOEXTEND ON NEXT 5M MAXSIZE 200M;
```

Se valora que fije un `MAXSIZE`: con `MAXSIZE UNLIMITED` el fichero puede llenar el disco (en Oracle Free, además, el total de datos de usuario está limitado).

### 8. Añadir un datafile a `T1`

```sql
ALTER TABLESPACE t1
  ADD DATAFILE '/opt/oracle/oradata/FREE/FREEPDB1/t1_02.dbf' SIZE 10M;
```

### 9. Tablespace temporal `T3_temp` de 30 MB

```sql
CREATE TEMPORARY TABLESPACE t3_temp
  TEMPFILE '/opt/oracle/oradata/FREE/FREEPDB1/t3_temp01.dbf' SIZE 30M;
```

Un tablespace temporal usa `TEMPFILE`, no `DATAFILE`. El nombre se guarda en mayúsculas: `T3_TEMP`.

### 10. ¿Dónde se han creado?

```sql
SHOW CON_NAME
SELECT con_id, name FROM v$containers;
```

En la **PDB `FREEPDB1`** (contenedor 3), porque la conexión del paso 4 se hizo al servicio `FREEPDB1`. Prueba adicional: conectado a `CDB$ROOT`, `SELECT tablespace_name FROM dba_tablespaces` no muestra `T1`, `T2` ni `T3_TEMP`; con `cdb_tablespaces` sí aparecen, con `con_id = 3`.

### 11. Tablespaces creados, con datos

```sql
SELECT tablespace_name, contents, status, bigfile,
       extent_management, segment_space_management, block_size
FROM   dba_tablespaces
WHERE  tablespace_name IN ('T1', 'T2', 'T3_TEMP');
```

Para añadir el tamaño total:

```sql
SELECT t.tablespace_name, t.contents, t.bigfile,
       ROUND(SUM(f.bytes)/1024/1024) AS mb
FROM   dba_tablespaces t
JOIN   (SELECT tablespace_name, bytes FROM dba_data_files
        UNION ALL
        SELECT tablespace_name, bytes FROM dba_temp_files) f
       ON f.tablespace_name = t.tablespace_name
WHERE  t.tablespace_name IN ('T1', 'T2', 'T3_TEMP')
GROUP  BY t.tablespace_name, t.contents, t.bigfile;
```

Resultado esperado: `T1` 20 MB (dos ficheros de 10), `T2` 20 MB, `T3_TEMP` 30 MB; `T1` con `BIGFILE = NO`.

### 12. Datafiles creados, con datos

```sql
SELECT file_name, tablespace_name, ROUND(bytes/1024/1024) AS mb,
       autoextensible, ROUND(maxbytes/1024/1024) AS max_mb, status
FROM   dba_data_files
WHERE  tablespace_name IN ('T1', 'T2');

SELECT file_name, tablespace_name, ROUND(bytes/1024/1024) AS mb
FROM   dba_temp_files
WHERE  tablespace_name = 'T3_TEMP';
```

Error frecuente: buscar el fichero de `T3_TEMP` en `dba_data_files`. Los *tempfiles* están en `dba_temp_files`.

### 13. Tablespace de UNDO

```sql
SHOW PARAMETER undo_tablespace
SELECT tablespace_name FROM dba_tablespaces WHERE contents = 'UNDO';
```

Se llama `UNDOTBS1`.

## De nuevo en el servidor

### 14. Redo log, alert log y listener log

```bash
podman exec -it cont-oracle bash

# Redo log: ficheros redoNN.log de la CDB
find / -name "redo*.log" 2>/dev/null
#   /opt/oracle/oradata/FREE/redo01.log  redo02.log  redo03.log

# Alert log
find / -name "alert_*.log" 2>/dev/null
#   /opt/oracle/diag/rdbms/free/FREE/trace/alert_FREE.log

# Listener log
find / -name "listener.log" 2>/dev/null
#   /opt/oracle/diag/tnslsnr/<nombre-del-contenedor>/listener/trace/listener.log
```

Comprobación desde SQL:

```sql
SELECT group#, member FROM v$logfile;
SELECT name, value FROM v$diag_info WHERE name IN ('Diag Trace', 'Diag Alert');
```

- Los *redo log* pertenecen a la **CDB**, no a cada PDB: no están en `FREEPDB1/`.
- `<nombre-del-contenedor>` es el *hostname* del contenedor (un identificador como `a2444629be58`), no el nombre que se le dio en `podman run`.
- En `alert/` hay además una versión XML (`log.xml`) de cada registro.

## Con SQL\*Plus como SYS

Para las tareas 15 a 18 hay que estar conectado a la **CDB** de forma local, porque al parar la instancia el listener ya no puede atender conexiones a ella:

```bash
podman exec -it cont-oracle sqlplus / as sysdba
```

### 15. Parada inmediata

```sql
SQL> SHUTDOWN IMMEDIATE
Pluggable Database closed.   -- según la versión
Database closed.
Database dismounted.
ORACLE instance shut down.
```

`IMMEDIATE` no espera a que se desconecten los usuarios: deshace las transacciones en curso y cierra de forma ordenada, por lo que el siguiente arranque no necesita recuperación.

::: tip
El contenedor sigue en marcha (el proceso principal es un script, no la instancia), pero `podman ps` pasará a mostrar `unhealthy` hasta que se vuelva a abrir la base de datos.
:::

### 16. Arranque en `NOMOUNT`

```sql
SQL> STARTUP NOMOUNT
ORACLE instance started.

Total System Global Area  1603373280 bytes
Fixed Size                   5007584 bytes
Variable Size              436207616 bytes
Database Buffers          1157627904 bytes
Redo Buffers                 4530176 bytes

SQL> SELECT status FROM v$instance;
STATUS
------------
STARTED
```

Las cifras varían. En `NOMOUNT` se ha leído el SPFILE, se ha reservado la SGA y se han arrancado los procesos en segundo plano, pero aún no se han abierto los ficheros de control. Por eso, por ejemplo, `SELECT name FROM v$database` da error (`ORA-01507: database not mounted`).

### 17. Paso a `OPEN`

```sql
SQL> ALTER DATABASE MOUNT;
Database altered.
SQL> SELECT status FROM v$instance;      -- MOUNTED

SQL> ALTER DATABASE OPEN;
Database altered.
SQL> SELECT status FROM v$instance;      -- OPEN

SQL> SHOW PDBS
    CON_ID CON_NAME                       OPEN MODE  RESTRICTED
---------- ------------------------------ ---------- ----------
         2 PDB$SEED                       READ ONLY  NO
         3 FREEPDB1                       READ WRITE NO
```

Si `FREEPDB1` aparece `MOUNTED`, hay que abrirla y, para que se abra sola en adelante, guardar su estado:

```sql
SQL> ALTER PLUGGABLE DATABASE ALL OPEN;
SQL> ALTER PLUGGABLE DATABASE freepdb1 SAVE STATE;
```

Una respuesta de nivel 3 pasa por `MOUNT` de forma explícita (en lugar de saltar a `OPEN`) y explica qué se abre en cada estado: SPFILE → ficheros de control → datafiles y redo log.

### 18. `sort_area_size` +15 %, de forma permanente e inmediata

```sql
SQL> SHOW PARAMETER sort_area_size
NAME              TYPE     VALUE
----------------- -------- ------
sort_area_size    integer  65536

SQL> SELECT issys_modifiable, isses_modifiable
     FROM   v$parameter WHERE name = 'sort_area_size';
ISSYS_MODIFIABLE ISSES_MODIFIABLE
---------------- ----------------
DEFERRED         TRUE
```

65 536 × 1,15 = 75 366,4 → **75 366** bytes.

```sql
SQL> ALTER SYSTEM SET sort_area_size = 75366 DEFERRED SCOPE = BOTH;
System altered.

SQL> SHOW SPPARAMETER sort_area_size    -- 75366 en el SPFILE
SQL> ALTER SESSION SET sort_area_size = 75366;   -- para que se aplique ya en la sesión actual
```

Justificación esperada:

- **Permanente** → el valor tiene que quedar en el SPFILE: `SCOPE = SPFILE` o `BOTH`.
- **Inmediato** → en memoria: `SCOPE = MEMORY` o `BOTH`. Por eso `BOTH`.
- `sort_area_size` es un parámetro **diferido** a nivel de sistema: sin `DEFERRED`, la orden da `ORA-02096: specified initialization parameter is not modifiable with this option`. Con `DEFERRED` se aplica a las sesiones que se abran a partir de ese momento; la sesión actual se cambia con `ALTER SESSION`.
- Para nivel 4: con `workarea_size_policy = AUTO` (valor por defecto) Oracle gestiona la memoria de ordenación con `pga_aggregate_target` y no usa `sort_area_size`; el parámetro solo tiene efecto en modo `MANUAL`.

### 19. Nombre de la `CDB$ROOT` y de la primera PDB

```sql
SQL> SHOW CON_NAME
CON_NAME
------------------------------
CDB$ROOT

SQL> SELECT name, cdb FROM v$database;
NAME      CDB
--------- ---
FREE      YES

SQL> SELECT con_id, name, open_mode FROM v$pdbs;
    CON_ID NAME          OPEN_MODE
---------- ------------- ----------
         2 PDB$SEED      READ ONLY
         3 FREEPDB1      READ WRITE
```

La CDB se llama `FREE` (su contenedor raíz es `CDB$ROOT`) y la primera PDB, `FREEPDB1`. `PDB$SEED` es la plantilla de solo lectura y no cuenta como «primera PDB».

### 20. Conexión como `sys` a la primera PDB

```bash
podman exec -it cont-oracle sqlplus sys/1234@FREEPDB1 as sysdba
```

O, sin salir de la sesión:

```sql
SQL> ALTER SESSION SET CONTAINER = freepdb1;
SQL> SHOW CON_NAME
CON_NAME
------------------------------
FREEPDB1
```

### 21. Cuatro tablas

Crear las tablas en el esquema de `SYS` funciona, pero es una mala práctica (irían al tablespace `SYSTEM` y se mezclarían con el diccionario). La solución de referencia crea un esquema propio que usa los tablespaces de la práctica:

```sql
-- En FREEPDB1, como SYS
CREATE USER instituto IDENTIFIED BY "Inst2026"
  DEFAULT TABLESPACE t2 TEMPORARY TABLESPACE t3_temp
  QUOTA UNLIMITED ON t2;

CREATE TABLE instituto.alumnes (
  nia       NUMBER(8)     CONSTRAINT alumnes_pk PRIMARY KEY,
  nom       VARCHAR2(60)  NOT NULL,
  adreca    VARCHAR2(100),
  telefon   VARCHAR2(15),
  email     VARCHAR2(80)  CONSTRAINT alumnes_email_uk UNIQUE,
  dataalta  DATE          DEFAULT SYSDATE
);

CREATE TABLE instituto.modul (
  codmodul  VARCHAR2(10)  CONSTRAINT modul_pk PRIMARY KEY,
  nommodul  VARCHAR2(80)  NOT NULL,
  cicle     VARCHAR2(10)  NOT NULL,
  curs      NUMBER(1)     CONSTRAINT modul_curs_ck CHECK (curs IN (1, 2)),
  hores     NUMBER(4)
);

CREATE TABLE instituto.professor (
  codprof   NUMBER(6)     CONSTRAINT professor_pk PRIMARY KEY,
  nom       VARCHAR2(60)  NOT NULL,
  email     VARCHAR2(80)
);

CREATE TABLE instituto.matricula (
  nia       NUMBER(8)     CONSTRAINT matricula_alumne_fk REFERENCES instituto.alumnes,
  codmodul  VARCHAR2(10)  CONSTRAINT matricula_modul_fk  REFERENCES instituto.modul,
  curs_acad VARCHAR2(9),
  nota      NUMBER(4,2)   CONSTRAINT matricula_nota_ck CHECK (nota BETWEEN 0 AND 10),
  CONSTRAINT matricula_pk PRIMARY KEY (nia, codmodul, curs_acad)
) TABLESPACE t1;
```

- `Adreça` se ha escrito `adreca`: Oracle admite caracteres no ASCII en identificadores, pero dan problemas con clientes y juegos de caracteres distintos. Si el alumno o la alumna usa `adreça` y le funciona, es correcto.
- `matricula` va a `T1` de forma explícita para que el paso 23 muestre dos tablespaces distintos.
- Si se crean como `SYS` sin esquema, también se aceptan; para el nivel 3–4 de 2.f se espera que se plantee dónde quedan las tablas.

### 22. Las tablas en el diccionario de datos

| Vista | Qué muestra |
|:---|:---|
| `DICTIONARY` (`DICT`) | Todas las vistas del diccionario con su descripción. Útil para buscar: `SELECT table_name FROM dict WHERE table_name LIKE '%TABLES%';` |
| `USER_TABLES` | Tablas del usuario conectado (si se conecta como `instituto`). |
| `ALL_TABLES` | Tablas a las que tiene acceso el usuario conectado. |
| `DBA_TABLES` | Todas las tablas de la base de datos; necesita privilegios de DBA. Incluye la columna `OWNER`. |
| `DBA_TAB_COLUMNS` | Columnas de cada tabla, con su tipo y si admiten nulos. |
| `DBA_CONSTRAINTS` / `DBA_CONS_COLUMNS` | Restricciones (`P`, `R`, `U`, `C`) y sus columnas. |
| `DBA_SEGMENTS` | Espacio realmente ocupado. |

```sql
DESC dba_tables
SELECT column_name, data_type, nullable
FROM   dba_tab_columns
WHERE  owner = 'INSTITUTO' AND table_name = 'ALUMNES';

SELECT table_name, constraint_name, constraint_type
FROM   dba_constraints
WHERE  owner = 'INSTITUTO'
ORDER  BY table_name, constraint_type;
```

Error frecuente: escribir los nombres en minúsculas dentro del `WHERE` (`owner = 'instituto'`) y no obtener filas. El diccionario guarda los nombres en **mayúsculas**.

### 23. Tablas creadas, con datos

```sql
SELECT owner, table_name, tablespace_name, status, num_rows, last_analyzed
FROM   dba_tables
WHERE  owner = 'INSTITUTO'
ORDER  BY table_name;
```

Resultado esperado: cuatro filas, `ALUMNES`, `MODUL` y `PROFESSOR` en `T2` y `MATRICULA` en `T1`. `num_rows` y `last_analyzed` están vacíos hasta que se recogen estadísticas:

```sql
EXEC DBMS_STATS.GATHER_SCHEMA_STATS('INSTITUTO');
```

Si se consulta `dba_segments` antes de insertar datos, no aparece ningún segmento: Oracle crea el segmento con la primera fila (*deferred segment creation*). Explicarlo es una evidencia de nivel 4.

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **2.a** | Para y arranca, pero sin pasar por `NOMOUNT` o sin mostrar el resultado. | `SHUTDOWN IMMEDIATE`, `STARTUP NOMOUNT` y paso a `OPEN` con la salida de cada orden. | Además, comprueba el estado con `v$instance` en cada paso y explica qué se abre en cada uno. | Además, comprueba y abre las PDB tras el arranque y lo relaciona con el *alert log*. |
| **2.d** | Localiza algún fichero, sin distinguir cuál se usa. | Localiza los tres ficheros de red y el SPFILE con su ruta. | Distingue ficheros reales, enlaces y plantillas, y explica la función de cada uno. | Lo confirma con `lsnrctl status`, `tnsping` y `SHOW PARAMETER spfile`. |
| **2.e** | No consigue conectar desde el cliente o conecta a la CDB. | Conecta desde el cliente a `FREEPDB1` como `sys` con rol SYSDBA. | Justifica nombre de servicio frente a SID y comprueba el contenedor conectado. | Documenta la comprobación de red (`nc`, puerto publicado, cortafuegos) o la resolución de un error. |
| **2.f** | Crea algún tablespace, con errores de tipo o de ruta. | Crea `T1`, `T2`, `T3_temp` y el segundo datafile, y los consulta. | Sitúa los tablespaces en la PDB y explica las diferencias (simple, autoextensible, temporal). | Resuelve o anticipa el problema de `BIGFILE`, fija `MAXSIZE` o crea las tablas en un esquema con tablespace propio. |
| **2.g** | Localiza el parámetro sin modificarlo correctamente. | Modifica `sort_area_size` al valor correcto con `SCOPE = BOTH`. | Justifica el ámbito, resuelve `DEFERRED` y comprueba el valor en memoria y en el SPFILE. | Explica la relación con `workarea_size_policy` y `pga_aggregate_target`. |
| **2.h** | Documento incompleto o capturas sin explicación. | Todas las tareas con orden y resultado. | Explica cada resultado y las vistas del DD utilizadas. | Documento claro y ordenado, con los errores encontrados y su solución. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD, sobre la práctica adaptada de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
