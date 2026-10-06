---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 2: índices y optimización de consultas"
pageClass: ejercicios-page
---

# 📋 Práctica 2: índices y optimización de consultas

## Enunciado

La tabla de ventas de una empresa ha crecido hasta un millón de filas y los informes tardan cada vez más. Antes de pedir un servidor más potente hay que comprobar si las consultas están aprovechando bien la base de datos.

Vas a **medir**, **crear índices**, **volver a medir** y sacar conclusiones con números. En esta práctica no vale decir «va más rápido»: hay que demostrar cuánto y a qué coste.

Haz la práctica con Oracle o con PostgreSQL, según te indique tu profesor o profesora.

## Objetivos

- Obtener e interpretar el plan de ejecución de una consulta.
- Crear distintos tipos de índices en tablas y en vistas materializadas.
- Cuantificar las ventajas y los inconvenientes de los índices.
- Mejorar la estructura de la base de datos y reescribir consultas ineficientes.

## Datos de partida

Crea la tabla `ventas` con un millón de filas generadas al azar.

**PostgreSQL:**

```sql
CREATE TABLE ventas AS
SELECT g AS id,
       (random() * 50000)::int                           AS cliente_id,
       DATE '2020-01-01' + (random() * 2000)::int        AS fecha,
       (random() * 500)::numeric(8,2)                    AS importe,
       md5(g::text)                                      AS referencia,
       (ARRAY['NORTE','SUR','ESTE','OESTE'])[1 + floor(random() * 4)::int] AS region
FROM generate_series(1, 1000000) AS g;

ANALYZE ventas;
```

**Oracle:**

```sql
CREATE TABLE ventas AS
SELECT ROWNUM                                             AS id,
       TRUNC(DBMS_RANDOM.VALUE(1, 50000))                 AS cliente_id,
       DATE '2020-01-01' + TRUNC(DBMS_RANDOM.VALUE(0, 2000)) AS fecha,
       ROUND(DBMS_RANDOM.VALUE(0, 500), 2)                AS importe,
       DBMS_RANDOM.STRING('X', 16)                        AS referencia,
       DECODE(TRUNC(DBMS_RANDOM.VALUE(0, 4)), 0, 'NORTE', 1, 'SUR', 2, 'ESTE', 'OESTE') AS region
FROM (SELECT LEVEL FROM dual CONNECT BY LEVEL <= 1000),
     (SELECT LEVEL FROM dual CONNECT BY LEVEL <= 1000);

EXEC DBMS_STATS.GATHER_TABLE_STATS(USER, 'VENTAS')
```

## Tareas

### Parte 1. Medir sin índices

1. Anota el **tamaño** de la tabla y el número de filas.
2. Para cada una de estas consultas, obtén el **plan de ejecución** y el **tiempo real**, y anótalos en una tabla de resultados:

   | Id. | Consulta |
   |:---:|:---|
   | C1 | Todas las ventas del cliente 4242. |
   | C2 | Ventas de la región SUR entre dos fechas separadas una semana. |
   | C3 | La venta cuya referencia, en mayúsculas, es un valor concreto. |
   | C4 | Importe total por mes y región. |
   | C5 | Las diez ventas de mayor importe. |

3. Interpreta el plan de C1: ¿cómo accede a la tabla?, ¿cuántas filas lee y cuántas devuelve?

### Parte 2. Crear índices

4. Crea el índice que consideres adecuado para **C1**. Repite la medición y compara plan y tiempo.
5. Para **C2**, crea un índice **compuesto**. Razona el orden de las columnas y demuestra con el plan qué ocurre si las pones en el orden contrario.
6. Para **C3**, comprueba que un índice normal sobre `referencia` no se utiliza y crea un índice **basado en función** que sí se use.
7. Añade una **clave primaria** a la tabla. ¿Qué índice se ha creado automáticamente?
8. Para **C4**, crea una **vista materializada** con el resultado y un **índice sobre la vista**. Compara el tiempo de consultar la vista con el de la consulta original e indica cuándo y cómo habría que refrescarla.
9. Para **C5**, crea el índice que evite la ordenación y demuéstralo con el plan.

### Parte 3. El coste de los índices

10. Anota el **tamaño** de cada índice y el total. ¿Qué proporción representan sobre el tamaño de la tabla?
11. Mide cuánto tarda en insertarse un lote de 100 000 filas nuevas **con** todos los índices y, tras borrarlos, **sin** ellos. Explica la diferencia.
12. Consulta las estadísticas de **uso** de los índices y localiza si hay alguno que no se haya utilizado. ¿Qué harías con él?
13. Busca un caso en el que el optimizador **no use** un índice que existe (por ejemplo, una condición que devuelve la mayor parte de la tabla) y explica por qué hace bien.
14. Con todo lo anterior, redacta las **ventajas y los inconvenientes** de crear índices, apoyando cada afirmación en una de tus mediciones.

### Parte 4. Estructura y consultas

15. La columna `region` repite cuatro textos en un millón de filas. Propón una mejora de la **estructura** (tabla de regiones con clave numérica, tipo enumerado, particionamiento por región...), aplícala y mide su efecto en el tamaño y en C2.
16. Reescribe estas tres consultas ineficientes para que puedan usar índices y demuestra la mejora con el plan:

    ```sql
    SELECT * FROM ventas WHERE EXTRACT(YEAR FROM fecha) = 2023;
    SELECT * FROM ventas WHERE importe * 1.21 > 600;
    SELECT * FROM ventas WHERE cliente_id IN (SELECT cliente_id FROM ventas WHERE importe > 499);
    ```

17. Entrega la **tabla de resultados** completa: cada consulta con su tiempo y tipo de acceso antes y después.

## Orientaciones

| | PostgreSQL | Oracle |
|:---|:---|:---|
| Plan estimado | `EXPLAIN consulta;` | `EXPLAIN PLAN FOR consulta;` y `SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);` |
| Plan con tiempos reales | `EXPLAIN (ANALYZE, BUFFERS) consulta;` | `SET AUTOTRACE ON` y `SET TIMING ON` |
| Actualizar estadísticas | `ANALYZE ventas;` | `EXEC DBMS_STATS.GATHER_TABLE_STATS(USER, 'VENTAS')` |
| Tamaño de tabla e índices | `pg_relation_size()`, `pg_indexes_size()`, `pg_size_pretty()` | `USER_SEGMENTS` |
| Uso de los índices | `pg_stat_user_indexes` (columna `idx_scan`) | `ALTER INDEX ... MONITORING USAGE` y `USER_OBJECT_USAGE` |
| Vista materializada | `CREATE MATERIALIZED VIEW`, `REFRESH MATERIALIZED VIEW` | `CREATE MATERIALIZED VIEW`, `DBMS_MVIEW.REFRESH` |
| Medir tiempos en el cliente | `\timing on` | `SET TIMING ON` |

- Ejecuta cada consulta **dos o tres veces** antes de anotar el tiempo: la primera lectura llena la memoria caché y no es representativa.
- Un acceso secuencial aparece como `Seq Scan` en PostgreSQL y como `TABLE ACCESS FULL` en Oracle.
- Repasa las páginas de optimización de tu SGBD: [PostgreSQL](/ut5/contenidos/postgresql/2-optimizacion) y sus [objetos](/ut5/contenidos/postgresql/3-optimizacion-objetos), u [Oracle](/ut5/contenidos/oracle/2-optimizacion) y sus [objetos](/ut5/contenidos/oracle/3-optimizacion-objetos).

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA5** (*Optimiza el rendimiento del sistema aplicando técnicas de monitorización y realizando adaptaciones.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **5.b** | Se han descrito las ventajas e inconvenientes de la creación de índices. | Describe las ventajas y los inconvenientes de los índices apoyándose en sus propias mediciones de tiempo, tamaño y coste de inserción. |
| **5.c** | Se han creado índices en tablas y vistas. | Crea índices simples, compuestos, basados en función y sobre una vista materializada, y demuestra con el plan que se utilizan. |
| **5.d** | Se ha optimizado la estructura de la base de datos. | Propone y aplica una mejora de la estructura de la tabla y mide su efecto. |
| **5.f** | Se ha obtenido información sobre el rendimiento de las consultas para su optimización. | Obtiene e interpreta los planes de ejecución y los tiempos antes y después, y reescribe las consultas ineficientes. |

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
