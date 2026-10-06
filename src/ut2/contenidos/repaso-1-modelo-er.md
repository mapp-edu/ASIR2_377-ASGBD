---
layout: doc
title: "Repaso: modelo entidad-relación"
sidebar: true
outline: [2, 3]
aside: true
---

# Repaso: modelo entidad-relación

## Introducción al modelo E-R

### Diagrama E-R

Un diagrama E-R (entidad-relación) es una herramienta gráfica utilizada en el diseño de bases de datos para representar de manera visual la estructura de los datos y cómo se relacionan entre ellos.

- Entidades → objetos o conceptos (p. ej., Alumnos, Profesores)
- Atributos → características de las entidades (p. ej., nombre, edad)
- Relaciones → cómo se conectan las entidades (p. ej., un alumno se matricula en un curso)
- Rectángulos → entidades
- Elipses → atributos
- Rombos → relaciones

¿Para qué sirve?

- Ayuda a definir qué datos hay que guardar antes de crear las tablas reales.
- Es el paso previo a crear el esquema SQL.
- Permite ver rápidamente la estructura de la información.
- Es útil para explicar el sistema a otras personas (equipos, clientes, estudiantes).
- Ayuda a detectar duplicaciones de datos, relaciones incorrectas y carencias de información
- Se puede convertir fácilmente en tablas, claves primarias y claves foráneas

### Ejemplo sencillo

Sistema académico: entidad Alumnos, entidad Cursos, relación Matrícula

👉 Interpretación:

Un alumno puede matricularse en varios cursos; un curso puede tener varios alumnos

---

## Entidad

![Entidad PROFESOR con sus atributos dni, nombre, apellido1 y apellido2 #center](/img/contenidos/ut2/E_professor.png)

Una entidad es un objeto, concepto o «cosa» del mundo real sobre el que queremos almacenar información dentro de una base de datos.

Cada entidad tiene atributos, que son los datos que queremos registrar sobre ella.

Una entidad puede ser independiente o depender de otras entidades (relaciones).

| Aspecto | Descripción |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Representación E-R | Normalmente se dibuja con un **rectángulo** |
| Atributos | Columnas que describen propiedades de la entidad (p. ej.: nombre, edad, dirección) |
| Clave primaria | Un atributo o combinación de atributos que identifica **de forma única cada instancia** |
| Instancia | Cada fila o registro concreto de una entidad es una **instancia** (p. ej.: «Anna» en la tabla alumnes) |
| Tipo de entidad | - **Entidad fuerte**: existe de manera independiente (p. ej.: Alumnos, Empleados) |
| Tipo de entidad | - **Entidad débil**: depende de otra entidad para existir (p. ej.: Matrículas depende de Alumnos) |

### Ejemplo

- Entidad: Alumnos
- Atributos: id, nom, edat, curs
- Clave primaria: id

Relación entre entidad y tabla de BBDD

1. Cada entidad corresponde a una tabla en una base de datos relacional.
2. Los atributos de la entidad corresponden a las columnas de la tabla.
3. Las relaciones entre entidades (1:1, 1:N, N:M) indican cómo interactúan las entidades entre ellas.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
