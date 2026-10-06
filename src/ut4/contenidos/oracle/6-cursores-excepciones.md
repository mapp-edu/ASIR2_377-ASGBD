---
layout: doc
title: "PL/SQL: cursores y excepciones"
sidebar: true
outline: [2, 3]
aside: true
---

# PL/SQL: cursores y excepciones

## Cursores en PL/SQL

### 📘 ¿Qué es un cursor?

![Un cursor apunta a la fila actual del conjunto activo #center](/img/contenidos/ut4/cursor-gen.png)

Un **cursor** es un mecanismo de PL/SQL que permite **recorrer múltiples filas** devueltas por una consulta `SELECT`. Un cursor es como un puntero que apunta a un conjunto de resultados de una SQL y permite leerlos uno a uno.

Sirve para trabajar fila a fila con el conjunto de resultados, como un bucle sobre una tabla.

### Tipos de cursores

- **Implícitos:** creados automáticamente por Oracle para sentencias DML (SELECT ... INTO, INSERT, UPDATE...)
- **Explícitos:** definidos manualmente por el usuario para tratar los SELECT que devuelven múltiples filas
- **Cursores FOR:** simplificación del uso explícito

---

### Cursores implícitos

No se declaran; solo devuelven un resultado o fila:

```sql
SELECT DESCRIPCION INTO vdescripcion from PAISES WHERE CO_PAIS = 'ESP';
```

Los cursores implícitos solo pueden devolver una única fila. En caso de que se devuelva más de una fila (o ninguna) se producirá una **excepción**: NO_DATA_FOUND o TOO_MANY_ROWS. Esta **EXCEPCIÓN** se podrá capturar y tratar

Si no sabemos si va a devolver ninguna fila o más de una, se puede comprobar antes con

```sql
SELECT count(*) INTO vcant from factura WHERE idcli = 'V00923';
```

O utilizar una EXCEPTION y preguntar por %FOUND

### Atributos útiles

- `sql%FOUND` → si se ha encontrado al menos una fila
- `sql%NOTFOUND` → si no se ha encontrado ninguna fila
- `sql%ROWCOUNT` → número de filas tratadas
- `sql%ISOPEN` → indica si el cursor está abierto

---

### Uso de un cursor explícito

**Pasos:**

1. Declarar el cursor
2. Abrirlo
3. Leer fila a fila
4. Cerrarlo

#### Ejemplo completo

```sql
DECLARE
   CURSOR c_alumnes IS
     SELECT nom, edat FROM alumnes;

   v_nom alumnes.nom%TYPE;
   v_edat alumnes.edat%TYPE;
BEGIN
   OPEN c_alumnes;
   LOOP
      FETCH c_alumnes INTO v_nom, v_edat;
      EXIT WHEN c_alumnes%NOTFOUND;
      DBMS_OUTPUT.PUT_LINE('Nombre: ' || v_nom || ' - Edad: ' || v_edat);
   END LOOP;
   CLOSE c_alumnes;
END;
```

---

### Cursor FOR – simplificado

Oracle gestiona automáticamente la apertura, la lectura y el cierre.

```sql
BEGIN
   FOR reg IN (SELECT nom, edat FROM alumnes) LOOP
      DBMS_OUTPUT.PUT_LINE('Nombre: ' || reg.nom || ', Edad: ' || reg.edat);
   END LOOP;
END;
```

### Cursores con parámetros

```sql
DECLARE
   CURSOR c_per_edat(min_edat NUMBER) IS
     SELECT nom FROM alumnes WHERE edat > min_edat;

   v_nom alumnes.nom%TYPE;
BEGIN
   OPEN c_per_edat(18);
   LOOP
      FETCH c_per_edat INTO v_nom;
      EXIT WHEN c_per_edat%NOTFOUND;
      DBMS_OUTPUT.PUT_LINE('Mayor de 18: ' || v_nom);
   END LOOP;
   CLOSE c_per_edat;
END;
```

---

### Buenas prácticas

- Cierra siempre los cursores después de usarlos
- Utiliza **cursores FOR** si solo necesitas leer
- Evita los FETCH sin `EXIT WHEN %NOTFOUND`
- Reutiliza variables con tipos %TYPE o %ROWTYPE

### 📘 Consulta de los cursores activos

(por sesiones de trabajo; para administradores)

```sql
SELECT * FROM v$open_cursor
WHERE user_name = 'NOM_USUARI';
```

## Gestión de excepciones en PL/SQL

### 📘 ¿Qué es una excepción?

Una **excepción** es una situación de error que se produce durante la ejecución de un bloque PL/SQL. Oracle permite capturar estas situaciones para gestionarlas de manera controlada y evitar que el bloque falle de manera abrupta.

### Estructura general con excepciones

```sql
BEGIN
   -- código normal
EXCEPTION
   WHEN tipus_excepcio THEN
      -- código de error
END;
```

### Tipos de excepciones

#### Excepciones predefinidas

Oracle las reconoce automáticamente. Ejemplo:

- `NO_DATA_FOUND` → no hay resultados
- `TOO_MANY_ROWS` → el SELECT devuelve más de una fila
- `ZERO_DIVIDE` → división por cero
- ....

[Se puede consultar la lista completa en la documentación oficial de Oracle](https://docs.oracle.com/en/database/oracle/oracle-database/21/lnpls/plsql-error-handling.html#GUID-8C327B4A-71FA-4CFB-8BC9-4550A23734D6). Y la de la versión 26, [aquí](https://docs.oracle.com/en/database/oracle/oracle-database/26/lnpls/predefined-exceptions.html)

#### Ejemplo

```sql
DECLARE
   v_nom alumnes.nom%TYPE;
BEGIN
   SELECT nom INTO v_nom FROM alumnes WHERE id = 999;
   DBMS_OUTPUT.PUT_LINE(v_nom);
EXCEPTION
   WHEN NO_DATA_FOUND THEN
      DBMS_OUTPUT.PUT_LINE('Ningún alumno con este ID');
END;
```

#### Excepciones no predefinidas

Oracle las puede capturar con `SQLCODE` y `SQLERRM`:

```sql
BEGIN
   -- operación que puede fallar
EXCEPTION
   WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Error ' || SQLCODE || ': ' || SQLERRM);
END;
```

#### 🔧 Excepciones personalizadas

Se pueden declarar con `EXCEPTION` y lanzar con `RAISE`:

```sql
DECLARE
   ex_preu_invalid EXCEPTION;
   v_preu NUMBER := -5;
BEGIN
   IF v_preu < 0 THEN
      RAISE ex_preu_invalid;
   END IF;
EXCEPTION
   WHEN ex_preu_invalid THEN
      DBMS_OUTPUT.PUT_LINE('Error: precio negativo no válido');
END;
```

### Claves de uso

- `RAISE` → provoca una excepción
- `WHEN ... THEN` → captura una excepción
- `WHEN OTHERS THEN` → captura cualquier error no gestionado antes
- `SQLERRM` → muestra el mensaje de error
- `SQLCODE` → muestra el código numérico del error

### 🧠 Ejemplo final combinado

```sql
DECLARE
   v_total NUMBER := 0;
BEGIN
   v_total := 100 / 0;
EXCEPTION
   WHEN ZERO_DIVIDE THEN
      DBMS_OUTPUT.PUT_LINE('¡No se puede dividir por cero!');
   WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Error inesperado: ' || SQLERRM);
END;
```

### Buenas prácticas

- Captura los errores específicos antes de usar `OTHERS`
- Informa al usuario o registra el error
- No captures `OTHERS` sin mostrar ningún mensaje (silenciar errores es peligroso)
- Usa excepciones personalizadas cuando tengas validaciones propias

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
