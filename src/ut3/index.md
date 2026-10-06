---
layout: doc
title: "UT3 · Control de acceso: usuarios, vistas y privilegios"
sidebar: true
aside: true
outline: [2, 3]
---

# 👥 UT3 · Control de acceso: usuarios, vistas y privilegios

Esta unidad trata el control de acceso y la seguridad de los datos: usuarios, privilegios, roles, perfiles, vistas y sinónimos, además del cifrado, la auditoría, las transacciones, las copias de seguridad y la **normativa de protección de datos**.

::: tip Resultado de aprendizaje
**RA3** · Implanta métodos de control de acceso utilizando asistentes, herramientas gráficas y comandos del lenguaje del sistema gestor.

**Peso en la nota del módulo:** 25 %
:::

## Criterios de evaluación

| CE | Criterio de evaluación |
|:---:|:---|
| **3.a** | Se han creado vistas personalizadas para cada tipo de usuario. |
| **3.b** | Se han creado sinónimos de tablas y vistas. |
| **3.c** | Se han definido y eliminado cuentas de usuario. |
| **3.d** | Se han identificado los privilegios sobre las bases de datos y sus elementos. |
| **3.e** | Se han agrupado y desagrupado privilegios. |
| **3.f** | Se han asignado y eliminado privilegios a usuarios. |
| **3.g** | Se han asignado y eliminado grupos de privilegios a usuarios. |
| **3.h** | Se ha garantizado el cumplimiento de los requisitos de seguridad. |

## Contenidos

La teoría se presenta en dos versiones paralelas, una para cada motor. Sigue la del SGBD con el que trabajes en clase o compara las dos.

### 📚 Conceptos comunes

- [La tríada CID](./contenidos/1-triada-cid)
- [Normativa de protección de datos](./contenidos/2-normativa-proteccion-datos)

### 🔶 Oracle y 🐘 PostgreSQL

| 🔶 Oracle | 🐘 PostgreSQL |
|:---|:---|
| [Usuarios y seguridad de las cuentas](./contenidos/oracle/1-usuarios) | [Usuarios y seguridad de las cuentas](./contenidos/postgresql/1-usuarios) |
| [Privilegios, roles y perfiles](./contenidos/oracle/2-privilegios-roles-perfiles) | [Privilegios, roles y perfiles](./contenidos/postgresql/2-privilegios-roles-perfiles) |
| [Vistas y sinónimos](./contenidos/oracle/3-vistas-sinonimos) | [Vistas como mecanismo de seguridad](./contenidos/postgresql/3-vistas) |
| [Cifrado y auditoría](./contenidos/oracle/4-cifrado-auditoria) | [Cifrado y auditoría](./contenidos/postgresql/4-cifrado-auditoria) |
| [Integridad y transacciones](./contenidos/oracle/5-integridad-transacciones) | [Integridad y transacciones](./contenidos/postgresql/5-integridad-transacciones) |
| [Copias de seguridad y recuperación](./contenidos/oracle/6-copias-seguridad) | [Copias de seguridad y recuperación](./contenidos/postgresql/6-copias-seguridad) |

## Prácticas y ejercicios

Las prácticas evaluables incluyen su rúbrica, elaborada a partir de los criterios de evaluación de esta unidad.

- [Índice de actividades](./ejercicios/)
- [Práctica 1: usuarios y permisos](./ejercicios/practica-1-usuarios-permisos)
- [Práctica 2: copias con Oracle expdp](./ejercicios/practica-2-copias-expdp)
- [Práctica 3: vistas, sinónimos y roles](./ejercicios/practica-3-vistas-sinonimos-roles)
- [Guía: conexiones como SYSDBA en Windows](./ejercicios/guia-1-sysdba-en-windows)
- [Guía: permisos UPDATE y DELETE en Oracle](./ejercicios/guia-2-update-delete-select)
- [Guía: usuarios comunes en Oracle](./ejercicios/guia-3-usuarios-comunes)
- [Cuestionario de autoevaluación](./ejercicios/cuestionario)


---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
