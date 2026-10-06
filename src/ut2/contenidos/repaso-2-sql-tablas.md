---
layout: doc
title: "Repaso de SQL: tipos de datos y tablas"
sidebar: true
outline: [2, 3]
aside: true
---

# Repaso de SQL: tipos de datos y tablas

## Introducción al repaso de SQL

### 🎯 Objetivo del repaso

Este repaso forma parte del módulo **ASGBD – Administración de Sistemas Gestores de Bases de Datos** del ciclo formativo ASIR (Administración de Sistemas Informáticos en Red). Tiene como objetivo hacer un **repaso práctico y teórico de los fundamentos de SQL**, el lenguaje estándar para trabajar con bases de datos relacionales.

### Contenido a repasar

Durante el primer curso se adquirieron las bases de trabajo con **SQL**: creación y modificación de estructuras, manipulación de datos y consultas básicas. Ahora se revisan estos conceptos para consolidar conocimientos y prepararse para tareas más avanzadas como la administración, la optimización y la seguridad del sistema gestor.

![SQL #center](/img/contenidos/ut2/sql.png)

- Definición de tablas y manipulación de datos (**DDL** y **DML**)
- Uso de claves primarias y ajenas
- Consultas con filtros, ordenaciones y funciones agregadas (**DQL**)
- Funciones y operadores
- Permisos: `GRANT` y `REVOKE` (**DCL**)
- Transacciones y control de errores: `COMMIT` y `ROLLBACK` (**TCL**)
- Modelos relacionales y buenas prácticas de diseño

### Importancia del repaso

Este refuerzo no solo ayuda a recordar conceptos, sino que también prepara para:

- Entender el comportamiento interno del SGBD
- Mejorar la calidad de las consultas y los scripts
- Desarrollar sistemas más seguros y eficientes

## 🔠 Datos: tipos de datos

Un **dato**, en el contexto de una base de datos, es una unidad básica de información que se almacena y se utiliza para realizar operaciones u obtener conocimiento. Se trata de un elemento que representa un hecho concreto, y puede ser de diversos tipos (numérico, textual, temporal, etc.).

Lugar donde poner los datos: variables o celdas de una tabla

Cada columna de una tabla debe tener un tipo de dato, según el valor que debe almacenar:

| Descripción | Tipo de dato (Oracle) | Tipo de dato (PostgreSQL) |
| --- | --- | --- |
| Enteros (sin límite) o con n dígitos | `NUMBER / NUMBER(n)` | `INTEGER o INT` / `NUMERIC(n)` |
| Con decimales, con n dígitos | `NUMBER(p,s) o NUMBER` | `NUMERIC(p,s)` / `DECIMAL` |
| Cadenas de texto de longitud variable (sin límite) | `"Tipo especial"` | `TEXT` |
| Cadenas de texto de longitud variable (hasta n caracteres) | `VARCHAR2(n)` | `VARCHAR(n)` |
| Valores de fecha y hora | `DATE o TIMESTAMP` | `DATE` / `TIMESTAMP` |
| Fila o registro | `ROWTYPE` | `ROWTYPE` |
| Cadena de longitud fija | `CHAR(n)` | `CHAR(n)` |
| Valor booleano (verdadero/falso) | `BOOLEAN` | `BOOLEAN` |
| Array (no soportado directamente en Oracle) |  | `int[], text[], date[] boolean[]` |

**Nota:** en Oracle, `VARCHAR2` es más habitual que `VARCHAR` por compatibilidad.

Una **variable** representa un contenedor o un espacio en la memoria física o virtual de un ordenador, donde se almacenan diferentes tipos de datos (valores) durante la ejecución de un programa. A cada variable se le asigna un nombre descriptivo o un identificador que se refiere al valor guardado

Una **tabla** es una estructura organizada que se utiliza para almacenar datos en una base de datos. Está formada por filas (o registros) y columnas (o campos) y tiene un nombre para referirse a ella

### Tablas y registros

- Una **tabla** es como una hoja de cálculo: cada columna representa una propiedad, y cada fila un elemento del mundo real (p. ej.: un alumno, una factura...)
- Una **columna** tiene un nombre y un tipo de dato
- Una **fila** es un registro que contiene un valor para cada columna

#### En un esquema relacional

- Cada entidad se representa mediante una **tabla** (por ejemplo: clientes, productos, trabajadores)
- Cada **columna** representa un campo / atributo de la tabla; da nombre a los valores que después se almacenan
- Cada **fila** representa un registro / elemento de esa entidad
- Cada **celda** guarda un dato de información de una fila / elemento

### Ejemplo de tabla "alumnes"

| ID | Nom | Edat | Curs |
| --- | --- | --- | --- |
| 1 | Julia | 19 | 2n ASIX |
| 2 | Marc | 18 | 1r ASIX |
| 3 | Laia | 16 | 1r SMX |
| 4 | Pau | 15 | 1r SMX |

![Un fichero de fichas como analogía de una tabla #center](/img/contenidos/ut2/fitxer-taula.png)

La **tabla** ALUMNES se puede representar como un fichero con fichas, donde cada ficha es un alumno y cada ficha tiene la misma estructura (id, nom, cognoms, curs, edat)

Una ficha del fichero corresponde con una fila (registro) de la tabla

| 2 | Marc | 18 | 1r ASIX |
| --- | --- | --- | --- |

Donde ID es 2, Nom es "Marc", Edat es 18 y Curs es "1r ASIX"

## TABLAS

Una tabla es la unidad básica de almacenamiento de datos dentro de una base de datos relacional.

- Una tabla es un conjunto de registros (filas) que comparten la misma estructura.
- Cada registro contiene valores para cada campo (columna) definido en la tabla.
- Los campos tienen un tipo de dato específico (INTEGER, VARCHAR, DATE, etc.)
- y pueden tener restricciones (`NOT NULL, PRIMARY KEY, CHECK,` etc.).

## 🛠️ Creación de tablas: `CREATE TABLE`

Para definir una nueva tabla, utilizamos la orden `CREATE TABLE` indicando el nombre (de la tabla), las columnas con el tipo de datos y, opcionalmente, las restricciones.

### 📄 Ejemplo básico:

```sql
  ** Oracle
CREATE TABLE alumnes (
   id NUMBER(3),
   nom VARCHAR2(30),
   edat NUMBER(2),
   curs VARCHAR2(10)
);
```

```sql
  ** postgresql
CREATE TABLE alumnes (
   id NUMERIC(3),
   nom VARCHAR(30),
   edat NUMERIC(2),
   curs VARCHAR(10)
);
```

Se suele escribir de esta forma por legibilidad, pero también se puede escribir así:

```sql
CREATE TABLE alumnes (id NUMBER(3), nom VARCHAR2(30), edat NUMBER(2), curs VARCHAR2(10) );
```

### Restricciones comunes

- **PRIMARY KEY** → identifica de forma única cada fila
- **NOT NULL** → obliga a tener un valor
- **UNIQUE** → impide valores duplicados
- **DEFAULT** → establece un valor por defecto
- **CHECK** → condición que se debe cumplir
- **FOREIGN KEY** → crea una relación con otra tabla

### Ejemplo con restricciones:

```sql
CREATE TABLE alumnes (
   id NUMBER(3) PRIMARY KEY,
   nom VARCHAR2(30) NOT NULL,
   edat NUMBER(2) DEFAULT 18 CHECK (edat >= 16),
   curs VARCHAR2(10) NOT NULL
);
```

```sql
  ** postgresql
CREATE TABLE alumnes (
   id INTEGER PRIMARY KEY,
   nom VARCHAR(30) NOT NULL,
   edat SMALLINT DEFAULT 18 CHECK (edat >= 16),
   curs VARCHAR(10) NOT NULL
);
```

| ID | Nom | Edat | Curs |
| --- | --- | --- | --- |

## Añadir una columna a una tabla existente: `ALTER TABLE ... ADD`

### 📘 ¿Para qué sirve?

Cuando necesitas **modificar la estructura de una tabla** que ya existe, por ejemplo añadiendo una nueva columna para una información nueva (teléfono, correo, etc.), utilizas el comando `ALTER TABLE`.

### Qué se puede modificar

- Añadir una columna
- Borrar una columna
- Modificar una columna

### 🔧 Sintaxis básica: añadir una columna nueva

```sql
ALTER TABLE nom_taula
ADD (nom_columna tipus_dada [restriccions]);
```

#### Ejemplo sencillo: añadir el correo electrónico

```sql
ALTER TABLE alumnes
ADD (correu VARCHAR2(50));
```

Con esto, la tabla `alumnes` tendrá ahora una nueva columna llamada `correu`, de hasta 50 caracteres.

### 🧱 Añadir varias columnas a la vez

```sql
ALTER TABLE alumnes
ADD (
  telefon VARCHAR2(15),
  data_alta DATE
);
```

Esto es útil cuando haces evoluciones del modelo de datos.

### 🔐 Añadir una columna con la restricción `NOT NULL`

Cuando añades una nueva columna y le pones la restricción `NOT NULL`, debes asegurarte de que todas las filas actuales tendrán un valor válido.

```sql
-- Esto provocará un error si no asignamos un valor a todas las filas existentes
ALTER TABLE alumnes
ADD (dni VARCHAR2(9) NOT NULL); -- ❌ ERROR
```

#### ✅ Solución: primero añadirla sin restricción, rellenarla y después aplicar la restricción

```sql
ALTER TABLE alumnes
ADD (dni VARCHAR2(9));

UPDATE alumnes SET dni = 'PENDENT'; -- o un valor real

ALTER TABLE alumnes
MODIFY (dni VARCHAR2(9) NOT NULL);
```

### Buenas prácticas

- Planifica bien qué campos nuevos necesitas
- Revisa que los nombres no existan ya
- Si la columna debe ser obligatoria, asegúrate de que todas las filas tengan valor antes de poner `NOT NULL`
- Utiliza tipos de dato adecuados para el uso que le darás

### 🔍 Comprobar los cambios

Puedes ver la estructura actual de una tabla con:

```sql
DESC alumnes;
-- o
SELECT column_name, data_type FROM user_tab_columns
WHERE table_name = 'ALUMNES';
```

### Casos habituales de uso

- Añadir una columna `observacions` o `comentaris`
- Añadir un `telefon` o `email` si antes no se había registrado
- Añadir una fecha de creación o de actualización de registros

**🗑️ Modificar una columna de una tabla: `ALTER TABLE ... MODIFY COLUMN ...`**

Puede interesar modificar una columna, como por ejemplo añadir una restricción que no tiene

```sql
ALTER TABLE alumnes
MODIFY (dni VARCHAR2(9) NOT NULL);
```

Si se hace esto, hay que comprobar que todas las filas cumplen la restricción; de no ser así, fallará y dará ERROR

Cuando modificas el tipo de una columna en Oracle, como por ejemplo de `NUMBER` a `VARCHAR2`, Oracle intenta convertir automáticamente los datos existentes al nuevo tipo.

```sql
CREATE TABLE test (  id NUMBER );
INSERT INTO test VALUES (123);
ALTER TABLE test MODIFY id VARCHAR2(10);
```

#### ✅ Si la conversión es posible:

Oracle convierte todos los datos automáticamente y sin error

#### ❌ Si hay valores que no se pueden convertir:

La operación fallará con un error de tipo ORA-01439. Esto pasa, por ejemplo, si vas de VARCHAR2 a NUMBER y hay valores no numéricos

**🗑️ Borrar una columna de una tabla: `ALTER TABLE ... DROP COLUMN ...`**

### 📘 ¿Cuándo hay que borrar una columna?

A veces una columna ya no es necesaria porque:

- Ha quedado obsoleta (p. ej.: `fax`)
- Ha sido sustituida por otra más útil o normalizada
- Se añadió por error o durante unas pruebas

### 🧱 Sintaxis básica

```sql
ALTER TABLE nom_taula
DROP COLUMN nom_columna;
```

#### Ejemplo: eliminar el campo `telefon`

```sql
ALTER TABLE alumnes
DROP COLUMN telefon;
```

Este comando elimina completamente la columna `telefon` y todos los datos que contenía.

### ⚠️ ¡Atención a la pérdida de datos!

Esta operación **no se puede deshacer** fácilmente. Una vez eliminada una columna, los datos desaparecen definitivamente, a menos que:

- Tengamos una copia de seguridad (backup)
- La hayamos exportado previamente

### Alternativa: dejarla como inactiva (por convención)

Si no quieres perder los datos inmediatamente, puedes:

- Renombrarla (p. ej.: `telefon_obsolet`)
- Dejarla vacía (`NULL`) e ignorarla

### Borrar múltiples columnas (Oracle 12c+)

```sql
ALTER TABLE alumnes
DROP (telefon, observacions);
```

No todos los SGBD permiten esta sintaxis directa. En versiones antiguas de Oracle hay que hacerlo de forma individual.

### ¿Cómo comprobar que ha desaparecido?

```sql
DESC alumnes;
-- o
SELECT column_name FROM user_tab_columns
WHERE table_name = 'ALUMNES';
```

### Buenas prácticas antes de borrar

- Asegúrate de que realmente no se utiliza ni en consultas ni en aplicaciones
- Exporta los datos si pueden tener valor en el futuro
- Informa al equipo o documenta el cambio
- Considera poner la columna a `NULL` y hacer una limpieza progresiva

### Ejemplo completo

```sql
-- Comprobamos si la columna existe
DESC alumnes;

-- Eliminamos la columna
ALTER TABLE alumnes DROP COLUMN data_alta;

-- Verificamos de nuevo
DESC alumnes;
```

## 🗑️ Borrar una tabla: `DROP TABLE ...`

### 📘 ¿Cuándo hay que borrar una tabla?

A veces una tabla deja de formar parte del E-R porque:

- Ha quedado obsoleta
- Ha sido sustituida por otra más útil o normalizada
- Se añadió por error o durante unas pruebas

### 🧱 Sintaxis básica

```sql
DROP TABLE nom_taula;
```

#### Ejemplo: eliminar la tabla `alumnes`

```sql
DROP TABLE alumnes;
```

Este comando elimina completamente la tabla y todos los datos que contenía.

### ⚠️ ¡Atención a la pérdida de datos!

Esta operación **no se puede deshacer** fácilmente. Una vez eliminada una tabla, los datos desaparecen definitivamente, a menos que:

- Tengamos una copia de seguridad (backup)
- La hayamos exportado previamente

### ¿Cómo comprobar que ha desaparecido?

```sql
** Oracle
SELECT table_name
FROM user_tables
WHERE table_name = 'NOM_TAULA';
```

```sql
  ** postgresql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'   -- esquema donde está la tabla
  AND table_name = 'nom_taula';
```

Si la consulta no devuelve ninguna fila, quiere decir que la tabla ya no existe dentro de tu esquema de usuario.

NOM_TAULA debería estar en mayúsculas, ya que Oracle guarda los nombres de los objetos en mayúsculas por defecto

Si hay foreign keys que referencian la tabla, `DROP TABLE` puede fallar → hace falta `DROP TABLE … CASCADE` para forzarlo. `TRUNCATE` también puede fallar con foreign keys si no se hace `TRUNCATE … CASCADE`

### Buenas prácticas antes de borrar

- Asegúrate de que realmente no se utiliza ni en consultas ni en aplicaciones
- Exporta los datos si pueden tener valor en el futuro
- Informa al equipo o documenta el cambio

---

Pero una cosa es crear una tabla (estructura), que se crea vacía, y otra cosa es poner datos dentro de la tabla, rellenar la tabla con datos

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
