---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 6: disparadores"
pageClass: ejercicios-page
---

# 📋 Práctica 6: disparadores

## Enunciado

Un almacén gestiona sus productos y sus movimientos de entrada y salida. Hasta ahora, las comprobaciones se hacían «a mano» desde la aplicación, y por eso hay existencias negativas, precios cambiados sin que nadie sepa por quién y tablas borradas por error.

Vas a trasladar esas reglas a la base de datos mediante **disparadores** (*triggers*), de forma que se cumplan siempre, se acceda desde donde se acceda.

Haz la práctica con Oracle (PL/SQL) o con PostgreSQL (PL/pgSQL), según te indique tu profesor o profesora.

## Objetivos

- Identificar los eventos que pueden activar un disparador y el momento en que se ejecuta.
- Programar disparadores de fila y de sentencia, `BEFORE` y `AFTER`.
- Usar disparadores para validar datos, mantener datos derivados y auditar cambios.
- Gestionar los disparadores: consultarlos, desactivarlos y eliminarlos.

## Datos de partida

```sql
CREATE TABLE productos (
  id_producto  INT PRIMARY KEY,
  nombre       VARCHAR(50)  NOT NULL,
  precio       DECIMAL(8,2) NOT NULL,
  stock        INT DEFAULT 0 NOT NULL
);

CREATE TABLE movimientos (
  id_movimiento INT PRIMARY KEY,
  id_producto   INT NOT NULL REFERENCES productos,
  tipo          CHAR(1) NOT NULL,          -- 'E' entrada, 'S' salida
  cantidad      INT NOT NULL,
  fecha         DATE
);
```

Inserta al menos cinco productos.

## Tareas

### Parte 1. Eventos

1. Elabora una **tabla de los eventos** que pueden activar un disparador en tu SGBD, clasificados en: eventos de manipulación de datos (DML), eventos de definición (DDL) y eventos del sistema o de la base de datos. Indica para cada grupo si el disparador puede ser de fila, de sentencia o ambos, y si puede ejecutarse antes (`BEFORE`), después (`AFTER`) o en lugar de (`INSTEAD OF`) la operación.
2. Explica con tus palabras la diferencia entre un disparador **de fila** y uno **de sentencia**, y cuándo se puede acceder a los valores antiguos y nuevos de la fila.

### Parte 2. Validación

3. Crea un disparador que **impida** insertar o modificar un producto con precio negativo o cero, con un mensaje de error claro.
4. Amplíalo para que el nombre del producto se guarde siempre **en mayúsculas y sin espacios** al principio ni al final, lo escriba como lo escriba el usuario.
5. Crea un disparador que impida dar de alta movimientos con una cantidad menor o igual que cero o con un tipo distinto de `E` o `S`, y que rellene la fecha con la fecha actual si no se indica.

### Parte 3. Datos derivados

6. Crea un disparador que, al **insertar un movimiento**, actualice el `stock` del producto: lo aumente en las entradas y lo reduzca en las salidas.
7. Si una salida dejara el stock en negativo, el movimiento debe **rechazarse** y el stock quedar como estaba. Demuéstralo.
8. Completa el disparador para que el stock siga siendo correcto si un movimiento se **borra** o se le **modifica la cantidad**.
9. Comprueba el conjunto: tras varios movimientos, el stock de cada producto debe coincidir con la suma de sus entradas menos sus salidas. Escribe la consulta que lo verifica.

### Parte 4. Auditoría

10. Crea una tabla `auditoria_precios` y un disparador que registre **cada cambio de precio**: producto, precio anterior, precio nuevo, usuario de la base de datos que lo hace y fecha y hora. El disparador solo debe actuar si el precio cambia de verdad.
11. Crea un disparador **de sentencia** que impida modificar la tabla `productos` fuera del horario laboral (de lunes a viernes, de 8 a 20 h). Pruébalo cambiando temporalmente el horario permitido.
12. Crea un disparador asociado a un **evento DDL** que registre en una tabla `registro_ddl` cada objeto que se cree o se borre: orden ejecutada, nombre del objeto, usuario y momento.

### Parte 5. Gestión

13. Consulta en el diccionario de datos los disparadores que has creado: tabla, evento, momento y estado.
14. **Desactiva** el disparador del horario, comprueba que deja de actuar y vuelve a activarlo.
15. Carga 1000 movimientos de golpe con los disparadores activos y con los disparadores de `movimientos` desactivados, y compara los tiempos. ¿Qué coste tiene un disparador de fila? ¿Qué habría que hacer después de una carga con los disparadores desactivados?
16. Reflexiona: ¿qué reglas de esta práctica se podrían haber resuelto con una restricción `CHECK` en lugar de un disparador? ¿Cuál es preferible y por qué?

## Orientaciones

| | Oracle (PL/SQL) | PostgreSQL (PL/pgSQL) |
|:---|:---|:---|
| Estructura | El código va dentro del propio `CREATE TRIGGER` | Primero una función que devuelve `TRIGGER` y después `CREATE TRIGGER ... EXECUTE FUNCTION` |
| Valores de la fila | `:OLD` y `:NEW` | `OLD` y `NEW` |
| Saber qué operación es | `INSERTING`, `UPDATING`, `DELETING` | variable `TG_OP` |
| Rechazar la operación | `RAISE_APPLICATION_ERROR(-20001, 'mensaje')` | `RAISE EXCEPTION 'mensaje'` |
| Final de un disparador `BEFORE` de fila | no devuelve nada | `RETURN NEW;` (o `RETURN OLD;` al borrar) |
| Usuario y momento | `USER`, `SYSTIMESTAMP` | `current_user`, `now()` |
| Evento DDL | `AFTER DDL ON SCHEMA`, funciones `ORA_SYSEVENT` y `ORA_DICT_OBJ_NAME` | `CREATE EVENT TRIGGER ... ON ddl_command_end`, función `pg_event_trigger_ddl_commands()` |
| Diccionario | `USER_TRIGGERS` | `pg_trigger`, `pg_event_trigger`, `\dft` |
| Desactivar | `ALTER TRIGGER nombre DISABLE;` | `ALTER TABLE tabla DISABLE TRIGGER nombre;` |

- En PostgreSQL, los borrados de objetos se capturan con el evento `sql_drop` y la función `pg_event_trigger_dropped_objects()`.
- Para generar muchas filas: en PostgreSQL, `generate_series(1, 1000)`; en Oracle, `SELECT LEVEL FROM dual CONNECT BY LEVEL <= 1000`.
- Repasa las páginas de disparadores ([Oracle](/ut4/contenidos/oracle/5-disparadores-secuencias), [PostgreSQL](/ut4/contenidos/postgresql/5-disparadores-secuencias)) y de excepciones ([Oracle](/ut4/contenidos/oracle/6-cursores-excepciones), [PostgreSQL](/ut4/contenidos/postgresql/6-cursores-excepciones)).

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA4** (*Automatiza tareas de administración del gestor describiéndolas y utilizando guiones de sentencias.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **4.e** | Se han identificado los eventos susceptibles de activar disparadores. | La tabla de eventos es completa y correcta para el SGBD utilizado, y distingue disparadores de fila y de sentencia y sus momentos de ejecución. |
| **4.f** | Se han definido disparadores. | Los disparadores de validación, de stock, de auditoría, de horario y de DDL se crean sin errores y hacen lo pedido. |
| **4.g** | Se han utilizado estructuras de control de flujo. | Utiliza condicionales para distinguir la operación y el tipo de movimiento, y gestiona los errores con excepciones. |
| **4.h** | Se han adoptado medidas para mantener la integridad y consistencia de la información. | El stock se mantiene coherente con los movimientos en altas, bajas y modificaciones, y las operaciones no válidas se rechazan sin dejar datos a medias. |
| **4.d** | Se han definido y utilizado guiones para automatizar tareas. | Prueba cada disparador con casos válidos y no válidos y los gestiona (consulta, desactivación, activación). |

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

<small>Práctica de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
