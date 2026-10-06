---
layout: doc
title: "UT2 · Configuración del sistema gestor de bases de datos"
sidebar: true
aside: true
outline: [2, 3]
---

# 🛠️ UT2 · Configuración del sistema gestor de bases de datos

Con el SGBD ya instalado, en esta unidad se configura: variables de entorno y conexiones en red, instancia y cuentas de administración, arranque y parada, estructuras de almacenamiento, diccionario de datos y ficheros de registro. Incluye un **repaso previo** del modelo entidad-relación y de SQL.

::: tip Resultado de aprendizaje
**RA2** · Configura el sistema gestor de bases de datos interpretando las especificaciones técnicas y los requisitos de explotación.

**Peso en la nota del módulo:** 5 %
:::

## Criterios de evaluación

| CE | Criterio de evaluación |
|:---:|:---|
| **2.a** | Se han descrito las condiciones de inicio y parada del sistema gestor. |
| **2.b** | Se ha seleccionado el motor de base de datos. |
| **2.c** | Se han asegurado las cuentas de administración. |
| **2.d** | Se han configurado las herramientas y software cliente del sistema gestor. |
| **2.e** | Se ha configurado la conectividad en red del sistema gestor. |
| **2.f** | Se han definido las características por defecto de las bases de datos. |
| **2.g** | Se han definido los parámetros relativos a las conexiones (tiempos de espera, número máximo de conexiones, entre otros). |
| **2.h** | Se ha documentado el proceso de configuración. |

## Contenidos

La teoría se presenta en dos versiones paralelas, una para cada motor. Sigue la del SGBD con el que trabajes en clase o compara las dos.

### ⏳ Repaso previo

- [Repaso: modelo entidad-relación](./contenidos/repaso-1-modelo-er)
- [Repaso de SQL: tipos de datos y tablas](./contenidos/repaso-2-sql-tablas)
- [Repaso de SQL: operaciones CRUD](./contenidos/repaso-3-sql-crud)
- [Repaso de SQL: normalización, permisos, transacciones y JOIN](./contenidos/repaso-4-sql-avanzado)

### 🔶 Oracle y 🐘 PostgreSQL

| 🔶 Oracle | 🐘 PostgreSQL |
|:---|:---|
| [Entorno y conexiones](./contenidos/oracle/1-entorno-conexiones) | [Entorno y conexiones](./contenidos/postgresql/1-entorno-conexiones) |
| [Instancia, cuentas de administración y arranque](./contenidos/oracle/2-instancia-cuentas-arranque) | [Clúster, cuentas de administración y arranque](./contenidos/postgresql/2-instancia-cuentas-arranque) |
| [Almacenamiento y diccionario de datos](./contenidos/oracle/3-almacenamiento-diccionario) | [Almacenamiento y diccionario de datos](./contenidos/postgresql/3-almacenamiento-diccionario) |
| [Redo log, ficheros log y parámetros NLS](./contenidos/oracle/4-redo-log-ficheros-log) | [WAL y ficheros log](./contenidos/postgresql/4-wal-ficheros-log) |
| [Gestión de fechas](./contenidos/oracle/5-fechas-en-oracle) |  |

## Prácticas y ejercicios

Las prácticas evaluables incluyen su rúbrica, elaborada a partir de los criterios de evaluación de esta unidad.

- [Índice de actividades](./ejercicios/)
- [Práctica 1: primeros pasos en la administración de Oracle](./ejercicios/practica-1-primeros-pasos)
- [Práctica 2: selección del motor de almacenamiento](./ejercicios/practica-2-motor-de-almacenamiento)
- [Práctica 3: asegurar las cuentas de administración](./ejercicios/practica-3-cuentas-de-administracion)
- [Guía: tablespaces y datafiles en Oracle](./ejercicios/guia-1-tablespaces-datafiles)
- [Guía: uso de SQL*Plus](./ejercicios/guia-2-uso-sqlplus)
- [Guía: uso de vi](./ejercicios/guia-3-uso-vi)
- [Cuestionario de autoevaluación](./ejercicios/cuestionario)


---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
