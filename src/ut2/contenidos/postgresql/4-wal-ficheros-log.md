---
layout: doc
title: "PostgreSQL: WAL y ficheros log"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: WAL y ficheros log

## 🧾 Cuaderno de bitácora (Redo Log Files)

En PostgreSQL, el cuaderno de bitácora se llama WAL

### WAL (Write Ahead Log)

El WAL (Write Ahead Log) en PostgreSQL es el mecanismo que garantiza la seguridad y la consistencia de los datos. WAL significa literalmente «Write Ahead Log» = escribir primero en el log antes que en la tabla

Ubicado en: `PGDATA/pg_wal/`

Es esencial para:

- Recuperación en caso de fallo
- Replicación en tiempo real
- Propiedades ACID

Idea clave: antes de que PostgreSQL modifique físicamente una tabla en el disco, escribe el cambio en el WAL y después aplica el cambio en la tabla

Esto permite recuperar la base de datos si hay un error o un corte eléctrico.

#### ¿Cómo funciona?

```sql
Para una operación como:
UPDATE comptes SET saldo = saldo - 100 WHERE id = 1;
```

1. Se registra el cambio en el WAL
2. El WAL se guarda en disco
3. Se confirma la transacción (COMMIT)
4. Más tarde se actualiza la tabla real

Si el sistema falla antes del paso 4 → PostgreSQL puede reconstruir el cambio utilizando el WAL.

#### 🔥 Recuperación después de un crash

- Lee el WAL
- Reproduce las operaciones que no se habían escrito completamente en disco
- Deja la base de datos en estado consistente

Esto se llama: **Crash Recovery**

## LOGS

Los logs en PostgreSQL son ficheros de registro que documentan la actividad del servidor (errores, conexiones, consultas y eventos internos) y sirven para el diagnóstico, la auditoría y el análisis del rendimiento

### 📁 Ubicación de los ficheros

Por defecto, PostgreSQL escribe los mensajes en stderr, no en ficheros. Para generar logs en ficheros, hay que activar el logging_collector y definir un directorio con log_directory y log_filename:

```bash
# Fichero postgresql.conf (normalmente en /etc/postgresql/16/main )
logging_collector = on          # habilita la recogida de logs en ficheros
log_directory = 'pg_log'        # nombre del directorio (puede ser relativo a $PGDATA)
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'   # nombre de los ficheros
```

En PostgreSQL normalmente se generan ficheros separados según la configuración de log_filename. Esto hace que cada reinicio del servidor o cada intervalo de tiempo (según la configuración) genere un fichero nuevo.

Por defecto:

```txt
$PGDATA/pg_log/          (Linux)
%PGDATA%\pg_log\          (Windows)
```

PostgreSQL puede rotar los logs automáticamente con

```txt
log_truncate_on_rotation = on   # Borra el fichero antiguo si existe
log_rotation_age = 1d           # Rotar cada día
log_rotation_size = 10MB        # Rotar cuando el fichero llega a 10 MB
```

Esto evita ficheros enormes y permite tener logs manejables. Si utilizas log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log', cada rotación creará un fichero nuevo automáticamente.

### 🔍 Cómo consultar los logs

#### Linux

```bash
# Logs recientes en tiempo real
tail -f $PGDATA/pg_log/postgresql-2026-02-19_120000.log

# Buscar por un error concreto
grep "ERROR" $PGDATA/pg_log/postgresql-2026-02-19_120000.log

# Buscar por una fecha específica
grep "2026-02-19" $PGDATA/pg_log/postgresql-2026-02-19_*.log
```

#### 🖥️ Windows

Abrir los ficheros `.log` con Notepad o Notepad++ y filtrar por errores o sentencias.

### 🛠 Configuración clave en `postgresql.conf`

```bash
# Habilitar la recogida de logs
logging_collector = on

# Destino del log
log_destination = 'stderr'

# Carpeta y nombre del fichero
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'

# Registrar las consultas SQL largas
log_min_duration_statement = 1000   # ms

# Registrar conexiones y desconexiones
log_connections = on
log_disconnections = on

# Nivel de gravedad mínimo
log_min_messages = warning
```

### 📋 Tipos de logs en PostgreSQL

Dentro de los ficheros de log se pueden encontrar los siguientes eventos:

**🟢 Server log (equivalente al alert log)**

```txt
ejemplo
LOG:  database system is ready to accept connections
LOG:  database system is shut down
```

```txt
Ejemplo de errores:
ERROR:  relation "clients" does not exist
STATEMENT: SELECT * FROM clients;
```

**🟡 CSV log / File log**

Logs en formato CSV, útiles para análisis automático o informes. Extensión: `.csv`

```txt
log_destination = 'csvlog'
```

Si se activa, la estructura de almacenamiento será de tipo .csv, para hacer un análisis posterior

**🔵 Log de conexiones**

Registra intentos de conexión, autenticación fallida o correcta, y desconexiones. Se configura con `log_connections` y `log_disconnections`.

Si se activa:

```txt
log_connections = on
log_disconnections = on
```

```txt
Se podrá ver en los eventos:
LOG:  connection authorized: user=postgres database=testdb
LOG:  disconnection: session time: 0:01:23
```

**🟣 Log de consultas**

Registra sentencias SQL; útil para depuración y tuning. Se configura con `log_statement` y `log_min_duration_statement`.

Si se activa:

```txt
log_statement = 'all'
```

```txt
Se podrán ver en los eventos TODAS las consultas:
Mejor práctica:
log_min_duration_statement = 1000
  Solo las consultas que «duran» mucho...
```

**🟠 Log de backups**

Si se utiliza `pg_dump`, `pg_restore` o `pg_basebackup`, los logs de las operaciones de backup se pueden redirigir a ficheros específicos.

```bash
Desde el cliente que lanza el backup
pg_dump -U postgres -d basedades > backup.sql 2> backup.log
o
DATA=$(date +%Y-%m-%d_%H%M)
pg_dump -U postgres basedades   > /backups/basedades_$DATA.sql  2> /backups/basedades_$DATA.log
```

```txt
Desde el servidor
log_checkpoints = on
log_connections = on
log_replication_commands = on
==>  Esto hará que el server log muestre información cuando se haga un pg_basebackup.
```

**⚪ Log de instalación o actualizaciones**

Durante la instalación del servidor PostgreSQL o de extensiones, se generan logs del sistema operativo o de los scripts de instalación.

Si se instala con sudo apt install postgresql-16, los logs no se configuran en PostgreSQL, sino que los generan APT y dpkg.

```txt
📁 On es troben?
/var/log/apt/history.log
/var/log/apt/term.log

También:

/var/log/dpkg.log
```

Configuración: no se configuran desde PostgreSQL. Se configuran desde:

```bash
/etc/apt/apt.conf.d/
  * Configuración de rsyslog
  * Rotación con logrotate
Ejemplo para ver la instalación de PostgreSQL:
grep postgresql /var/log/apt/history.log
```

Logs del servicio de PostgreSQL, una vez en funcionamiento

```txt
Para ver los logs:
journalctl -u postgresql
O en tiempo real:
journalctl -u postgresql -f
Estos logs dependen de:
/etc/systemd/journald.conf
```

---

### 🔍 Ejemplo de alert log real (arranque y errores)

```txt
2026-02-19 12:00:01 UTC [12345] LOG:  database system was shut down at 2026-02-19 11:59:50 UTC
2026-02-19 12:00:01 UTC [12345] LOG:  MultiXact member wraparound protections are now enabled
2026-02-19 12:00:01 UTC [12345] LOG:  database system is ready to accept connections
2026-02-19 12:05:02 UTC [12347] ERROR:  relation "clients" does not exist at character 15
2026-02-19 12:05:02 UTC [12347] STATEMENT:  SELECT * FROM clients;
```

### ⚙️ Configuración recomendada en `postgresql.conf`

```txt
logging_collector = on
log_destination = 'stderr'
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_connections = on
log_disconnections = on
log_statement = 'all'
log_min_duration_statement = 1000
log_min_messages = warning
```

::: warning Atención
🧪 Práctica: localiza los ficheros de log, ábrelos y filtra por errores o arranques de la base de datos. Observa cómo PostgreSQL registra diferentes eventos, como arranques, errores SQL y conexiones.
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
