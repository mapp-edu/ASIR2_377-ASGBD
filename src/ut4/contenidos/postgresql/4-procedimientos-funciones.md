---
layout: doc
title: "PL/pgSQL: procedimientos y funciones"
sidebar: true
outline: [2, 3]
aside: true
---

# PL/pgSQL: procedimientos y funciones

## ⚙️ Procedimientos, funciones y triggers

### Definiciones rápidas

- **Procedimiento:** bloque PL/pgSQL que realiza una acción; puede tener parámetros, pero no devuelve un valor directamente.
- **Función:** como un procedimiento, pero **devuelve un valor** mediante `RETURN`.
- **Trigger:** bloque de código que se ejecuta automáticamente **cuando se produce un evento** sobre una tabla (INSERT, UPDATE, DELETE).

---

### Permisos necesarios

❗ Un usuario necesita tener permiso para ejecutar rutinas, o para crearlas y ejecutarlas.

```sql
-- Si solo necesita ejecutar
GRANT EXECUTE ON PROCEDURE nom_proc TO <usuari>/<rol> [WITH GRANT OPTION];
```

```sql
-- Para poder crear (y ejecutar las suyas)
GRANT CREATE ON SCHEMA public to usuari [WITH GRANT OPTION];
```

### Vista del DD

Para ver si un usuario tiene estos permisos

```sql
SELECT nspname
FROM pg_namespace
WHERE has_schema_privilege(current_user, oid, 'CREATE')   -- Sustituir current_user por 'nomusuari'
  AND nspname NOT LIKE 'pg_%'
  AND nspname <> 'information_schema';
```

---

### PROCEDURE – Procedimiento

Los procedimientos **NO devuelven valor** y NO se pueden llamar dentro de un SELECT ni de expresiones. Se pueden llamar desde dentro de un bloque DO, directamente desde la línea de órdenes de psql o pgAdmin, desde dentro de otro procedimiento o función, o desde un planificador como **pg_cron** con un **job**

#### Ejemplos

```sql
BEGIN
      call nom_proc();
END;
```

---

### FUNCTION – Función

#### Diferencia clave:

Las funciones **devuelven un valor** y se pueden llamar desde dentro de un SELECT o de expresiones.

#### Ejemplos

```sql
DO $$
DECLARE
  data_actual TIMESTAMP;
  valor_aleatori NUMERIC;
  data_convertida DATE;
BEGIN
  data_actual := NOW();
  valor_aleatori := RANDOM() * 99 + 1; -- equivalente a DBMS_RANDOM.VALUE(1,100) de Oracle
  data_convertida := TO_DATE('2025-04-20', 'YYYY-MM-DD');
  RAISE NOTICE '%', (SELECT UPPER(nom) FROM empleats LIMIT 1);
  RAISE NOTICE '%', (SELECT NOW());
  RAISE NOTICE '%', (SELECT sou FROM empleats LIMIT 1);
  RAISE NOTICE '%', NOW();
  RAISE NOTICE '%', data_convertida;
END;
$$ LANGUAGE plpgsql;
```

---

### TRIGGER – Disparador

#### Diferencia clave:

Los triggers **no devuelven un valor y no se les puede llamar**. Son bloques de código con nombre que el sistema llama automáticamente cuando ocurre algún evento.

- Evento DML: INSERT, UPDATE, DELETE
- Evento DDL: CREATE, ALTER, DROP

#### Ejemplos

```sql
-- Al insertar un nuevo empleado se disparará el trigger asociado
-- al INSERT en la tabla EMPLEATS
INSERT INTO empleats (id_empleat, nom, cognom, sou)
VALUES (101, 'Joan', 'García', 2500);
-- En este momento, el sistema llama al trigger
```

## ⚙️ Procedimientos en PL/pgSQL

### ¿Qué es un procedimiento?

Un **procedimiento** es un bloque de código PL/pgSQL **almacenado con un nombre** que se puede llamar para ejecutar una acción. Puede recibir parámetros y utilizar sentencias SQL, estructuras de control, bucles, excepciones, etc.

### Estructura básica

```sql
CREATE OR REPLACE PROCEDURE saludar()
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE NOTICE 'Hola!';
END;
$$;
```

```txt
Nota importante (seguridad) - 👉 Un procedimiento puede ejecutarse con:
- SECURITY INVOKER (por defecto) → permisos de quien lo ejecuta
- SECURITY DEFINER → permisos del propietario
```

#### Procedimiento con parámetros

```sql
-- Definir el procedimiento
CREATE PROCEDURE suma(a int, b int)
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE NOTICE 'Suma: %', a + b;
END;
$$;

-- Llamar al procedimiento
CALL suma(3, 4);
```

#### Tipos de parámetros:

- `IN`: entrada (por defecto)
- `OUT`: salida
- `INOUT`: entrada y salida

Solo veremos los IN, para los que, además, no hace falta poner la palabra IN porque es el tipo por defecto

```sql
CREATE PROCEDURE obtenir_doble(IN x int, OUT resultat int)
```

#### Valores por defecto

```sql
CREATE PROCEDURE saludar(nom text DEFAULT 'Usuario')
```

### 📘 Consultar procedimientos

- Listar los procedimientos del usuario:

```sql
SELECT routine_name, routine_schema, routine_type
FROM information_schema.routines
WHERE routine_type = 'PROCEDURE';
```

👀 Consultar los parámetros de un procedimiento:

```sql
SELECT pg_get_functiondef(p.oid)
FROM pg_proc p
WHERE p.proname = 'nom_procediment';
```

```sql
-- Desde psql
\df
\dfP
\df+ nom_proc
```

### 🧹 Borrar un procedimiento

```sql
DROP PROCEDURE nom_proc;
```

### Buenas prácticas

- Da nombres claros y significativos
- Documenta el comportamiento y los parámetros
- Gestiona las excepciones con `EXCEPTION` para capturar errores
- ⚠️ Evita hacer demasiadas cosas dentro de un solo procedimiento → separa funcionalidades

## Formas de llamar / invocar un procedimiento

- Notación posicional
- Notación nominal

```sql
call afegir_client('Joan', 'García', '123456789');
call afegir_client( p_nom => 'Joan', p_cognom => 'García', p_telefon => '123456789');
o
call afegir_client(p_telefon => '123456789', p_nom => 'Joan', p_cognom => 'García');
```

Todas son correctas

## Funciones en PL/pgSQL

### 📘 ¿Qué es una función?

Una **función** es un bloque de código PL/pgSQL que **recibe cero o más parámetros** y **devuelve un valor**. A diferencia de los procedimientos, las funciones se pueden llamar dentro de sentencias SQL y expresiones.

```sql
Ejemplo:
SELECT nom, UPPER(nom) FROM alumnes;
SELECT * FROM alumnes WHERE LENGTH(nom) > 5;
```

Igual que ocurre con los procedimientos, existen funciones predefinidas que podemos utilizar en PostgreSQL

| Tipos de funciones | Funciones |
| --- | --- |
| **Funciones numéricas** | ROUND, TRUNC, MOD, SQRT, POWER, SIGN, ABS, CEIL, FLOOR, RANDOM |
| **Funciones de cadenas (strings)** | LOWER, UPPER, TRIM, SUBSTRING, LENGTH, REPLACE, POSITION, TRANSLATE, CHR, ASCII, INITCAP |
| **Funciones para trabajar con NULL** | NULLIF, COALESCE |
| **Funciones de fechas** | CURRENT_DATE, NOW(), EXTRACT , CURRENT_TIMESTAMP, AGE |
| **Funciones de conversión** | TO_NUMBER, TO_DATE, TO_CHAR |
| **Funciones de sistema** | VERSION(), CURRENT_USER, PG_DATABASE_SIZE(), PG_TABLE_SIZE() |

Y, al igual que con los procedimientos, podemos definir nuevas funciones (funciones definidas por el usuario)

Debemos tener en cuenta que una función necesita **saber** qué tipo de dato va a devolver y, además, en algún punto del cuerpo de la función debe **devolver** un dato de ese tipo

### Estructura básica

```sql
CREATE [OR REPLACE] FUNCTION nom_func (  parámetros  )
RETURNS tipus AS $$
BEGIN
    -- código
    RETURN valor;
END;
$$ LANGUAGE plpgsql;
```

### Ejemplo simple

```sql
CREATE OR REPLACE FUNCTION suma(a integer, b integer)
RETURNS integer AS $$
BEGIN
    RETURN a + b;
END;
$$ LANGUAGE plpgsql;
```

```sql
CREATE FUNCTION doble(x INT)
RETURNS INT AS $$
BEGIN
  RETURN x * 2;
END;
$$ LANGUAGE plpgsql;
```

#### Ejemplo: llamada desde una sentencia SQL

```sql
SELECT doble(4);
```

### Tipos de parámetros

- `IN`: entrada (por defecto)
- `OUT` e `IN OUT` no se pueden usar en funciones que se llamen dentro de SQL

### ⚠️ Limitaciones

- Las funciones que se llaman desde SQL **no pueden modificar datos** (no pueden hacer INSERT, UPDATE o DELETE)
- Deben ser deterministas: el resultado debe depender solo de los valores de entrada

### 📥 Consulta de funciones

```sql
-- Funciones del usuario
SELECT proname
FROM pg_proc
WHERE pronamespace NOT IN (
  SELECT oid FROM pg_namespace
  WHERE nspname LIKE 'pg_%' OR nspname = 'information_schema'
);

-- Con más información
SELECT n.nspname AS esquema,
       p.proname AS funcio,
       pg_get_function_result(p.oid) AS retorna,
       pg_get_function_arguments(p.oid) AS arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname NOT LIKE 'pg_%'
  AND n.nspname <> 'information_schema';
```

### Cómo llamar a las funciones:

- ✔️ Dentro de `SELECT`, `WHERE`, `ORDER BY`
- ✔️ Asignándolas a una variable dentro de un bloque
- ❌ No se pueden usar dentro de DML (si tienen código que modifica datos)

### Buenas prácticas

- Utiliza nombres claros y descriptivos
- Usa `RETURN` una sola vez si es posible
- Documenta qué hace la función y qué devuelve
- ⚠️ Evita hacer INSERT/UPDATE dentro de funciones si se van a llamar desde SQL

### 🧹 Borrar una función

```sql
DROP FUNCTION nom_de_la_funcio;
```

⚠️ Consideraciones:

- Asegúrate de que no hay ningún procedimiento, vista u otro objeto que dependa de esa función antes de eliminarla.
- Si la función no existe, PostgreSQL dará un error

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
