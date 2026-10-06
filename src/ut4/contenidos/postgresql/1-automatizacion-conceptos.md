---
layout: doc
title: "PostgreSQL: automatización, conceptos"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: automatización, conceptos

## Automatización

La automatización consiste en hacer tareas de manera sistemática y repetitiva sin que intervenga un usuario en su ejecución

Cuando hablamos de automatización en PostgreSQL, generalmente nos referimos a procesos que se programan para ejecutarse automáticamente, sin necesidad de intervención manual. PostgreSQL ofrece diversas herramientas y métodos para hacerlo

### Ventajas de la automatización

- Ahorro de tiempo
- Reducción de los costes de administración
- Reducción de errores (humanos)

### Tipos

- Programa externo (al SGBD)

  - Programador de tareas de Windows, crontab en Linux, etc.

- Programa interno: rutina de BBDD + job

### Rutina

- Script, guion, programa o secuencia de comandos que permite llevar a cabo el procesamiento de ciertas acciones
- Cuando se crea recibe un nombre que permite invocarla tantas veces como sea necesario
- Fueron introducidas en la versión SQL3, o SQL:1999

Los guiones o scripts dieron paso a los lenguajes procedimentales como PL/SQL (Procedural Language, que es diferente del SQL)

**SQL** (Structured Query Language) es un lenguaje declarativo. Se utiliza para gestionar y consultar bases de datos. No tiene estructuras de control como bucles o condiciones complejas. SELECT (consultar datos), INSERT (insertar datos), UPDATE (actualizar datos), DELETE (borrar datos), y otras como DDL, DCL, TCL

**PL/pgSQL** (Procedural Language / PostgreSQL Structured Query Language). Es la adaptación a PostgreSQL de PL/SQL, creado por Oracle. Es un lenguaje procedimental. Permite utilizar: variables, condiciones (IF), bucles (LOOP, WHILE, FOR), procedimientos y funciones. Se utiliza para crear programas dentro de la base de datos.

### El SGBD debe proporcionar:

- Las herramientas necesarias para crear rutinas
- Herramientas para ejecutar las rutinas automáticamente

### Ventajas de la rutina interna

- Rendimiento
- Reutilización de código
- Encapsula reglas de negocio
- Mayor seguridad

---

## Las rutinas se deben documentar

## ¿QUÉ?

Descripción de la tarea, descripción de los parámetros de entrada y salida, autor, versión, fecha de la última modificación, etc.

## ¿CÓMO?

\*\* Utilizando comentarios en el código de las rutinas, con /\* \*/ o --

```txt
-- Esta línea es un comentario
```

\*\* Utilizando documentación institucional en cualquier soporte (documentos, hojas de cálculo, diagramas, etc.)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
