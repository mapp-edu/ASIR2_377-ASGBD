---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 6: selección del SGBD"
pageClass: ejercicios-page
---

# 📋 Práctica 6: selección del SGBD

## Enunciado

Trabajas en el departamento de sistemas de una consultora. Tres clientes necesitan una base de datos y te piden que **recomiendes el SGBD** con el que deben trabajar. No se trata de instalar nada: se trata de analizar cada caso, comparar alternativas y **justificar la elección**.

Puedes hacer esta práctica antes o después de las instalaciones: no depende de ellas.

## Objetivos

- Analizar y comparar las características de los principales SGBD.
- Aplicar los factores de selección de un SGBD a casos concretos.
- Identificar el software y el hardware que exigirá la opción elegida.

## Los tres casos

| Caso | Descripción |
|:---|:---|
| **A. Tienda en línea de una pyme** | Una tienda de material deportivo de Alcoi con 12 empleados quiere una tienda web. Prevén unos 300 pedidos al día, picos en rebajas y un presupuesto muy ajustado. No tienen personal informático propio: el mantenimiento lo hará una empresa externa. |
| **B. Entidad financiera** | Una cooperativa de crédito con 80 oficinas necesita renovar el sistema que registra las operaciones de sus clientes. No puede perderse ninguna transacción, el servicio debe estar disponible las 24 horas y están sometidos a auditorías y a normativa estricta. Tienen equipo propio de administradores y presupuesto para licencias y soporte. |
| **C. Red de sensores** | Un ayuntamiento instala 2000 sensores de calidad del aire y de ruido que envían una medida por minuto. Quieren conservar los datos cinco años, consultarlos por fecha y por zona, y mostrarlos en un mapa. |

## Tareas

### Parte 1. Estudio de alternativas

1. Elige **cinco SGBD** que consideres candidatos razonables (al menos uno comercial, uno libre y uno no relacional). Consulta su posición en el [ranking de DB-Engines](https://db-engines.com/en/ranking).
2. Elabora una **tabla comparativa** de los cinco con, como mínimo: tipo de licencia y coste, modelo de datos, sistemas operativos soportados, límites de la edición gratuita (si la hay), mecanismos de alta disponibilidad, herramientas de administración y soporte técnico disponible.

### Parte 2. Selección para cada caso

Para **cada uno** de los tres casos:

3. Enumera los **requisitos** que se deducen del enunciado y clasifícalos según los factores de selección vistos en la unidad (tipo y volumen de datos, usuarios y concurrencia, tipo de consultas, coste, escalabilidad, seguridad y normativa, experiencia del equipo, soporte).
4. Estima el **volumen de datos** que se generará en un año. En el caso C, calcula el número de filas.
5. **Elige un SGBD** y una edición concreta. Indica también cuál sería tu segunda opción y por qué la descartas.
6. Explica qué **factor ha sido decisivo** y qué riesgo asumes con la elección.

### Parte 3. Qué hace falta para instalarlo

Para el SGBD elegido en **uno** de los casos (el que prefieras):

7. Localiza en la documentación oficial los **requisitos de hardware** (procesador, memoria, disco) y compáralos con los de la máquina virtual que usas en clase. ¿La cumple?
8. Enumera el **software necesario** para instalarlo: sistema operativo y versión, paquetes o dependencias, y de dónde se descarga.
9. Indica qué **software cliente** usarían los administradores y qué conector o *driver* necesitaría la aplicación.

## Orientaciones

- Los factores de selección están en la página [Conceptos generales de un SGBD](/ut1/contenidos/1-conceptos-generales).
- No hay una única respuesta correcta: se valora que la elección sea **coherente con los requisitos** que tú mismo has identificado.
- Cita siempre la fuente de cada dato (documentación oficial, página de precios, etc.) y la fecha de consulta: las licencias y los límites cambian.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA1** (*Implanta sistemas gestores de bases de datos analizando sus características y ajustándose a los requerimientos del sistema.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **1.b** | Se han analizado las características de los principales sistemas gestores de bases de datos. | La tabla comparativa recoge datos correctos, actuales y con fuente de los cinco SGBD analizados. |
| **1.c** | Se ha seleccionado el sistema gestor de bases de datos. | Elige un SGBD y una edición para cada caso y la elección es coherente con los requisitos identificados. |
| **1.d** | Se ha identificado el software necesario para llevar a cabo la instalación. | Identifica el software necesario para instalar la opción elegida: sistema operativo, dependencias, clientes y conectores. |
| **1.e** | Se ha verificado el cumplimiento de los requisitos hardware. | Contrasta los requisitos de hardware oficiales con la máquina disponible y concluye si los cumple. |

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

<small>Práctica de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
