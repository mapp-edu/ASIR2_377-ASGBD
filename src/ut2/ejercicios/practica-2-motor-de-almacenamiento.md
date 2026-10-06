---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 2: selección del motor de almacenamiento"
pageClass: ejercicios-page
---

# 📋 Práctica 2: selección del motor de almacenamiento

## Enunciado

En algunos SGBD, como MariaDB y MySQL, el **motor de almacenamiento** (*storage engine*) se elige tabla a tabla, y de esa elección depende que haya transacciones, claves foráneas o recuperación ante caídas. En otros, como Oracle y PostgreSQL, hay un único motor y lo que se elige es la **organización** de cada tabla.

En esta práctica vas a comprobar con pruebas las diferencias entre motores y a decidir cuál conviene en cada caso. Utiliza el servidor **MariaDB** que instalaste en la [Práctica 2 de la UT1](/ut1/ejercicios/practica-2-tres-sgbd).

## Objetivos

- Identificar los motores de almacenamiento disponibles y el motor por defecto.
- Comprobar qué ofrece cada motor: transacciones, integridad referencial y persistencia.
- Seleccionar el motor adecuado según los requisitos y cambiar el de una tabla existente.

## Tareas

### Parte 1. Motores disponibles

1. Muestra los motores disponibles en tu servidor. ¿Cuál es el motor por defecto? ¿Cuáles admiten transacciones?
2. Consulta el valor de la variable que fija el motor por defecto e indica en qué fichero de configuración se cambiaría de forma permanente.
3. Crea una base de datos `motores` y, dentro, tres tablas con la misma estructura (`id` entero como clave primaria y `valor` de texto), una con cada motor: `InnoDB`, `MyISAM` y `MEMORY`.
4. Comprueba en el diccionario de datos con qué motor se ha creado cada tabla y localiza en el disco los ficheros de cada una. ¿Qué extensiones tienen?

### Parte 2. Pruebas

5. **Transacciones.** Inicia una transacción, inserta una fila en la tabla InnoDB y otra en la tabla MyISAM y haz `ROLLBACK`. ¿Qué ha quedado en cada tabla? Muestra el aviso que da el servidor.
6. **Integridad referencial.** Crea una tabla `padre` y dos tablas hijas con una clave foránea hacia ella: una hija con InnoDB y otra con MyISAM. Intenta insertar en cada hija una fila que apunte a un padre que no existe. ¿Qué ocurre en cada caso?
7. **Persistencia.** Inserta filas en las tres tablas de la parte 1, reinicia el servicio y cuenta las filas de cada una. Explica el resultado.
8. **Bloqueos.** Abre dos sesiones sobre la tabla InnoDB. En la primera, inicia una transacción y actualiza una fila sin confirmarla; en la segunda, actualiza primero otra fila distinta y después la misma fila. ¿Qué ocurre en cada caso? Investiga qué tipo de bloqueo utiliza MyISAM y explica qué pasaría con ese motor en una tabla con muchas escrituras simultáneas.

### Parte 3. Selección

9. Indica qué motor elegirías para cada una de estas tablas y **por qué**:

   | Tabla | Uso |
   |:---|:---|
   | `pedidos` | Altas y modificaciones constantes; no puede perderse ningún pedido. |
   | `sesiones_web` | Datos temporales de las sesiones abiertas; se pueden perder si el servidor se reinicia. |
   | `historico_2015` | Datos antiguos que solo se consultan, nunca se modifican. |
   | `codigos_postales` | Tabla pequeña de consulta que casi nunca cambia. |

10. Cambia el motor de la tabla MyISAM de la parte 1 a InnoDB **sin perder los datos** y comprueba el resultado.
11. Deja configurado el servidor para que el motor por defecto sea el que has elegido para `pedidos` y demuestra que una tabla creada sin indicar motor lo utiliza.

### Parte 4. ¿Y en Oracle y PostgreSQL?

12. Investiga y explica brevemente: ¿existe en PostgreSQL y en Oracle el concepto de motor de almacenamiento elegible por tabla? ¿Qué se puede elegir en su lugar? (Pistas: en PostgreSQL, la vista `pg_am` y las tablas `UNLOGGED`; en Oracle, las tablas organizadas por índice.)

## Orientaciones

```sql
SHOW ENGINES;
SHOW VARIABLES LIKE 'default_storage_engine';
CREATE TABLE t (id INT PRIMARY KEY, valor VARCHAR(20)) ENGINE=MyISAM;
SELECT table_name, engine FROM information_schema.tables WHERE table_schema = 'motores';
SHOW WARNINGS;
ALTER TABLE t ENGINE=InnoDB;
```

- Los ficheros de datos están, por defecto, en `/var/lib/mysql/` dentro de una carpeta con el nombre de la base de datos.
- La configuración del servidor en Debian, Ubuntu y Linux Mint está en `/etc/mysql/mariadb.conf.d/50-server.cnf`, en la sección `[mysqld]`.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA2** (*Configura el sistema gestor de bases de datos interpretando las especificaciones técnicas y los requisitos de explotación.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **2.b** | Se ha seleccionado el motor de base de datos. | Selecciona el motor de cada tabla del caso propuesto y lo razona con el resultado de sus propias pruebas. |
| **2.f** | Se han definido las características por defecto de las bases de datos. | Configura el motor por defecto del servidor y demuestra que las tablas nuevas lo utilizan. |
| **2.h** | Se ha documentado el proceso de configuración. | Documenta las pruebas (transacciones, claves foráneas, persistencia y bloqueos) con las órdenes, la salida y su interpretación. |

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
