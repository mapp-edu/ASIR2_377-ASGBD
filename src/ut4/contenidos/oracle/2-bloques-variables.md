---
layout: doc
title: "PL/SQL: bloques anónimos, variables y operaciones"
sidebar: true
outline: [2, 3]
aside: true
---

# PL/SQL: bloques anónimos, variables y operaciones

## 🧾 Bloque anónimo en PL/SQL

### ¿Qué es un bloque anónimo?

Un **bloque anónimo** es una unidad de código en PL/SQL que:

- No tiene nombre ni se guarda en la base de datos.
- Se ejecuta directamente desde la pestaña de trabajo. Se puede guardar en un fichero externo y recuperarlo después.
- Es ideal para pruebas o para ejecutar operaciones puntuales.
- Puede incluir sentencias SQL, declaraciones de variables, control de flujo y gestión de excepciones.

---

#### En sqlplus se puede:

- Editar el contenido del buffer con `edit`

- Ejecutar el contenido del buffer con `run` o `/`

- Guardar el contenido del buffer en un archivo (pon nombre + .sql)

  - SQL&gt; SAVE nom_fitxer.sql
  - SQL&gt; SAVE nom_fitxer.sql REPLACE

- Cargar el contenido de un fichero en el buffer (pero **NO** lo ejecuta)

∘ SQL&gt; GET nom_fitxer.sql

- Ejecutar el contenido de un fichero

  - SQL&gt; @prova.sql
  - SQL&gt; @/ruta/completa/prova.sql
  - SQL&gt; START prova.sql

#### En SQL Developer

Se trabaja con worksheets (pestaña abierta). Cada pestaña es una conexión

Para ejecutar una línea del worksheet, pulsa Ctrl+Enter

Para ejecutar TODAS las líneas, pulsa F5

Para guardar el contenido del worksheet, ve a File → Save o Save As…

Para recuperar el texto guardado en un fichero, File → Open → prova_bloc.sql

Para ejecutar directamente el contenido de un fichero → @/ruta/prova_bloc.sql y pulsa F5

---

### Estructura básica de un bloque anónimo

Lo primero es activar la salida por pantalla. Esta sentencia se puede ejecutar una vez al principio

```sql
SET SERVEROUTPUT ON;
```

```sql
DECLARE
    vNom VARCHAR2(20) := '&nom';
BEGIN
    DBMS_OUTPUT.PUT_LINE('Hola ' || vNom);
    DBMS_OUTPUT.PUT_LINE('Bienvenido a la programación en PL/SQL');
END;
.  -- ¡Solo en SQL*Plus!
```

⚠️ En **SQL\*Plus** hay que poner un punto (`.`) al final para enviarlo al buffer y después ejecutarlo con `RUN`. En **SQL Developer** se ejecuta con <kbd>F5</kbd> y **no hace falta poner el punto**.

### 💬 Explicación paso a paso

- `DECLARE`: bloque **opcional** para declarar variables.
- `&nom`: variable de sustitución (se mostrará al pedir el valor).
- `BEGIN`: bloque obligatorio para ejecutar código.
- `DBMS_OUTPUT.PUT_LINE`: muestra texto por pantalla (hay que tener activado `SET SERVEROUTPUT ON`).
- `END;` finaliza el bloque.
- `.` (solo en SQL\*Plus) envía el bloque al buffer para ejecutarlo.

**&nom**: una variable de sustitución es una variable que se utiliza principalmente en herramientas como SQL\*Plus, SQL Developer o Toad para permitir que el usuario introduzca un valor en tiempo de ejecución, antes de que se ejecute un bloque PL/SQL o una sentencia SQL. **No es parte del lenguaje PL/SQL como tal**, sino una funcionalidad de estas herramientas para hacer scripts más dinámicos e interactivos.

Se usará **'&NOM'** con comillas para pedir un STRING y **&NOM** sin comillas para pedir un NUMBER

**PUT_LINE** es un procedimiento del paquete **DBMS_OUTPUT** de Oracle.

**PUT_LINE** evalúa la expresión e imprime el resultado.

```txt
DBMS_OUTPUT.PUT_LINE('La fecha actual es: '); -- una cadena
DBMS_OUTPUT.PUT_LINE(  vdata  );             -- una variable (el contenido)
DBMS_OUTPUT.PUT_LINE(  'vdata'  );           -- una cadena
DBMS_OUTPUT.PUT_LINE(  sysdate );            --  resultado de una función
DBMS_OUTPUT.PUT_LINE('La fecha actual es: ' ||  sysdate);  -- una concatenación
DBMS_OUTPUT.PUT_LINE(  3*4+5**2+1 );              --  un cálculo matemático
DBMS_OUTPUT.PUT_LINE(  3*4+5**2+1 || '  456');    --  ¡un casting!
```

### Ejemplo sencillo

```sql
SET SERVEROUTPUT ON;

DECLARE
   vData DATE := SYSDATE;   -- DATE es el tipo y SYSDATE una función
BEGIN
   DBMS_OUTPUT.PUT_LINE('La fecha actual es: ' ||  vData  );
   DBMS_OUTPUT.PUT_LINE('La fecha actual es: ' || TO_CHAR(vData, 'DD/MM/YYYY hh:mi am'));
END;
```

PL/SQL no es case-sensitive en general: las palabras clave y los nombres de variables, procedimientos y funciones no distinguen entre mayúsculas y minúsculas. ❗❗ Pero los valores de los strings o de los campos VARCHAR SÍ distinguen.

**SYSDATE** es una **función** de Oracle que devuelve la fecha/hora del instante actual

**TO_CHAR** es una **función** de Oracle que transforma del formato DATE al formato VARCHAR2

### Buenas prácticas

- Documenta el código con comentarios (`--` para una línea, `/* */` para varias).
- Usa bloques anónimos para probar procedimientos o funciones antes de guardarlos.
- Prueba condiciones, bucles y excepciones dentro de bloques anónimos antes de incorporarlos a rutinas almacenadas.

### Órdenes útiles en SQL\*Plus

- `EDIT` → edita el script actual
- `LIST` → muestra el contenido del buffer
- `RUN` → ejecuta el bloque del buffer (también r o /)
- `SAVE fitxer.sql` → guarda el script en un fichero
- `GET fitxer.sql` → carga un script desde un fichero
- `start fitxer.sql` → carga y ejecuta un script desde un fichero
- `@fitxer.sql` → equivale a start

[📘 Se puede ampliar con el tutorial de SQL\*Plus](https://www.codifica.me/sql-plus/)

### Órdenes útiles en SQL Developer

- **`F5`** → ejecuta el script de la sesión activa. Muestra el resultado en el área de Script Output.
- **`F9`** → ejecuta una sentencia (aquella en la que está el cursor). Muestra el resultado en el área de resultados.
- Ctrl+Intro → equivalente a F9
- `.` → en SQL Developer no hace falta poner un punto al final
- Recuerda poner `SET SERVEROUTPUT ON;` antes del bloque anónimo

### Diferencia con los procedimientos

Los bloques anónimos no se pueden reutilizar directamente, ya que no tienen nombre (sí se pueden guardar en un fichero externo y después recuperarlo —abrirlo— y volver a ejecutarlo). Para reutilizar código es mejor usar procedimientos o funciones, ya que quedan almacenados dentro del SGBD.

### 🧪 ¡Pruébalo!

Prueba este bloque en **SQL Developer**:

```sql
DECLARE
   vNom VARCHAR2(20) := '&DimeNom';
BEGIN
   DBMS_OUTPUT.PUT_LINE('Hola ' || vNom || '! ¡Buenos días!');
END;
```

Ejecuta el bloque algunas veces y después guárdalo en un fichero externo

## 🧪 Práctica interactiva: bloque anónimo

Prueba la sintaxis de un bloque anónimo PL/SQL en la página oficial de Oracle.

[Simulador de código de Oracle (Live SQL)](https://livesql.oracle.com/landing/)

## 🗃️ Comentarios, variables y operaciones en PL/SQL

## Comentarios

El uso de comentarios es un recurso para poder documentar el código. Como se ha dicho antes, es muy importante documentar el código

```txt
--  Con dos guiones se pone un comentario de una línea.
/*  Con la barra y el asterisco se pueden
    poner comentarios de más de una línea
*/
```

## Variables

Una **variable** en PL/SQL es un espacio de memoria para almacenar datos temporales durante la ejecución de un bloque de código. Puede contener textos, números, fechas, etc.

En PL/SQL (Oracle), las variables se deben declarar **siempre** antes de utilizarlas. Las variables se declaran en la sección DECLARE (o en la parte de declaración de un procedimiento, función o paquete).

### Estructura básica

```sql
DECLARE
    nom_variable tipus ;                    -- Se declara pero no se inicializa. Toma el valor NULL
    nom_variable tipus [:= valor_inicial];  -- Se declara y se inicializa con un valor
    nom_variable tipus [DEFAULT valor_inicial];  -- DEFAULT es equivalente a :=
BEGIN
    -- uso de la variable
END;
```

#### Tipos básicos

| Tipo | Descripción | Ejemplo |
| --- | --- | --- |
| `VARCHAR2(n)` | Cadena de texto de longitud variable | 'Hola', 'Joan' |
| `NUMBER(p,s)`, `NUMBER(p)`, `NUMBER` | Números con precisión y escala | 123, 45.67 |
| `DATE` | Fecha y hora | SYSDATE |
| `BOOLEAN` | TRUE, FALSE, NULL (solo PL/SQL) | TRUE |
| `%TYPE` | Tipo igual al de una columna o al de otra variable | taula.columna%TYPE |

#### 🧪 Ejemplo de declaración

```sql
DECLARE
    v_nom       VARCHAR2(50) := 'Anna';
    v_edat      NUMBER := 30;
    v_sou       NUMBER(8,2);
    v_data_naix DATE := TO_DATE('1995-06-10', 'YYYY-MM-DD');
    v_es_actiu  BOOLEAN := TRUE;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Nombre: ' || v_nom);
    DBMS_OUTPUT.PUT_LINE('Edad: ' || v_edat);
END;
```

#### Variables con `%TYPE`

```sql
DECLARE
    v_nom_client clients.nom%TYPE;
BEGIN
    SELECT nom INTO v_nom_client FROM clients WHERE id = 1;
    DBMS_OUTPUT.PUT_LINE('Cliente: ' || v_nom_client);
END;
```

#### 🛠️ Cómo asignar valores

### En el bloque DECLARE

- **Entrada del usuario (herramienta de SQL Developer):**

  ```txt
  v_nom varchar2(20) := '&nom_usuari';  -- Variable de sustitución
  /*  una variable de sustitución es un valor que se introduce en tiempo de ejecución
     y que Oracle sustituye antes de ejecutar la sentencia */
  ```

- Utilizando **DEFAULT**

  ```txt
  v_code number default 100;
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
- No puedes hacer `SELECT ...` sin `INTO` dentro de PL/SQL.
- `BOOLEAN` solo se puede usar dentro de PL/SQL, no en SQL estándar (❗ sí en Oracle 23 ❗).

## Operaciones

### Operaciones con variables en PL/SQL

Una vez declaradas, las variables en PL/SQL se pueden utilizar para hacer cálculos, tratamiento de texto, fechas y lógica condicional. Aquí tienes ejemplos claros y útiles:

### 📐 1. Operaciones aritméticas

Para hacer sumas, restas, multiplicaciones, divisiones y potencias con variables de tipo `NUMBER`:

```sql
DECLARE
    a NUMBER := 10;
    b NUMBER := 3;
    resultat NUMBER;
BEGIN
    resultat := a + b;
    DBMS_OUTPUT.PUT_LINE('Suma: ' || resultat);

    resultat := a - b;
    DBMS_OUTPUT.PUT_LINE('Resta: ' || resultat);

    resultat := a * b;
    DBMS_OUTPUT.PUT_LINE('Multiplicación: ' || resultat);

    resultat := a / b;
    DBMS_OUTPUT.PUT_LINE('División: ' || resultat);

    resultat := a ** b;
    DBMS_OUTPUT.PUT_LINE('Potencia: ' || resultat);
END;
```

**Precedencia**: no hay que olvidar que no es lo mismo 2 + 5 \* 3 que (2 + 5) \* 3. La precedencia u orden de las operaciones es crucial en el resultado

En PL/SQL este orden de precedencia es el siguiente:

| ( ) | unarios | \*\* potencia | \* , /, mod | + y - | comparación | lógicos (NOT AND OR) |
| --- | --- | --- | --- | --- | --- | --- |

Y los operadores lógicos tienen precedencia entre ellos: NOT tiene más precedencia que AND, y AND más que OR.

Aunque conozcas la precedencia, usa paréntesis para que el código sea más claro, menos propenso a errores y más legible para otros desarrolladores

Otras operaciones aritméticas con funciones: ABS, ROUND, TRUNC, MOD, CEIL, FLOOR, SQRT, TO_CHAR

---

### 🔤 2. Operaciones con cadenas de texto

Las cadenas (`VARCHAR2`) se concatenan con `||`

```sql
DECLARE
    nom VARCHAR2(20) := 'Joan';
    cognom VARCHAR2(20) := 'Garcia';
    nom_complet VARCHAR2(50);
BEGIN
    nom_complet := nom || ' ' || cognom;
    DBMS_OUTPUT.PUT_LINE('Nombre completo: ' || nom_complet);
END;
```

Otras operaciones con funciones: LENGTH, UPPER, LOWER, INITCAP, SUBSTR, INSTR, REPLACE, TRIM, LTRIM, RTRIM, TO_NUMBER

---

### 📅 3. Operaciones con fechas

Las fechas se pueden restar o sumar, donde 1 unidad es 1 día: <br> `(y donde, por ejemplo, 1.5 será un día y medio, es decir, 1 día y 12 horas)`

```sql
DECLARE
    data_naix DATE := TO_DATE('2000-01-01', 'YYYY-MM-DD');
    avui      DATE := SYSDATE;
    edat_dies NUMBER;
BEGIN
    edat_dies := avui - data_naix;
    DBMS_OUTPUT.PUT_LINE('Días desde el nacimiento: ' || edat_dies);

    DBMS_OUTPUT.PUT_LINE('Mañana será: ' || (avui + 1));
END;
```

Igual que TO_DATE, existe TO_CHAR, con la posibilidad de usar una máscara ('DD/MM/YY HH:MI PM')

::: tip Nota
✔️ El tipo "DATE" puede almacenar hasta el minuto y el segundo (ejemplo de un valor de tipo DATE: 23-MAY-2025 14:35:22). <br> Si se necesita más precisión, se puede utilizar el tipo "TIMESTAMP", que puede almacenar hasta la millonésima de segundo (ejemplo de un valor de tipo TIMESTAMP: 23-MAY-2025 14:35:22.123456)
:::

::: warning Atención
Hay que tener cuidado en las operaciones con fechas, porque no todos los meses tienen el mismo número de días, ni todos los años tampoco.
:::

---

### 4. Operaciones lógicas

Con variables `BOOLEAN` puedes hacer condiciones:

```sql
DECLARE
    actiu BOOLEAN := TRUE;
    menor BOOLEAN := FALSE;
BEGIN
    IF actiu AND NOT menor THEN
      DBMS_OUTPUT.PUT_LINE('El usuario está activo y no es menor.');
    END IF;
END;
```

Se pueden utilizar variables `BOOLEAN` o hacer comparaciones entre números, textos o fechas con los operadores siguientes:

- `=` igualdad
- `<>` distinto
- `>`, `<`, `>=`, `<=`
- `AND`, `OR`, `NOT`

### 🧪 Ejemplo 1: comparaciones numéricas

```sql
DECLARE
  nota NUMBER := 7.5;
BEGIN
  IF nota >= 5 THEN
      DBMS_OUTPUT.PUT_LINE('Aprobado');
  ELSE
      DBMS_OUTPUT.PUT_LINE('Suspenso');
  END IF;
END;
```

### 🧪 Ejemplo 2: condiciones múltiples

```sql
DECLARE
  edat NUMBER := 16;
  autoritzat BOOLEAN;
BEGIN
  autoritzat := (edat >= 18);
  IF autoritzat THEN
      DBMS_OUTPUT.PUT_LINE('Puede entrar');
  ELSE
      DBMS_OUTPUT.PUT_LINE('Acceso denegado');
  END IF;
END;
```

### 🧪 Ejemplo 3: combinación con `AND` y `OR`

```sql
DECLARE
  edat NUMBER := 20;
  carnet_conduir BOOLEAN := TRUE;
BEGIN
  IF edat >= 18 AND carnet_conduir THEN
      DBMS_OUTPUT.PUT_LINE('Puede conducir legalmente');
  ELSE
      DBMS_OUTPUT.PUT_LINE('No puede conducir');
  END IF;
END;
```

### 🧪 Ejemplo 4: comparación de cadenas

```sql
DECLARE
  rol VARCHAR2(20) := 'admin';
BEGIN
  IF rol = 'admin' THEN
      DBMS_OUTPUT.PUT_LINE('Acceso completo');
  ELSE
      DBMS_OUTPUT.PUT_LINE('Acceso limitado');
  END IF;
END;
```

En PL/SQL, 'admin' no es igual que 'ADMIN'. <br> También se pueden comparar con &lt; o &gt;, de manera que las cadenas se comparan carácter a carácter, según el orden lexicográfico (parecido al orden del diccionario).

```txt
'Ana' < 'Berta'     -- TRUE
'abc' < 'abd'       -- TRUE
'Z' < 'a'           -- TRUE (porque el código ASCII de Z es menor)
```

Las cadenas de texto también se pueden comparar con `LIKE`, usando '%' → (cualquier secuencia de caracteres) o '_' → (un carácter)

```txt
IF nom LIKE 'Mar%' THEN
```

### 5. Operaciones combinadas

Se pueden combinar números y textos, por ejemplo para calcular salarios:

```sql
DECLARE
    nom VARCHAR2(20) := 'Laura';
    hores NUMBER := 5;
    sou_hora NUMBER := 12.5;
    total_sou NUMBER;
BEGIN
    total_sou := hores * sou_hora;
    DBMS_OUTPUT.PUT_LINE(nom || ' cobrará ' || total_sou || ' euros.');
END;
```

::: tip Nota
✨ Puedes probar estos bloques en Oracle SQL Developer con **F5** para ver el resultado en *DBMS Output*.
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
