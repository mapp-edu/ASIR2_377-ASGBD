---
layout: doc
title: "Repaso de SQL: operaciones CRUD"
sidebar: true
outline: [2, 3]
aside: true
---

# Repaso de SQL: operaciones CRUD

![Operaciones CRUD: create, read, update y delete #center](/img/contenidos/ut2/crud_.jpg)

## Qué es el CRUD

El término CRUD es un acrónimo que hace referencia a las cuatro operaciones básicas que se realizan en bases de datos y sistemas de gestión de información. Es un modelo conceptual para operaciones básicas sobre datos.

- Create (insertar datos): hace referencia a la operación de añadir nuevos registros o elementos a la base de datos.
- Read (leer datos): implica obtener o consultar los datos almacenados en la base de datos.
- Update (modificar datos): consiste en modificar o actualizar los registros existentes.
- Delete (eliminar datos): se refiere a eliminar registros o datos de la base de datos.

Es un concepto general, aplicable a cualquier sistema de gestión de datos, no solo a SQL.

Estas operaciones son fundamentales para la gestión y el mantenimiento de bases de datos en muchas aplicaciones, desde sistemas sencillos hasta plataformas más complejas. CRUD es un concepto que se aplica en muchas áreas del desarrollo de software, especialmente en el contexto de aplicaciones web o móviles que interactúan con bases de datos.

DML es la implementación SQL concreta del CRUD.

| Sentencia SQL | Operación CRUD equivalente |
| ------------- | ------------------------ |
| `INSERT` | Create |
| `SELECT` | Read |
| `UPDATE` | Update |
| `DELETE` | Delete |

## Rellenar una tabla: `INSERT INTO`

### 📘 ¿Qué hace la orden `INSERT`?

La orden `INSERT INTO` se utiliza para añadir **nuevas filas (registros)** en una tabla. Puedes insertar una fila concreta indicando los valores para cada columna, o múltiples filas si el SGBD lo permite.

### Sintaxis básica

```sql
INSERT INTO nom_taula (col1, col2, ..., colN)
VALUES (valor1, valor2, ..., valorN);
```

#### Ejemplo básico

```sql
INSERT INTO alumnes (id, nom, edat, curs)
VALUES (1, 'Julia', 19, '2n ASIX');
```

#### Ejemplo sin especificar columnas (no recomendado)

```sql
INSERT INTO alumnes
VALUES (2, 'Marc', 18 '1r ASIX');
//  ¡Funciona, pero no se recomienda!
```

**⚠️ Cuidado:** hay que respetar el orden de las columnas definidas en la tabla.

### Buenas prácticas

- Indica siempre los nombres de las columnas por claridad
- Revisa que los valores sean compatibles con el tipo de dato (p. ej.: número, texto...)
- Respeta las restricciones: `NOT NULL`, `CHECK`, `FOREIGN KEY`...

### Ejemplo con valores por defecto

Supongamos que la tabla `alumnes` tiene un valor por defecto de edat = 18:

```sql
CREATE TABLE alumnes (
  id NUMBER PRIMARY KEY,
  nom VARCHAR2(30) NOT NULL,
  edat NUMBER DEFAULT 18
);

INSERT INTO alumnes (id, nom)
VALUES (5, 'Núria');
```

**Resultado:** se insertará la edad 18 automáticamente.

### Comprobación

```sql
SELECT * FROM alumnes;
```

### Posibles errores comunes

- Insertar un valor duplicado en una `PRIMARY KEY`
- Omitir una columna con `NOT NULL` sin valor por defecto
- Violación de una `FOREIGN KEY`: insertar un valor que no existe en la tabla referenciada

## 🔎 Consultas SELECT y condiciones con WHERE (DQL)

### 📘 Orden `SELECT`

La orden `SELECT` se utiliza para **consultar datos** de una o más tablas. Se pueden seleccionar columnas específicas o todas.

```sql
SELECT * FROM alumnes;
   ==>  resultado: muestra los datos de TODAS las columnas
        de TODAS las filas de la tabla alumnes
```

```sql
SELECT nom, edat FROM alumnes;
==>  resultado: muestra los datos de las columnas  nom y edat
     de TODAS las filas de la tabla alumnes
```

### 🔍 Filtrar registros con `WHERE`

La cláusula `WHERE` permite filtrar las filas según una o más condiciones.

```sql
SELECT * FROM alumnes  WHERE edat > 18;
   ==>  resultado: muestra los datos de TODAS las columnas,
     pero solo de las filas que en la celda edat
     tienen un dato mayor que 18,  de la tabla alumnes
```

**Solo muestra los alumnos que tienen más de 18 años.**

### 🧮 Operadores de comparación

- `=` igual a
- `<>` distinto de
- `>`, `<` → mayor o menor
- `>=`, `<=` → mayor o igual, menor o igual
- `LIKE` → búsqueda por patrones (p. ej.: `'L%'`)
- `IN` → un valor dentro de un conjunto
- `BETWEEN` → dentro de un rango de valores

```sql
SELECT * FROM alumnes WHERE nom LIKE 'L%';     -- nombres que empiezan por L
SELECT * FROM alumnes WHERE edat BETWEEN 18 AND 21;
SELECT * FROM alumnes WHERE id_curs IN (1, 2, 3);
```

A los operadores `LIKE, IN, BETWEEN` también se les llama **predicados**. Otros son `IS NULL, EXISTS, ALL, ANY`

## ✏️ Actualización de registros: orden `UPDATE`

### 📘 ¿Qué hace la orden `UPDATE`?

La orden `UPDATE` sirve para **modificar valores de una o más columnas** dentro de las filas de una tabla. Igual que con `DELETE`, es muy importante aplicarla con una condición `WHERE` para limitar las filas afectadas.

### 🧱 Sintaxis básica

```sql
UPDATE nom_taula
SET columna1 = valor1,
    columna2 = valor2
WHERE condición;
```

#### Ejemplo sencillo: cambiar la edad de un alumno

```sql
UPDATE alumnes
SET edat = 21
WHERE id = 3;
```

**Resultado:** el alumno con id 3 tendrá la edad actualizada a 21.

### 🔁 Modificar múltiples campos

```sql
UPDATE alumnes
SET edat = edat + 1,
    nom = 'Marc Actualizado'
WHERE id = 5;
```

Es posible utilizar cálculos, expresiones o funciones dentro del `SET`.

### 🔍 Importante: incluir siempre una cláusula `WHERE`

```sql
-- ⚠️ Sin WHERE: ¡actualiza TODAS las filas!
UPDATE alumnes
SET edat = 18;
```

Comprueba siempre primero las filas afectadas con un `SELECT`:

```sql
SELECT * FROM alumnes WHERE id = 3;
UPDATE alumnes SET edat = 22 WHERE id = 3;
```

### Ejemplo real: incremento de edad para los mayores de edad

```sql
UPDATE alumnes
SET edat = edat + 1
WHERE edat >= 18;
```

Todas las personas mayores de edad tendrán 1 año más.

### Posibles errores habituales

- Omitir `WHERE` y modificar todas las filas
- Asignar valores incompatibles con el tipo de dato (p. ej.: texto a una columna numérica)
- Violar restricciones como `CHECK` o `FOREIGN KEY`

### Buen uso en entornos transaccionales

Si estás trabajando en un entorno que soporta transacciones (como Oracle), puedes utilizar:

- `COMMIT`: para hacer permanentes los cambios
- `ROLLBACK`: para deshacer los cambios si has cometido un error

```sql
BEGIN;
UPDATE alumnes SET edat = 30 WHERE id = 999; -- ¡Ups!
ROLLBACK; -- Deshacemos el cambio
```

### Buenas prácticas

- Comprueba previamente con un `SELECT`
- Aplica el `WHERE` siempre que no quieras modificarlo todo
- Haz una copia de seguridad o trabaja dentro de una transacción si tienes dudas
- Usa alias si trabajas con subconsultas o joins

## 🗑️ Borrar filas de una tabla: orden `DELETE`

### 📘 ¿Qué hace la orden `DELETE`?

La orden `DELETE` sirve para eliminar **una o más filas** de una tabla según un criterio determinado. Cuando se ejecuta, las filas desaparecen permanentemente (si no hay transacciones o backups).

### 🔍 Sintaxis básica

```sql
DELETE FROM nom_taula
WHERE condición;
```

#### 🧱 Ejemplo: eliminar los alumnos menores de 18 años

```sql
DELETE FROM alumnes
WHERE edat < 18;
```

### ⚠️ Muy importante: NO olvides el `WHERE`

Si no incluyes ninguna condición, **se eliminarán todas las filas** de la tabla.

```sql
-- ⚠️ ¡Elimina todas las filas!
DELETE FROM alumnes;

TRUNCATE TABLE alumnes;
// Es equivalente y más eficiente si lo que queremos es borrar todas las filas
/// La tabla quedará vacía, pero la estructura sigue existiendo en la BBDD
```

### Comparación con `TRUNCATE`

|  | `DELETE` | `TRUNCATE` |
| --- | --- | --- |
| Condiciones | Permite `WHERE` | No permite condiciones (se borra todo) |
| Recuperación | Se puede hacer `ROLLBACK` si está dentro de una transacción | No se puede recuperar |
| Velocidad | Más lenta (registro a registro) | Muy rápida (reconstruye la tabla) |

**Recomendación:** antes de un DELETE, comprueba las filas afectadas con un `SELECT`:

```sql
SELECT * FROM alumnes WHERE edat < 18;
DELETE FROM alumnes WHERE edat < 18;
```

### Control de seguridad con claves ajenas

\*\* Para entender mejor este caso puede ser conveniente mirar primero el apartado de «Normalización»

Si una fila está relacionada con otra tabla mediante una `FOREIGN KEY`, puede que el DELETE **no se permita** (error de restricción), a menos que esté configurada la opción `ON DELETE CASCADE`.

#### Ejemplo con relación:

```sql
-- alumnes tiene una clave ajena hacia cursos
DELETE FROM cursos WHERE id = 1;  -- error si hay alumnos vinculados
```

Con `ON DELETE CASCADE`, también se eliminarían automáticamente los alumnos del curso 1.

### Buenas prácticas

- Haz un `SELECT` antes de borrar
- Trabaja con `COMMIT` y `ROLLBACK` por seguridad
- Asegúrate de que no rompes relaciones entre tablas
- ⚠️⚠️⚠️ Nunca hagas `DELETE` sin `WHERE` si no tienes claro lo que haces

## ⚙️ Operadores lógicos y tratamiento de NULL

### Operadores lógicos

Permiten combinar condiciones:

- `AND` → todas las condiciones deben ser ciertas
- `OR` → al menos una condición debe ser cierta
- `NOT` → invierte una condición

```sql
SELECT * FROM alumnes
WHERE edat > 18 AND id_curs = 1;

SELECT * FROM alumnes
WHERE edat < 18 OR id_curs = 2;

   ¿qué hace cada select?
```

### 🔍 Atención a los paréntesis

Cuando hay múltiples condiciones, **el orden de prioridad importa**. Usa paréntesis para controlarlo:

```sql
SELECT * FROM alumnes
WHERE (edat > 18 AND id_curs = 1) OR (nom LIKE 'M%');
```

Esta consulta devuelve los alumnos que: <br> ➡️ tengan más de 18 años y estén en el curso 1, <br> **o bien** cuyo nombre empiece por M.

### Trabajar con `NULL`

Los campos `NULL` representan valores desconocidos o ausentes. No se pueden comparar directamente con `=` o `<>`.

- `IS NULL` → comprueba si un valor es nulo
- `IS NOT NULL` → comprueba si tiene valor

```sql
SELECT * FROM alumnes WHERE nota IS NULL;
SELECT * FROM alumnes WHERE nota IS NOT NULL;
```

**Importante:** `nota = NULL` no funcionará; nunca se evalúa como verdadero.

**Recuerda:** `NULL` no es 0 (cero), `NULL` no es "" (cadena vacía)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
