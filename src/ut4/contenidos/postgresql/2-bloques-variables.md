---
layout: doc
title: "PL/pgSQL: bloques DO, variables y operaciones"
sidebar: true
outline: [2, 3]
aside: true
---

# PL/pgSQL: bloques DO, variables y operaciones

## 🧾 Bloque DO en PL/pgSQL

### ¿Qué es un bloque DO?

Un **bloque DO** es una unidad de código en PL/pgSQL que:

- No tiene nombre ni se guarda en la base de datos.
- Se ejecuta directamente desde la pestaña de trabajo. Se puede guardar en un fichero externo y recuperarlo después.
- Es ideal para pruebas o para ejecutar operaciones puntuales.
- Puede incluir sentencias SQL, declaraciones de variables, control de flujo y gestión de excepciones.

---

#### En psql se puede:

- Editar el contenido del buffer con `\e`

- Ver el contenido del buffer con `\p`

- Ejecutar el contenido de un fichero con `\i`

- Guardar el contenido del buffer en un archivo (pon nombre + .sql)

  - postgres=# \w nom_fitxer.sql

- Cargar el contenido de un fichero en el buffer (pero **NO** lo ejecuta)

  - postgres=# \e nom_fitxer.sql

- Ejecutar el contenido de un fichero

  - postgres=# \i nom_fitxer.sql

#### En pgAdmin

![Acceso a Query Tool Workspace en pgAdmin #center](/img/contenidos/ut4/QueryToolWorkspace.png)

Desde Query Tool Workspace. Se trabaja con worksheets (pestaña abierta). Cada pestaña es una conexión

Para ejecutar una línea del worksheet, pulsa Alt+F5

Para ejecutar TODAS las líneas (SCRIPT), pulsa F5

Para guardar el contenido del worksheet, usa el icono de guardar, Ctrl+S (Save) o Save As…

Para recuperar el texto guardado en un fichero: Open o Ctrl+O

Otra forma de abrir un Query Tool Workspace es desde el menú (estando situado en una BBDD concreta): Tools → Query Tool, o pulsando Alt+Mayús+Q

---

### Estructura básica de un bloque DO

```sql
DO $$
BEGIN
    RAISE NOTICE 'Hola mundo';
END;
$$ LANGUAGE plpgsql;
```

Este bloque DO se debe ejecutar con F5 (script); en otro caso, al ejecutar como sentencia, dará un error: 'ERROR: unterminated dollar-quoted string at or near "$$' porque solo llega hasta el primer ";"

Ejemplo

```sql
DO $$
declare
 i int;
BEGIN
    i := 445;
    RAISE NOTICE 'Hola mundo';
    RAISE NOTICE 'valor de i %', i;
    RAISE NOTICE 'valor de i*i %', i*i ;
    RAISE NOTICE 'hoy es   %', current_date;
END;
$$ LANGUAGE plpgsql;
```

**PL/pgSQL no distingue entre mayúsculas y minúsculas en los nombres de variables, funciones e identificadores (salvo que se escriban entre comillas dobles); los valores de las cadenas sí distinguen.**

```sql
DO $$
DECLARE
    x_valor int := 10;
    "X_VALOR" int := 20;    -- entre comillas dobles es un identificador distinto
BEGIN
    -- X_Valor (sin comillas) es la misma variable que x_valor
    RAISE NOTICE 'x_valor = %, X_VALOR = %', X_Valor, "X_VALOR";
END;
$$ LANGUAGE plpgsql;
```

## 🗃️ Comentarios, variables y operaciones en PL/pgSQL

## Comentarios

El uso de comentarios es un recurso para poder documentar el código. Como se ha dicho antes, es muy importante documentar el código

```txt
--  Con dos guiones se pone un comentario de una línea.
/*  Con la barra y el asterisco se pueden
    poner comentarios de más de una línea
*/
```

## Variables

Una **variable** en PL/pgSQL es un espacio de memoria para almacenar datos temporales durante la ejecución de un bloque de código. Puede contener textos, números, fechas, etc.

En PL/pgSQL, las variables se deben declarar **siempre** antes de utilizarlas. Las variables se declaran en la sección DECLARE (o en la parte de declaración de un procedimiento o función).

Para «crear» una variable es necesario: <br> un nombre <br> un tipo <br> un valor (opcional)

Para «usar» una variable, solo es necesario saber el **nombre**

### Estructura básica

```sql
DO $$
DECLARE
    nom_variable tipus ;        -- Se declara pero no se inicializa. Toma el valor NULL
    nom_variable tipus := valor_inicial;  -- Se declara y se inicializa con un valor
BEGIN
    -- uso de la variable
END;
$$ LANGUAGE plpgsql;
```

```txt
-- Tipos de datos en PL/pgSQL
int         (entero)
text        (string sin límite)
varchar(n)  (string con límite)
numeric(p,s)  (decimales con límite)
numeric       (permite cualquier número de decimales; más flexible)
boolean
DATE         (año, mes, día)
TIMESTAMP    (año, mes, día, hora, min, seg, fracción de segundo)
RECORD
ROW
int[]         (ARRAY de ints)
Tipos compuestos personalizados (TYPE)
```

#### Tipos básicos

| Tipo | Descripción | Ejemplo |
| --- | --- | --- |
| `text`, `varchar(n)` | Cadena de texto de longitud variable | 'Hola', 'Joan' |
| `int`, `decimal`, `bigint` | Números con precisión y escala | 123, 45.67 |
| `DATE`, `timestamp` | Fecha y hora | now <br> current_date |
| `BOOLEAN` | TRUE, FALSE, NULL | TRUE |
| `%TYPE` | Tipo igual al de una columna o al de otra variable | taula.columna%TYPE |

#### 🧪 Ejemplo de declaración

```sql
DECLARE
    v_nom       text := 'Anna';
    v_edat      int := 30;
    v_sou       numeric 8.27;
    v_data_naix DATE := now();
    v_es_actiu  BOOLEAN := TRUE;
BEGIN

END;
```

## 🛠️ Cómo asignar valores

### En el bloque DECLARE

```txt
v_nom       text := 'Anna';
```

### En el bloque principal BEGIN

- **Asignación directa:** `v_edat := 25;`

- **Con SELECT INTO:**

  ```sql
  SELECT sou INTO v_sou FROM empleats WHERE id = 5;
              o
  SELECT avg(sou) INTO v_mitjanasou FROM empleats WHERE departament=101;
  ```

#### ❗ Detalles importantes

- Las variables solo existen dentro del bloque donde se declaran.
- No puedes hacer `SELECT ...` sin `INTO` dentro de PL/pgSQL.
- `BOOLEAN` se puede usar tanto en PL/pgSQL como en SQL.

## Operaciones

### Operaciones con variables en PL/pgSQL

Una vez declaradas, las variables en PL/pgSQL se pueden utilizar para hacer cálculos, tratamiento de texto, fechas y lógica condicional. Aquí tienes ejemplos claros y útiles:

### 📐 1. Operaciones aritméticas

Para hacer sumas, restas, multiplicaciones, divisiones y potencias con variables de tipo `NUMBER`:

```sql
DECLARE
    a int := 10;
    b int := 3;
    resultat1 int;
BEGIN
    resultat1 := a + b;
    raise notice ' %' ,resultat1 ;
    resultat1 := a - b;
    raise notice ' %' ,resultat1 ;
    resultat1 := a * b;
    raise notice ' %' ,resultat1 ;
    resultat1 := a / b;
    raise notice ' %' ,resultat1 ;
    resultat1 := a % b;
    raise notice ' %' ,resultat1 ;
END;
```

**Precedencia**: no hay que olvidar que no es lo mismo 2 + 5 \* 3 que (2 + 5) \* 3. La precedencia u orden de las operaciones es crucial en el resultado

En PL/pgSQL este orden de precedencia es el siguiente:

| ( ) | unarios | \*\* potencia | \* , /, mod | + y - | comparación | lógicos (NOT AND OR) |
| --- | --- | --- | --- | --- | --- | --- |

Y los operadores lógicos tienen precedencia entre ellos: NOT tiene más precedencia que AND, y AND más que OR.

Aunque conozcas la precedencia, usa paréntesis para que el código sea más claro, menos propenso a errores y más legible para otros desarrolladores

Otras operaciones aritméticas con funciones: ABS, ROUND, MOD, CEIL, CEILING, FLOOR, POWER, SQRT, TO_CHAR

---

### 🔤 2. Operaciones con cadenas de texto

Las cadenas (`VARCHAR`) se concatenan con `||`

```sql
DECLARE
    nom VARCHAR(20) := 'Joan';
    cognom VARCHAR(20) := 'Garcia';
    nom_complet VARCHAR(50);
BEGIN
    nom_complet := nom || ' ' || cognom;
    raise notice  'Nombre completo: %', nom_complet ;
END;
```

Otras operaciones con funciones: LENGTH, UPPER, LOWER, INITCAP, SUBSTRING, POSITION, REPLACE, TRIM, LTRIM, RTRIM, TO_NUMBER

---

### 📅 3. Operaciones con fechas

Las fechas se pueden restar para obtener la diferencia (resultado en días, y horas/minutos)

También se pueden sumar «intervalos»

```sql
DO $$
DECLARE
  d1 date ;
    d2 date;
    resultat1 int;
BEGIN
  d1 := now();
    d2 := date '2026-01-01';
  resultat1 := d1 - d2 + 8;
  raise notice ' %' ,resultat1 ;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Ejemplos de operaciones con fechas
SELECT CURRENT_DATE + 7 AS setmana_propera;
SELECT date '2026-03-22' - date '2026-03-20' AS dies_diff;
SELECT CURRENT_DATE + interval '1 month' AS mes_proper;
SELECT CURRENT_DATE - interval '2 weeks' AS fa_dos_setmanes;
```

```sql
--Comparaciones
SELECT '2026-03-22'::date > '2026-03-20'::date;  -- true
SELECT NOW() BETWEEN '2026-03-22 00:00' AND '2026-03-22 23:59';
```

Igual que TO_DATE, existe TO_CHAR, con la posibilidad de usar una máscara ('DD/MM/YY HH:MI PM')

::: tip Nota
✔️ El tipo "DATE" puede almacenar hasta el día (año, mes, día). <br> Si se necesita más precisión, se puede utilizar el tipo "TIMESTAMP", que puede almacenar hasta la millonésima de segundo (ejemplo de un valor de tipo TIMESTAMP: 2026-03-22 15:57:59.811083)
:::

::: warning Atención
Hay que tener cuidado en las operaciones con fechas, porque no todos los meses tienen el mismo número de días, ni todos los años tampoco.
:::

---

### 4. Operaciones lógicas

Con variables `BOOLEAN` puedes hacer condiciones:

```txt
AND OR NOT
```

Se pueden utilizar variables `BOOLEAN` o hacer comparaciones entre números, textos o fechas con los operadores siguientes:

- `=` igualdad
- `<>` distinto
- `>`, `<`, `>=`, `<=`
- `AND`, `OR`, `NOT`

---

### Mayúsculas y minúsculas

En PL/pgSQL, 'admin' no es igual que 'ADMIN'. <br> También se pueden comparar con &lt; o &gt;, de manera que las cadenas se comparan carácter a carácter, según el orden lexicográfico (parecido al orden del diccionario).

```txt
'Ana' < 'Berta'     -- TRUE
'abc' < 'abd'       -- TRUE
'Z' < 'a'           -- TRUE (porque el código ASCII de Z es menor)
```

Las cadenas de texto también se pueden comparar con `LIKE`, usando '%' → (cualquier secuencia de caracteres) o '_' → (un carácter)

También con `ILIKE`

```txt
IF nom LIKE 'Mar%' THEN
```

::: tip Nota
✨ Puedes probar estos bloques en pgAdmin, en el Query Tool Workspace.
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
