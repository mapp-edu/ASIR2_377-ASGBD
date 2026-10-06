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

**1. ¿Dónde se guardan los parámetros de arranque del SGBD?**

- a) spfileSID.ora
- b) listener.ora
- c) tnsnames.ora
- d) sqlnet.ora

::: details Ver respuesta
a) spfileSID.ora
:::

**2. spfile es un fichero binario**

- a) Verdadero
- b) Falso

::: details Ver respuesta
a) Verdadero
:::

**3. En Oracle, ¿qué usuario no se crea automáticamente?**

- a) sysdba
- b) sys
- c) system
- d) pdbadmin

::: details Ver respuesta
a) sysdba
:::

**4. En Oracle, ¿cómo se crea una nueva BBDD?**

- a) Con el comando del SO `dbca`
- b) `CREATE DATABASE novadb;`
- c) `NEW DATABASE novadb;`
- d) `createdb novadb`

::: details Ver respuesta
a) Con el comando del SO `dbca`
:::

**5. El diccionario de datos puede ser modificado directamente por el DBA**

- a) Falso
- b) Verdadero

::: details Ver respuesta
a) Falso
:::

**6. sqlplus forma parte del software servidor del sistema gestor**

- a) Falso
- b) Verdadero

::: details Ver respuesta
a) Falso
:::

**7. Los datos del diccionario de datos están en:**

- a) mayúsculas
- b) minúsculas
- c) no importa

::: details Ver respuesta
a) mayúsculas
:::

**8. La orden `sqlplus sys@localhost/pdb1`:**

- a) Conecta como superusuario
- b) Funciona desde el cmd
- c) Da error
- d) Funciona desde el `SQL>`

::: details Ver respuesta
c) Da error
:::

## PostgreSQL

**1. ¿Qué es una instancia de PostgreSQL?**

- a) Una única base de datos
- b) Solo el fichero postgresql.conf
- c) El servidor en ejecución con datos, memoria y configuración
- d) Un usuario conectado

::: details Ver respuesta
c) El servidor en ejecución con datos, memoria y configuración
:::

**2. ¿Qué es una sesión en PostgreSQL?**

- a) Un fichero de configuración
- b) Una conexión activa entre cliente y servidor
- c) Una base de datos
- d) Un proceso del sistema

::: details Ver respuesta
b) Una conexión activa entre cliente y servidor
:::

**3. ¿Qué enunciado es correcto?**

- a) 1 usuario = 1 sesión siempre
- b) 1 conexión = 1 sesión
- c) 1 base de datos = 1 sesión
- d) 1 tabla = 1 sesión

::: details Ver respuesta
b) 1 conexión = 1 sesión
:::

**4. ¿Cuál es el fichero principal de configuración?**

- a) pg_hba.conf
- b) pg_ident.conf
- c) postgresql.conf
- d) pg_settings.conf

::: details Ver respuesta
c) postgresql.conf
:::

**5. ¿Qué fichero controla quién puede conectarse y cómo?**

- a) postgresql.conf
- b) pg_ident.conf
- c) pg_hba.conf
- d) pg_roles.conf

::: details Ver respuesta
c) pg_hba.conf
:::

**6. ¿Cuál de estos parámetros requiere reiniciar el servidor?**

- a) context = user
- b) context = sighup
- c) context = postmaster
- d) context = backend

::: details Ver respuesta
c) context = postmaster
:::

**7. ¿Qué función recarga la configuración sin reiniciar?**

- a) pg_stop()
- b) pg_reload_conf()
- c) pg_restart()
- d) reload_db()

::: details Ver respuesta
b) pg_reload_conf()
:::

**8. ¿Dónde escribe ALTER SYSTEM los cambios?**

- a) postgresql.conf
- b) pg_hba.conf
- c) postgresql.auto.conf
- d) pg_ident.conf

::: details Ver respuesta
c) postgresql.auto.conf
:::

**9. ¿Qué consulta muestra todas las variables de configuración?**

- a) `SELECT * FROM config;`
- b) `SHOW VARIABLES;`
- c) `SELECT name, setting FROM pg_settings;`
- d) `LIST SETTINGS;`

::: details Ver respuesta
c) `SELECT name, setting FROM pg_settings;`
:::

**10. ¿Qué contexto permite cambiar una variable en cualquier sesión?**

- a) internal
- b) postmaster
- c) superuser
- d) user

::: details Ver respuesta
d) user
:::


---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `docs/preguntes/preguntes21.json · preguntes21p.json`.</small>
