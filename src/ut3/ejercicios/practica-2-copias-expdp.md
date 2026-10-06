---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 2: copias con Oracle expdp"
pageClass: ejercicios-page
---

# 📋 Práctica 2: copias con Oracle expdp

## Enunciado

Para realizar esta práctica utiliza SQL\*Plus en la máquina servidor y el CMD para lanzar la copia. Utiliza la máquina virtual facilitada (`windowsOracle4`), en la que todas las contraseñas son `1234`.

En el texto siguiente, sustituye `client01` por **tu nombre** y `client02` por **tu apellido**.

Muestra y explica los pasos realizados.

## Objetivos

- Crear usuarios con los permisos necesarios para trabajar y para exportar sus datos.
- Definir un directorio de Oracle y usar ficheros de parámetros con `expdp`.
- Identificar qué privilegios hacen falta para exportar un esquema y un tablespace.

## Tareas

### Preparación de los datos

1. Trabaja en la primera PDB de la CDB del `ORACLE_SID`. Muestra qué valores tienen.
2. Crea los usuarios `client01` y `client02` y dales los permisos necesarios para conectar, crear recursos y disponer de cuota.
3. Conecta con el usuario `client01`.
4. Crea una tabla `festius` con los campos mes, día y nombre de la fiesta.
5. Puebla la tabla con 5 registros (Todos los Santos 1/11, Navidad 25/12, Nochevieja 31/12 y alguno más).
6. Conecta con el usuario `client02`.
7. Crea una tabla `alumnes` con los campos NIA y nombre del alumno.
8. Puebla la tabla con 7 registros (pon nombres de familiares, amistades o famosos).

### Directorio de copias

Sal de SQL\*Plus:

9. Desde el CMD (sistema operativo), crea una carpeta con tu nombre para hacer las copias (en la máquina servidor, dentro de `c:\app\copies\`).
10. Conecta como `SYSTEM`.
11. Define la carpeta creada con un nombre dentro del SGBD con `CREATE DIRECTORY ...` (inventa el nombre) y dale permisos si hace falta. Sal de SQL\*Plus.

### Ficheros de parámetros

12. Desde el sistema operativo, crea el fichero de parámetros `parametres1.txt` dentro de la carpeta definida antes, indicando que se hará copia de los objetos del esquema (usuario) de `client01` (`schemas`).
13. Crea otro fichero de parámetros, `parametres2.txt`, dentro de la misma carpeta, indicando que se hará copia de los objetos del tablespace `users` (`tablespaces`).

### Copias

14. Haz las copias con la utilidad `expdp` de Oracle (desde el CMD y utilizando la opción `parfile`).
15. Lanza `expdp` con el usuario `system` y `parametres1.txt`.
16. Lanza `expdp` con el usuario `client01` y `parametres2.txt`.
17. Lanza `expdp` con el usuario `client02` y `parametres2.txt`.
18. Observa y comenta los resultados obtenidos en los tres puntos anteriores. (Observa bien...)
19. Dale permisos a `client01` (`grant DATAPUMP_EXP...`).
20. Lanza `expdp` con el usuario `client01` y `parametres2.txt`.
21. Observa y comenta los resultados obtenidos.

## Tablas

| Tabla | Columnas |
|:---|:---|
| `FESTIUS` | `dia` (numérico), `mes` (numérico), `nom_festa` (texto) |
| `ALUMNES` | `nia` (numérico), `nom_alumne` (texto) |

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA3** (*Implanta métodos de control de acceso utilizando asistentes, herramientas gráficas y comandos del lenguaje del sistema gestor.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **3.c** | Se han definido y eliminado cuentas de usuario. | Crea los usuarios con los permisos y la cuota necesarios para trabajar. |
| **3.d** | Se han identificado los privilegios sobre las bases de datos y sus elementos. | Identifica qué privilegios necesita cada usuario para exportar su esquema y para exportar un tablespace completo. |
| **3.f** | Se han asignado y eliminado privilegios a usuarios. | Concede los permisos sobre el directorio de Oracle y los necesarios para la exportación. |
| **3.g** | Se han asignado y eliminado grupos de privilegios a usuarios. | Asigna el rol de exportación de Data Pump y explica qué privilegios agrupa. |
| **3.h** | Se ha garantizado el cumplimiento de los requisitos de seguridad. | Obtiene las copias, compara qué contiene cada una según el usuario que la lanza y razona las diferencias. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/10 expdp impdp.pdf`.</small>
