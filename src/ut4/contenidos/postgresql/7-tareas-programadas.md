---
layout: doc
title: "PostgreSQL: tareas automatizables"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: tareas automatizables

## 📅 Tareas automatizables en PostgreSQL

### ¿Qué se puede automatizar?

En un entorno PostgreSQL es habitual automatizar tareas para mejorar la gestión y el rendimiento del sistema. Algunas de las tareas más comunes son:

- Exportaciones y copias de seguridad
- Importaciones de datos
- Ejecución de informes
- Limpieza de logs y archivos antiguos
- Tareas de mantenimiento periódico

### 📄 Scripts SQL y .bat

Puedes crear scripts `.sql` con comandos de PostgreSQL y ejecutarlos desde scripts `.bat` o `.sh` mediante `psql`.

#### Ejemplo: script SQL

```sql
-- archivo: informe.sql
-- informe.sql
\pset pager off       -- desactiva el paginador
\o informe_resultats.txt  -- envía la salida a un fichero

SELECT * FROM alumnes;

\o                    -- devuelve la salida a la consola
\q                    -- sale de psql
```

#### 🖥️ Script .bat (Windows)

```bash
-- archivo: llança_informe.bat
psql -d empresa -c "CALL el_meu_procediment();"
pause
```

Una vez creado el fichero .bat, hay que crear una tarea programada: Panel de control → Tareas programadas → Agregar tarea → ...

Consulta alguna guía sobre cómo usar el programador de tareas de Windows: [guía 1](https://www.adslzone.net/esenciales/windows-10/programar-tareas/), [guía 2](https://openwebinars.net/blog/programacion-de-tareas-desde-la-terminal-de-windows/)

#### 🐧 Script .sh (Linux)

```bash
#!/bin/bash
psql -d empresa -c "CALL el_meu_procediment();"
```

En Linux se utiliza CRON / CRONTAB para añadir tareas que se ejecutarán a determinadas horas / días. Consulta alguna guía sobre cómo usar CRON, [guía 1](https://www.redeszone.net/tutoriales/servidores/cron-crontab-linux-programar-tareas/), [guía 2](https://www.arsys.es/blog/cron-jobs-una-guia-completa) o [guía 3](https://www.hostinger.com/mx/tutoriales/sintaxis-crontab), para entender las diferentes opciones de programación horaria.

---

### 📆 pg_cron

PostgreSQL dispone de una extensión para programar tareas (llamadas **jobs**) directamente desde **DENTRO** de la base de datos: **pg_cron**.

Primero hay que instalarla en el SO

```bash
   Linux
sudo apt install postgresql-XX-cron
```

```txt
-- En postgresql.conf
shared_preload_libraries = 'pg_cron'
-- Para hacer que el servidor cron se inicialice automáticamente
```

⚠️ IMPORTANTE: después de modificar shared_preload_libraries, hay que reiniciar el servidor: `sudo systemctl restart postgresql`

En Windows es un poco más complicado, porque hay que compilar el código fuente.

#### Usar la extensión

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

pg_cron solo permite que un superusuario cree jobs.

Los jobs se ejecutan con los privilegios del rol que los crea.

Si hace falta más granularidad, se usará otra herramienta, como pgAgent de pgAdmin

#### Crear una tarea programada

```sql
SELECT cron.schedule(
    'job1',
    '* * * * *',
    $$CALL el_meu_procediment();$$
);
```

El rol que ejecuta el job debe tener permisos para ejecutar el SQL o el procedimiento definido dentro del job.

GRANT EXECUTE ON PROCEDURE nom_procediment TO usuari; GRANT SELECT, INSERT, UPDATE, DELETE ON taula TO usuari;

El usuario 'usuari' no necesita ser superusuario para ejecutar el job; solo necesita poder llamar a los procedimientos sobre los que tiene permiso.

---

\* Las expresiones cron siguen el formato de Linux: min hora dia_mes mes dia_semana

\* Los jobs se ejecutan dentro de la BD, con los permisos del rol que crea el job.

```txt
┌───────────── min (0 - 59)
│ ┌────────────── hour (0 - 23)
│ │ ┌─────────────── day of month (1 - 31) or last day of the month ($)
│ │ │ ┌──────────────── month (1 - 12)
│ │ │ │ ┌───────────────── day of week (0 - 6) (0 to 6 are Sunday to
│ │ │ │ │                  Saturday, or use names; 7 is also Sunday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

```txt
-- Ejemplos
'10 seconds'  # cada 10 segundos
* * * * *     # cada minuto
*/5 * * * *   # cada 5 minutos
0 * * * *     # cada hora
0 0 * * *     # cada día a las 12 AM
0 0 * * 1-5   # a las 12 AM de lunes a viernes
0 1 * * 0     # a la 1 AM todos los domingos
0 13 2 6 *    # a la 1 PM del 2 de junio
```

#### Habilitar o deshabilitar la programación

```sql
-- Deshabilitar
UPDATE cron.job
SET active = false
WHERE jobid = 1;

-- Habilitar
UPDATE cron.job
SET active = true
WHERE jobid = 1;
```

Los jobs desactivados no se ejecutan, pero permanecen en la tabla cron.job.

#### Modificar un job

```sql
-- cambia la planificación del job
SELECT cron.alter_job(42, '0 10 * * *');
-- devuelve void
```

#### Borrar un job

```sql
SELECT cron.unschedule(jobid);
```

→ Documentación oficial de la extensión: [What is pg_cron](https://github.com/citusdata/pg_cron)

---

### 📆 pgAgent, integrado en pgAdmin

![Nodo pgAgent Jobs en el árbol de pgAdmin #center](/img/contenidos/ut4/pgAgent.png)

- Es un agente de programación de tareas para PostgreSQL.
- Te permite automatizar ejecuciones de SQL, funciones o scripts según horarios definidos.
- Se integra con pgAdmin, así que puedes crear, modificar y supervisar tareas gráficamente.
- Funciona como un servidor/servicio que se ejecuta constantemente y comprueba las tareas programadas.

Para poder usar pgAgent, primero hay que instalarlo desde el sistema operativo. Después, crear una extensión.

```bash
Desde Linux
sudo apt update
sudo apt install -y pgagent
```

Ejecutar pgAgent como servicio

```sql
  Crear servei:
sudo nano /etc/systemd/system/pgagent.service

[Unit]
Description=pgAgent Service

[Service]
Type=forking
User=postgres
ExecStart=/usr/bin/pgagent host=localhost dbname=postgres user=postgres

[Install]
WantedBy=multi-user.target
```

```bash
  Inicia y habilita el servicio
sudo systemctl daemon-reload
sudo systemctl enable pgagent
sudo systemctl start pgagent
sudo systemctl status pgagent
```

---

```txt
🖥️ Desde Windows, ejecuta " StackBuilder ", conéctate al clúster
  y en "add-ons, Tools and Utilities" selecciona pgAgent.
Continúa dando los datos que el instalador te pida hasta que acabe
```

Una vez instalado, entra en pgAdmin, conéctate a la BBDD postgres y crea la extensión.

```sql
CREATE EXTENSION pgagent;
```

Esto crea las tablas de pgAgent (pga_job, pga_jobstep, pga_schedule, etc.) que utiliza pgAdmin.

Una vez instalado y registrado, abre pgAdmin y conéctate al servidor PostgreSQL donde está pgAgent.

```txt
--Navega hasta:
Servers → NomDelServidor → pgAgent Jobs
```

---

1. pgAgent Service / Daemon

2. Base de datos de control

   - Tareas (pgagent.pga_job)
   - Pasos de cada tarea (pgagent.pga_jobstep)
   - Horarios (pgagent.pga_schedule)
   - Historial (pgagent.pga_joblog)

3. pgAdmin

- Creas una tarea (job) en pgAdmin.
- La tarea puede tener uno o más pasos (steps), que pueden ser:

- Asignas un horario (schedule) a la tarea:
- El servicio pgAgent comprueba continuamente las tareas y las dispara según el horario.
- Las ejecuciones quedan registradas en la tabla pga_joblog.

---

### 📆 Extensiones alternativas

#### pg_timetable

#### timescaledb background jobs

---

#### 📘 Consultar los jobs en el DD

#### Consultar los jobs

```sql
SELECT * FROM cron.job;
```

### Ejemplo completo de automatización

- `informe.sql`: genera un informe con SELECT
- `informe.bat`: lo ejecuta desde el sistema
- **cron**: programa su ejecución cada día a las 8 h
- **pg_cron**: programa su ejecución cada día a las 8 h

### Buenas prácticas

- Guarda los scripts en carpetas versionadas (p. ej.: Git)
- Documenta las tareas automatizadas
- Revisa los permisos de los usuarios que ejecutan las tareas
- ⚠️ Evita duplicar jobs o crear jobs recurrentes sin control

---

### SQL dinámico

En algunas tareas de mantenimiento se utilizará el diccionario de datos (con un cursor) y, para cada objeto del DD, se aplicará una sentencia DDL

::: warning Atención
Si el nombre del objeto no se conoce hasta el momento de la ejecución (porque sale de una consulta al diccionario), la sentencia no se puede escribir directamente en el bloque de código: hay que construirla como texto.
:::

En este caso se hará uso de la sentencia `EXECUTE`

`EXECUTE` es una instrucción de PL/pgSQL que permite ejecutar sentencias SQL dinámicas, es decir, sentencias construidas en tiempo de ejecución como cadenas de texto.

Ejemplo

```sql
CREATE OR REPLACE PROCEDURE reindexa_taules(vschema text)
LANGUAGE plpgsql
AS $$
DECLARE
    x RECORD;
    sql_cmd text;
BEGIN
    -- Recorre todas las tablas del esquema
    FOR x IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = vschema
    LOOP
        -- Construir la sentencia SQL dinámica
        sql_cmd := 'REINDEX TABLE ' || quote_ident(vschema) || '.' || quote_ident(x.tablename) || ';';

        -- Ejecutar el SQL dinámico
        EXECUTE sql_cmd;

        -- Mostrar un mensaje
        RAISE NOTICE 'Tabla reindexada: %', x.tablename;
    END LOOP;
END;
$$;
```

El EXECUTE dinámico de PostgreSQL solo funciona dentro de PL/pgSQL; no puedes ejecutar DDL dinámico directamente en SQL normal.

Siempre es recomendable utilizar quote_ident() para evitar inyecciones SQL o errores con nombres especiales.

```sql
CALL reindexa_taules('public');
```

::: warning Atención
`VACUUM` no se puede ejecutar dentro de una función o de un procedimiento, ni siquiera con `EXECUTE` (PostgreSQL responde `VACUUM cannot be executed from a function`). Para lanzarlo sobre todas las tablas de un esquema se generan las sentencias con una consulta y se ejecutan desde `psql` con `\gexec`:

```sql
SELECT format('VACUUM FULL %I.%I', schemaname, tablename)
FROM pg_tables
WHERE schemaname = 'public' \gexec
```
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
