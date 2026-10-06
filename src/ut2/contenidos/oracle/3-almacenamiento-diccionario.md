---
layout: doc
title: "Oracle: almacenamiento y diccionario de datos"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: almacenamiento y diccionario de datos

## Configuración del almacenamiento

### ¿Qué es un tablespace?

Un **tablespace** es una unidad lógica de almacenamiento dentro de Oracle. Está formado por uno o más **ficheros de datos (datafiles)** que residen en el disco y contienen los datos reales de la base de datos.

![Una base de datos se compone de tablespaces y estos de datafiles #center](/img/contenidos/ut2/tablespaces.png)

Cada datafile puede estar en un disco físico diferente

Los usuarios guardan sus datos en tablespaces, como por ejemplo `USERS`

SYS guarda sus datos en el tablespace «especial» `SYSTEM`

Crear tablespaces adicionales ayuda a organizar las aplicaciones que se crean sobre la base de esquemas

Utilizar tablespaces es fundamental para la seguridad

### Métodos de gestión del espacio

- **Manual:** el administrador debe crear y ampliar los ficheros de datos manualmente.
- **Automático:** el sistema crea y amplía los datafiles automáticamente con `AUTOEXTEND`.

### Tipos de tablespaces

- Existen desde la instalación: **SYSTEM, SYSAUX, UNDO, TEMP, USERS**
- El tablespace USERS es el que se utilizará para guardar los datos de las tablas de los usuarios (si no se crean tablespaces adicionales para este fin)
- Se pueden crear tablespaces TEMPORALES, PERMANENTES y DE SOLO LECTURA, y poner un tablespace OFFLINE u ONLINE
- El tablespace «undo» gestiona la información de reversión (las versiones anteriores de los datos para ROLLBACK, lectura consistente, etc.).
- TEMP se utiliza para almacenar los datos temporales que Oracle genera durante la ejecución de ciertas operaciones SQL (y que no caben en la memoria PGA). Operaciones como sort, index, join, etc.
- El tablespace SYSTEM es obligatorio y no se puede eliminar. SYSTEM guarda el DD, el código PL/SQL, los objetos de SYS y parte de los de SYSTEM
- El tablespace SYSAUX actúa como «complemento» de SYSTEM: componentes opcionales (AWR, RMAN, Enterprise Manager, etc.). SYSAUX también es obligatorio. Su función es descargar a SYSTEM de una gran cantidad de componentes y metadatos que antes se guardaban en él, para mejorar el rendimiento y la organización.

El usuario como entidad (su nombre, contraseña, privilegios) está en el diccionario de datos, que vive dentro del tablespace SYSTEM. Pero las tablas, índices, vistas, etc. que crea ese usuario se guardan en su DEFAULT TABLESPACE (USERS).

### Consultar información de almacenamiento

Consulta de los tablespaces:

```txt
SQL> SELECT tablespace_name, status from dba_tablespaces;
```

Consulta de los ficheros de datos: **muy útil para saber las rutas físicas de los ficheros del SO.**

```txt
SQL> SELECT file_name, tablespace_name from dba_data_files;
```

### Crear un nuevo tablespace manualmente

Ejemplo de creación con gestión manual:

```txt
SQL> CREATE TABLESPACE dades
DATAFILE '/opt/oracle/oradata/COSTERA/dades01.dbf' SIZE 10M;
```

Ejemplo con autoextensión activada:

```txt
SQL> CREATE TABLESPACE dades
DATAFILE '/opt/oracle/oradata/COSTERA/dades01.dbf'
SIZE 10M
AUTOEXTEND ON
NEXT 5M
MAXSIZE 100M;
```

### Añadir un fichero de datos a un tablespace

```txt
SQL> ALTER TABLESPACE dades
ADD DATAFILE '/opt/oracle/oradata/COSTERA/dades02.dbf' SIZE 20M;
```

### Ubicación por defecto (si no se especifica)

Si no se indica una ruta explícita, Oracle utiliza la variable:

```txt
DB_CREATE_FILE_DEST
```

Si `DB_CREATE_FILE_DEST` no tiene valor, la ubicación será $ORACLE_HOME/dbs (en Unix/Linux) o %ORACLE_HOME%\database (en Windows)

Desde Oracle 21c XE / 23ai Free, Oracle no usa directamente $ORACLE_HOME/dbs como ubicación de trabajo. Cada base de datos (CDB o Free) tiene su propio **«dbconfig_directory»**:

```txt
/opt/oracle/oradata/dbconfig/'DB_NAME'/
```

```txt
Y Oracle utiliza este dbconfig_directory/dbs  para operaciones relativas
```

Ejemplo de creación de tablespace/datafile con ruta automática:

```txt
SQL> CREATE TABLESPACE dades123 DATAFILE 'dades123' SIZE 10M;
```

### Buenas prácticas

- Activa `AUTOEXTEND` para evitar errores por falta de espacio
- Asigna un tablespace específico a los usuarios nuevos (evita usar `SYSTEM`)
- Utiliza rutas claras y separadas para cada base de datos
- ⚠️ Controla el tamaño máximo de crecimiento para no llenar el disco

### Ejemplo completo

```sql
-- Crear el tablespace
CREATE TABLESPACE aplicacio
DATAFILE '/opt/oracle/oradata/COSTERA/aplicacio01.dbf'
SIZE 20M
AUTOEXTEND ON
NEXT 5M
MAXSIZE UNLIMITED;

-- Crear un usuario y asignarle un tablespace (DEFAULT TABLESPACE)
-- Todos los objetos que cree este usuario se almacenarán dentro del tablespace
CREATE USER us_aplicacio IDENTIFIED BY 1234
DEFAULT TABLESPACE aplicacio
QUOTA UNLIMITED ON aplicacio;

-- Desde dentro del usuario
-- En el momento de crear un objeto, especificar en qué TABLESPACE se almacenará
CREATE table tabla1 ( codi number(6),  Nom varchar2(40) )  TABLESPACE aplicacio2;
CREATE index indice1 on tabla1(nom DESC) TABLESPACE aplicacio2;

-- Si queremos que, al crear un usuario sin especificar nada, se le asigne un tablespace diferente de USERS
ALTER DATABASE DEFAULT TABLESPACE dades001;   -- ¡dades001 debe estar creado!
-- A partir de este momento, cualquier CREATE USER sin especificar DEFAULT TABLESPACE usará "dades001".
```

### Borrar un tablespace

```sql
DROP TABLESPACE nom_tablespace INCLUDING CONTENTS AND DATAFILES;
```

Esta operación se debe hacer con mucho cuidado y teniendo en cuenta todos los usuarios afectados, las tablas y las claves ajenas que pueden referenciar tablas del tablespace que se va a borrar

## Diccionario de datos

### 📘 ¿Qué es el diccionario de datos?

El **diccionario de datos** de Oracle es un conjunto de vistas especiales que contienen metadatos sobre:

- Tablas, vistas, columnas
- Usuarios, roles y privilegios
- Estructura de la base de datos, espacio, ficheros
- Permisos de acceso y auditorías

El diccionario es gestionado automáticamente por Oracle y está formado por miles de vistas con los prefijos:

- `USER_` → Muestra los datos del propio usuario conectado
- `ALL_` → Muestra los datos accesibles para el usuario (los suyos y los de otros)
- `DBA_` → Muestra todos los datos del sistema (requiere permisos de DBA)
- `V$___` → Vistas dinámicas
- `TABS, DUAL, DICTIONARY` → Vistas «legacy»

El diccionario se almacena en el esquema de SYS. El DD pertenece a SYS

SYS está presente en CDB$ROOT y en todas las PDB

::: warning Atención
Los datos del DD están en MAYÚSCULAS
:::

---

### 🔍🔍 Consultas habituales

#### 📂 Tablas y columnas

```sql
-- Tablas creadas por el usuario actual
SELECT table_name FROM user_tables;

-- Columnas de una tabla concreta
SELECT column_name, data_type, data_length
FROM user_tab_columns
WHERE table_name = 'EMPLEATS';
```

#### 👤 Usuarios y roles

```sql
-- Lista de usuarios
SELECT username FROM dba_users;

-- Roles asignados a un usuario
SELECT * FROM dba_role_privs WHERE grantee = 'SYSTEM';
```

#### 🔐 Privilegios

```sql
-- Privilegios de usuario
SELECT * FROM user_sys_privs;

-- Privilegios de rol
SELECT * FROM role_sys_privs WHERE role = 'DBA';
```

#### 📁 Estructuras de almacenamiento

```sql
-- Ficheros de datos
SELECT file_name, tablespace_name, bytes/1024/1024 AS MB
FROM dba_data_files;

-- Espacio libre
SELECT tablespace_name, file_id, block_id, bytes/1024/1024 AS MB
FROM dba_free_space;
```

### 📘 Buenas prácticas

- Utiliza `USER_` si trabajas como usuario no administrador
- Utiliza `DBA_` para hacer auditorías completas (solo si eres `SYS` o tienes `DBA`)
- Usa `DESCRIBE` o `DESC` para ver la estructura de las vistas del diccionario

### Consejo final

El diccionario de datos es clave para conocer el estado interno de la base de datos, y resulta imprescindible para administradores y desarrolladores.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
