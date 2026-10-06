---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Cuestionario de autoevaluación"
pageClass: ejercicios-page
---


# ✅ Cuestionario de autoevaluación

Comprueba lo que has aprendido en la unidad. Piensa la respuesta antes de desplegar la solución.

## Oracle

**1. ¿Quién asegura la disponibilidad y el acceso al SGBD?**

- a) SO
- b) APP
- c) EULA
- d) DBA

::: details Ver respuesta
d) DBA
:::

**2. ¿Cómo se llama la plantilla por defecto de las PDB?**

- a) pdb$template
- b) cdb$seed
- c) pdb$root
- d) pdb$seed

::: details Ver respuesta
d) pdb$seed
:::

**3. Para crear una nueva PDB utilizaremos:**

- a) rman
- b) dbmgr
- c) netca
- d) dbca

::: details Ver respuesta
d) dbca
:::

**4. En una instancia de Oracle, la SGA es:**

- a) Área de memoria compartida de cada proceso
- b) Área de memoria privada de la instancia
- c) Área de memoria privada de cada proceso
- d) Área de memoria compartida de la instancia

::: details Ver respuesta
d) Área de memoria compartida de la instancia
:::

**5. Sentencia para borrar una BBDD de trabajo:**

- a) `DROP CONTAINER DATABASE nom_pdb INCLUDING DATAFILES;`
- b) `DROP DATABASE nom_pdb INCLUDING DATAFILES;`
- c) `ERASE PLUGGABLE DATABASE nom_pdb INCLUDING DATAFILES;`
- d) `DROP PLUGGABLE DATABASE nom_pdb INCLUDING DATAFILES;`

::: details Ver respuesta
d) `DROP PLUGGABLE DATABASE nom_pdb INCLUDING DATAFILES;`
:::

**6. sqlplus forma parte de los servicios del SGBD de Oracle**

- a) Verdadero
- b) Falso

::: details Ver respuesta
b) Falso
:::

**7. El código se puede poner dentro de un fichero .sql y ejecutarlo desde bash**

- a) Falso
- b) Verdadero

::: details Ver respuesta
b) Verdadero
:::

## PostgreSQL

**1. psql forma parte de los servicios del SGBD de PostgreSQL**

- a) Verdadero
- b) Falso

::: details Ver respuesta
b) Falso
:::

**2. El código se puede poner dentro de un fichero .sql y ejecutarlo desde bash**

- a) Falso
- b) Verdadero

::: details Ver respuesta
b) Verdadero
:::

**3. ¿Cómo gestiona PostgreSQL las conexiones?**

- a) Crea un hilo por cada conexión
- b) Crea un proceso por cada conexión
- c) Todas las conexiones comparten un proceso
- d) No crea ningún proceso nuevo

::: details Ver respuesta
b) Crea un proceso por cada conexión
:::

**4. ¿Qué proceso es responsable de crear los procesos backend?**

- a) Autovacuum
- b) WAL writer
- c) postmaster
- d) Checkpointer

::: details Ver respuesta
c) postmaster
:::

**5. ¿Qué es un schema en PostgreSQL?**

- a) Un tipo de tabla
- b) Una base de datos independiente
- c) Un contenedor de objetos dentro de una base de datos
- d) Un disco físico

::: details Ver respuesta
c) Un contenedor de objetos dentro de una base de datos
:::

**6. ¿Qué elemento define la ubicación física de los datos?**

- a) Schema
- b) Tablespace
- c) Base de datos
- d) Rol

::: details Ver respuesta
b) Tablespace
:::

**7. ¿Dónde se definen los usuarios (roles) en PostgreSQL?**

- a) Dentro de cada tabla
- b) Dentro de cada schema
- c) A nivel de clúster
- d) Solo dentro del postmaster

::: details Ver respuesta
c) A nivel de clúster
:::

**8. ¿Qué proceso se encarga del registro WAL?**

- a) Background writer
- b) Checkpointer
- c) WAL writer
- d) Stats collector

::: details Ver respuesta
c) WAL writer
:::

**9. ¿Cuál es la jerarquía correcta en PostgreSQL?**

- a) Schema → Clúster → Tabla → Base de datos
- b) Clúster → Base de datos → Schema → Tabla
- c) Tabla → Schema → Clúster → Base de datos
- d) Base de datos → Clúster → Schema → Tabla

::: details Ver respuesta
b) Clúster → Base de datos → Schema → Tabla
:::

**10. ¿Cuál es la función del autovacuum?**

- a) Crear usuarios
- b) Eliminar datos obsoletos y optimizar
- c) Gestionar conexiones
- d) Crear schemas

::: details Ver respuesta
b) Eliminar datos obsoletos y optimizar
:::


---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `docs/preguntes/preguntes11.json · preguntes11p.json`.</small>
