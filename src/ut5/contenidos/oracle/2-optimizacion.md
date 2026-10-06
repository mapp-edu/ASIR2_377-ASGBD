---
layout: doc
title: "Oracle: optimización y herramientas"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: optimización y herramientas

## Optimización

### 🎯 Objetivo

El objetivo de la optimización es **mejorar el rendimiento** del sistema, reduciendo los tiempos de respuesta, el uso de recursos y el impacto en el usuario final. No se trata solo de hacer que las consultas funcionen, sino de que sean **rápidas y eficientes**.

### Niveles en los que optimizar

- a nivel de sistema operativo
- a nivel de red

- Tamaño de los bloques
- Tamaño y ubicación de los ficheros de datos
- Deshabilitar procesos ocultos
- Tamaño del almacenamiento temporal

- Diseño de tablas y tipos de datos (ajustar a lo necesario)
- Campos calculados (intentar mantener los menos posibles)
- Desnormalización (reducir los JOIN a costa de aumentar la redundancia)
- Desfragmentación
- Particionamiento
- Crear, modificar o eliminar índices
- Balanceo de índices
- Optimización de consultas

### Particionamiento

Se evita procesar toda una tabla (solo se procesa la partición). Permite guardar en una sola tabla más datos de los que caben en un disco. Se puede acceder a los datos en paralelo. Facilita operaciones como, por ejemplo, el purgado de datos

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

  - Agrupados
  - No agrupados

  - Índice B-tree
  - Índice bitmap
  - Índice hash

### Optimización de consultas

- Sustituir los OR por UNION
- IN frente a EXISTS
- IN frente a BETWEEN
- Comparaciones: evitar IS NULL y &lt;&gt;
- Usar tablas derivadas, subconsultas y joins
- Evitar el GROUP BY
- Cursores y funciones

---

### Prácticas recomendadas para los índices

- Columna filtrada frecuentemente (WHERE)
- Columnas utilizadas en los JOIN
- ⚠️ No crear índices por defecto en todas las columnas (consumen espacio y pueden ralentizar los INSERT/UPDATE)

### Prácticas recomendadas para las consultas

- Utiliza `EXPLAIN PLAN` para analizar la estrategia de la consulta (se explica en el siguiente punto)
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
-- Evitar funciones sobre columnas
WHERE data >= TO_DATE('01/01/2023', 'DD/MM/YYYY')

-- Sustituir la subconsulta por un JOIN
SELECT a.nom, c.nom_curs
FROM alumnes a
JOIN cursos c ON a.curs_id = c.id;
```

### Otros consejos de optimización

- Usa `BULK COLLECT` y `FORALL` para trabajar con grandes volúmenes en PL/SQL
- Utiliza particiones en tablas muy grandes
- Evita bloqueos y transacciones largas

### Resumen de buenas prácticas

- Conoce el modelo de datos y el volumen
- Usa EXPLAIN PLAN a menudo
- Mantén las estadísticas al día
- Indexa con criterio
- Mejora las consultas repetitivas o lentas

## Optimización en Oracle

### 📈 El optimizador

Oracle utiliza un componente llamado **optimizador** para determinar el mejor plan de ejecución para una consulta SQL. El objetivo es minimizar el tiempo de ejecución y el uso de recursos.

### 📊 Estadísticas

Oracle utiliza un optimizador CBO (basado en costes calculados con estadísticas)

El optimizador CBO utiliza **estadísticas** sobre las tablas, columnas e índices para decidir la estrategia de ejecución.

#### Cómo generar estadísticas

```sql
EXEC DBMS_STATS.GATHER_TABLE_STATS('USUARI', 'TAULA');
-- Actualizar las estadísticas
EXEC DBMS_STATS.GATHER_TABLE_STATS(ownname=>'USUARI', tabname=>'ALUMNES');
--
execute dbms_stats.gather_table_stats(‘esquema’.’taula’);
execute dbms_stats.gather_schema_stats(‘esquema’);
```

**⚠️ Por tanto, es muy importante crear tareas programadas que realicen esta actualización fuera de las horas de carga de trabajo**

**También se pueden automatizar mediante tareas de mantenimiento o con la recogida automática del Oracle Scheduler.**

### 🧪 EXPLAIN PLAN

Esta orden permite visualizar el plan que Oracle seguirá para ejecutar una consulta (sin ejecutarla realmente). Muestra si se utilizan índices, escaneos completos, joins, etc. Ayuda a detectar consultas lentas o mal optimizadas.

- Analizar el rendimiento
- Detectar cuellos de botella
- Ver si se están usando los índices
- Entender por qué es lenta una consulta
- Ayuda a optimizar una SQL

#### Ejemplo de uso

```sql
EXPLAIN PLAN FOR  SELECT * FROM alumnes WHERE edat > 18;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

En Oracle SQL Developer puedes hacer un EXPLAIN PLAN de manera muy sencilla:

1: Escribe tu consulta en el worksheet, selecciónala (o deja el cursor dentro) y haz clic en el botón «Explain Plan» (icono con una lupa o un árbol); también puedes pulsar F10. ➜ SQL Developer mostrará el plan de ejecución en una pestaña inferior. ⚠️ Esto no ejecuta la consulta, solo muestra el plan estimado. 2: Con EXPLAIN PLAN manualmente (como se ha visto antes). 3: Ver el plan real (muy recomendado): ejecuta la consulta normalmente (F9) y ve a la pestaña «Autotrace» (si está activada; si no la ves: View &gt; Autotrace)

#### Resultados comunes:

- `TABLE ACCESS FULL` → Oracle escanea toda la tabla
- `INDEX RANGE SCAN` → usa un índice de forma parcial
- `NESTED LOOPS`, `HASH JOIN` → tipos de estrategias de join

### Factores que afectan al plan de ejecución

- Disponibilidad de índices
- Estadísticas actualizadas
- Volumen de datos
- Condiciones de filtro y joins

### ⚠️ Errores habituales de optimización

- Usar `SELECT *` en lugar de solo las columnas necesarias
- Aplicar funciones sobre columnas en las condiciones (`WHERE UPPER(nom)`) → impide usar los índices
- No tener índices sobre las claves foráneas o las condiciones de filtro
- Olvidar actualizar las estadísticas

### Otras herramientas de optimización

- **DBMS_XPLAN** → muestra el plan de ejecución con más detalle
- **AWR** (Automatic Workload Repository) → historial de rendimiento
- **ASH** (Active Session History) → actividad de las sesiones en tiempo real

### Recomendaciones generales

- Revisa las consultas lentas con EXPLAIN PLAN
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
WHERE data_naixement BETWEEN TO_DATE('01/01/2005', 'DD/MM/YYYY')
                        AND TO_DATE('31/12/2005', 'DD/MM/YYYY');
```

### 💬 Conclusión

La optimización en Oracle se basa en la colaboración entre el desarrollador y el optimizador del sistema. Mantener las estadísticas actualizadas, evitar las malas prácticas y revisar los planes de ejecución son claves para un rendimiento óptimo.

## Herramientas de optimización en Oracle

### 🎯 Objetivo

Estas herramientas permiten **analizar el rendimiento** de consultas SQL, sesiones y cargas del sistema, ayudando a diagnosticar cuellos de botella y a optimizar los accesos a los datos.

---

### 1. EXPLAIN PLAN

Muestra el plan de ejecución previsto por Oracle para una consulta. Ayuda a detectar si se utilizan índices o si se hace un escaneo completo de la tabla.

```sql
EXPLAIN PLAN FOR
SELECT * FROM alumnes WHERE edat > 18;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

**Salidas habituales:**

- `TABLE ACCESS FULL` → acceso completo (lento)
- `INDEX RANGE SCAN` → acceso parcial mediante un índice
- `HASH JOIN`, `NESTED LOOPS` → estrategias de join

---

### 2. DBMS_XPLAN

Paquete que permite mostrar el plan de ejecución con más claridad, incluyendo coste, filas estimadas, filtro aplicado, etc.

#### Ejemplo:

```sql
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

Para ver el plan real de una consulta ya ejecutada:

```sql
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY_CURSOR(NULL, NULL, 'ALLSTATS LAST'));
```

---

### 3. AUTOTRACE

Muestra automáticamente el plan de ejecución y las estadísticas después de ejecutar una consulta.

#### Activar AUTOTRACE en SQL\*Plus:

```sql
SET AUTOTRACE ON;
SELECT * FROM alumnes WHERE edat > 18;
```

**Resultado:** muestra el coste, el número de lecturas, las filas devueltas y el acceso utilizado.

---

### 4. AWR (Automatic Workload Repository)

Recoge métricas de rendimiento cada hora. Permite hacer comparativas, generar informes y detectar cambios de rendimiento.

#### 📝 Informes AWR:

```txt
@$ORACLE_HOME/rdbms/admin/awrrpt.sql
```

- Comparativa entre snapshots
- Identificación del top SQL (las consultas más pesadas)
- Uso de recursos (CPU, E/S, etc.)

---

### 5. ASH (Active Session History)

Muestra la actividad de las sesiones que han estado activas en los últimos minutos. Ideal para ver qué consultas están causando carga.

#### 🔍 Ejemplo de consulta ASH:

```sql
SELECT sql_id, session_id, wait_class, event, sample_time
FROM v$active_session_history
WHERE sample_time > SYSDATE - 1/24;
```

**Requiere:** licencia Oracle Enterprise Edition + Diagnostics Pack

---

### Otras herramientas útiles

- `V$SQL`, `V$SESSION` → consultas activas y sesiones en curso
- SQL Developer → gráficos de sesiones, consultas y objetos bloqueados

---

### Buenas prácticas

- Revisa los planes con EXPLAIN PLAN antes de desplegar consultas
- Activa AUTOTRACE si trabajas con SQL\*Plus
- Usa AWR y ASH para detectar cambios de rendimiento entre periodos
- ⚠️ Evita EXPLAIN PLAN sobre consultas complejas sin contexto

### Conclusión

Las herramientas de optimización de Oracle te permiten **monitorizar y mejorar** el comportamiento de tu sistema, evitando cuellos de botella y mejorando la experiencia de usuario.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
