---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 1: base de datos distribuida y fragmentación"
pageClass: ejercicios-page
---

# 📋 Práctica 1: base de datos distribuida y fragmentación

## Enunciado

Una cadena de tiendas tiene dos sedes, **Norte** y **Sur**. Cada sede quiere tener en su propio servidor los datos de sus clientes, pero la dirección necesita consultarlos todos como si estuvieran en una sola base de datos.

Vas a implantar una **base de datos distribuida homogénea** con tres nodos: uno por sede y un nodo **central** que ofrece la visión global. Los datos se repartirán con distintas **políticas de fragmentación**.

La práctica se plantea con **PostgreSQL** y la extensión `postgres_fdw`. Al final tienes las orientaciones para hacerla con Oracle y enlaces de base de datos.

::: tip Montaje de los nodos
Puedes usar **una máquina virtual por nodo** (es lo más parecido a la realidad) o **varios clústeres de PostgreSQL en la misma máquina**, cada uno en un puerto distinto. En Debian, Ubuntu y Linux Mint un clúster nuevo se crea con:

```bash
sudo pg_createcluster 16 nombre -p 5441 --start
pg_lsclusters
```

Repasa la página [Acceso y varios clústeres](/ut1/contenidos/postgresql/3-acceso-multicluster). Si usas máquinas distintas, recuerda abrir `listen_addresses` y añadir la regla correspondiente en `pg_hba.conf`.
:::

## Objetivos

- Reconocer para qué sirve una base de datos distribuida y qué transparencias ofrece.
- Aplicar fragmentación horizontal, vertical y mixta.
- Implantar una base de datos distribuida homogénea y consultarla desde un único punto.
- Comprobar cómo se ejecuta una consulta distribuida.

## Tareas

### Parte 1. Diseño

1. Explica, para este caso, **qué ventajas** tiene distribuir los datos frente a centralizarlos y qué inconvenientes aparecen.
2. Describe las tres **políticas de fragmentación** (horizontal, vertical y mixta) y decide cuál aplicarás a cada tabla:

   | Tabla | Columnas | Requisito |
   |:---|:---|:---|
   | `clientes` | `id`, `nombre`, `region` | Cada sede guarda sus clientes. |
   | `empleados` | `id`, `nombre`, `sede`, `salario`, `iban` | Los datos de nómina (`salario`, `iban`) solo deben estar en el nodo central. |

3. Dibuja el **esquema de la distribución**: nodos, puertos o direcciones, y qué fragmento hay en cada uno.

### Parte 2. Los nodos

4. Crea los tres nodos (`central`, `norte` y `sur`) y comprueba que están en marcha.
5. En `norte` y `sur`, crea un usuario de aplicación, la base de datos `ventas` y la tabla `clientes`. Añade en cada nodo una restricción que **impida guardar clientes de otra región**.

### Parte 3. Fragmentación horizontal

6. En el nodo `central`, instala la extensión, define los dos **servidores remotos** y la **correspondencia de usuarios**.
7. Crea en `central` la tabla `clientes` **particionada por región**, de forma que cada partición sea una **tabla externa** que apunta al nodo de su sede.
8. Inserta desde `central` seis clientes, tres de cada región. Comprueba, conectándote a cada sede, que cada fila ha ido a parar a su nodo.
9. Desde `central`, modifica y borra un cliente y comprueba el efecto en la sede.
10. Intenta insertar desde `central` un cliente de una región que no existe. ¿Qué ocurre y por qué?

### Parte 4. Fragmentación vertical

11. Reparte la tabla `empleados`: las columnas `id`, `nombre` y `sede` en los nodos de las sedes, y `id`, `salario` e `iban` en el nodo central.
12. Crea en `central` una **vista** que reconstruya la tabla completa. ¿Qué columna hace posible la reconstrucción?

### Parte 5. Consulta distribuida

13. Obtén el **plan de ejecución detallado** de estas consultas lanzadas desde `central` y explica qué parte se ejecuta en cada nodo:
    - los clientes de la región SUR;
    - el número total de clientes;
    - los clientes cuyo nombre empieza por una letra.
14. ¿En cuál de ellas el nodo central evita consultar una de las sedes? ¿Cómo lo sabe?
15. Explica qué **transparencias** (de localización, de fragmentación) percibe un usuario que consulta `clientes` desde `central`.

### Parte 6. Parada de un nodo

16. Detén el nodo `sur` y repite desde `central` las tres consultas del punto 13. ¿Cuáles funcionan y cuáles fallan? Copia el mensaje de error.
17. ¿Se puede seguir dando de alta clientes de la región NORTE? ¿Y de la región SUR?
18. Arranca de nuevo el nodo y comprueba que todo vuelve a funcionar. Relaciona lo observado con las reglas de Date de **autonomía local** y **no dependencia de un sitio central**: ¿las cumple tu sistema?

## Orientaciones

### Con PostgreSQL

```sql
-- En el nodo central, dentro de la base de datos ventas
CREATE EXTENSION postgres_fdw;

CREATE SERVER nodo_norte FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (host '127.0.0.1', port '5451', dbname 'ventas');

CREATE USER MAPPING FOR CURRENT_USER SERVER nodo_norte
  OPTIONS (user 'app', password '...');

CREATE TABLE clientes (id int, nombre text NOT NULL, region text NOT NULL)
  PARTITION BY LIST (region);

CREATE FOREIGN TABLE clientes_norte PARTITION OF clientes
  FOR VALUES IN ('NORTE')
  SERVER nodo_norte OPTIONS (table_name 'clientes');

-- Ver en qué fragmento está cada fila y qué se envía a cada nodo
SELECT tableoid::regclass, * FROM clientes;
EXPLAIN (VERBOSE, COSTS OFF) SELECT * FROM clientes WHERE region = 'SUR';
```

- En el plan, la línea `Remote SQL` muestra la sentencia que se envía al nodo remoto.
- `\des` lista los servidores remotos, `\deu` las correspondencias de usuarios y `\det` las tablas externas.
- Repasa [PostgreSQL como SGBD distribuido](/ut6/contenidos/postgresql/1-postgresql-distribuido) y [Fragmentación y replicación](/ut6/contenidos/3-fragmentacion-replicacion).

### Con Oracle

Utiliza **dos o tres PDB** como nodos y únelas con **enlaces de base de datos**:

```sql
CREATE DATABASE LINK enlace_sur
  CONNECT TO app IDENTIFIED BY "..."
  USING '//servidor:1521/pdb_sur';

SELECT * FROM clientes@enlace_sur;

CREATE VIEW clientes AS
  SELECT * FROM clientes_norte
  UNION ALL
  SELECT * FROM clientes@enlace_sur;

CREATE SYNONYM clientes_sur FOR clientes@enlace_sur;
```

- La fragmentación horizontal se reconstruye con una vista `UNION ALL`; la transparencia de localización se consigue con sinónimos.
- En el plan de ejecución, las operaciones que se envían al otro nodo aparecen como `REMOTE`.
- Hace falta el privilegio `CREATE DATABASE LINK`.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA6** (*Aplica criterios de disponibilidad analizándolos y ajustando la configuración del sistema gestor.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **6.a** | Se ha reconocido la utilidad de las bases de datos distribuidas. | Razona la utilidad de la base de datos distribuida en el caso propuesto, con ventajas, inconvenientes y transparencias conseguidas. |
| **6.b** | Se han descrito las distintas políticas de fragmentación de la información. | Describe las políticas de fragmentación horizontal, vertical y mixta y justifica la que aplica a cada tabla. |
| **6.c** | Se ha implantado una base de datos distribuida homogénea. | La base de datos distribuida funciona: desde el nodo central se consulta y se modifica y cada fila queda en el nodo que le corresponde. |
| **6.g** | Se ha comprobado el efecto de la parada de determinados nodos sobre los sistemas distribuidos y replicados. | Comprueba qué operaciones siguen funcionando y cuáles fallan al parar un nodo, y lo relaciona con las reglas de Date. |

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
