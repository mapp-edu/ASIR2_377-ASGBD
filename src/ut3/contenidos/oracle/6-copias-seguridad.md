---
layout: doc
title: "Oracle: copias de seguridad y recuperación"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: copias de seguridad y recuperación

## 💾 Recuperación y copias de seguridad en Oracle

### ¿Por qué hay que hacer copias de seguridad?

Las copias de seguridad son esenciales para garantizar la **continuidad del servicio** y la **protección de la información**. En caso de fallo del sistema, error humano, corrupción de datos o ataques, una buena estrategia de backup permite recuperar la base de datos sin pérdidas.

La cuestión de hacer las copias de seguridad desde dentro de Oracle (usando herramientas como RMAN o exportaciones lógicas como Data Pump) frente a hacerlas desde fuera (copiando ficheros del sistema operativo) es muy importante porque afecta a la consistencia y a la recuperabilidad de la base de datos

Hacer las copias de seguridad desde dentro de Oracle es crítico porque asegura que la base de datos se pueda recuperar correctamente y sin pérdida de datos, incluso si está en funcionamiento. Hacerlo desde el sistema operativo solo es seguro si la base de datos está apagada, algo poco práctico en entornos de producción

Problemas si se hacen desde fuera del SGBD: inconsistencia, recuperación complicada, no se registran las transacciones

Ventajas si se hacen desde dentro del SGBD: consistencia de datos, recuperación puntual, gestión automática de logs, copias en caliente, automatización y verificación

### 🎯 Objetivos de una copia de seguridad

- Restaurar los datos después de un error
- Permitir la recuperación puntual o total
- Facilitar entornos de prueba o migraciones
- Cumplir normativas legales (protección de datos)

### Tipos de copias de seguridad

- **Físicas**: copias de los ficheros físicos (datafiles, control files, logs...)
- **Lógicas**: exportación de esquemas, tablas, usuarios o datos mediante utilidades como `expdp` e `impdp`

---

- **Totales**: una PDB entera o una CDB entera
- **Parciales**: parte de una BBDD, un tablespace, una tabla concreta, un esquema

---

- **Online**: también se llama copia de seguridad en caliente. Se hace mientras la base de datos sigue activa y los usuarios trabajan.
- **Offline**: también se llama copia de seguridad en frío. Se realiza cuando la base de datos está completamente parada

---

### Estrategias de backup

- **Completa:** copia total de la BD
- **Incremental:** solo los datos modificados desde el último backup
- **Diferencial:** todas las modificaciones desde el último backup completo
- **Continua:** con redo logs y archivelogs activos

### Mecanismos de Oracle

- **Exportación:** la copia lógica se guarda en el equipo cliente
- **Data Pump:** la copia lógica se guarda en el equipo servidor
- **RMAN:** la copia física o incremental se guarda en el equipo servidor

---

### Herramientas principales de backup en Oracle

### 1. 📤 Exportación e importación legacy (Original Export)

```txt
exp / imp
```

- Se ejecuta desde la línea de comandos/terminal
- La copia lógica se guarda en el equipo desde el que se ejecuta (suele ser el cliente)
- Modos: full, user (esquema), tablespace, table, query
- Se puede usar un fichero de parámetros parfile=

```txt
EJEMPLO
exp username/password@ipAddress:portNumber/serviceName file=/recovery_area/export/prueba_export.dmp full=yes buffer=1000000
```

Si queremos hacer un exp total (full=yes), el usuario que lo ejecute necesita el rol EXP_FULL_DATABASE

```txt
Para llamarlo con sys
exp \'username/password@instance AS SYSDBA\' parametres
```

![Asistente de exportación de datos de SQL Developer #center](/img/contenidos/ut3/copseg_exporta.png)

Un mecanismo muy parecido, y más cómodo e intuitivo, se puede encontrar en SQL Developer con la herramienta de exportación. Desde el menú Herramientas → Exportación de base de datos, lanza unas ventanas para indicar qué, cómo y dónde hacer una exportación.

Los datos se guardarán en la máquina cliente (o en un lugar al que esta pueda acceder)

```txt
SQL Developer permite exportar / importar datos, esquemas y resultados de consultas a diversos formatos
```

---

### 2. 📤 Data Pump

```bash
expdp / impdp
```

- Se ejecuta desde la línea de comandos/terminal (pero la copia se ejecuta en el servidor)
- También se puede ejecutar desde dentro del SGBD con el paquete DBMS_DATAPUMP (próxima unidad)
- La copia lógica se guarda en el equipo servidor (o en un lugar alcanzable desde el servidor)
- Más rápido, más rendimiento, varios hilos en paralelo
- Modos: full=Y, schemas=esquema_1[, esquema_N], tablespaces=, tables=, QUERY=
- Se puede usar un fichero de parámetros parfile=

```bash
-- EJEMPLO
-- Guardar todo un esquema (todos los objetos de un usuario)
expdp username/password@ipAddress:portNumber/serviceName directory=dumpdir dumpfile=export.dmp logfile=fichero.log
expdp usuari/password SCHEMAS=usuari DUMPFILE=export.dmp LOGFILE=export.log   --¡No hace falta poner la ruta física!

-- Recuperar en otra BD
impdp usuari/password DUMPFILE=export.dmp LOGFILE=import.log
```

- Todo: FULL=Y
- Uno o más tablespaces: TABLESPACES=tb1[,...]
- Uno o más esquemas: SCHEMAS= usuari1 [,...]
- Una o más tablas: TABLES= taula1 [,...]
- Una parte de una tabla: QUERY [usuari.taula:] WHERE ....
- No se pueden combinar en una misma exportación, pero se pueden ejecutar varias exportaciones

![Data Pump en modo FULL: se exporta toda la base de datos #center](/img/contenidos/ut3/copseg_full.png)

![Data Pump en modo TABLESPACES: se exportan los objetos de un tablespace #center](/img/contenidos/ut3/copseg_tblspc.png)

![Data Pump en modo SCHEMAS: se exportan los objetos de un esquema #center](/img/contenidos/ut3/copseg_sch.png)

![Data Pump en modo TABLES: se exportan tablas concretas #center](/img/contenidos/ut3/copseg_table.png)

![Data Pump con QUERY: se exportan las filas que cumplen una condición #center](/img/contenidos/ut3/copseg_query.png)

Es necesario que el servidor tenga acceso al lugar donde hará (el servidor) las copias

Primero: definir un directorio

```sql
CREATE [OR REPLACE] DIRECTORY directory_name AS 'path_name';
```

La ruta debe existir y tener permisos de escritura

Los ficheros de destino NO deben existir (o la copia dará error)

El usuario que conecta debe tener permisos de acceso a los datos para hacer copias

Para hacer una copia completa se necesita un permiso (ROL) concreto

```txt
DATAPUMP_EXP_FULL_DATABASE
DATAPUMP_IMP_FULL_DATABASE
```

```txt
EJEMPLO de archivo 'parfile'
TABLESPACES=users
DUMPFILE=exp2.dmp
DIRECTORY=dirdump
LOGFILE=exp2.log
```

---

### 3. 🔄 RMAN (Recovery Manager)

Herramienta oficial de Oracle para hacer backups y recuperar datos. Puede trabajar con copias incrementales, verificar la integridad y automatizar tareas.

::: warning Atención
RMAN necesita ARCHIVELOG activado para funcionar correctamente
:::

```txt
-- Ejemplo: backup completo
RMAN> BACKUP DATABASE;

-- Backup solo de la parte SYSTEM
RMAN> BACKUP TABLESPACE system;

-- Recuperación
RMAN> RESTORE DATABASE;
RMAN> RECOVER DATABASE;
```

#### 📋 Ejemplo de procedimiento básico con RMAN

```bash
-- Conexión
rman target /

-- Comprobación de la copia
VALIDATE DATABASE;

-- Copia
BACKUP AS BACKUPSET DATABASE PLUS ARCHIVELOG;

-- Restauración
RESTORE DATABASE;
RECOVER DATABASE;
```

---

![SQL*Loader carga ficheros de texto en la base de datos #center](/img/contenidos/ut3/copseg_SQL_loader.png)

SQL\*Loader es una utilidad que permite la inserción de datos desde un archivo plano en una o más tablas de la base de datos.

En una sola de sus ejecuciones es posible rellenar múltiples tablas con datos de múltiples archivos, manejar registros de ancho variable o fijo, manipular los datos entrantes para tratar valores nulos, delimitadores y espacios en blanco, omitir registros o encabezados y reaccionar ante fallos del proceso de carga

---

### Archivos implicados en la recuperación

- **Datafiles:** contienen los datos
- **Control file:** describe la estructura de la BD
- **Redo logs:** registran todos los cambios
- **Archivelogs:** copia de los redo logs, esencial para una recuperación completa

### Escenarios de recuperación

- Recuperación completa: con todos los archivelogs y datafiles
- Recuperación parcial: tablas, ficheros o instancia
- Restauración en caso de pérdida del control file

### Buenas prácticas de seguridad

- Programar backups regulares
- Mantener copias en ubicaciones externas
- Hacer pruebas periódicas de recuperación
- Utilizar `RMAN VALIDATE` para comprobar la integridad
- Documentar el procedimiento de recuperación

### Conclusión

Disponer de un plan de copias de seguridad fiable y efectivo es **fundamental para garantizar la seguridad y la continuidad** de cualquier sistema basado en Oracle. Herramientas como RMAN y Data Pump permiten adaptarse a múltiples escenarios, y una buena estrategia de backup debe ir acompañada de una política de recuperación clara.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
