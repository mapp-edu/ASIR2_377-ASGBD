---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: CDB y PDB con dbca"
pageClass: ejercicios-page
---

# 🧭 Guía: CDB y PDB con dbca

## Conceptos

**SGBD** = software de base de datos + conjunto de CDB y BD.

| Término | Significado |
|:---|:---|
| BBDD «tradicional» o *stand-alone* | BBDD de trabajo autónoma, aislada |
| BBDD multitenant | CDB + (PDB, ...) |
| **CDB** | Contenedor principal de una BD multitenant. Las CDB son las BD con los datos de configuración global |
| **PDB** | *Pluggable Database*: base de datos de trabajo, a la que se conectan las aplicaciones de los usuarios |
| **PDB$SEED** | Semilla, plantilla o *template* de otras PDB |
| **Instancia** | BBDD en funcionamiento, con datos y procesos en memoria: el conjunto de procesos que se ejecutan en el servidor y la memoria que comparten para acceder a los datos y manipularlos |
| **SGA** (System Global Area) | Área de memoria compartida de la instancia |
| **PGA** (Program Global Area) | Área de memoria privada de cada proceso |

## Crear, borrar y modificar BBDD en Oracle

Se hace con el comando `dbca`, ejecutado:

- desde un CMD con privilegios de administrador y con el usuario SYS, o
- desde un CMD del usuario instalador del SGBD.

Al arrancar, el asistente permite elegir entre crear una base de datos, configurar una existente, suprimirla, gestionar plantillas o **gestionar bases de datos de conexión** (PDB).

## Crear una BD multitenant nueva

Cuando se crea una BD multitenant nueva, se crea una CDB y lo habitual es crear también una primera PDB. En la pantalla de **configuración típica** del asistente:

1. **Nombre de la base de datos global**: es el nombre de la CDB. No puede repetirse con los nombres de otras CDB ya creadas. Este nombre corresponderá con el **SID** (puede ser diferente si optamos por una configuración avanzada).
2. **Nombre de la base de datos de conexión**: el nombre de la primera PDB.
3. La casilla **«Crear como base de datos de contenedor»**: desactivándola se crearía una BD tradicional.

::: warning A partir de la versión 21
Solo se pueden crear BBDD multitenant, no tradicionales.
:::

Si no cambiamos el nombre de la BD global o CDB y ya existe otra con ese nombre, el asistente da un error indicando que el SID o el nombre global ya existen en el sistema.

## Crear una PDB a posteriori

1. Elige en qué CDB se va a crear (el asistente muestra la lista de CDB con su instancia local).
2. Elige la plantilla. Suele estar la plantilla por defecto (`PDB$SEED`).
3. Indica el nombre de la PDB, el nombre del usuario administrador y las contraseñas de acceso.

## Casos posibles

Utilizando la primera ventana de configuración típica se puede crear:

- una BBDD tradicional (solo hasta la versión 19),
- una CDB + una PDB (por ejemplo, `empresa1` + `pdb1`),
- una CDB + varias PDB (`empresa1` + `pdb1` + `pdb2` + `pdb3`),
- una CDB sin PDB.

Con la **configuración avanzada** se puede elegir entre crear una base de datos de contenedor vacía o con una o más PDB, indicando el número de PDB y su prefijo de nombre.

::: danger Recuerda
En Oracle Database 21c (y posteriores) ya no se pueden crear BBDD non-CDB. Solo se pueden crear CDB (*Container Database*).
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD1/ASGBD-UD1.2 DB-CDB i PDB_v2.pdf`.</small>
