---
layout: doc
title: "Oracle: optimización de los objetos de la base de datos"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: optimización de los objetos de la base de datos

## Optimización de los objetos de la BBDD

### Fragmentación de tablas en Oracle

**🔍 ¿Qué es la fragmentación de tablas?**

La **fragmentación** hace referencia al espacio mal aprovechado dentro de una tabla (o índice) de la base de datos. Puede provocar que ciertas operaciones, como los escaneos completos de tabla o el acceso mediante índice, sean menos eficientes.

**Causas comunes de fragmentación en Oracle**

- **Inserciones y borrados frecuentes**: dejan «huecos» dentro de los bloques que no se rellenan automáticamente.
- **Actualizaciones con valores más grandes**: pueden generar *row chaining*.
- **Cambios en PCTFREE o PCTUSED**: afectan a cómo se administra el espacio dentro de los bloques.

**Consecuencias de la fragmentación**

- Rendimiento más lento en las consultas.
- Más escaneos de bloques de los necesarios.
- Incremento de E/S.

**🧰 Cómo detectar la fragmentación**

```sql
ANALYZE TABLE nom_taula COMPUTE STATISTICS;
```

```sql
SELECT table_name, blocks, empty_blocks, avg_space
FROM dba_tables
WHERE table_name = 'NOM_TAULA';
```

También puedes consultar las vistas `DBA_SEGMENTS` y `DBA_EXTENTS`.

**🛠️ Soluciones para reducir o eliminar la fragmentación**

- **Reorganizar la tabla:**

  ```sql
  ALTER TABLE nom_taula MOVE;
  alter table nom_taula move [compress];
  ```

- **Exportar e importar:** con `exp/imp` o `Data Pump`.

- **Shrink de tablas:**

  ```sql
  ALTER TABLE nom_taula ENABLE ROW MOVEMENT;
  ALTER TABLE nom_taula SHRINK SPACE;
  ```

- **Rebuild de índices:**

  ```sql
  ALTER INDEX nom_index REBUILD;
  ```

**Buenas prácticas**

- Monitorizar el uso del espacio con regularidad.
- Evitar borrados masivos sin planificación.
- Configurar correctamente `PCTFREE` y `PCTUSED` según el patrón de uso.

### 📊 Índices

Los **índices** permiten acceder más rápidamente a los datos. Hay que usarlos correctamente:

**🔧 Crear un índice**

```sql
CREATE INDEX idx_nom ON alumnes(nom);
```

```sql
create index nom_ind on nom_taula (camp1, camp2,..);
alter index nom_ind rebuild;
```

Cuando se crea una tabla con una clave primaria o unique, Oracle crea un índice automáticamente

**Tipos de índice**

```sql
create [bitmap | unique] index nom_ind on nom_taula (camp1, camp2,..);
alter index nom_ind rebuild;
```

**Cómo explorar los índices (en el DD)**

```sql
select index_name , index_type ,table_name , tablespace_name , secondary
from all_indexes where table_name = 'TAULA_A_CONSULTAR';
```

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
    id NUMBER,
    data_venda DATE,
    import NUMERIC
)
PARTITION BY RANGE (data_venda) (
    PARTITION p2019 VALUES LESS THAN (TO_DATE('2020-01-01', 'YYYY-MM-DD')),
    PARTITION p2020 VALUES LESS THAN (TO_DATE('2021-01-01', 'YYYY-MM-DD')),
    PARTITION p2021 VALUES LESS THAN (TO_DATE('2022-01-01', 'YYYY-MM-DD')),
    PARTITION p_future VALUES LESS THAN (MAXVALUE)
);
```

**2. Particionamiento por lista (`LIST`)**

Divide según valores específicos.

```sql
CREATE TABLE clients (
    id NUMBER,
    nom VARCHAR2(50),
    regió VARCHAR2(20)
)
PARTITION BY LIST (regió) (
    PARTITION p_nord VALUES ('NORD'),
    PARTITION p_sud VALUES ('SUD'),
    PARTITION p_est VALUES ('EST'),
    PARTITION p_oest VALUES ('OEST')
);
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
ALTER TABLE vendes ADD PARTITION p2022 VALUES LESS THAN (TO_DATE('2023-01-01', 'YYYY-MM-DD'));

-- Eliminar una partición
ALTER TABLE vendes DROP PARTITION p2020;

-- Consultar solo una partición
SELECT * FROM vendes
WHERE data_venda >= TO_DATE('2021-01-01', 'YYYY-MM-DD');
```

**Consultar si una tabla está particionada**

```sql
SELECT table_name, partitioning_type
FROM user_part_tables;
```

### Optimización de consultas

Oracle activa automáticamente un optimizador de consultas y reescribe las consultas si lo estima necesario. Realiza las siguientes operaciones:

- Evalúa expresiones y condiciones
- Transforma sentencias complejas
- Transforma vistas en consultas
- Evalúa los JOIN y ordena el acceso y la forma de acceso

#### Plan de ejecución

```txt
Oracle guarda en el DD las estadísticas de las tablas
En la vista ==> user_tables
```

Usando las estadísticas (DD), el monitor de rendimiento y el registro de errores, propone un plan de ejecución, que determina cómo se puede resolver una consulta de la forma más eficiente. Una vez ejecutadas las consultas, los planes de ejecución se almacenan en **la caché de consultas**

Cada vez que ejecutamos una sentencia (SELECT, UPDATE, INSERT o DELETE), una de las cosas que hace Oracle es crear un plan de ejecución de la sentencia. Un plan de ejecución define la forma en que Oracle busca o graba los datos. Decide, por ejemplo, si usará o no los índices en una sentencia SELECT

```sql
DELETE PLAN_TABLE;
  EXPLAIN PLAN FOR SELECT * FROM T_PEDIDOS WHERE CODPEDIDO = 5;
  select * from plan_table;
```

¡El plan de ejecución usa las estadísticas de las tablas!

Un usuario necesita tener permiso para revisar los planes de ejecución de las consultas

```sql
grant select_catalog_role to nom_usu;
grant select any dictionary to nom_usu;
```

SQL Developer permite consultar el plan de ejecución de forma gráfica, pulsando F10 sobre la consulta antes de lanzarla

SQL\*Plus permite consultar el plan de ejecución de las consultas ejecutando la siguiente instrucción: `set autotrace traceonly explain`

#### SQL Tuning Advisor

Un usuario necesita tener permiso para ejecutar el SQL Tuning Advisor

En una SQL, antes de ejecutar, pulsa Ctrl + F12

Y después, run SQL con Alt + F11

#### Monitor de operaciones

```txt
Se consulta desde el paquete DBMS_SQL_MONITOR,
  - procedimiento report_sql_monitor
  - vista V$SQL_MONITOR
```

#### Operaciones particulares de Oracle

```sql
d’OracleInsercions massives : SQL Loader
  Insert Append: INSERT /*+ APPEND */ INTO NOM_taula VALUES (...);
  Nologging alter table t1 nologging;
  Truncate table truncate table t1 ;
  Intercambio de particiones
  Vistas materializadas. Guardan la consulta y los datos. Suelen guardar cálculos masivos
  Merge. Combina la inserción y la modificación en una sola instrucción
  Hints
    Los hints se incorporan a una sentencia DML en forma de comentario y deben ir justo detrás del comando principal. Por ejemplo, si se tratara de una sentencia SELECT, el formato sería el siguiente:
  SELECT /*+ COMANDO-HINT */ ...

  ¡Hay que tener cuidado con estas operaciones, dado que reducen la seguridad y la posibilidad de recuperación ante operaciones no deseadas!
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
