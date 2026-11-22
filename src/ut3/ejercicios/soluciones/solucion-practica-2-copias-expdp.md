---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 2: copias con Oracle expdp"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 2: copias con Oracle expdp

::: tip Solución de referencia
Resolución de referencia de la [Práctica 2](../practica-2-copias-expdp), con los resultados esperados, los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

::: info Órdenes no ejecutadas
La práctica es de Oracle en Windows y no se ha podido ejecutar. Las órdenes y los mensajes están escritos a partir de la documentación de Oracle Data Pump; los textos exactos de la salida pueden variar algo según la versión.
:::

## Convenciones

En esta solución, `client01` es **`ana`** y `client02` es **`garcia`**; la PDB se escribe `<pdb>` (la que muestre el paso 1 en la máquina `windowsOracle4`). Todas las contraseñas son `1234`.

## Preparación de los datos

### 1. `ORACLE_SID` y primera PDB

```txt
C:\> echo %ORACLE_SID%
C:\> reg query HKLM\SOFTWARE\ORACLE\KEY_OraDB21Home1 /v ORACLE_SID
C:\> sqlplus / as sysdba
```

En Windows, `ORACLE_SID` suele **no** estar definida como variable de entorno (`echo` devuelve `%ORACLE_SID%`): está en el registro, y SQL\*Plus la lee de allí. Explicarlo es una buena respuesta.

```sql
SELECT instance_name FROM v$instance;   -- el SID
SELECT name FROM v$database;            -- la CDB
SHOW PDBS                                -- la primera PDB: CON_ID 3
ALTER SESSION SET CONTAINER = <pdb>;
SHOW CON_NAME
```

### 2. Usuarios `ana` y `garcia`

```sql
-- en la PDB, como sys
CREATE USER ana    IDENTIFIED BY "1234" QUOTA UNLIMITED ON users;
CREATE USER garcia IDENTIFIED BY "1234" QUOTA UNLIMITED ON users;
GRANT CREATE SESSION, CREATE TABLE TO ana, garcia;
```

- Conectar → `CREATE SESSION`; crear recursos → `CREATE TABLE`; cuota → `QUOTA ... ON users`.
- Si se usan los roles `CONNECT` y `RESOURCE`, también funciona, pero desde Oracle 12c `RESOURCE` **ya no incluye** `UNLIMITED TABLESPACE`: sin la cuota, el `INSERT` del paso 5 falla con `ORA-01950: no privileges on tablespace 'USERS'`. Es el error más habitual de esta parte.
- `"1234"` va entre comillas dobles: una contraseña que empieza por un número no es un identificador válido.

### 3–5. Tabla `festius` (como `ana`)

```txt
C:\> sqlplus ana/1234@localhost:1521/<pdb>
```

```sql
CREATE TABLE festius (
  dia        NUMBER(2),
  mes        NUMBER(2),
  nom_festa  VARCHAR2(40)
);
INSERT INTO festius VALUES (1, 11, 'Todos los Santos');
INSERT INTO festius VALUES (25, 12, 'Navidad');
INSERT INTO festius VALUES (31, 12, 'Nochevieja');
INSERT INTO festius VALUES (6, 1, 'Reyes');
INSERT INTO festius VALUES (9, 10, 'Día de la Comunitat Valenciana');
COMMIT;
```

Sin `@<pdb>` la conexión va a la raíz, donde `ana` no existe: `ORA-01017: invalid username/password`. Sin `COMMIT`, la exportación del paso 15 (otra sesión) no verá las filas.

### 6–8. Tabla `alumnes` (como `garcia`)

```sql
CREATE TABLE alumnes (
  nia         NUMBER(8) PRIMARY KEY,
  nom_alumne  VARCHAR2(50)
);
-- siete INSERT con nombres inventados o de familiares
COMMIT;
```

## Directorio de copias

### 9. Carpeta en el sistema operativo

```txt
C:\> mkdir c:\app\copies\ana
```

### 10–11. Objeto `DIRECTORY`

```txt
C:\> sqlplus system/1234@localhost:1521/<pdb>
```

```sql
CREATE DIRECTORY dir_copias_ana AS 'C:\app\copies\ana';
GRANT READ, WRITE ON DIRECTORY dir_copias_ana TO ana, garcia;

SELECT directory_name, directory_path FROM dba_directories WHERE directory_name = 'DIR_COPIAS_ANA';
```

- `system` tiene que estar conectado **a la PDB**: un directorio creado en la raíz no lo ven los usuarios de la PDB.
- «Dale permisos si hace falta»: **sí hace falta**. Sin `READ, WRITE` sobre el directorio, los usuarios sin privilegios reciben `ORA-39002: invalid operation` y `ORA-39070: Unable to open the log file` / `ORA-39087: directory name DIR_COPIAS_ANA is invalid`. `system` no los necesita porque tiene privilegios de administrador.
- El directorio de Oracle es solo un nombre para una ruta: Oracle **no crea la carpeta** ni comprueba que exista al hacer `CREATE DIRECTORY`.
- Además, la cuenta con la que se ejecuta el servicio de Oracle tiene que poder escribir en la carpeta. Si se instaló con cuenta virtual y la carpeta está fuera de `ORACLE_BASE`, puede aparecer `ORA-29283: invalid file operation`; se resuelve dando permisos de escritura sobre `c:\app\copies` al grupo `ORA_OraDB21Home1_SVCACCTS` (o al usuario del servicio que corresponda).

## Ficheros de parámetros

### 12–13

`C:\app\copies\ana\parametres1.txt`:

```ini
DIRECTORY=dir_copias_ana
DUMPFILE=esquema_ana.dmp
LOGFILE=esquema_ana.log
SCHEMAS=ana
```

`C:\app\copies\ana\parametres2.txt`:

```ini
DIRECTORY=dir_copias_ana
TABLESPACES=users
```

::: tip Por qué `parametres2.txt` no lleva `DUMPFILE`
Se usa tres veces (pasos 16, 17 y 20). Si llevara un nombre de fichero fijo, la segunda ejecución fallaría porque el fichero ya existe (`ORA-39001`, `ORA-31641: unable to create dump file`, `ORA-27038: created file already exists`). Hay tres soluciones válidas: indicar `DUMPFILE` y `LOGFILE` en la línea de órdenes de cada ejecución (la recomendada, porque se conservan las tres copias para compararlas), añadir `REUSE_DUMPFILES=YES` (sobrescribe la anterior) o borrar el fichero antes. Si una entrega muestra este error y lo resuelve, es una evidencia de nivel 3–4.
:::

## Copias

### 14–15. `system` con `parametres1.txt`

```txt
C:\> expdp system/1234@localhost:1521/<pdb> parfile=C:\app\copies\ana\parametres1.txt
```

```txt
Starting "SYSTEM"."SYS_EXPORT_SCHEMA_01":  system/********@localhost:1521/<pdb> parfile=...
...
. . exported "ANA"."FESTIUS"                             6.0 KB       5 rows
Master table "SYSTEM"."SYS_EXPORT_SCHEMA_01" successfully loaded/unloaded
******************************************************************************
Dump file set for SYSTEM.SYS_EXPORT_SCHEMA_01 is:
  C:\APP\COPIES\ANA\ESQUEMA_ANA.DMP
Job "SYSTEM"."SYS_EXPORT_SCHEMA_01" successfully completed at ...
```

`system` puede exportar el esquema de otro usuario porque tiene el rol `DATAPUMP_EXP_FULL_DATABASE` a través del rol `DBA`. La copia incluye la definición del usuario `ana`, sus cuotas y privilegios, y su tabla.

### 16. `ana` con `parametres2.txt`

```txt
C:\> expdp ana/1234@localhost:1521/<pdb> parfile=C:\app\copies\ana\parametres2.txt dumpfile=ts_users_ana.dmp logfile=ts_users_ana.log
```

```txt
Starting "ANA"."SYS_EXPORT_TABLESPACE_01": ...
. . exported "ANA"."FESTIUS"                             6.0 KB       5 rows
Job "ANA"."SYS_EXPORT_TABLESPACE_01" successfully completed at ...
```

### 17. `garcia` con `parametres2.txt`

```txt
C:\> expdp garcia/1234@localhost:1521/<pdb> parfile=C:\app\copies\ana\parametres2.txt dumpfile=ts_users_garcia.dmp logfile=ts_users_garcia.log
```

```txt
. . exported "GARCIA"."ALUMNES"                          5.9 KB       7 rows
Job "GARCIA"."SYS_EXPORT_TABLESPACE_01" successfully completed at ...
```

### 18. Qué hay que observar

Es la pregunta clave de la práctica («Observa bien…»). Respuesta esperada:

- Las tres copias **terminan bien**, sin error, pero **no contienen lo mismo**.
- Con el mismo `parametres2.txt` («todo el tablespace `users`»), `ana` solo exporta `FESTIUS` y `garcia` solo `ALUMNES`. La documentación de Data Pump lo indica para el modo tablespace: *los usuarios con privilegios obtienen todas las tablas; los usuarios sin privilegios, solo las de su propio esquema*.
- Es decir, Data Pump **no se salta** el control de acceso: un usuario no puede usar una exportación para llevarse datos que no puede leer.
- Cada usuario sin privilegios puede lanzar la exportación porque tiene `READ, WRITE` sobre el directorio y porque Data Pump crea la tabla maestra del trabajo (`SYS_EXPORT_TABLESPACE_01`) **en su propio esquema**, para lo que necesita `CREATE TABLE` y cuota. Explicarlo es una evidencia de nivel 4.

Si en la entrega `garcia` falla con `ORA-39087`, es porque en el paso 11 solo se dieron permisos sobre el directorio a `ana`: es un buen error para documentar.

### 19. Rol de exportación

```sql
-- system, en la PDB
GRANT DATAPUMP_EXP_FULL_DATABASE TO ana;

SELECT granted_role FROM dba_role_privs WHERE grantee = 'ANA';
SELECT granted_role FROM dba_role_privs WHERE grantee = 'DATAPUMP_EXP_FULL_DATABASE';
-- incluye EXP_FULL_DATABASE, que a su vez incluye privilegios como SELECT ANY TABLE, ...
```

### 20. `ana` con `parametres2.txt` de nuevo

```txt
C:\> expdp ana/1234@localhost:1521/<pdb> parfile=C:\app\copies\ana\parametres2.txt dumpfile=ts_users_ana_full.dmp logfile=ts_users_ana_full.log
```

```txt
. . exported "ANA"."FESTIUS"                             6.0 KB       5 rows
. . exported "GARCIA"."ALUMNES"                          5.9 KB       7 rows
...                                   (y cualquier otra tabla de otros usuarios en USERS)
Job "ANA"."SYS_EXPORT_TABLESPACE_01" successfully completed at ...
```

Si la sesión de `ana` ya estaba abierta, el rol se activa en la siguiente conexión; como `expdp` abre una sesión nueva, no hace falta nada más.

### 21. Conclusión esperada

- Con `DATAPUMP_EXP_FULL_DATABASE`, `ana` es un usuario **con privilegios** para Data Pump y exporta **todas** las tablas del tablespace, también las de `garcia`.
- El rol **agrupa** muchos privilegios de sistema (exportar cualquier esquema, la base de datos completa, leer cualquier tabla en la exportación). Es un rol muy potente: equivale a poder leer todos los datos y llevárselos en un fichero. En la práctica se concede solo a la cuenta que hace las copias y se retira cuando no hace falta (`REVOKE DATAPUMP_EXP_FULL_DATABASE FROM ana;`). Relacionarlo con el mínimo privilegio y con la protección de datos es lo que se espera para el nivel 4 en 3.h.

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **3.c** | Usuarios sin cuota o creados en el contenedor equivocado. | Los dos usuarios, con permisos y cuota, y sus tablas con datos. | Justifica cada privilegio y la cuota (diferencia entre `RESOURCE` y cuota). | Usa solo los privilegios necesarios y lo comprueba en el diccionario. |
| **3.d** | No identifica qué privilegios hacen falta. | Indica que hace falta el rol de exportación para el tablespace completo. | Explica por qué cada usuario exporta lo que exporta (modo tablespace con y sin privilegios). | Explica también la tabla maestra en el esquema del usuario y los permisos sobre el directorio. |
| **3.f** | Falta el permiso sobre el directorio o no funciona. | Crea el directorio y concede `READ, WRITE`. | Justifica a quién y por qué se conceden, y en qué contenedor se crea el directorio. | Resuelve incidencias del directorio (permisos de Windows, fichero ya existente). |
| **3.g** | No concede el rol o no se ve el efecto. | Concede `DATAPUMP_EXP_FULL_DATABASE` y repite la copia. | Explica qué privilegios agrupa el rol y lo consulta en el diccionario. | Valora el riesgo del rol y propone retirarlo tras usarlo. |
| **3.h** | No compara las copias. | Muestra las cuatro copias y sus resultados. | Compara qué contiene cada copia según el usuario y razona las diferencias. | Relaciona el resultado con el mínimo privilegio y la protección de datos. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD, sobre la práctica adaptada de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
