---
layout: doc
title: "PostgreSQL: optimización de los objetos de la base de datos"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: optimización de los objetos de la base de datos

## Optimización de los objetos de la BBDD

### Fragmentación de tablas en PostgreSQL

**🔍 ¿Qué es la fragmentación de tablas?**

La **fragmentación (o bloat)** hace referencia al espacio mal aprovechado dentro de una tabla (o índice) de la base de datos. Puede provocar que ciertas operaciones, como los escaneos completos de tabla o el acceso mediante índice, sean menos eficientes.

**Causas comunes de fragmentación en PostgreSQL**

- **Inserciones y borrados frecuentes**: dejan «huecos» dentro de los bloques que no se rellenan automáticamente.
- **Actualizaciones con valores más grandes**: pueden generar *row chaining*.

**Consecuencias de la fragmentación**

- Rendimiento más lento en las consultas.
- Incremento de E/S.

**🧰 Cómo detectar la fragmentación**

```sql
-- tamaño aproximado de la tabla y de los índices
SELECT
    relname AS taula,
    pg_total_relation_size(relid) AS mida_total_bytes,
    pg_relation_size(relid) AS mida_taula_bytes,
    pg_indexes_size(relid) AS mida_indexes_bytes
FROM pg_stat_user_tables;

-- tamaño real de los bloques y tuplas vacías
SELECT *,
       (pg_total_relation_size(relid) - pg_relation_size(relid)) AS bloat_bytes
FROM pg_stat_user_tables;
```

También se pueden usar extensiones como pgstattuple:

```sql
CREATE EXTENSION IF NOT EXISTS pgstattuple;
SELECT * FROM pgstattuple('alumnes');
```

**🛠️ Soluciones para reducir o eliminar la fragmentación**

```sql
VACUUM;          -- limpieza básica
VACUUM FULL;     -- recupera espacio y compacta la tabla
```

VACUUM → habitual y rápido; mantiene las estadísticas <br> VACUUM FULL → lento; bloquea la tabla y recupera espacio físico

```sql
REINDEX TABLE alumnes;
-- o para un índice concreto
REINDEX INDEX idx_nom;
```

Recomendado cuando los índices tienen bloat

```sql
CLUSTER alumnes USING idx_nom;
```

Reorganiza físicamente la tabla según un índice <br> Mejora los accesos secuenciales <br> Bloquea la tabla mientras se ejecuta

```sql
CREATE TABLE alumnes_nova AS SELECT * FROM alumnes;
DROP TABLE alumnes;
ALTER TABLE alumnes_nova RENAME TO alumnes;
```

Crear una tabla nueva y copiar los datos:

### 📊 Índices

Los **índices** permiten acceder más rápidamente a los datos. Hay que usarlos correctamente:

**🔧 Crear un índice**

```sql
CREATE INDEX idx_nom ON alumnes(nom);
```

```sql
create index nom_ind on nom_taula (camp1, camp2,..);
REINDEX INDEX nom_ind ;
```

Cuando se crea una tabla con una clave primaria o unique, PostgreSQL crea un índice automáticamente

Cuando creas una PRIMARY KEY o un UNIQUE, PostgreSQL crea automáticamente un índice B-tree

**Reconstruir un índice**

```sql
REINDEX INDEX nom_ind ;
```

**Cómo explorar los índices (en el DD)**

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'alumnes';
```

---

### Particionamiento

```sql
create table ....( ) partition by range(nomcamp) (....);
```

**¿En qué consiste el particionamiento?**

El particionamiento consiste en **dividir lógica y físicamente una tabla grande** en partes más pequeñas llamadas *particiones*, de manera que el sistema pueda gestionarlas de forma más eficiente.

**¿Para qué sirve?**

Por ejemplo, imaginemos una tabla de facturas donde tenemos el detalle de nuestra facturación a lo largo de 9 años (2017, 2018… 2025). Si quisiéramos hacer:

`SELECT SUM(total_fac) FROM facturacio WHERE any = 2019;`

En este ejemplo habría que recorrer toda la tabla (imaginemos que hablamos de 30 millones de registros en total; es mucho, ¿no?). Por este motivo, un criterio posible para particionar la tabla sería el año de la fecha de la factura

- Mejora del rendimiento de las consultas.
- Facilita el mantenimiento (por ejemplo, eliminar o archivar particiones antiguas).
- Mejor gestión del almacenamiento.
- Paralelismo en las operaciones.

**Tipos de particionamiento**

**1. Particionamiento por rango (`RANGE`)**

Divide según un valor dentro de un rango (p. ej.: fechas).

```sql
CREATE TABLE vendes (
    id SERIAL,
    data_venda DATE,
    import NUMERIC,
    PRIMARY KEY (id, data_venda)   -- la clave primaria debe incluir la columna de partición
) PARTITION BY RANGE (data_venda);

-- Particiones
CREATE TABLE vendes_2019 PARTITION OF vendes
    FOR VALUES FROM ('2019-01-01') TO ('2020-01-01');

CREATE TABLE vendes_2020 PARTITION OF vendes
    FOR VALUES FROM ('2020-01-01') TO ('2021-01-01');

CREATE TABLE vendes_2021 PARTITION OF vendes
    FOR VALUES FROM ('2021-01-01') TO ('2022-01-01');

CREATE TABLE vendes_future PARTITION OF vendes
    FOR VALUES FROM ('2022-01-01') TO ('9999-12-31');
```

**2. Particionamiento por lista (`LIST`)**

Divide según valores específicos.

```sql
CREATE TABLE clients (
    id SERIAL,
    nom VARCHAR(50),
    regio VARCHAR(20),
    PRIMARY KEY (id, regio)        -- la clave primaria debe incluir la columna de partición
) PARTITION BY LIST (regio);

CREATE TABLE clients_nord PARTITION OF clients FOR VALUES IN ('NORD');
CREATE TABLE clients_sud PARTITION OF clients FOR VALUES IN ('SUD');
CREATE TABLE clients_est PARTITION OF clients FOR VALUES IN ('EST');
CREATE TABLE clients_oest PARTITION OF clients FOR VALUES IN ('OEST');
```

**¿Cómo saber qué estrategia escoger?**

Depende de:

- El tipo de consultas habituales.
- El tamaño de los datos.
- El tipo de columna (distribución, cardinalidad).
- Las necesidades de mantenimiento y archivado.

**Otras operaciones útiles**

```sql
-- Añadir una partición
CREATE TABLE vendes_2022 PARTITION OF vendes
    FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');

-- Eliminar una partición
DROP TABLE vendes_2020;

-- Consultar solo una partición
SELECT * FROM vendes
WHERE data_venda >= '2021-01-01' AND data_venda < '2022-01-01';
```

**Consultar si una tabla está particionada**

```sql
SELECT relname AS table_name,
       relkind AS table_type
FROM pg_class
WHERE relname = 'vendes';

o

SELECT *
FROM pg_partitioned_table pt
JOIN pg_class c ON c.oid = pt.partrelid
WHERE c.relname = 'vendes';
```

### Optimización de consultas

#### Plan de ejecución

PostgreSQL no almacena los planes de ejecución en una tabla como Oracle, sino que el planner calcula un plan cada vez que se ejecuta una consulta (SELECT, UPDATE, INSERT, DELETE).

- Cómo se leerán los datos (secuencialmente o con un índice)
- Qué tipo de join se utilizará (Nested Loop, Hash Join, Merge Join)
- El orden de acceso a las tablas
- El coste estimado y las filas estimadas

**Herramientas para ver el plan**

```sql
-- Plan estimado (no ejecuta la consulta)
EXPLAIN SELECT * FROM t_pedidos WHERE codpedido = 5;

-- Plan con ejecución real y tiempo real
EXPLAIN ANALYZE SELECT * FROM t_pedidos WHERE codpedido = 5;
```

PostgreSQL no requiere permisos especiales para ver el EXPLAIN. En pgAdmin se puede hacer clic en Explain o Explain Analyze para verlo gráficamente

#### Estadísticas

El planner utiliza las estadísticas de tablas y columnas (ANALYZE) para decidir el mejor plan.

```sql
-- Ejemplo para ver las estadísticas
SELECT *
FROM pg_stats
WHERE tablename = 't_pedidos';
```

#### Monitorización de consultas

pg_stat_activity → sesiones activas y consultas en ejecución; pg_stat_statements → historial de consultas con tiempo, E/S y número de llamadas. Detecta las consultas costosas y permite optimizarlas

```sql
-- Consultas más lentas
SELECT query, calls, total_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

```sql
-- Sesiones activas
SELECT pid, usename, state, query, query_start
FROM pg_stat_activity
WHERE state = 'active';
```

#### Inserciones masivas y manipulación de tablas

```sql
-- cargar datos masivos desde ficheros CSV:
COPY t_pedidos FROM '/path/to/file.csv' CSV HEADER;
```

```sql
INSERT en bulk sin índices temporalmente
  → opcional: quitar temporalmente los índices para cargas muy grandes y reconstruirlos después con REINDEX.
```

**TRUNCATE → eliminar todas las filas rápidamente:**

```sql
TRUNCATE TABLE t_pedidos;
```

**Vistas materializadas → PostgreSQL soporta MATERIALIZED VIEW:**

```sql
CREATE MATERIALIZED VIEW v_pedidos_totals AS
SELECT cliente_id, SUM(total_fac) AS total
FROM t_pedidos
GROUP BY cliente_id;

-- Actualizarla
REFRESH MATERIALIZED VIEW v_pedidos_totals;
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
