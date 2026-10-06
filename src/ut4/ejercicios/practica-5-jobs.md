---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 5: crear un job en Oracle"
pageClass: ejercicios-page
---

# 📋 Práctica 5: crear un job en Oracle

## Enunciado

Para realizar esta práctica utilizaremos la máquina virtual Windows 10 con Oracle SQL Developer.

Una empresa de seguros tiene dos tablas: una de **pólizas** y otra de **recibos mensuales**. Cada mes hay que generar los recibos de los clientes que tengan su póliza activa.

→ Hay que insertar una fila en la tabla `rebuts` con los datos de cada póliza activa, la fecha del recibo y la cantidad calculada.

## Objetivos

- Automatizar una tarea periódica con un procedimiento almacenado y un job.
- Definir el calendario de ejecución de un job con `DBMS_SCHEDULER`.
- Ejecutar el job manualmente y comprobar sus resultados.

## Tareas

**Con el usuario `system` en `pdb1`:**

1. Crea el usuario `usuari4` (dale contraseña y permisos de conexión y para crear tablas, procedimientos, disparadores y jobs).

**Con `usuari4` en `pdb1`:**

2. Crea la tabla `polisses` y puéblala con los ejemplos de más abajo.
3. Crea la tabla `rebuts`. No la pueblas: se llenará automáticamente con el job y el procedimiento.
4. Crea un procedimiento (de nombre `calcula_rebuts`) que genere los recibos de un mes de las pólizas activas. Prueba el procedimiento, documenta el código y explica cómo actúa.
5. Utilizando el procedimiento de Oracle `DBMS_SCHEDULER.CREATE_JOB`, crea y habilita un job que ejecute el procedimiento `calcula_rebuts` **el primer miércoles de cada mes, a las 02:30 de la madrugada**.
6. Utiliza el procedimiento adecuado del paquete `DBMS_SCHEDULER` para ejecutar el job manualmente y muestra los resultados.

## Tablas

```sql
CREATE TABLE polisses(
numpolissa NUMBER(6) PRIMARY KEY,
codiclient NUMBER(6) ,
nom VARCHAR2(50) NOT NULL,
cobertura number(8,2),
estat VARCHAR2(10),
preu_anual number(8,2) );

CREATE TABLE rebuts(
numpolissa NUMBER(6) not null ,
datap DATE not null ,
quantitat_mes NUMBER(6) not null,
estat varchar2(10) not null ,
constraint rebuts_pk primary key (datap, numpolissa)                );

insert into polisses values (1,1,'pepe', 100000,'actiu',860);
insert into polisses values (2,1,'pepe', 110000,'inactiu',700);
insert into polisses values (3,1,'pepe', 80000,'actiu',600);
insert into polisses values (4,2,'juan', 90000,'actiu',960);
insert into polisses values (5,2,'juan', 70000,'inactiu',880);
insert into polisses values (6,2,'juan', 55000,'inactiu',690);
```

::: tip Apoyo
Consulta la página [Tareas programadas](/ut4/contenidos/oracle/7-tareas-programadas) para la sintaxis de `DBMS_SCHEDULER` y de los intervalos de repetición.
:::

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA4** (*Automatiza tareas de administración del gestor describiéndolas y utilizando guiones de sentencias.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **4.a** | Se ha reconocido la importancia de automatizar tareas administrativas. | Justifica por qué conviene automatizar la generación de recibos en lugar de lanzarla a mano. |
| **4.d** | Se han definido y utilizado guiones para automatizar tareas. | El procedimiento `calcula_rebuts` genera los recibos correctos y el job queda creado, habilitado y con el calendario pedido. |
| **4.g** | Se han utilizado estructuras de control de flujo. | Utiliza un cursor o un bucle y condiciones para recorrer las pólizas activas y calcular la cantidad mensual. |
| **4.h** | Se han adoptado medidas para mantener la integridad y consistencia de la información. | Evita recibos duplicados o incoherentes (clave primaria, confirmación de la transacción, tratamiento de errores) y comprueba el resultado de la ejecución manual. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/12 Activitat jobs_.pdf`.</small>
