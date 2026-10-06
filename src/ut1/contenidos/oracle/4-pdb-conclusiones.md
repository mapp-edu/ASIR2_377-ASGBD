---
layout: doc
title: "Oracle: creación de PDB y conclusiones"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: creación de PDB y conclusiones

## Creación manual de PDB

### Información general

Las **PDB** (Pluggable Databases) se pueden crear de forma manual mediante SQL desde el usuario `SYS`, siempre conectado a la **CDB** (¡no desde otra PDB!).

Esta opción ofrece más control sobre nombres, ubicaciones, contraseñas y configuración de la base de datos. Permite integrarlo en scripts y automatizar la creación de PDB, por lo que es ideal para entornos de desarrollo, testing o despliegues masivos.

El código se puede poner dentro de un .sql y ejecutarlo desde sqlplus, como por ejemplo:

```bash
sqlplus sys/password@CDB1 as sysdba @create_pdb.sql
```

### Creación manual de una PDB en Windows

Desde una sesión SQL\*Plus con el usuario `SYS` dentro de la CDB:

```sql
CREATE PLUGGABLE DATABASE nom_pdb
ADMIN USER pdbadmin1 IDENTIFIED BY 1234
ROLES = (dba)
DEFAULT TABLESPACE users;
```

⚠️ Si no se indica `DEFAULT TABLESPACE`, la PDB no tendrá un espacio por defecto para los usuarios.

#### 🗑️ Borrar una PDB (Windows):

```txt
SQL> ALTER PLUGGABLE DATABASE pdb_manual CLOSE IMMEDIATE;
SQL> DROP PLUGGABLE DATABASE pdb_manual INCLUDING DATAFILES;
```

### 🐧 Creación manual de una PDB en Linux

Desde `sqlplus` como `SYS` y dentro de la CDB, podemos crear la PDB indicando los ficheros exactos y las rutas:

```sql
-- En contenedor de oracle23ai
CREATE PLUGGABLE DATABASE DATAPDB
ADMIN USER pdbadmin1 IDENTIFIED BY 1234
ROLES = (dba)
PATH_PREFIX = '/opt/oracle/oradata/FREE/DATAPDB/'
FILE_NAME_CONVERT = (
  '/opt/oracle/oradata/FREE/pdbseed/',
  '/opt/oracle/oradata/FREE/DATAPDB/'
)
DEFAULT TABLESPACE users
DATAFILE '/opt/oracle/oradata/DATAPDB/users01.dbf' AUTOEXTEND ON
```

Se recomienda utilizar los comandos `edit` y `run` para facilitar el trabajo

El comando `edit` abre un editor (**vi** en Linux, **notepad** en Windows) para introducir más cómodamente las sentencias SQL; al acabar, guardamos, salimos y, desde la línea de SQL&gt;, ejecutamos con el comando `run`

- ( [Aprende el editor vi](https://keepcoding.io/blog/como-funciona-el-editor-de-texto-vi/) )

**Cuando se crea la PDB nueva, inicialmente está en modo MOUNT, y en este modo no se puede acceder a ella. Para acceder necesitamos abrirla**

```sql
   -- Para abrir la PDB
ALTER PLUGGABLE DATABASE DATAPDB OPEN;

   -- Para hacer que se abra automáticamente cuando se reinicie el sistema (máquina)
ALTER PLUGGABLE DATABASE DATAPDB SAVE STATE;
```

#### Notas útiles:

- Se puede consultar dónde se encuentran los ficheros de datos con:

```txt
SQL> SELECT name FROM v$datafile;
```

`PATH_PREFIX` ayuda a identificar la ruta base de la nueva PDB. `FILE_NAME_CONVERT` copia y adapta ficheros de PDB$SEED

#### 🗑️ Borrar una PDB (Linux):

```txt
SQL> ALTER PLUGGABLE DATABASE nom_pdb CLOSE IMMEDIATE;
SQL> DROP PLUGGABLE DATABASE nom_pdb INCLUDING DATAFILES;
```

### Recomendaciones finales

- Comprueba que estás conectado a la CDB antes de crear la PDB
- Comprueba las rutas y los permisos del sistema de ficheros si trabajas en Linux
- ⚠️ Asegúrate de tener `DB_CREATE_FILE_DEST` o `FILE_NAME_CONVERT` correctamente configurado

## Conclusiones

Una vez finalizada esta unidad, habrás adquirido conocimientos esenciales sobre la instalación y la administración básica de Oracle Database. A continuación se resumen los puntos clave alcanzados:

### Versiones y ediciones

- Identificar la **versión y la edición** de Oracle que hay que instalar según el contexto
- Diferenciar entre las ediciones *XE, SE, EE* y las versiones *11g, 12c, 19c, 21c...*

### Requisitos y preparación

- Conocer los **requisitos mínimos y realistas** para cada sistema operativo
- Saber qué **componentes y herramientas** forman parte de la instalación

### Arquitectura e instancia

- Diferenciar entre **BBDD, CDB, PDB, instancia, SGA y PGA**
- Entender la arquitectura multitenant y su obligatoriedad a partir de Oracle 21c
- Utilizar el **estándar OFA** para estructurar las carpetas

### Instalación del SGBD

- Instalar el **software Oracle** con `setup.exe` o `runInstaller`
- Crear una **CDB y una PDB** con la herramienta `dbca`
- Crear manualmente PDB o CDB desde la línea de órdenes
- Conocer los permisos necesarios según el rol del usuario (admin, oracle...)

### Conexión y acceso

- Conectarse a una instancia Oracle con **SQL\*Plus** y **SQL Developer**
- Saber cómo acceder a una CDB o a una PDB como `SYS` o `SYSTEM`
- Consultar el estado de las PDB y realizar cambios de contenedor

### Herramientas y clientes

- Utilizar clientes como:

  - **SQL\*Plus / SQL Developer / SQLcl**
  - **DBeaver / TOAD**
  - **ORDS** y **VSCode** con extensiones

- Crear y configurar **listeners** con `netca` y comprobar conexiones

🎓 Con todos estos conocimientos, ya estás preparado/a para empezar la unidad dos: configuración de un SGBD

## Otros recursos

- 🧭 [Guía: CDB y PDB](/ut1/ejercicios/guia-2-cdb-pdb)
- 🧭 [Guía: órdenes básicas y primeros errores](/ut1/ejercicios/guia-3-ordenes-basicas-errores)
- ✅ [Cuestionario de autoevaluación](/ut1/ejercicios/cuestionario)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
