---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 1: monitorización y alertas de rendimiento"
pageClass: ejercicios-page
---

# 📋 Práctica 1: monitorización y alertas de rendimiento

## Enunciado

Te incorporas como administrador de un servidor de bases de datos del que los usuarios se quejan: «a veces va lento». Nadie sabe por qué, porque nadie lo está vigilando.

Tu primer encargo es saber **qué está pasando** en el servidor y dejar programadas **alertas** que avisen antes de que el problema llegue a los usuarios.

Haz la práctica con Oracle o con PostgreSQL, según te indique tu profesor o profesora.

## Objetivos

- Identificar las herramientas de monitorización que ofrece el SGBD.
- Consultar la actividad, las sesiones, los bloqueos y el uso del espacio.
- Localizar las consultas más costosas.
- Programar alertas que se evalúen de forma automática.

## Tareas

### Parte 1. Inventario de herramientas

1. Elabora una tabla con las **herramientas de monitorización** disponibles para tu SGBD, clasificadas en: vistas del diccionario de datos, ficheros de registro, herramientas gráficas y extensiones o herramientas externas. Indica de cada una qué información da y si viene instalada por defecto.
2. Elige de esa tabla las tres que usarías a diario y justifica por qué.

### Parte 2. Qué está pasando ahora

3. Muestra las **sesiones** abiertas: usuario, máquina de origen, base de datos, estado y la sentencia que están ejecutando.
4. Muestra cuántas conexiones hay abiertas y qué **porcentaje** representan sobre el máximo permitido.
5. Provoca un **bloqueo**: en una sesión, modifica una fila sin confirmar; en otra, intenta modificar la misma fila. Desde una tercera sesión, localiza quién bloquea a quién y resuelve la situación cerrando la sesión bloqueante.
6. Muestra el **tamaño** de cada base de datos (o tablespace) y de las cinco tablas más grandes.
7. Abre la herramienta gráfica de tu SGBD (pgAdmin o SQL Developer) y localiza en ella la misma información de los puntos 3 y 5.

### Parte 3. Consultas costosas

8. Activa el mecanismo que permite conocer las **consultas más costosas** y lanza una carga de trabajo de prueba (varias consultas, alguna de ellas lenta a propósito).
9. Obtén la lista de las cinco sentencias que más tiempo total han consumido, con el número de ejecuciones y el tiempo medio.
10. Configura el servidor para que deje constancia en el **fichero de registro** de las sentencias que tarden más de un umbral que tú decidas. Localiza una en el registro.

### Parte 4. Alertas

11. Crea una tabla `alertas` (momento, tipo, nivel, valor medido y mensaje) y un **procedimiento o guion** que compruebe estas tres condiciones e inserte una fila cuando alguna se cumpla:

    | Alerta | Aviso | Crítico |
    |:---|:---:|:---:|
    | Conexiones abiertas sobre el máximo | 70 % | 90 % |
    | Sesiones que llevan bloqueadas más de un tiempo | 30 s | 2 min |
    | Ocupación del espacio: un tablespace (Oracle) o el tamaño de una base de datos respecto a un límite que tú fijes (PostgreSQL) | 70 % | 85 % |

12. **Programa** la comprobación para que se ejecute sola cada cinco minutos.
13. **Provoca** al menos dos de las alertas (abre muchas conexiones, deja un bloqueo abierto, llena una tabla) y muestra las filas registradas.
14. Explica cómo harías llegar el aviso al administrador (correo, mensajería, panel) y qué harías para que una alerta que se repite no genere cientos de avisos.

## Orientaciones

### Con PostgreSQL

```sql
-- Sesiones y bloqueos
SELECT pid, usename, client_addr, datname, state, wait_event_type, query
FROM pg_stat_activity;
SELECT pid, pg_blocking_pids(pid) AS bloqueada_por, query
FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0;
SELECT pg_terminate_backend(pid);

-- Conexiones sobre el máximo
SELECT count(*) AS conexiones,
       current_setting('max_connections')::int AS maximo
FROM pg_stat_activity;

-- Tamaños
SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database;
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 5;
```

- Las consultas costosas se obtienen con la extensión **`pg_stat_statements`**: hay que añadirla a `shared_preload_libraries` en `postgresql.conf`, **reiniciar** el servidor y ejecutar `CREATE EXTENSION pg_stat_statements;` en la base de datos. La vista `pg_stat_statements` tiene, entre otras, las columnas `calls`, `total_exec_time` y `mean_exec_time`.
- El umbral de las sentencias lentas es el parámetro `log_min_duration_statement`.
- Para programar la comprobación puedes usar el `cron` del sistema operativo con una línea que llame a `psql -c "CALL comprueba_alertas()"`, o la extensión `pg_cron`. Repasa la página de [tareas automatizables](/ut4/contenidos/postgresql/7-tareas-programadas).
- Una sentencia lenta de prueba: `SELECT pg_sleep(3);`

### Con Oracle

```sql
-- Sesiones y bloqueos
SELECT sid, serial#, username, machine, status, blocking_session, seconds_in_wait
FROM v$session WHERE type = 'USER';
ALTER SYSTEM KILL SESSION 'sid,serial#';

-- Sentencias más costosas
SELECT sql_id, executions, ROUND(elapsed_time / 1e6, 2) AS segundos, sql_text
FROM v$sql ORDER BY elapsed_time DESC FETCH FIRST 5 ROWS ONLY;

-- Espacio
SELECT tablespace_name, ROUND(used_percent, 1) AS pct_usado
FROM dba_tablespace_usage_metrics;
SELECT segment_name, ROUND(bytes / 1024 / 1024) AS mb
FROM user_segments ORDER BY bytes DESC FETCH FIRST 5 ROWS ONLY;
```

- El número máximo de sesiones está en el parámetro `sessions` y el uso actual en `v$resource_limit`.
- El fichero de alertas de la instancia se consulta con `adrci`: repasa la página de [ficheros log](/ut2/contenidos/oracle/4-redo-log-ficheros-log).
- Programa la comprobación con un job de `DBMS_SCHEDULER`: repasa la página de [tareas automatizables](/ut4/contenidos/oracle/7-tareas-programadas).
- Como ampliación, investiga las alertas generadas por el propio servidor: paquete `DBMS_SERVER_ALERT` y vista `DBA_OUTSTANDING_ALERTS`.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA5** (*Optimiza el rendimiento del sistema aplicando técnicas de monitorización y realizando adaptaciones.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **5.a** | Se han identificado las herramientas de monitorización disponibles para el sistema gestor. | El inventario de herramientas de monitorización es completo, está bien clasificado y la selección de uso diario está razonada. |
| **5.f** | Se ha obtenido información sobre el rendimiento de las consultas para su optimización. | Obtiene las sentencias más costosas y registra las que superan el umbral, e interpreta los datos. |
| **5.g** | Se han programado alertas de rendimiento. | Las tres alertas se evalúan de forma automática cada cinco minutos y quedan registradas al provocarlas. |
| **5.e** | Se han optimizado los recursos del sistema gestor. | Detecta el consumo de conexiones, bloqueos y espacio, y resuelve la sesión bloqueante. |

Cada criterio se califica con la **rúbrica común** del módulo:

| Nivel | Descriptor | Puntuación |
|:---:|:---|:---:|
| **0** | No entregado o sin relación con lo solicitado. | 0 |
| **1** | Incompleto o incorrecto. Faltan elementos esenciales. | 2,5 |
| **2** | Correcto y completo, pero sin justificar las decisiones. | 5 |
| **3** | Correcto, completo y justificado. | 7,5 |
| **4** | Además, coherente con el resto del proyecto y bien comunicado. | 10 |

La nota de la práctica es la media de las puntuaciones de sus criterios. El **nivel 2 es el mínimo** para superarla.

---

<small>Práctica de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
