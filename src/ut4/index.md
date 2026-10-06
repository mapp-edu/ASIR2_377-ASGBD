---
layout: doc
title: "UT4 · Automatización de tareas de administración"
sidebar: true
aside: true
outline: [2, 3]
---

# 📝 UT4 · Automatización de tareas de administración

Es la unidad con más peso del módulo. Se aprende a automatizar tareas de administración con guiones: bloques, variables, estructuras de control, procedimientos y funciones, disparadores, cursores, excepciones y tareas programadas, con **PL/SQL** en Oracle y **PL/pgSQL** en PostgreSQL.

::: tip Resultado de aprendizaje
**RA4** · Automatiza tareas de administración del gestor describiéndolas y utilizando guiones de sentencias.

**Peso en la nota del módulo:** 45 %
:::

## Criterios de evaluación

| CE | Criterio de evaluación |
|:---:|:---|
| **4.a** | Se ha reconocido la importancia de automatizar tareas administrativas. |
| **4.b** | Se han descrito los distintos métodos de ejecución de guiones. |
| **4.c** | Se han identificado las herramientas disponibles para redactar guiones. |
| **4.d** | Se han definido y utilizado guiones para automatizar tareas. |
| **4.e** | Se han identificado los eventos susceptibles de activar disparadores. |
| **4.f** | Se han definido disparadores. |
| **4.g** | Se han utilizado estructuras de control de flujo. |
| **4.h** | Se han adoptado medidas para mantener la integridad y consistencia de la información. |

## Contenidos

La teoría se presenta en dos versiones paralelas, una para cada motor. Sigue la del SGBD con el que trabajes en clase o compara las dos.

### 🔶 Oracle y 🐘 PostgreSQL

| 🔶 Oracle | 🐘 PostgreSQL |
|:---|:---|
| [Automatización, conceptos](./contenidos/oracle/1-automatizacion-conceptos) | [Automatización, conceptos](./contenidos/postgresql/1-automatizacion-conceptos) |
| [Bloques anónimos, variables y operaciones](./contenidos/oracle/2-bloques-variables) | [Bloques DO, variables y operaciones](./contenidos/postgresql/2-bloques-variables) |
| [Estructuras de control](./contenidos/oracle/3-estructuras-control) | [Estructuras de control](./contenidos/postgresql/3-estructuras-control) |
| [Procedimientos y funciones](./contenidos/oracle/4-procedimientos-funciones) | [Procedimientos y funciones](./contenidos/postgresql/4-procedimientos-funciones) |
| [Disparadores y secuencias](./contenidos/oracle/5-disparadores-secuencias) | [Disparadores y secuencias](./contenidos/postgresql/5-disparadores-secuencias) |
| [Cursores y excepciones](./contenidos/oracle/6-cursores-excepciones) | [Cursores y excepciones](./contenidos/postgresql/6-cursores-excepciones) |
| [Tareas automatizables](./contenidos/oracle/7-tareas-programadas) | [Tareas automatizables](./contenidos/postgresql/7-tareas-programadas) |

## Prácticas y ejercicios

Las prácticas evaluables incluyen su rúbrica, elaborada a partir de los criterios de evaluación de esta unidad.

- [Índice de actividades](./ejercicios/)
- [Práctica 1: bloques anónimos en Oracle](./ejercicios/practica-1-bloques-anonimos)
- [Práctica 2: boletín de repaso de PL/SQL](./ejercicios/practica-2-boletin-plsql)
- [Práctica 3: boletín de procedimientos y funciones](./ejercicios/practica-3-procedimientos-funciones)
- [Práctica 4: procedimiento almacenado y permisos de ejecución](./ejercicios/practica-4-procedimiento-almacenado)
- [Práctica 5: crear un job en Oracle](./ejercicios/practica-5-jobs)
- [Práctica 6: disparadores](./ejercicios/practica-6-disparadores)
- [Guía: AUTHID en los procedimientos almacenados](./ejercicios/guia-1-authid)
- [Guía: la variable de control en WHILE, FOR y LOOP](./ejercicios/guia-2-ambito-variables-bucles)
- [Cuestionario de autoevaluación](./ejercicios/cuestionario)


---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
