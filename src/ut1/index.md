---
layout: doc
title: "UT1 · Implantación de sistemas gestores de bases de datos"
sidebar: true
aside: true
outline: [2, 3]
---

# 📦 UT1 · Implantación de sistemas gestores de bases de datos

En esta unidad se presentan los sistemas gestores de bases de datos: qué son, qué funciones cumplen, qué componentes tienen y cómo se instalan. Verás la arquitectura, las ediciones y los requisitos de **Oracle Database** y de **PostgreSQL**, harás tu primera instalación de cada uno y comprobarás que funcionan.

::: tip Resultado de aprendizaje
**RA1** · Implanta sistemas gestores de bases de datos analizando sus características y ajustándose a los requerimientos del sistema.

**Peso en la nota del módulo:** 5 %
:::

## Criterios de evaluación

| CE | Criterio de evaluación |
|:---:|:---|
| **1.a** | Se ha reconocido la utilidad y función de cada uno de los elementos de un sistema gestor de bases de datos. |
| **1.b** | Se han analizado las características de los principales sistemas gestores de bases de datos. |
| **1.c** | Se ha seleccionado el sistema gestor de bases de datos. |
| **1.d** | Se ha identificado el software necesario para llevar a cabo la instalación. |
| **1.e** | Se ha verificado el cumplimiento de los requisitos hardware. |
| **1.f** | Se han instalado sistemas gestores de bases de datos. |
| **1.g** | Se ha documentado el proceso de instalación. |
| **1.h** | Se ha interpretado la información suministrada por los mensajes de error y ficheros de registro. |
| **1.i** | Se han resuelto las incidencias de la instalación. |
| **1.j** | Se ha verificado el funcionamiento del sistema gestor de bases de datos. |

## Contenidos

La teoría se presenta en dos versiones paralelas, una para cada motor. Sigue la del SGBD con el que trabajes en clase o compara las dos.

### 📚 Conceptos comunes

- [Conceptos generales de un SGBD](./contenidos/1-conceptos-generales)

### 🔶 Oracle y 🐘 PostgreSQL

| 🔶 Oracle | 🐘 PostgreSQL |
|:---|:---|
| [Ediciones, versiones y requisitos](./contenidos/oracle/1-ediciones-versiones-requisitos) | [Versiones, clúster y arquitectura](./contenidos/postgresql/1-versiones-cluster-arquitectura) |
| [Instancia, arquitectura y OFA](./contenidos/oracle/2-instancia-arquitectura) | [Instalación y estructura de carpetas](./contenidos/postgresql/2-instalacion-estructura) |
| [Instalación y acceso](./contenidos/oracle/3-instalacion-acceso) | [Acceso y varios clústeres](./contenidos/postgresql/3-acceso-multicluster) |
| [Creación de PDB y conclusiones](./contenidos/oracle/4-pdb-conclusiones) |  |

## Prácticas y ejercicios

Las prácticas evaluables incluyen su rúbrica, elaborada a partir de los criterios de evaluación de esta unidad.

- [Índice de actividades](./ejercicios/)
- [Práctica 1: preparación de la MV Linux Mint](./ejercicios/practica-1-mv-linux-mint)
- [Práctica 2: desplegar Oracle, PostgreSQL y MariaDB](./ejercicios/practica-2-tres-sgbd)
- [Práctica 3: instalar los clientes de los tres SGBD](./ejercicios/practica-3-clientes)
- [Práctica 4: preparación de la MV Windows 10 Pro](./ejercicios/practica-4-mv-windows-10)
- [Práctica 5: instalar Oracle 21c en Windows 10 Pro](./ejercicios/practica-5-oracle-21c-windows)
- [Práctica 6: selección del SGBD](./ejercicios/practica-6-seleccion-sgbd)
- [Cómo hacer un trabajo de clase](./ejercicios/como-hacer-un-trabajo)
- [Guía: Oracle Database Free en un contenedor](./ejercicios/guia-1-oracle-en-contenedor)
- [Guía: CDB y PDB con dbca](./ejercicios/guia-2-cdb-pdb)
- [Guía: órdenes básicas y primeros errores en Oracle](./ejercicios/guia-3-ordenes-basicas-errores)
- [Cuestionario de autoevaluación](./ejercicios/cuestionario)


---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
