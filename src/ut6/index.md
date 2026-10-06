---
layout: doc
title: "UT6 · Disponibilidad: bases de datos distribuidas y replicadas"
sidebar: true
aside: true
outline: [2, 3]
---

# ⏱️ UT6 · Disponibilidad: bases de datos distribuidas y replicadas

La última unidad aborda la disponibilidad: bases de datos en la nube y en clúster, SGBD distribuidos y las reglas de Date, técnicas de fragmentación y de replicación, y las soluciones concretas de Oracle (RAC) y de PostgreSQL.

::: tip Resultado de aprendizaje
**RA6** · Aplica criterios de disponibilidad analizándolos y ajustando la configuración del sistema gestor.

**Peso en la nota del módulo:** 10 %
:::

## Criterios de evaluación

| CE | Criterio de evaluación |
|:---:|:---|
| **6.a** | Se ha reconocido la utilidad de las bases de datos distribuidas. |
| **6.b** | Se han descrito las distintas políticas de fragmentación de la información. |
| **6.c** | Se ha implantado una base de datos distribuida homogénea. |
| **6.d** | Se ha creado una base de datos distribuida mediante la integración de un conjunto de bases de datos preexistentes. |
| **6.e** | Se ha configurado un «nodo» maestro y varios «esclavos» para llevar a cabo la replicación del primero. |
| **6.f** | Se ha configurado un sistema de replicación en cadena. |
| **6.g** | Se ha comprobado el efecto de la parada de determinados nodos sobre los sistemas distribuidos y replicados. |

## Contenidos

La teoría se presenta en dos versiones paralelas, una para cada motor. Sigue la del SGBD con el que trabajes en clase o compara las dos.

### 📚 Conceptos comunes

- [Bases de datos en la nube y clústeres](./contenidos/1-nube-cluster)
- [SGBD distribuidos y reglas de Date](./contenidos/2-sgbd-distribuidos)
- [Fragmentación y replicación](./contenidos/3-fragmentacion-replicacion)

### 🔶 Oracle y 🐘 PostgreSQL

| 🔶 Oracle | 🐘 PostgreSQL |
|:---|:---|
| [Clúster Oracle RAC](./contenidos/oracle/1-oracle-rac) | [PostgreSQL como SGBD distribuido](./contenidos/postgresql/1-postgresql-distribuido) |

## Prácticas y ejercicios

Las prácticas evaluables incluyen su rúbrica, elaborada a partir de los criterios de evaluación de esta unidad.

- [Índice de actividades](./ejercicios/)
- [Práctica 1: base de datos distribuida y fragmentación](./ejercicios/practica-1-base-de-datos-distribuida)
- [Práctica 2: integración de bases de datos preexistentes](./ejercicios/practica-2-integracion-de-bases-de-datos)
- [Práctica 3: replicación maestro-esclavo y en cadena](./ejercicios/practica-3-replicacion)
- [Cuestionario de autoevaluación](./ejercicios/cuestionario)


---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
