---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 1: usuarios y permisos"
pageClass: ejercicios-page
---

# 📋 Práctica 1: usuarios y permisos

## Enunciado

Para realizar esta práctica utiliza la máquina Linux Mint como **cliente** (SQL Developer) para conectar con la máquina Linux Server que tiene el servidor Oracle. Las dos máquinas deben estar en la misma red.

Trabaja toda la práctica en la **primera PDB**.

## Objetivos

- Crear y modificar cuentas de usuario y asignarles almacenamiento.
- Asignar privilegios de sistema y de objeto, con y sin posibilidad de reasignarlos.
- Consultar en el diccionario de datos la información de usuarios y privilegios.
- Distinguir entre usuarios locales y usuarios comunes.

## Tareas

1. En la máquina servidor, crea una carpeta a partir de `$ORACLE_BASE` llamada `INFO01`. (Obtén primero el valor de `$ORACLE_BASE`.)
2. Desde la máquina cliente, conecta con el usuario `sys` a la primera PDB. Muestra los valores de la conexión.
3. Crea dos tablespaces nuevos (`tabs1`, `tabs2`) con sus *datafiles* respectivos (`file1.dbf`, `file2.dbf`) en la carpeta creada anteriormente.
4. Crea un usuario (`client01`) y asígnale el tablespace `tabs1` con una cuota de 20M.
5. Asigna al usuario permisos para crear sesión y crear tablas, vistas, secuencias y procedimientos.
6. Explora la vista del diccionario de datos en la que está el usuario creado. ¿Qué campos tiene? (Todos.) Razona sobre esa información.
7. Conecta con el usuario `client01` y crea una tabla `LLIBRE` (tienes su definición más abajo).
8. Cambia la contraseña de `client01` desde `client01`.
9. Añade un registro (una fila) a la tabla.
10. Utiliza el usuario `system` para crear un nuevo usuario (`suport01`).
11. ¿Qué tablespace se le asigna por defecto? (Consulta el diccionario de datos.)
12. Asigna al usuario `suport01` permisos para conectar y para crear usuarios y roles; además, el usuario deberá poder **reasignar** todos estos permisos a otros usuarios.
13. Asigna al usuario `suport01` permisos para insertar, modificar, eliminar y consultar los datos de la tabla `LLIBRE` creada por el usuario `client01`, de forma que pueda reasignar todos estos permisos.
14. Conecta con el usuario `suport01`.
15. Borra el registro que tiene la tabla.
16. Añade un registro (diferente del borrado) a la tabla.
17. Modifica el registro: cambia el contenido del campo `TITOL`.
18. Visualiza el contenido del registro.
19. Crea un usuario común a todas las PDB llamado `usucomu1`.

## Tabla `LLIBRE`

| Columna | Tipo | Restricciones |
|:---|:---|:---|
| `codi` | `NUMBER(6)` | clave primaria |
| `titol` | `VARCHAR2(20)` | `NOT NULL` |
| `editorial` | `VARCHAR2(30)` | |
| `edicio` | `VARCHAR2(12)` | |
| `isbn` | `VARCHAR2(25)` | |

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA3** (*Implanta métodos de control de acceso utilizando asistentes, herramientas gráficas y comandos del lenguaje del sistema gestor.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **3.c** | Se han definido y eliminado cuentas de usuario. | Crea los usuarios `client01`, `suport01` y el usuario común `usucomu1`, con su tablespace y su cuota, y cambia una contraseña. |
| **3.d** | Se han identificado los privilegios sobre las bases de datos y sus elementos. | Localiza en el diccionario de datos la información de los usuarios y de sus privilegios, e interpreta sus campos. |
| **3.f** | Se han asignado y eliminado privilegios a usuarios. | Asigna los privilegios de sistema y de objeto pedidos, distinguiendo `WITH ADMIN OPTION` de `WITH GRANT OPTION`. |
| **3.h** | Se ha garantizado el cumplimiento de los requisitos de seguridad. | Comprueba que cada usuario puede hacer exactamente lo que se le ha concedido (y nada más) y lo documenta. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/09 usuaris i permisos.pdf`.</small>
