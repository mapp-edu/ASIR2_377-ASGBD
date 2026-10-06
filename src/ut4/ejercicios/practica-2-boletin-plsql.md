---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 2: boletín de repaso de PL/SQL"
pageClass: ejercicios-page
---

# 📋 Práctica 2: boletín de repaso de PL/SQL

## Enunciado

Utiliza SQL Developer.

1. Conecta con `SYSTEM` a la primera PDB (`con_id=3`).
2. Crea el usuario `usuari1` en la primera PDB y dale los permisos necesarios.
3. Conecta con `usuari1` a la primera PDB.

## Objetivos

- Utilizar variables de sustitución para pedir datos.
- Utilizar las estructuras de control de flujo de PL/SQL.
- Transformar un bloque anónimo en un procedimiento o en una función.

## Tareas

**Tarea 1.** Crea un bloque anónimo que pida dos números (utiliza dos variables de sustitución) y diga la suma, la multiplicación, la resta y la división de los números.

**Tarea 2.** Cálculo de la superficie de varias figuras geométricas (utiliza tres variables de sustitución):

| Figura | Superficie |
|:---|:---|
| Rectángulo | base × altura |
| Cuadrado | base² |
| Triángulo | (base × altura) / 2 |
| Círculo | π × radio² |

**Tarea 3.** Crea un fragmento de código que, dado un mes del año en número (de 1 a 12), muestre el nombre del mes (utiliza una variable de sustitución).

**Tarea 4.** Haz otro fragmento que, dado un mes (utiliza una variable de sustitución), en lugar de mostrar el nombre del mes muestre los días que tiene. (Consideramos que febrero siempre tiene 28 días.)

**Tarea 5.** Otro fragmento que, dado un día de la semana en número (de 1 a 7), muestre si el día introducido es entre semana o fin de semana (utiliza una variable de sustitución).

**Tarea 6.** Un bloque anónimo que reciba una cadena y la visualice al revés (utiliza una variable de sustitución). Transforma el bloque anónimo en un procedimiento. Ejecuta el procedimiento utilizando notación posicional y notación nominal.

**Tarea 7.** Un fragmento de código que devuelva el número de años completos que hay entre dos fechas que se pasan como cadenas. Transforma el bloque anónimo en una función.

**Tarea 8.** Un bloque anónimo que escriba solamente caracteres alfabéticos, sustituyendo cualquier otro carácter por blancos, a partir de una cadena que se pasará en una variable de sustitución.

## Pistas

Puedes utilizar las funciones predefinidas de PL/SQL:

| Numéricas | De cadenas |
|:---|:---|
| `round(n)`, `trunc(n)`, `mod(n,m)`, `floor(n)`, `ceil(n)` | `length(s)`, `lower(s)`, `upper(s)`, `initcap(s)`, `trim(s)`, `ascii(s)`, `chr(n)`, `substr(s,n[,l])`, `instr(c,s)`, `replace(s,s1,s2)`, <code>&#124;&#124;</code> |

Operaciones con fechas:

- `fecha2 - fecha1` → número de días entre las dos fechas.
- `fecha1 + num` → fecha de `num` días después de `fecha1`.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA4** (*Automatiza tareas de administración del gestor describiéndolas y utilizando guiones de sentencias.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **4.b** | Se han descrito los distintos métodos de ejecución de guiones. | Ejecuta los guiones con variables de sustitución y muestra las ejecuciones con distintos datos de entrada. |
| **4.d** | Se han definido y utilizado guiones para automatizar tareas. | Los ocho guiones funcionan, y el procedimiento y la función se crean y se invocan correctamente. |
| **4.g** | Se han utilizado estructuras de control de flujo. | Elige y utiliza la estructura de control adecuada en cada tarea (`IF`, `CASE`, bucles) y justifica la elección. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/11 automatització_I_procs_i_funcs.pdf (Butlletí repàs PL/SQL)`.</small>
