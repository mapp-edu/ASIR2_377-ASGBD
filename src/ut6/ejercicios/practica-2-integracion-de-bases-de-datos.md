---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 2: integración de bases de datos preexistentes"
pageClass: ejercicios-page
---

# 📋 Práctica 2: integración de bases de datos preexistentes

## Enunciado

Dos bibliotecas municipales, que hasta ahora funcionaban por separado, se integran en una red comarcal. Cada una tiene **su propia base de datos**, diseñada en su día por personas distintas: las tablas no se llaman igual, las columnas tampoco y algunos datos están en formatos diferentes.

No se van a migrar los datos: cada biblioteca seguirá trabajando con su base de datos. Tu trabajo es crear, **por encima de las dos**, una base de datos distribuida que ofrezca una **visión única** a la red comarcal.

La práctica se plantea con **PostgreSQL** y `postgres_fdw`; con Oracle se resuelve igual usando enlaces de base de datos, como en la [práctica anterior](./practica-1-base-de-datos-distribuida).

::: tip Montaje de los nodos
Puedes usar **una máquina virtual por nodo** (es lo más parecido a la realidad) o **varios clústeres de PostgreSQL en la misma máquina**, cada uno en un puerto distinto. En Debian, Ubuntu y Linux Mint un clúster nuevo se crea con:

```bash
sudo pg_createcluster 16 nombre -p 5441 --start
pg_lsclusters
```

Repasa la página [Acceso y varios clústeres](/ut1/contenidos/postgresql/3-acceso-multicluster). Si usas máquinas distintas, recuerda abrir `listen_addresses` y añadir la regla correspondiente en `pg_hba.conf`.
:::

## Objetivos

- Integrar bases de datos que ya existen sin modificarlas.
- Resolver las diferencias de nombres, estructura y formato entre esquemas.
- Ofrecer un esquema global mediante vistas.
- Valorar los límites de una base de datos federada.

## Datos de partida

Crea las dos bases de datos **tal como están** (son las «preexistentes»: después no podrás cambiar su estructura) e inserta al menos cinco filas en cada tabla.

**Nodo norte, base de datos `biblioteca_norte`:**

```sql
CREATE TABLE socios (
  num_socio   int PRIMARY KEY,
  nombre      varchar(60) NOT NULL,      -- «Apellidos, Nombre»
  alta        date NOT NULL,
  telefono    varchar(15)
);

CREATE TABLE prestamos (
  id          int PRIMARY KEY,
  num_socio   int NOT NULL REFERENCES socios,
  isbn        varchar(13) NOT NULL,
  titulo      varchar(100) NOT NULL,
  prestado    date NOT NULL,
  devuelto    date                        -- NULL si sigue prestado
);
```

**Nodo sur, base de datos `biblio_sur`:**

```sql
CREATE TABLE lectores (
  id            int PRIMARY KEY,
  nom           varchar(30) NOT NULL,
  apellidos     varchar(50) NOT NULL,
  fecha_alta    timestamp NOT NULL,
  movil         varchar(15)
);

CREATE TABLE libros (
  isbn          varchar(17) PRIMARY KEY,  -- con guiones: 978-84-...
  titulo        varchar(100) NOT NULL
);

CREATE TABLE prestamo (
  id_lector     int NOT NULL REFERENCES lectores,
  isbn          varchar(17) NOT NULL REFERENCES libros,
  desde         date NOT NULL,
  estado        char(1) NOT NULL,         -- 'P' prestado, 'D' devuelto
  PRIMARY KEY (id_lector, isbn, desde)
);
```

## Tareas

### Parte 1. Análisis

1. Elabora una **tabla de correspondencias** entre los dos esquemas: qué tabla y qué columna de cada base de datos representa el mismo concepto, y qué diferencias hay de nombre, tipo, formato o estructura.
2. Detecta los **conflictos** que habrá que resolver. Como mínimo: los identificadores de socio que se repiten en las dos bibliotecas, el formato del nombre, el formato del ISBN y la forma de saber si un préstamo sigue abierto.
3. Diseña el **esquema global**: las tablas (vistas) que verá la red comarcal, con sus columnas y tipos.

### Parte 2. Conexión con las bases de datos existentes

4. En cada biblioteca, crea un usuario para la red comarcal con permiso **solo de lectura**.
5. En el nodo `central`, crea la base de datos `red_bibliotecas`, define los dos servidores remotos y las correspondencias de usuarios.
6. Crea un esquema local por biblioteca e **importa** en él las tablas remotas, sin escribir a mano su definición.
7. Comprueba desde `central` que puedes consultar las tablas de las dos bibliotecas y que **no** puedes modificarlas.

### Parte 3. Esquema global

8. Crea la vista global de **socios**, que unifique las dos fuentes con: sede, identificador de socio único en toda la red, nombre, apellidos, fecha de alta y teléfono.
9. Crea la vista global de **préstamos**, con: sede, identificador único del socio, ISBN en un formato único, título, fecha de préstamo y un indicador de si está abierto.
10. Resuelve con esas vistas estas consultas de la red comarcal:
    - número de socios por sede y total;
    - préstamos abiertos en toda la red, con el nombre del socio;
    - títulos que se han prestado en las dos bibliotecas.
11. Obtén el plan de ejecución detallado de la tercera consulta y explica qué se resuelve en cada nodo y qué en el nodo central.

### Parte 4. Límites de la integración

12. Una socia tiene carné en las dos bibliotecas. ¿Cómo aparece en la vista global? Propón cómo detectar estos duplicados.
13. La biblioteca del sur añade una columna a `lectores`. ¿Se entera el nodo central? ¿Qué hay que hacer?
14. Detén el nodo `norte`. ¿Qué consultas del punto 10 siguen funcionando? ¿Qué se podría hacer para que la red siguiera viendo los datos de una biblioteca aunque su servidor esté parado?
15. Compara esta solución (integración de bases de datos preexistentes, de abajo arriba) con la de la práctica anterior (diseño distribuido desde el principio, de arriba abajo): autonomía de los nodos, homogeneidad de los esquemas y esfuerzo de mantenimiento.
16. Si la biblioteca del sur usara MariaDB en lugar de PostgreSQL, ¿seguiría siendo posible la integración? Investiga qué haría falta y qué tipo de SGBD distribuido sería entonces.

## Orientaciones

```sql
-- En el nodo central
CREATE SCHEMA norte;
IMPORT FOREIGN SCHEMA public FROM SERVER bib_norte INTO norte;
IMPORT FOREIGN SCHEMA public LIMIT TO (lectores, prestamo) FROM SERVER bib_sur INTO sur;
\det *.*

-- Esquema global: una vista que unifica las dos fuentes
CREATE VIEW socios_global AS
  SELECT 'NORTE' AS sede, ... FROM norte.socios
  UNION ALL
  SELECT 'SUR',           ... FROM sur.lectores;
```

- Un identificador único en toda la red se puede construir combinando la sede y el identificador local.
- Funciones útiles para unificar formatos: `split_part()`, `replace()`, `trim()`, conversiones con `::date` y expresiones `CASE`.
- En cada biblioteca, el permiso de solo lectura se da con `GRANT SELECT ON ALL TABLES IN SCHEMA public TO usuario;`.
- Con Oracle: un enlace de base de datos por biblioteca y vistas con `UNION ALL` sobre `tabla@enlace`.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA6** (*Aplica criterios de disponibilidad analizándolos y ajustando la configuración del sistema gestor.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **6.d** | Se ha creado una base de datos distribuida mediante la integración de un conjunto de bases de datos preexistentes. | Integra las dos bases de datos existentes sin modificarlas y ofrece un esquema global correcto que resuelve los conflictos de nombres, formatos e identificadores. |
| **6.a** | Se ha reconocido la utilidad de las bases de datos distribuidas. | Valora la utilidad y los límites de la solución federada frente al diseño distribuido de la práctica anterior. |
| **6.c** | Se ha implantado una base de datos distribuida homogénea. | Las consultas globales funcionan desde el nodo central y explica con el plan dónde se ejecuta cada parte. |
| **6.g** | Se ha comprobado el efecto de la parada de determinados nodos sobre los sistemas distribuidos y replicados. | Comprueba qué deja de funcionar al parar un nodo y propone cómo mitigarlo. |

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
