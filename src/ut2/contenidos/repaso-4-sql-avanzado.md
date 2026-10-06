---
layout: doc
title: "Repaso de SQL: normalización, permisos, transacciones y JOIN"
sidebar: true
outline: [2, 3]
aside: true
---

# Repaso de SQL: normalización, permisos, transacciones y JOIN

## Normalización

```txt
Ejemplo
Poner en la tabla alumnes el curso con VARCHAR2.
* Analizar posibles problemas
* 1 CURS, 1 curs, 1er curs, ...
Hay que normalizar.
```

Por ejemplo, en la siguiente tabla

| ID | Nom | Edat | Curs |
| --- | --- | --- | --- |
| 1 | Julia | 19 | 2n ASIX |
| 2 | Marc | 18 | 2 ASIX |
| 3 | Laia | 16 | 2on ASIX |
| 4 | Pau | 15 | 2n ASIR |

Todos los alumnos están en el mismo curso, pero el nombre del curso es diferente en cada una de las filas

Si se hace una consulta filtrando por el curso

```sql
SELECT * FROM ALUMNES WHERE curs='2n ASIX'
```

¡¡Solo saldrá **un** alumno!!

![Relación N:1 entre las tablas Alumnes y Cursos #center](/img/contenidos/ut2/normalitzacio1.png)

### HAY QUE NORMALIZAR

| ID-curs | NomCurs |
| --- | --- |
| 10 | 1r ASIX |
| 20 | 2n ASIX |

| ID-alu | Nom | Edat | Curs |
| --- | --- | --- | --- |
| 1 | Julia | 19 | 20 |
| 2 | Marc | 18 | 20 |
| 3 | Laia | 16 | 20 |
| 4 | Pau | 15 | 10 |

## GRANT y REVOKE (DCL)

```sql
Los usuarios pueden tener privilegios para hacer operaciones sobre la base de datos.
Para otorgar privilegios utilizaremos
GRANT
Para revocar (quitar) privilegios otorgados previamente utilizaremos
REVOKE
```

## Funciones de agregación

```sql
AVG , MAX , MIN , COUNT , SUM
Ejemplo
SELECT MAX(edat) FROM alumnes ;
SELECT MAX(edat) FROM alumnes where curs=5;
SELECT count(*) FROM alumnes where curs=1;
```

En el primer caso, visualiza la edad mayor de toda la tabla alumnes

En el segundo caso, visualiza la edad mayor de los alumnos del curs=5

En el tercer caso, visualiza el recuento (cuántos) de los alumnos del curs=1

Se puede obtener más potencia con `GROUP BY` y `HAVING`

## Transacciones (TCL)

Las transacciones en bases de datos (como Oracle) son un conjunto de operaciones que se tratan como una unidad indivisible de trabajo. Es decir, todas las operaciones dentro de una transacción se deben completar con éxito o ninguna de ellas debe tener efecto

Objetivo de una transacción: asegurar la coherencia, la integridad y la fiabilidad de los datos, especialmente en sistemas con múltiples usuarios o procesos simultáneos

Propiedades de una transacción (ACID)

- A – Atomicidad: todo o nada. Si una parte falla, todo se cancela.
- C – Consistencia: después de la transacción, la base de datos debe estar en un estado válido.
- I – Aislamiento (Isolation): las transacciones simultáneas no se ven entre sí hasta que acaban.
- D – Durabilidad: una vez confirmada, la transacción no se pierde, aunque falle el sistema.

```txt
Si una transacción va bien, se hace un COMMIT
Si una transacción NO va bien, se hace un ROLLBACK
¿Cuándo hace Oracle COMMIT automático?
Después de un DDL (como CREATE, ALTER, DROP) y cuando se cierra la sesión
```

## Conclusiones del repaso de SQL

### Refuerzo de conocimientos esenciales

Este repaso ha servido para **consolidar los fundamentos de SQL**, un lenguaje esencial para la gestión y la manipulación de datos en sistemas relacionales. A través del repaso práctico se ha fortalecido la base necesaria para abordar con seguridad tareas de administración, optimización y automatización de bases de datos.

### Conceptos clave trabajados

- Creación y modificación de tablas con `CREATE TABLE` y `ALTER TABLE`
- Inserción, borrado y actualización de datos con `INSERT`, `DELETE` y `UPDATE`
- Consultas con `SELECT`, filtros con `WHERE`, condiciones lógicas y tratamiento de `NULL`
- Uso correcto de tipos de datos, restricciones y clave primaria / clave ajena
- Gestión segura y eficaz de los cambios estructurales, como añadir o eliminar columnas

### Habilidades prácticas adquiridas

El estudiante ha aprendido a construir consultas SQL correctas, identificar errores habituales, aplicar buenas prácticas de diseño de tablas y gestionar los datos con criterio. Este conocimiento es indispensable para trabajar con sistemas como Oracle, MySQL o PostgreSQL en entornos reales.

### Proyección hacia temas más avanzados

Con esta base sólida, el alumnado está preparado para afrontar temas como:

- Gestión de permisos y roles de usuario
- Automatización de procesos con PL/SQL
- Análisis de rendimiento y optimización de consultas
- Diseño de esquemas y relaciones complejas
- Integración con entornos cloud y sistemas distribuidos

### 💬 Reflexión final

Dominar el lenguaje SQL es mucho más que saber escribir consultas: es entender cómo se modela la información, cómo se interactúa con ella y cómo se asegura su integridad y disponibilidad. Este repaso ha sido una oportunidad para revisar, entender y mejorar la competencia técnica y analítica en un ámbito fundamental de las TIC.

## Tipos de JOIN en SQL

![Tipos de JOIN: INNER, LEFT, RIGHT y FULL OUTER #center](/img/contenidos/ut2/joins1.png)

### 1. INNER JOIN (JOIN)

Solo devuelve las filas que tienen coincidencia en ambas tablas.

```sql
SELECT a.nom, b.departament
      FROM empleats a
      JOIN departaments b ON a.dept_id = b.id;
```

### 2. LEFT JOIN (LEFT OUTER JOIN)

Muestra todas las filas de la tabla de la izquierda, con las coincidencias (si las hay) de la tabla de la derecha.

```sql
SELECT a.nom, b.departament
      FROM empleats a
      LEFT JOIN departaments b ON a.dept_id = b.id;
```

### 3. RIGHT JOIN (RIGHT OUTER JOIN)

Muestra todas las filas de la tabla de la derecha, con las coincidencias (si las hay) de la tabla de la izquierda.

```sql
SELECT a.nom, b.departament
FROM empleats a
RIGHT JOIN departaments b ON a.dept_id = b.id;
```

### 4. FULL JOIN (FULL OUTER JOIN)

Combina LEFT y RIGHT JOIN. Devuelve todas las filas de ambas tablas, con NULL si no hay coincidencia.

```sql
SELECT a.nom, b.departament
FROM empleats a
FULL OUTER JOIN departaments b ON a.dept_id = b.id;
```

### 5. CROSS JOIN

Producto cartesiano: combina todas las filas de la primera tabla con todas las de la segunda.

```sql
SELECT a.nom, b.departament
FROM empleats a
CROSS JOIN departaments b;
```

## Diferencia entre `JOIN` y unión con coma en SQL

### 1. JOIN explícito (moderno y claro)

Es la forma recomendada actualmente, con una sintaxis clara y separación entre la lógica de la unión y el resto de condiciones.

```sql
SELECT e.nom, d.nom
  FROM empleats e
  JOIN departaments d ON e.dept_id = d.id;
```

### 2. Uso de la coma (sintaxis antigua)

Es una forma antigua de hacer INNER JOIN. Más propensa a errores, especialmente si olvidas poner condiciones en el `WHERE`.

```sql
SELECT e.nom, d.nom
  FROM empleats e, departaments d
  WHERE e.dept_id = d.id;
```

**Sin condición en el WHERE:**

```sql
SELECT e.nom
  FROM empleats e, departaments d;
  -- ¡Crea un producto cartesiano no deseado!
```

### 3. Comparativa resumida

| Aspecto | JOIN explícito | Coma en el FROM |
| --- | --- | --- |
| Claro y legible | ✅ | ❌ |
| Permite OUTER JOIN | ✅ | ❌ |
| Evita errores | ✅ | ❌ (si olvidas el WHERE) |
| Recomendado | ✅ | ❌ |

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
