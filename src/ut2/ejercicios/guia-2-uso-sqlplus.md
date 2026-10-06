---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: uso de SQL*Plus"
pageClass: ejercicios-page
---

# 🧭 Guía: uso de SQL*Plus

## Conexión y sentencias

```txt
sqlplus / as sysdba
sqlplus usuari/contrasenya
```

Las sentencias SQL y PL/SQL acaban en `;`. Una sentencia puede ocupar varias líneas:

```txt
SQL> SELECT
  2  EMPNO, ENAME, JOB, SAL
  3  FROM EMP
  4  WHERE SAL < 1500;
```

Se puede terminar una sentencia SQL de tres maneras:

| Terminación | Efecto |
|:---|:---|
| con un punto y coma (`;`) | guarda en el buffer y ejecuta |
| con una barra (`/`) sola en una línea | guarda en el buffer y ejecuta |
| con una línea en blanco | guarda en el buffer, pero no ejecuta |

## El buffer

SQL\*Plus almacena en un **buffer** la última sentencia SQL introducida. El buffer mantiene solo una sentencia cada vez; si se introduce una nueva sentencia, se sobrescribe la anterior.

| Acción | Orden |
|:---|:---|
| Ver la última sentencia | `L` |
| Repetir la sentencia | `run` o `/` |
| Modificar parte de la sentencia (*change*) | `C/origen/destino` |
| Repetir/ejecutar la sentencia modificada | `run` o `/` |
| Modificar con un editor externo | `edit` |
| Cambiar el editor | `define _editor=vi` o `define _editor=nano` |
| Guardar el buffer en un fichero | `SAV[E] nombre_fichero[.ext]` |
| Llenar el buffer desde un fichero | `GET nombre_fichero[.ext]` |

::: warning Atención
Solo se puede editar la última sentencia.
:::

## Uso del punto en bloques PL/SQL

En un bloque introducido de forma interactiva, el punto (`.`) cierra la entrada y lo deja en el buffer; después se ejecuta con `/`:

```txt
SQL> DECLARE
  2      x   NUMBER := 100;
  3  BEGIN
  4      FOR i IN 1..10 LOOP
  5          IF MOD (i, 2) = 0 THEN    --i is even
  6            INSERT INTO temp VALUES (i, x, 'i is even');
  7          ELSE
  8            INSERT INTO temp VALUES (i, x, 'i is odd');
  9          END IF;
 10          x := x + 100;
 11      END LOOP;
 12  END;
 13  .
SQL> /
```

Los bloques anónimos se ven mejor en SQL Developer.

## Sentencia SQL ≠ comando de SQL\*Plus

Los comandos de SQL\*Plus tienen una sintaxis diferente de la de las sentencias SQL o los bloques PL/SQL, y no requieren `;`.

```txt
SQL> DESCRIBE DEPT
SQL> DESCRIBE afunc
SQL> show user
SQL> show con_name
SQL> help show
```

### Comando SET: autocommit

| Orden | Efecto |
|:---|:---|
| `SET AUTOCOMMIT ON` | Activa el autocommit |
| `SET AUTOCOMMIT OFF` | Desactiva el autocommit (valor por defecto) |
| `SET AUTOCOMMIT n` | Hace commit después de *n* sentencias DML |
| `SET AUTOCOMMIT IMMEDIATE` | Activa el autocommit |

### Formatear la salida

Por ejemplo, para dar formato a una columna que se muestra descolocada: `column pdb_name format a20`.

```txt
SQL> set lines 80         -- linesize
SQL> set pages 100        -- pagesize
SQL> set feedback on
SQL> set timing on
SQL> set pause on
SQL> set trimspool on

column tbs         format a25 word_wrapped
column porc_usado  format 990.00
column libre       format 999,990.00
```

Para limpiar el formato de una columna: `column tbs clear`.

### Encabezados y pies

```txt
SQL> ttitle skip 2 center 'Fecha del sistema'
SQL> btitle skip 1 left   'Esa fue la fecha'
```

Para quitarlos: `ttitle off` y `btitle off`.

### Otros comandos

```txt
set tab on | off
set space n          (0 a 10)
SQL> set colsep '|'
SQL> set underline '='
SQL> COLUMN SAL FORMAT $99,999 HEADING SALARY
```

Un comando de SQL\*Plus largo se puede partir en varias líneas con un guion (`-`):

```txt
SQL> COLUMN SAL FORMAT $99,999 -
> HEADING SALARY
```

## El problema de los acentos y los caracteres especiales

En Windows, para que SQL\*Plus muestre correctamente los acentos y los símbolos especiales hay que cambiar la página de códigos de la consola desde el propio CMD (con la orden `chcp`) antes de ejecutar `sqlplus`.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD2/ASGBD-UD2.4 Us d sqlplus.pdf`.</small>
