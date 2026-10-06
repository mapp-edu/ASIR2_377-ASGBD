---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 3: boletín de procedimientos y funciones"
pageClass: ejercicios-page
---

# 📋 Práctica 3: boletín de procedimientos y funciones

## Enunciado

Para realizar esta práctica utilizaremos Oracle SQL Developer.

Con el usuario `system`, conectado a la primera PDB:

- Crea el usuario `usuari3` (dale contraseña y permisos de conexión y de creación de procedimientos y funciones).
- Dale permisos para crear tablas y asígnale cuota (10M) en el tablespace por defecto.

Conecta a la primera PDB con el usuario creado (`usuari3`), realiza los ejercicios siguientes y prueba que funcionan con ejemplos.

## Objetivos

- Crear procedimientos y funciones almacenados con parámetros.
- Guardar, cargar y ejecutar guiones desde fichero.
- Controlar las situaciones en las que una sentencia no afecta a ninguna fila.
- Consultar en el diccionario de datos el estado de los objetos PL/SQL.

## Ejercicios

**0.** Crea la tabla `llibres` y llénala (5 filas):

```sql
drop table llibres;
CREATE TABLE llibres(
codi NUMBER(6) PRIMARY KEY,
titol VARCHAR2(50) NOT NULL,
autor VARCHAR2(30),
editorial VARCHAR2(40),
preu number(8,2),
datadalta date );
```

**1.** Escribe un bloque anónimo PL/SQL que escriba el texto «HOLA»:

```sql
SET SERVEROUTPUT ON
BEGIN
DBMS_OUTPUT.PUT_LINE('HOLA');
END;
```

**2.** Escribe un bloque PL/SQL que cuente el número de filas que hay en la tabla `llibres`, deposite el resultado en la variable `v_num` y visualice su contenido.

- **2.1.** Guarda el bloque en un fichero llamado `PROG01.SQL` en `c:\users\oracle\Documents`.

**3.** Carga y ejecuta el bloque guardado en el fichero `PROG01.SQL` de `c:\users\oracle\Documents`.

**4.** Escribe un procedimiento llamado `suma2n` que reciba dos números y visualice su suma. Úsalo con un ejemplo.

**5.** Codifica un procedimiento `inreves` que reciba una cadena y la visualice al revés (`Hola` → `aloH`). Úsalo con un ejemplo.

**6.** Escribe una función que reciba una fecha y devuelva el año, en número, correspondiente a esa fecha. Úsala con un ejemplo.

**7.** Escribe un bloque PL/SQL que haga uso de la función anterior. Guarda el bloque en un fichero `prog02.sql`.

**8.** Dado el siguiente procedimiento, basado en la tabla creada antes:

```sql
CREATE OR REPLACE PROCEDURE alta_llibre (
v_num llibres.llibreid%TYPE,
v_titol llibres.titol%TYPE default 'sense titol',
v_autor llibes.autor%TYPE DEFAULT 'anònim')
IS
BEGIN
INSERT INTO llibres
VALUES (v_num , v_titol, v_autor);
END crear_llibre;
```

Detecta los errores y corrígelos (compila y ejecuta primero).

Indica cuáles de las siguientes llamadas al procedimiento son correctas y cuáles incorrectas; en este último caso, escribe la llamada correcta usando la notación posicional (en los casos en que se pueda):

```sql
crear_llibre;                             -- 1
crear_llibre(50);                         -- 2
crear_llibre('Hackers');                  -- 3
crear_llibre(50,'Hackers');               -- 4
crear_llibre('Hackers', 50);              -- 5
crear_llibre('Hackers', 'McClure');       -- 6
crear_llibre(50, 'Hackers', 'McClure');   -- 7
crear_llibre('Hackers', 50, 'McClure');   -- 8
crear_llibre('McClure', 'Hackers');       -- 9
crear_llibre('McClure', 50);              -- 10
```

**9.** Desarrolla una función que devuelva el número de años completos que hay entre dos fechas que se pasan como argumentos. Úsala con un ejemplo.

**10.** Escribe una función que, haciendo uso de la función anterior, devuelva los trienios que hay entre dos fechas. (Un trienio son tres años completos.) Úsala con un ejemplo.

**11.** Codifica un procedimiento que reciba una lista de hasta 5 números y visualice su suma. Úsalo con un ejemplo.

**12.** Escribe una función que devuelva solamente caracteres alfabéticos, sustituyendo cualquier otro carácter por blancos, a partir de una cadena que se pasará en la llamada. Úsala con un ejemplo.

**13.** Implementa un procedimiento que reciba un importe y visualice el desglose del cambio en unidades monetarias de 1 c, 2 c, 5 c, 10 c, 20 c, 50 c, 1 €, 2 €, 5 €, 10 €, 20 €, 50 €, 100 €, 200 € y 500 €, en orden inverso al que aparecen aquí enumeradas. Úsalo con un ejemplo.

**14.** Codifica un procedimiento que permita borrar un libro cuyo número (`num_id`) se pasará en la llamada al procedimiento.

::: tip Nota
El procedimiento anterior devolverá el mensaje «Procedimiento PL/SQL terminado con éxito» aunque no exista el número y, por tanto, no se borre el libro. ¿Puedes hacer que se informe de esa situación cuando se produzca?
:::

Usa el procedimiento con ejemplos para comprobar que funciona tanto si el libro existe como si no.

**15.** Escribe un procedimiento que modifique el título de un libro. El procedimiento recibirá como parámetros el número del libro y el título nuevo. Lo indicado en la nota del ejercicio anterior se puede aplicar también a este. Usa el procedimiento con ejemplos para comprobar que funciona tanto si el libro existe como si no.

**16.** Utilizando el diccionario de datos de Oracle, visualiza todos los procedimientos y funciones del usuario (el que se está utilizando para hacer los ejercicios del boletín) almacenados en la base de datos y su situación (válido o inválido).

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA4** (*Automatiza tareas de administración del gestor describiéndolas y utilizando guiones de sentencias.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **4.b** | Se han descrito los distintos métodos de ejecución de guiones. | Guarda los bloques en ficheros (`PROG01.SQL`, `prog02.sql`), los carga y los ejecuta, y describe el método utilizado. |
| **4.d** | Se han definido y utilizado guiones para automatizar tareas. | Los procedimientos y las funciones se crean sin errores y se prueban con ejemplos; el procedimiento del ejercicio 8 queda corregido. |
| **4.g** | Se han utilizado estructuras de control de flujo. | Utiliza estructuras de control (condicionales y bucles) en los ejercicios que las requieren. |
| **4.h** | Se han adoptado medidas para mantener la integridad y consistencia de la información. | Informa de las situaciones en las que no se borra o no se modifica ninguna fila (ejercicios 14 y 15) y comprueba el estado de los objetos en el diccionario de datos. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/11 automatització_I_procs_i_funcs.pdf (Butlletí: crear procediments amb PL/SQL)`.</small>
