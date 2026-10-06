---
layout: doc
title: "PL/SQL: procedimientos y funciones"
sidebar: true
outline: [2, 3]
aside: true
---

# PL/SQL: procedimientos y funciones

## ⚙️ Procedimientos, funciones y triggers

### Definiciones rápidas

- **Procedimiento:** bloque PL/SQL que realiza una acción; puede tener parámetros, pero no devuelve un valor directamente.
- **Función:** como un procedimiento, pero **devuelve un valor** mediante `RETURN`.
- **Trigger:** bloque de código que se ejecuta automáticamente **cuando se produce un evento** sobre una tabla (INSERT, UPDATE, DELETE).

---

### Permisos necesarios

❗ Un usuario necesita tener permiso para ejecutar rutinas, o para crearlas y ejecutarlas.

```sql
GRANT CREATE PROCEDURE, CREATE TRIGGER TO <usu>;
        -- (si tiene permiso de crear, también puede ejecutar)
GRANT EXECUTE ON <esquema>.<procedim> TO <usu>/<rol> [WITH GRANT OPTION];
```

El permiso **CREATE PROCEDURE** vale para procedimientos y también para funciones

El permiso **CREATE TRIGGER** vale para disparadores

### Vista del DD

Para ver si un usuario tiene estos permisos

```sql
SELECT *
FROM DBA_SYS_PRIVS
WHERE privilege IN ('CREATE PROCEDURE', 'CREATE TRIGGER');
```

---

### PROCEDURE – Procedimiento

Los procedimientos **NO devuelven valor** y NO se pueden llamar dentro de un SELECT ni de expresiones. Se pueden llamar desde dentro de un bloque anónimo, directamente desde la línea de órdenes de sqlplus o SQL Developer, desde dentro de otro procedimiento o función, o desde **DBMS_SCHEDULER** con un **job**

#### Ejemplos

```sql
BEGIN
  DBMS_OUTPUT.PUT_LINE('Suspenso')
  afegir_client('Maria', 'Gonzalez', '123456789');
  actualitzar_sou(101, 3000);
END;
```

---

### FUNCTION – Función

#### Diferencia clave:

Las funciones **devuelven un valor** y se pueden llamar desde dentro de un SELECT o de expresiones.

#### Ejemplos

```sql
BEGIN
  data_actual := SYSDATE;
  valor_aleatori := DBMS_RANDOM.VALUE(1, 100);
  data_convertida := TO_DATE('2025-04-20', 'YYYY-MM-DD');

  SELECT upper(nom) , sysdate, sou FROM empleats;
  SELECT CONCAT(nom, ' ', cognom) FROM clients;
  SELECT sysdate FROM dual;
END;
```

---

### TRIGGER – Disparador

#### Diferencia clave:

Los triggers **no devuelven un valor y no se les puede llamar**. Son bloques de código con nombre que el sistema llama automáticamente cuando ocurre algún evento.

- Evento DML: INSERT, UPDATE, DELETE
- Evento DDL: CREATE, ALTER, DROP...
- Eventos de base de datos: LOGON, LOGOFF, STARTUP, SHUTDOWN, etc.

#### Ejemplos

```sql
-- Al insertar un nuevo empleado se disparará el trigger asociado
-- al INSERT en la tabla EMPLEATS
INSERT INTO empleats (id_empleat, nom, cognom, sou)
VALUES (101, 'Joan', 'García', 2500);
-- En este momento, el sistema llama al trigger
```

## ⚙️ Procedimientos en PL/SQL

### ¿Qué es un procedimiento?

Un **procedimiento** es un bloque de código PL/SQL **almacenado con un nombre** que se puede llamar para ejecutar una acción. Puede recibir parámetros y utilizar sentencias SQL, estructuras de control, bucles, excepciones, etc.

### Estructura básica

```sql
CREATE [OR REPLACE] PROCEDURE nom_proc (
    param1 [IN | OUT | IN OUT] tipus,
    ...
) IS
BEGIN
   -- Código del procedimiento
END nom_proc;
```

#### Tipos de parámetros:

- `IN`: entrada (por defecto)
- `OUT`: salida
- `IN OUT`: entrada y salida

Solo veremos los IN, para los que, además, no hace falta poner la palabra IN porque es el tipo por defecto

### 🧪 Ejemplo sencillo

```sql
CREATE OR REPLACE PROCEDURE saluda (nom VARCHAR2) IS
BEGIN
   DBMS_OUTPUT.PUT_LINE('Hola, ' || nom || '!');
END;
```

**Ejecución:**

```sql
BEGIN
   saluda('Joan');
END;
```

O también con `execute`

```sql
execute mostrar_salutacio('Ada');
```

### 📘 Consultar procedimientos

- Listar los procedimientos del usuario:

```sql
SELECT object_name FROM user_objects WHERE object_type = 'PROCEDURE';
```

👀 Consultar los parámetros de un procedimiento:

```sql
SELECT argument_name, in_out, data_type
FROM user_arguments
WHERE object_name = 'CALCULA_DOBLE';
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

### Ejemplo completo con control de errores

```sql
CREATE OR REPLACE PROCEDURE insereix_alumne (
   nom IN VARCHAR2,
   edat IN NUMBER
) IS
BEGIN
   INSERT INTO alumnes(nom, edat) VALUES (nom, edat);
   DBMS_OUTPUT.PUT_LINE('Alumno insertado correctamente.');
EXCEPTION
   WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
```

## Formas de llamar / invocar un procedimiento

- Notación posicional
- Notación nominal

```txt
afegir_client('Joan', 'García', '123456789');
afegir_client( p_nom => 'Joan', p_cognom => 'García', p_telefon => '123456789');
o
afegir_client(p_telefon => '123456789', p_nom => 'Joan', p_cognom => 'García');
```

Todas son correctas

## Funciones en PL/SQL

### 📘 ¿Qué es una función?

Una **función** es un bloque de código PL/SQL que **recibe cero o más parámetros** y **devuelve un valor**. A diferencia de los procedimientos, las funciones se pueden llamar dentro de sentencias SQL y expresiones.

Igual que ocurre con los procedimientos, existen funciones predefinidas que podemos utilizar en Oracle

| Tipos de funciones | Funciones |
| --- | --- |
| **Funciones numéricas** | ROUND, TRUNC, MOD, SQRT, POWER, SIGN, ABS |
| **Funciones de cadenas (strings)** | LOWER, UPPER, TRIM, SUBSTR, LENGTH, REPLACE, INSTR, TRANSLATE, CHR, ASCII |
| **Funciones para trabajar con NULL** | NVL, NVL2, NULLIF, COALESCE |
| **Funciones de fechas** | SYSDATE, LAST_DAY, EXTRACT, ADD_MONTHS |
| **Funciones de conversión** | TO_NUMBER, TO_DATE, TO_CHAR |

Y, al igual que con los procedimientos, podemos definir nuevas funciones (funciones definidas por el usuario)

Debemos tener en cuenta que una función necesita **saber** qué tipo de dato va a devolver y, además, en algún punto del cuerpo de la función debe **devolver** un dato de ese tipo

### Estructura básica

```sql
CREATE [OR REPLACE] FUNCTION nom_func (  parámetros  )
RETURN tipus
IS
BEGIN
    -- código
    RETURN valor;
END nom_func;
```

### Ejemplo simple

```sql
CREATE OR REPLACE FUNCTION suma ( a NUMBER, b  NUMBER )
RETURN NUMBER
IS
BEGIN
   RETURN a + b;
END;
```

#### Ejemplo: llamada dentro de un bloque

```sql
DECLARE
   resultat NUMBER;
BEGIN
   resultat := suma(4, 5);
   DBMS_OUTPUT.PUT_LINE('Resultado: ' || resultat);
END;
```

#### Ejemplo: llamada dentro de un SELECT

```sql
SELECT suma(10, 20) FROM dual;
```

### Ejemplo real: calcular el salario con plus

```sql
CREATE OR REPLACE FUNCTION salari_total ( base NUMBER, plus NUMBER DEFAULT 0 )
RETURN NUMBER
IS
BEGIN
   RETURN base + plus;
END;
```

Llamada:

```sql
SELECT salari_total(1500, 200) FROM dual;
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
SELECT object_name FROM user_objects WHERE object_type = 'FUNCTION';

-- Argumentos de una función
SELECT argument_name, data_type, in_out
FROM user_arguments
WHERE object_name = 'SUMA';
```

### 🧪 Ejemplo con condición

```sql
CREATE OR REPLACE FUNCTION es_parell (n IN NUMBER)
RETURN VARCHAR2 IS
BEGIN
   IF MOD(n, 2) = 0 THEN
      RETURN 'Sí';
   ELSE
      RETURN 'No';
   END IF;
END;
```

Llamada:

```sql
SELECT es_parell(8) FROM dual;
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

### 🧪 Práctica combinada

Calcular el IRPF aplicado a un salario y devolverlo:

```sql
CREATE OR REPLACE FUNCTION calcula_irpf (
   salari IN NUMBER
) RETURN NUMBER IS
BEGIN
   RETURN salari * 0.15;
END;
```

Esta función se puede llamar dentro de un SELECT para ver cuántos impuestos se retienen:

```sql
SELECT nom, calcula_irpf(salari) AS irpf
FROM empleats;
```

### 📘 Consultas útiles al DD

```sql
-- Ver los procedimientos y funciones del usuario
SELECT object_name, object_type
FROM user_objects
WHERE object_type IN ('PROCEDURE', 'FUNCTION');
```

### 🧹 Borrar una función

```sql
DROP FUNCTION nom_de_la_funcio;
```

⚠️ Consideraciones:

- Asegúrate de que no hay ningún procedimiento, vista u otro objeto que dependa de esa función antes de eliminarla.
- Si la función no existe, Oracle dará un error

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
