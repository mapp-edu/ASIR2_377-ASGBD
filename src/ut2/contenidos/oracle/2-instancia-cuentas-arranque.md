---
layout: doc
title: "Oracle: instancia, cuentas de administración y arranque"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: instancia, cuentas de administración y arranque

## Configuración de la instancia

### 📘 ¿Qué es la instancia?

En Oracle Database, una instancia es el conjunto de procesos y estructuras de memoria que gestionan el acceso físico y el uso de una base de datos Oracle.

#### La instancia es el SGBD en ejecución

Una instancia Oracle necesita una configuración específica para funcionar correctamente: memoria, rutas, nombres, procesos, etc. Esta configuración se define mediante **ficheros de parámetros**.

### Ficheros de parámetros

- **spfile** – Fichero binario (Server Parameter File), leído automáticamente al iniciar la instancia.
- **pfile** – Fichero de texto (init&lt;sid&gt;.ora), utilizado como alternativa o copia editable.

#### Crear un PFILE a partir de un SPFILE

```txt
SQL> CREATE PFILE FROM SPFILE;
```

#### Crear un SPFILE a partir de un PFILE

```txt
SQL> CREATE SPFILE FROM PFILE;
```

Ubicación típica (en Linux):

```txt
$ORACLE_BASE/oradata/dbconfig/NOMCDB/dbs/spfileNOMCDB.ora
```

Ubicación típica (en Windows):

```txt
$ORACLE_BASE/database/spfileSID.ora
```

Donde SID es el nombre de la CDB

**⚠️ El fichero spfile no se puede manipular directamente, o se producirá un error. Los valores del fichero se deben modificar mediante sentencias SQL (`ALTER SYSTEM SET`)**

Dentro del fichero spfile se guardan los valores de los **parámetros** de la instancia, que se cargan en memoria en cuanto esta arranca.

### Tipos de parámetros

- **Estáticos**: se pueden modificar, pero no tienen efecto hasta que se reinicia la instancia

- **Dinámicos**: se pueden cambiar en tiempo real sin reiniciar

- **Scope:**

  - `MEMORY` – Cambio temporal (hasta el próximo reinicio)
  - `SPFILE` – Se almacena para el próximo reinicio
  - `BOTH` – Cambio inmediato y persistente (si el parámetro lo permite)

### Consultar los parámetros actuales

Consulta de parámetros:

```txt
SQL> SHOW PARAMETER   o   SQL> SHOW PARAMETER sga;
```

```txt
SQL> SHOW SPPARAMETER   o   SQL> SHOW SPPARAMETER sga;
```

SHOW PARAMETERS → consulta los valores actuales en uso por la instancia. <br> SHOW SPPARAMETERS → consulta los valores guardados en el SPFILE (Server Parameter File)

Consulta de todas las fuentes de los valores:

```txt
SQL> SELECT name, value, isspecified, isdefault , issys_modifiable, isses_modifiable
FROM v$parameter
WHERE name LIKE 'sga%';
```

### Modificar un parámetro

Por ejemplo, modificar el tamaño de la SGA:

```txt
SQL> ALTER SYSTEM SET sga_target=800M SCOPE=SPFILE;
```

*(hay que reiniciar para que tenga efecto)*

```txt
Ejemplos de parámetros dinámicos y estáticos
    sessions        estático
    open_cursors    dinámico
    processes       estático
    sort_area_size  dinámico
    optimizer_mode  dinámico
```

### Reinicio de la instancia

Para aplicar cambios definitivos:

```txt
SQL> SHUTDOWN IMMEDIATE;
SQL> STARTUP;
```

### Resumen de órdenes útiles

- `SHOW PARAMETER nom` – Consulta rápida
- `ALTER SYSTEM SET ...` – Para cambiar valores
- `CREATE PFILE FROM SPFILE` – Exportar la configuración binaria
- `CREATE SPFILE FROM PFILE` – Generar el spfile
- `STARTUP PFILE='...'` – Iniciar con un fichero concreto

### ⚠️ Buenas prácticas

- No modificar directamente el SPFILE (solo con SQL)

- Hacer copia del PFILE antes de hacer cambios

  - ⚠️ Los cambios incorrectos pueden impedir que la instancia arranque

---

→ ¿Cómo saber cuántos parámetros hay en la instancia?

```sql
SELECT COUNT(*) FROM v$spparameter WHERE value IS NOT NULL;
SELECT COUNT(*) FROM v$parameter WHERE value IS NOT NULL;
```

## Cuentas de administración

### 👤 Cuentas de administración predeterminadas

Cuando se crea una base de datos Oracle (CDB o PDB), se generan automáticamente varias cuentas especiales:

- **SYS**: usuario principal con privilegios totales sobre la base de datos.
- **SYSTEM**: usuario administrativo para tareas generales y desarrollo.
- **PDBADMIN**: usuario administrador dentro de una PDB específica.

Estas cuentas se crean automáticamente en el momento de crear la base de datos con la herramienta `DBCA` o con SQL.

### Roles asociados

- **SYSDBA**: acceso completo; incluye todas las capacidades (startup, shutdown, backup, etc.).
- **SYSOPER**: rol con permisos limitados a operaciones básicas (iniciar, parar, consultar).
- **SYSBACKUP**, **SYSDG**, **SYSKM**: roles especializados (backup, Data Guard, cifrado).

### 📍 Ubicación de las cuentas

Las cuentas SYS y SYSTEM se ubican dentro de la **CDB (contenedor principal)** y también dentro de cada una de las **PDB**. Son unas cuentas «especiales» llamadas COMUNES, que están en todas las PDB y en la CDB principal

Se puede cambiar de contenedor con:

```txt
SQL> ALTER SESSION SET CONTAINER = nom_pdb;
```

### Cambio de contraseña

```txt
SQL> ALTER USER system IDENTIFIED BY nova_contrasenya;
SQL> ALTER USER pdbadmin IDENTIFIED BY segura123;
```

### Buenas prácticas

- Cambiar las contraseñas por defecto después de la instalación
- Limitar el uso de SYS solo a tareas críticas
- Crear usuarios administradores propios con roles específicos si hace falta
- ⚠️ No trabajar habitualmente con SYS/SYSTEM, especialmente en entornos de producción

### 🔍 Consultar los roles asignados

```txt
SQL> SELECT * FROM dba_role_privs WHERE grantee = 'SYSTEM';
```

### 🧪 Ejemplo práctico

Crear un nuevo usuario administrador dentro de una PDB:

```txt
SQL> ALTER SESSION SET CONTAINER = nom_pdb;
SQL> CREATE USER admin_pdb IDENTIFIED BY 1234;
SQL> GRANT dba TO admin_pdb;
```

Dar más privilegios...

```sql
GRANT SYSDBA TO admin_pdb;
```

```bash
---  Y se puede conectar como sysdba
sqlplus admin_pdb/1234 AS SYSDBA
```

Esto le da el mismo nivel de acceso que SYS, pero sin ser el propietario del diccionario de datos. Es el máximo privilegio posible para un usuario que no es SYS

En otros SGBD, el usuario administrador varía...

**Comparativa de usuarios administradores**

| Sistema | Usuario administrador | Descripción breve |
| --- | --- | --- |
| Oracle | `SYS` | Superusuario con acceso al diccionario de datos. |
| MySQL | `root` | Superusuario con todos los privilegios sobre el servidor. |
| PostgreSQL | `postgres` | Superusuario creado por defecto durante la instalación. |

## Arranque y parada de la instancia Oracle

### ¿Cómo arranca una instancia Oracle?

Una instancia Oracle puede estar en diferentes estados:

- **NOMOUNT**: solo se ha cargado el SPFILE/PFILE. No hay acceso a la BBDD.
- **MOUNT**: se carga el control file, pero la BBDD sigue cerrada.
- **OPEN**: la BBDD está completamente disponible para operaciones.

Órdenes para arrancar paso a paso:

```txt
SQL> STARTUP NOMOUNT;
SQL> STARTUP MOUNT;
SQL> ALTER DATABASE OPEN;
```

### Arranque completo

Para arrancar la base de datos directamente en modo `OPEN`:

```txt
SQL> STARTUP;
```

![Estados de arranque y parada de una instancia Oracle #center](/img/contenidos/ut2/estats-arrancada.png)

⚠️ Necesitas los roles `SYSDBA` o `SYSOPER` para hacer esta acción.

### Parada de la instancia

Opciones disponibles:

- **IMMEDIATE** – Cierra las conexiones de forma controlada (recomendado)
- **NORMAL** – Espera a que los usuarios se desconecten
- **ABORT** – Corte inmediato (puede dejar la base de datos en estado incoherente)

Ejemplos:

```txt
SQL> SHUTDOWN IMMEDIATE;
SQL> SHUTDOWN NORMAL;
SQL> SHUTDOWN ABORT;
```

### En Windows

Ejecutar `sqlplus / as sysdba` como usuario `oracle` o administrador:

```bash
C:\> sqlplus / as sysdba
SQL> STARTUP;
SQL> SHUTDOWN IMMEDIATE;
```

### 🐧 En Linux

Las variables de entorno deben estar bien configuradas:

```bash
$ . oraenv
$ sqlplus / as sysdba
SQL> STARTUP;
SQL> SHUTDOWN IMMEDIATE;
```

### Gestionar contenedores (PDB)

Después de abrir la CDB, hay que abrir las PDB individualmente si no están configuradas para abrirse automáticamente:

```txt
SQL> ALTER PLUGGABLE DATABASE ALL OPEN;
SQL> ALTER PLUGGABLE DATABASE nom_pdb OPEN;
```

Para cerrarlas:

```txt
SQL> ALTER PLUGGABLE DATABASE ALL CLOSE IMMEDIATE;
SQL> ALTER PLUGGABLE DATABASE nom_pdb CLOSE IMMEDIATE;
```

### Buenas prácticas

- Utiliza siempre `SHUTDOWN IMMEDIATE` para evitar corrupciones
- Comprueba que las PDB están abiertas después del `STARTUP`
- ⚠️ Si haces `ABORT`, ejecuta `RECOVER` o revisa la coherencia de la BBDD después
- En entornos de prácticas, puedes hacer `STARTUP MOUNT` para estudiar las fases iniciales

### Comprobar el estado

```txt
SQL> SELECT status FROM v$instance;
SQL> SELECT name, open_mode FROM v$pdbs;
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
