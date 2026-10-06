---
layout: doc
title: "PostgreSQL: optimización y herramientas"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: optimización y herramientas

## Optimización

### 🎯 Objetivo

El objetivo de la optimización es **mejorar el rendimiento** del sistema, reduciendo los tiempos de respuesta, el uso de recursos y el impacto en el usuario final. No se trata solo de hacer que las consultas funcionen, sino de que sean **rápidas y eficientes**.

### Niveles en los que optimizar

- a nivel de sistema operativo
- a nivel de red

- Tamaño y ubicación de los ficheros de datos
- Tamaño del almacenamiento temporal

- Diseño de tablas y tipos de datos (ajustar a lo necesario)
- Campos calculados (intentar mantener los menos posibles)
- Desnormalización (reducir los JOIN a costa de aumentar la redundancia)
- Desfragmentación: VACUUM → AUTOVACUUM
- Particionamiento
- Crear, modificar o eliminar índices
- Optimización de consultas

### Particionamiento

Se evita procesar toda una tabla (solo se procesa la partición). Se puede acceder a los datos en paralelo. Facilita operaciones como, por ejemplo, el purgado de datos

### Creación de índices

- Sobre qué columnas crearlos

  - Claves primarias y ajenas (normalmente ya lo hace el SGBD)
  - Columnas que aparecen habitualmente en SELECT y en WHERE
  - Columnas con buena selectividad (si pocas filas tienen el mismo valor)

- Sobre qué columnas NO crearlos

  - Tablas con pocos datos
  - Columnas con muchos valores NULL
  - Columnas con valores que se modifican muy a menudo
  - Índices sobre muchas columnas
  - Muchos índices por tabla

- Qué tipo de índice crear

  - Índice B-tree
  - GIN
  - GiST
  - BRIN

### Optimización de consultas

- Usar tablas derivadas, subconsultas y joins
- Cursores y funciones

---

### Prácticas recomendadas para los índices

- Columna filtrada frecuentemente (WHERE)
- Columnas utilizadas en los JOIN
- ⚠️ No crear índices por defecto en todas las columnas (consumen espacio y pueden ralentizar los INSERT/UPDATE)

### Prácticas recomendadas para las consultas

- Utiliza `EXPLAIN` para analizar la estrategia de la consulta (se explica en el siguiente punto)
- Evita `SELECT *`: pide solo las columnas necesarias
- Evita subconsultas correlacionadas no indexadas
- Haz uso de joins eficientes (preferentemente explícitos)
- Controla el uso de funciones sobre columnas indexadas

### 🛑 Consultas ineficientes

Ejemplos a evitar:

- `SELECT * FROM taula;` → muy costoso si tiene muchas columnas
- `WHERE TO_CHAR(data, 'YYYY') = '2023'` → impide usar los índices
- `WHERE UPPER(nom) = 'JOAN'` → si no hay un índice con UPPER

### Versiones mejoradas

```sql
-- Especificar las columnas
SELECT col1,col4 FROM taula;

-- Evitar funciones sobre columnas
WHERE data >= TO_DATE('01/01/2023', 'DD/MM/YYYY')

-- Sustituir la subconsulta por un JOIN
SELECT a.nom, c.nom_curs
FROM alumnes a
JOIN cursos c ON a.curs_id = c.id;

-- Crear un índice con upper -- Solución principal: índice funcional
CREATE INDEX idx_nom_upper ON clients (UPPER(nom));
-- Otras soluciones
INSERT INTO clients(nom) VALUES (UPPER('Joan')); -- Insertar todos los datos en mayúsculas
-- usar el tipo CITEXT
CREATE EXTENSION citext;
nom CITEXT
WHERE nom = 'joan'

-- usar ILIKE. ==> WHERE nom ILIKE 'joan'
-- usar un índice trigram.
CREATE EXTENSION pg_trgm;
CREATE INDEX idx_nom_trgm ON clients USING gin (nom gin_trgm_ops);
```

### Otros consejos de optimización

- Evitar los bucles en PL/pgSQL y utilizar operaciones en bloque (set-based). Usa UPDATE y evita FOR

- Evita múltiples INSERT: `COPY clients FROM '/fitxer.csv' CSV;`

- Utiliza INSERT de varias filas si se puede...

  ```sql
  INSERT INTO clients (nom) VALUES ('Joan'), ('Maria'), ('Pere');
  ```

- Utiliza particiones en tablas muy grandes

- Evita bloqueos y transacciones largas

- Crear índices adecuados y evitar funciones en el WHERE

- Analizar las consultas con EXPLAIN ANALYZE

### Resumen de buenas prácticas

- Conoce el modelo de datos y el volumen
- Usa EXPLAIN a menudo
- Mantén las estadísticas al día

```sql
VACUUM;
ANALYZE;
VACUUM ANALYZE;
```

Indexa con criterio. Mejora las consultas repetitivas o lentas

## Optimización en PostgreSQL

### 📈 El optimizador

PostgreSQL utiliza un componente llamado **query planner / optimizer** para determinar el mejor plan de ejecución para una consulta SQL. El objetivo es minimizar el tiempo de ejecución y el uso de recursos.

### 📊 Estadísticas

PostgreSQL utiliza un optimizador basado en costes llamado «planner»

El optimizador utiliza **estadísticas** sobre las tablas, columnas e índices para decidir la estrategia de ejecución.

#### Cómo generar estadísticas

```sql
-- Se hacen automáticamente, pero se pueden hacer manualmente con
    ANALYZE;
    ANALYZE alumnes;
    ANALYZE alumnes(edat, nom);
    VACUUM ANALYZE alumnes;
```

**⚠️ Es muy importante crear tareas programadas que realicen esta actualización fuera de las horas de carga de trabajo**

#### Cómo ver las estadísticas

```sql
SELECT *  FROM pg_stats  WHERE tablename = 'alumnes';
```

**También se pueden automatizar mediante tareas de mantenimiento o con la recogida automática.**

### 🧪 EXPLAIN

Esta orden permite visualizar el plan que PostgreSQL seguirá para ejecutar una consulta (sin ejecutarla realmente). Muestra si se utilizan índices, escaneos completos, joins, etc. Ayuda a detectar consultas lentas o mal optimizadas.

- Analizar el rendimiento
- Detectar cuellos de botella
- Ver si se están usando los índices
- Entender por qué es lenta una consulta
- Ayuda a optimizar una SQL

#### Ejemplo de uso

```sql
EXPLAIN SELECT * FROM alumnes WHERE edat > 18;
o
EXPLAIN ANALYZE SELECT * FROM alumnes WHERE edat > 18;
```

#### EXPLAIN en pgAdmin (PostgreSQL)

- Escribe la consulta en el query tool (worksheet)
- Selecciona la consulta o deja el cursor dentro
- Haz clic en el botón Explain (icono con una lupa o un árbol)
- Muestra el plan estimado sin ejecutar la consulta
- Opcionalmente, haz clic en Explain Analyze para ver el plan real con los tiempos de ejecución y las filas devueltas

Manualmente con SQL

```sql
-- Plan estimado
EXPLAIN SELECT * FROM alumnes WHERE edat > 18;

-- Plan con ejecución real
EXPLAIN ANALYZE SELECT * FROM alumnes WHERE edat > 18;
```

### Factores que afectan al plan de ejecución

- Disponibilidad de índices
- Estadísticas actualizadas
- Volumen de datos
- Condiciones de filtro y joins

### Recomendaciones generales

- Revisa las consultas lentas con EXPLAIN
- ANALYZE taula; EXPLAIN ANALYZE;
- Actualiza las estadísticas a menudo
- Usa los índices de manera estratégica
- Prueba diferentes opciones de join según el volumen y las condiciones
- Evita los accesos completos si puedes usar índices

### Ejemplo de consulta optimizada

Consulta original (lenta):

```sql
SELECT * FROM alumnes WHERE TO_CHAR(data_naixement, 'YYYY') = '2005';
```

Versión optimizada:

```sql
SELECT * FROM alumnes
WHERE data_naixement >= DATE '2005-01-01'
  AND data_naixement < DATE '2006-01-01';
```

### 💬 Conclusión

La optimización en PostgreSQL se basa en la colaboración entre el desarrollador y el optimizador del sistema. Mantener las estadísticas actualizadas, evitar las malas prácticas y revisar los planes de ejecución son claves para un rendimiento óptimo.

## Herramientas de optimización en PostgreSQL

### 🎯 Objetivo

Estas herramientas permiten **analizar el rendimiento** de consultas SQL, sesiones y cargas del sistema, ayudando a diagnosticar cuellos de botella y a optimizar los accesos a los datos.

---

### 1. EXPLAIN

Muestra el plan de ejecución previsto por PostgreSQL para una consulta. Ayuda a detectar si se utilizan índices o si se hace un escaneo completo de la tabla.

```sql
EXPLAIN; EXPLAIN ANALYZE;
EXPLAIN SELECT * FROM alumnes WHERE edat > 18;

-- con ejecución real
EXPLAIN ANALYZE SELECT * FROM alumnes WHERE edat > 18;
```

**Salidas habituales:**

- coste estimado
- tiempo de ejecución (con ANALYZE)
- joins (Nested Loop, Hash Join, Merge Join)

---

### 2. pg_stat_statements

Extensión que guarda estadísticas de todas las consultas ejecutadas. Permite identificar las consultas más pesadas y su impacto en CPU, E/S y tiempo.

```sql
-- Top 10 de consultas por tiempo total
SELECT query, calls, total_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

### 3. pg_stat_activity

Permite ver el estado de las sesiones activas y qué consultas se están ejecutando:

```sql
SELECT pid, usename, state, query, query_start
FROM pg_stat_activity
WHERE state = 'active';
```

- Útil para detectar sesiones que bloquean recursos o provocan una carga elevada
- Combínala con pg_locks para ver los bloqueos:

```sql
SELECT * FROM pg_locks;
```

### 4. Estadísticas de tabla

El planner de PostgreSQL utiliza estadísticas para decidir el mejor plan. <br> **ANALYZE** → actualiza las estadísticas de una tabla o de columnas concretas. <br> ✔️ PostgreSQL usa estas estadísticas para decidir sobre los índices y elegir los planes de ejecución

```sql
ANALYZE;
ANALYZE alumnes;
ANALYZE alumnes(edat, nom);
```

**VACUUM ANALYZE** → limpieza + actualización de estadísticas:

```sql
VACUUM ANALYZE;
VACUUM ANALYZE alumnes;
```

AUTOVACUUM → automático; mantiene las estadísticas actualizadas sin intervención manual

### 5. Otras herramientas gráficas

- pgAdmin Dashboard → monitorización de sesiones, carga y consulta de planes
- pgBadger → informes de uso y rendimiento basados en los logs. <br> Es una herramienta externa para PostgreSQL que analiza los logs y genera informes HTML y estadísticas detalladas. <br> No afecta a la base de datos; solo lee los logs. Sirve para detectar consultas lentas, ver estadísticas por usuario, tabla o consulta, e identificar cuellos de botella
- Grafana + Prometheus → dashboards de rendimiento avanzados

---

#### pgBadger

Es una herramienta libre; se puede encontrar en <https://pgbadger.darold.net/> y también se puede instalar

```bash
sudo apt install pgbadger   # Linux Mint / Ubuntu
```

Previamente hay que configurar postgres para que genere logs

```txt
logging_collector = on
log_destination = 'csvlog'   -- o 'stderr'
log_min_duration_statement = 500  -- ms, para ver las consultas lentas
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
```

y después usar pgBadger

```txt
pgbadger /var/lib/postgresql/pg_log/postgresql-2026-03-29_*.log -o report.html
pgbadger -f stderr -o report.html /var/log/postgresql/postgresql.log
pgbadger -b "2026-03-01 00:00:00" -e "2026-03-29 23:59:59" /var/lib/postgresql/pg_log/*.log -o report.html
```

#### Qué muestra el informe HTML

- Consultas más lentas
- Consultas más frecuentes
- Tiempo medio por consulta
- Estadísticas por usuario / base de datos / tabla
- Errores y warnings
- Tiempo total de las conexiones

#### pgstattuple

Complemento de pgBadger: herramienta para medir el bloat y las dead tuples. Ayuda a decidir entre VACUUM, VACUUM FULL y REINDEX

```sql
Instalación
CREATE EXTENSION IF NOT EXISTS pgstattuple;
```

```sql
Funciones principales
SELECT * FROM pgstattuple('clients');
SELECT * FROM pgstatindex('idx_clients_nom');
```

Combinados, te permiten ver tabla + índice y decidir si hace falta VACUUM FULL o REINDEX

#### Diferencia con pg_stat_all_tables

pg_stat_all_tables → estadísticas aproximadas; pgstattuple → estadísticas exactas en tiempo real (más precisas pero costosas)

---

### Buenas prácticas de optimización de consultas

- Evita SELECT \*; selecciona solo las columnas necesarias
- Indexa las columnas que aparecen en WHERE y JOIN
- Evita subconsultas correlacionadas no indexadas
- Evalúa con EXPLAIN ANALYZE antes y después de los cambios
- Prueba diferentes tipos de join según los volúmenes de datos (Nested Loop, Hash Join)

---

### 6. pgBouncer

pgBouncer es un pooler de conexiones para PostgreSQL que mejora el rendimiento gestionando eficientemente las conexiones, pero no optimiza directamente las consultas SQL.

pgBouncer es una herramienta de optimización a nivel de **arquitectura**

#### Qué optimiza

- Reduce el coste de abrir/cerrar conexiones
- Evita la saturación de conexiones
- Mejora el throughput en aplicaciones con muchas conexiones

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
