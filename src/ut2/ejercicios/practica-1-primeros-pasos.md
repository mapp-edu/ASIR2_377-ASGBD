---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 1: primeros pasos en la administración de Oracle"
pageClass: ejercicios-page
---

# 📋 Práctica 1: primeros pasos en la administración de Oracle

## Enunciado

Realiza un primer recorrido por la configuración de un servidor Oracle: variables de entorno, ficheros de red, parámetros de la instancia, almacenamiento, arranque y parada, y diccionario de datos.

Utiliza las máquinas Linux Mint (servidor y cliente) de la unidad anterior.

## Objetivos

- Localizar los elementos de configuración del SGBD y de sus herramientas cliente.
- Describir y ejecutar las condiciones de inicio y parada del sistema gestor.
- Definir características por defecto de las bases de datos (tablespaces) y modificar parámetros de la instancia.

## Desarrollo

### Desde el sistema operativo (dentro del contenedor podman)

1. Localiza el valor de las variables de sistema `ORACLE_SID`, `ORACLE_HOME` y `ORACLE_BASE` (¡sin entrar en Oracle, ni en SQL\*Plus, ni en SQL Developer!).
2. Localiza los ficheros `listener.ora`, `sqlnet.ora` y `tnsnames.ora`. ¿Cuántos hay de cada uno?
3. Localiza el fichero SPFILE. ¿Qué nombre tiene? ¿Dónde está ubicado?

### Con SQL Developer (desde la máquina cliente)

4. Realiza una conexión desde la MV cliente a la máquina servidor de Oracle 23 con el usuario administrador de Oracle (`sys`). Conecta a la primera PDB.
5. Muestra los registros (los nombres) de la vista del DD que contiene los tablespaces creados en la instalación. Comenta cada uno de ellos.
6. Crea un nuevo tablespace simple `T1` de 10 MB (utiliza la ruta de los tablespaces de la PDB).
7. Crea un nuevo tablespace `T2` autoextensible de 20 MB (en la misma ruta).
8. Añade un datafile al tablespace `T1`.
9. Crea un nuevo tablespace temporal `T3_temp` de 30 MB.
10. ¿Dónde se han creado los tablespaces, en la CDB o en la PDB? Indica el nombre de la CDB o de la PDB.
11. Muestra los registros (con datos) de la vista del DD que contiene los tablespaces creados.
12. Muestra los registros (con datos) de la vista del DD que contiene los datafiles creados.
13. ¿Cómo se llama el tablespace de UNDO?

### De nuevo en el servidor (dentro del contenedor podman)

14. Localiza los ficheros *redo log*, *alert log* y *listener log* (no tienen por qué llamarse exactamente así).

### Con SQL\*Plus (como SYS)

15. Para la BBDD de manera «inmediata».
16. Arranca la BBDD multitenant en el estado `NOMOUNT` (muestra los resultados).
17. Pasa al estado `OPEN` (muestra los resultados).
18. Modifica el parámetro `sort_area_size`: aumenta un 15 % su valor, de forma permanente e inmediata.
19. Averigua el nombre de la `CDB$ROOT` y el de la primera PDB.
20. Conecta como `sys` a la primera PDB. ¿Cómo se llama?
21. Crea cuatro tablas (DDL). Abajo tienes dos ejemplos.
22. Explora en el DD las tablas creadas. Describe las vistas del DD utilizadas.
23. Muestra los registros (con datos) de la vista del DD que contiene las tablas creadas.

### Tablas de ejemplo

| Tabla | Campos |
|:---|:---|
| **Alumnes** | Nia, Nom, Adreça, Telefon, Email, dataAlta |
| **Modul** | CodModul, NomModul, Cicle, Curs, Hores |

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA2** (*Configura el sistema gestor de bases de datos interpretando las especificaciones técnicas y los requisitos de explotación.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **2.a** | Se han descrito las condiciones de inicio y parada del sistema gestor. | Para y arranca la instancia pasando por los estados `NOMOUNT` y `OPEN`, y explica qué ocurre en cada uno. |
| **2.d** | Se han configurado las herramientas y software cliente del sistema gestor. | Localiza y explica los ficheros de configuración de las herramientas cliente y de red (`listener.ora`, `sqlnet.ora`, `tnsnames.ora`). |
| **2.e** | Se ha configurado la conectividad en red del sistema gestor. | Conecta desde la máquina cliente al servidor y a la PDB correcta. |
| **2.f** | Se han definido las características por defecto de las bases de datos. | Crea y consulta tablespaces y datafiles (simple, autoextensible y temporal) y sitúa correctamente dónde se crean. |
| **2.g** | Se han definido los parámetros relativos a las conexiones (tiempos de espera, número máximo de conexiones, entre otros). | Localiza los parámetros de la instancia (SPFILE) y modifica uno de forma permanente e inmediata con el ámbito adecuado. |
| **2.h** | Se ha documentado el proceso de configuración. | Documenta el proceso de configuración, las vistas del DD utilizadas y los resultados. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/08 primers pasos.pdf`.</small>
