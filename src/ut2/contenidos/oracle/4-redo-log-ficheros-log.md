---
layout: doc
title: "Oracle: redo log, ficheros log y parámetros NLS"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: redo log, ficheros log y parámetros NLS

## 🧾 Cuaderno de bitácora (Redo Log Files)

### 📒 ¿Qué es?

El **cuaderno de bitácora** en Oracle (en inglés, log file o redo log) es un concepto clave para garantizar la recuperación de datos y la integridad del sistema en caso de fallo.

El **«cuaderno»** se compone de un grupo de ficheros especiales que Oracle utiliza para registrar todos los cambios que se hacen en la base de datos, antes de que estos se confirmen físicamente en los ficheros de datos

También conocido como: redo log files, ficheros de redo, ficheros de registro de redo

Los **ficheros redo log** son ficheros esenciales que registran todas las modificaciones hechas en la base de datos. Este registro permite a Oracle **recuperar los datos en caso de fallo** antes de que los datos se escriban definitivamente en los ficheros de datos.

### 🔧 ¿Para qué sirve?

- Permite recuperar la base de datos después de un fallo (p. ej., un corte eléctrico).
- Registra instrucciones como INSERT, UPDATE, DELETE, etc.
- No registra consultas SELECT porque no modifican datos.

### 🗂️ Tipos de redo logs:

- Online redo logs (en línea): son los principales. Oracle escribe continuamente en ellos.
- Offline redo logs (archived redo logs): si la base de datos está en modo ARCHIVELOG, los redo logs antiguos se guardan para una recuperación completa.

### 🔁 Funcionamiento cíclico

Oracle utiliza un conjunto de ficheros redo log en modo circular (anillo). Cuando un fichero se llena, se escribe en el siguiente. Cuando se completa un ciclo, vuelve a empezar por el primero.

Cuantos más grupos de redo logs tengas, más eficiencia y seguridad ofrece el sistema.

### Estructura típica

Una instancia puede tener múltiples grupos de redo logs, cada uno con uno o más miembros (ficheros físicos replicados):

```txt
GROUP 1 → redo01.log
GROUP 2 → redo02.log
GROUP 3 → redo03.log
```

![Grupos de redo log que se reutilizan de forma circular #center](/img/contenidos/ut2/redolog.png)

Normalmente hay tres ficheros redo log, que van rotando. Cuando uno se llena, pasa al siguiente, y cuando se llena el último, pasa otra vez al primero

El proceso de memoria LGWR se encarga de hacer esto.

```txt
(forzar la rotación de los ficheros Redo Log)
SQL> alter system switch logfile;
```

### Añadir un nuevo grupo de redo logs

```txt
SQL> ALTER DATABASE ADD LOGFILE GROUP 4
('/opt/oracle/oradata/NOM_BBDD/redo04.log') SIZE 50M;
```

### Añadir un miembro (fichero adicional) a un grupo existente

```txt
SQL> ALTER DATABASE ADD LOGFILE MEMBER
'/opt/oracle/oradata/NOM_BBDD/redo01b.log' TO GROUP 1;
```

### 🔍 ¿Dónde se encuentran?

Puedes ver dónde están consultando el DD:

```sql
SELECT member FROM v$logfile;
select * from v$log;
```

### 📍 Ubicación típica de los redo logs

```txt
/opt/oracle/oradata/NOM_BBDD/redo0X.log
```

(Se define durante la creación de la base de datos con `DBCA`)

::: warning Atención
🧪 Práctica: busca en la máquina servidor la ruta concreta de tus REDO LOGS
:::

⚠️ En un entorno de producción, estos ficheros deberían estar en un disco físico diferente del que contiene los datafiles

### En caso de error con los redo logs

Pueden impedir el inicio de la base de datos. Por ejemplo, si se borra un fichero o falla un disco.

Se puede utilizar una orden como:

```txt
SQL> ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 1;
```

⚠️ **¡Solo para casos de emergencia!**

### ARCHIVELOG u Offline Redo Log

![Base de datos primaria, redo log en línea y redo log archivado (fuera de línea) #center](/img/contenidos/ut2/archivelog.png)

El Online Redo Log viene activado por defecto, pero el Offline Redo Log viene desactivado por defecto

El proceso de memoria ARCH se encarga de llevar el Offline Redo Log, también conocido como ARCHIVELOG.

ARCHIVELOG guarda fuera de línea los archivos redo log que no están activos. De esta manera, cuando se hace la transición del último al primero, el primero ya se ha guardado antes fuera de línea, y no hay peligro de sobrescribir transacciones que ocupen demasiado espacio

### Cómo activar el ARCHIVELOG

```txt
SQL> archive log list
SQL> alter system set log_archive_dest_1='LOCATION=/archivelog/carpeta/arch' SCOPE=SPFILE;
SQL> alter system set log_archive_format='arch_%r_%t_%s.arc' scope=spfile;
SQL> alter system set LOG_ARCHIVE_START=TRUE SCOPE=spfile;
SQL> shutdown immediate; startup mount;
SQL> alter database archivelog;
SQL> alter database open;
SQL> archive log list
SQL> select name, log_mode from v$database;
SQL> ALTER SYSTEM SWITCH LOGFILE;
```

### Buenas prácticas

- Tener al menos 3 grupos de redo logs

- Tener más de un miembro por grupo (redundancia)

- Los redo logs deben estar en discos rápidos y fiables

- No compartir físicamente el disco de los redo logs con otros ficheros críticos

  - Los ficheros REDO deben estar en otro disco físico

## 🧾 Ficheros log

### ¿Qué son los ficheros log?

Los **logs** en Oracle hacen referencia a los ficheros de registro que el sistema genera automáticamente para monitorizar la actividad, los errores y las operaciones internas. Estos ficheros son imprescindibles para cualquier tarea de diagnóstico o auditoría.

### Tipos de logs

- **Alert log**: es uno de los principales ficheros de registro del sistema. Muestra mensajes de arranque y parada (SHUTDOWN y STARTUP en los diferentes modos), errores graves o críticos (ORA-xxxxx), creación, cambio o eliminación de tablespaces, datafiles o redo logs, y más.
- **Trace files**: .trc .trm ➜ ficheros de seguimiento detallado para procesos específicos o errores concretos.
- **Listener log**: fichero que recoge las conexiones y actividades del listener.
- **Log de instalación del software**: fichero que recoge las acciones de instalación.
- **Log de instalación de la BBDD**: fichero que recoge las acciones de instalación.
- **Log de instalación de parches/upgrades**: fichero que recoge las acciones de instalación.
- **Log de copias de seguridad**: fichero que recoge las acciones de copias de seguridad (hechas o fallidas) de Data Pump y RMAN.
- **Log de administración web de OEM**: Oracle Enterprise Manager

### 📁 Ubicación de los ficheros

La mayoría dentro de `$ORACLE_BASE/diag/`, pero también en `$ORACLE_BASE/oraInventory/logs/`

- **Unix/Linux:**

  ```txt
  $ORACLE_BASE/diag/rdbms/<db_name>/<sid>/trace/
  ```

- **Windows:**

  ```txt
  %ORACLE_BASE%\diag\rdbms\\<sid>\trace\
  ```

El fichero de alertas suele llamarse:

```txt
alert_SID_.log   -- Sustituye SID por el nombre de la CDB
```

::: warning Atención
🧪 Práctica: busca en la máquina servidor todos los ficheros que contengan la palabra «alert» (y su ruta). Después, haz una clasificación de los ficheros de log y relaciónalos con las variables de entorno (ORACLE_BASE, ORACLE_HOME, etc.)
:::

### 🔍 Consultar el alert log

Un fichero log suele ser muy extenso, con mucha información distinta de diferentes eventos, lo que hace difícil encontrar datos concretos

Cómo actuar

1. Localizar el fichero
2. Averiguar cómo se almacena el evento que se quiere consultar
3. Filtrar por el evento
4. Buscar alrededor del evento más información relevante

```bash
find / -name alert 2>/dev/null
--  El evento que queremos consultar es cuándo arranca la BBDD => corresponde con "Starting"
cat /opt/oracle/diag/rdbms/free/FREE/trace/alert_FREE.log | grep Starting
cat /opt/oracle/diag/rdbms/free/FREE/trace/alert_FREE.log | grep -A 1 Starting
```

También se pueden consultar las entradas recientes:

```bash
$ tail -f alert_costera.log   # En tiempo real (Linux)
```

#### Ejemplos reales de líneas dentro de `alert_FREE.log`

```sql
Starting ORACLE instance (normal)
ORACLE instance started.
Total System Global Area 2147483648 bytes
Fixed Size                  9133424 bytes
Variable Size             637534208 bytes
Database mounted.
Database opened.
Completed: ALTER DATABASE OPEN
ALTER SYSTEM SET sga_target=2048M SCOPE=BOTH;
ORA-00600: internal error code, arguments
Errors in file /opt....
ARC0: Archiving completed. Archiving:
```

Buscar por un error concreto

```bash
grep ORA- alert_FREE.log
```

Buscar por una fecha concreta

```bash
grep "2025-10-26" alert_FREE.log
```

#### Usar ADRCI

ADRCI se basa en el ADR (Automatic Diagnostic Repository), una estructura de directorios que Oracle utiliza para guardar toda la información de diagnóstico, como:

- ficheros alert log
- trace files (trazas de los procesos)
- informes de errores (incident reports)
- core dumps
- datos de seguimiento de rendimiento

... que normalmente se encuentra en: `$ORACLE_BASE/diag/`

ADRCI es la herramienta con la que puedes acceder a todo esto y analizarlo sin tener que abrir los ficheros manualmente. Es una CLI (Command-Line Interface) que te permite ver, filtrar y gestionar los incidentes.

```bash
Desde bash:
    $ adrci
```

Ejemplo de uso básico

```bash
$ adrci
adrci> show homes
ADR Homes:
diag/rdbms/free/FREE

adrci> set home diag/rdbms/free/FREE
adrci> show alert -tail 20

adrci> show alert -p "message_text like '%ORA-%'"

adrci> show incident
```

#### Vistas de diagnóstico

Desde Oracle 11g, el sistema de diagnóstico automático (ADR – Automatic Diagnostic Repository) permite leer el contenido del alert.log desde SQL con la vista `V$DIAG_ALERT_EXT`

Ejemplo

```sql
SELECT originating_timestamp, message_text
FROM   V$DIAG_ALERT_EXT
WHERE  message_text LIKE '%Starting%';
```

---

### 📞 Listener log

El fichero de registro del listener muestra información sobre conexiones, errores y tiempos de respuesta.

Ubicación típica:

```txt
$ORACLE_BASE/diag/tnslsnr/<host>/listener/trace/listener.log
```

ejemplo

```bash
cat /opt/oracle/diag/tnslsnr/a2444629be58/listener/trace/listener.log | grep establish
```

o

```bash
cat /opt/oracle/diag/tnslsnr/a2444629be58/listener/trace/listener.log | grep establish | grep 26-OCT
```

... y con adrci

```sql
show home
set home diag/........../listener
show alert -tail 10
show alert -p "message_text like '%CONNECT%'"
show alert -p "message_text like '%establish%'"      -- ver conexiones
show alert -p "message_text like '%TNS-%'"       -- ver errores de red
```

**⚠️ Los mensajes de listener.log no se pueden consultar directamente con una vista de diagnóstico, como ocurre con los mensajes de alert.log**

### Recomendaciones

- Revisa el **alert log** después de cualquier `startup`, `shutdown` o error inesperado
- Configura herramientas de rotación de logs para evitar que ocupen demasiado espacio
- Utiliza `v$diag_info` para consultar las rutas oficiales de los directorios
- Los trace files pueden ayudar a identificar errores que no aparecen en otros lugares

Los parámetros NLS (National Language Support) en Oracle Database se gestionan en tres niveles jerárquicos. Esta jerarquía determina qué configuración (idioma, formato de fecha, ordenación, etc.) se aplica en cada momento.

- Nivel de base de datos
- Nivel de instancia
- Nivel de sesión

## 🌎 NLS_DATABASE_PARAMETERS

- **Ámbito:** **toda la base de datos.** Es la configuración más permanente.
- **Qué rige:** principalmente el **juego de caracteres de la base de datos** (`NLS_CHARACTERSET`), que es crucial para el almacenamiento de los datos.
- **Configuración:** se fija durante la **creación de la base de datos** (con la sentencia `CREATE DATABASE`) y es muy difícil de cambiar posteriormente (requiere migraciones complejas).
- **Prioridad:** **la más baja.** Siempre es sobrescrito por los niveles de instancia y sesión.

### ⚙️ NLS_INSTANCE_PARAMETERS

- **Ámbito:** **la instancia del servidor Oracle.** Se aplica a todas las sesiones que se conectan, excepto si la sesión lo sobrescribe.
- **Qué rige:** establece los **valores por defecto** (*defaults*) para la mayoría de parámetros NLS (como `NLS_LANGUAGE` o `NLS_DATE_FORMAT`) antes de que la sesión se conecte.
- **Configuración:** se lee desde el **fichero de inicialización** (`pfile` / `spfile`). Hay que **reiniciar la instancia** para aplicar los cambios.
- **Prioridad:** **media.** Sobrescribe el nivel de base de datos, pero es sobrescrito por el nivel de sesión.

### 💻 NLS_SESSION_PARAMETERS

- **Ámbito:** **la sesión actual del usuario.** Es el nivel más flexible y el que realmente se utiliza para las consultas.
- **Qué rige:** cómo **se muestran y se interpretan los datos** durante la ejecución de una consulta (p. ej., formato de fecha, símbolo decimal, reglas de ordenación).
- **Configuración:** se establece de forma dinámica con el comando **`ALTER SESSION SET...`**
- **Configuración:** también se establece mediante la variable de cliente `NLS_LANG`, definida como variable de entorno del sistema operativo ($NLS_LANG): **`NLS_LANG = Language_Territory.Charset`**, en el fichero .bashrc o puntualmente con EXPORT
- Ejemplo: `export NLS_LANG=SPANISH_SPAIN.AL32UTF8` o dentro del .bashrc
- **Prioridad:** **la más alta.** Estos valores siempre sobrescriben la configuración de la instancia y de la base de datos.

## 🔢 Resumen de la jerarquía y la prioridad

El valor que utiliza Oracle para la mayoría de operaciones de presentación de datos siempre sigue esta lógica: **Sesión &gt; Instancia &gt; Base de datos**.

| Parámetro | Ámbito de aplicación | Método de configuración | Prioridad |
| --- | --- | --- | --- |
| **NLS_DATABASE_PARAMETERS** | Base de datos completa (almacenamiento) | Durante el `CREATE DATABASE` | **Baja (solo por defecto)** |
| **NLS_INSTANCE_PARAMETERS** | Instancia del servidor (valores por defecto) | `SPFILE` / `PFILE` (requiere reiniciar) | Media |
| **NLS_SESSION_PARAMETERS** | Sesión de usuario actual (presentación) | `NLS_LANG` del cliente o `ALTER SESSION` | **La más alta** |

## Otros recursos

- 🧭 [Guía: tablespaces y datafiles](/ut2/ejercicios/guia-1-tablespaces-datafiles)
- 🧭 [Guía: uso de SQL\*Plus](/ut2/ejercicios/guia-2-uso-sqlplus)
- 🧭 [Guía: uso de vi](/ut2/ejercicios/guia-3-uso-vi)
- 📅 [Gestión de fechas en Oracle](/ut2/contenidos/oracle/5-fechas-en-oracle)
- ✅ [Cuestionario de autoevaluación](/ut2/ejercicios/cuestionario)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
