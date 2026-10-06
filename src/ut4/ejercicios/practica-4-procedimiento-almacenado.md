---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 4: procedimiento almacenado y permisos de ejecución"
pageClass: ejercicios-page
---

# 📋 Práctica 4: procedimiento almacenado y permisos de ejecución

## Enunciado

::: warning Atención
Algún punto de esta práctica no funciona del todo bien... Averigua por qué y haz las modificaciones oportunas para que funcione.
:::

Para realizar esta práctica utiliza la máquina virtual facilitada (`windowsOracle6`), en la que todas las contraseñas son `1234`. Usa la herramienta SQL Developer.

## Objetivos

- Crear procedimientos almacenados que modifican datos.
- Conceder el permiso de ejecución de un procedimiento a otro usuario.
- Razonar con qué privilegios se ejecuta un procedimiento y qué puede hacer directamente el usuario que lo invoca.

## Tareas

Trabaja en la primera PDB de la CDB del `ORACLE_SID` (muestra qué valor tiene).

**Con el usuario `system`:**

1. Muestra el valor de `ORACLE_SID` y la PDB en la que vas a trabajar.
2. Crea el usuario `usuari1` (dale contraseña y permisos de conexión, de crear tablas y de crear procedimientos).
3. Crea el usuario `usuari2` (dale contraseña y permisos de conexión).

**Con el usuario `usuari1` en `pdb1`:**

4. Crea la tabla `llibres3`.
5. Crea un procedimiento (de nombre `amay`) que ponga todos los datos de la tabla en mayúsculas.
6. Dale a `usuari2` permiso de ejecución del procedimiento creado.
7. Inserta 3 filas con datos en mayúsculas y minúsculas.
8. Lista los datos de la tabla.

**Con el usuario `usuari2` en `pdb1`:**

9. Ejecuta el procedimiento (`execute usuari1.amay;`).
10. Explora los resultados (lista los datos). Comenta qué sucede y por qué.
11. Inserta 2 filas más con datos en mayúsculas y minúsculas. Comenta qué sucede y por qué.
12. Explora los resultados. Comenta qué sucede y por qué.
13. Contesta: ¿cómo podríamos solucionarlo?

**De nuevo con `usuari1`:**

14. Crea un procedimiento que inserte libros de la editorial «Sintesis», llamado `inserixSintesis`, al que se le pase como parámetro el nombre del libro y el precio.
15. El procedimiento buscará el último código de la tabla y lo incrementará en 1 para dar de alta el nuevo registro.
16. Da permiso a `usuari2` para ejecutar el nuevo procedimiento y pruébalo desde `usuari2`.

## Tabla `llibres3`

```sql
CREATE TABLE llibres3(
  codi NUMBER(6) PRIMARY KEY,
  titol VARCHAR2(30) NOT NULL,
  editorial VARCHAR2(30),
  preu NUMBER(8,2),
  datadalta date );
```

::: tip Apoyo
La [guía sobre AUTHID](./guia-1-authid) explica con qué privilegios se ejecuta un procedimiento almacenado.
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
| **4.a** | Se ha reconocido la importancia de automatizar tareas administrativas. | Explica qué ventaja tiene encapsular la tarea en un procedimiento que otros usuarios pueden ejecutar sin acceder a la tabla. |
| **4.d** | Se han definido y utilizado guiones para automatizar tareas. | Los procedimientos `amay` e `inserixSintesis` funcionan y se ejecutan desde el segundo usuario. |
| **4.g** | Se han utilizado estructuras de control de flujo. | Utiliza variables y sentencias de control para obtener el último código e insertar el nuevo registro. |
| **4.h** | Se han adoptado medidas para mantener la integridad y consistencia de la información. | Explica qué sucede en los puntos 10 a 13 (privilegios del invocador, transacciones sin confirmar) y propone una solución que mantiene los datos consistentes. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/11 automatització_I_procs_i_funcs.pdf (Crear procediment emmagatzemat en SQL Developer)`.</small>
