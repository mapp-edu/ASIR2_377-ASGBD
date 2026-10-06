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

## Oracle: usuarios y privilegios

**1. Para que los usuarios de una sede de una empresa no puedan ver todos los campos de la tabla de empleados y solo vean los empleados de su propia sede, deberemos usar:**

- a) Revoke
- b) Perfiles
- c) Una vista vertical
- d) Una vista mixta

::: details Ver respuesta
d) Una vista mixta
:::

**2. GRANT y REVOKE son sentencias del:**

- a) DDL
- b) DML
- c) DCL
- d) TCL

::: details Ver respuesta
c) DCL
:::

**3. Permiten restringir el uso de recursos a los usuarios:**

- a) Roles
- b) Permisos
- c) Perfiles
- d) Todas las respuestas son correctas

::: details Ver respuesta
d) Todas las respuestas son correctas
:::

**4. Para desbloquear la cuenta de un usuario que está bloqueado se usará:**

- a) `UNLOCK USER nomusuari;`
- b) `ALTER USER nomusuari ACCOUNT UNLOCK;`
- c) `ALTER USER nomusuari ENABLE;`
- d) `ALTER USER nomusuari UNLOCK;`

::: details Ver respuesta
b) `ALTER USER nomusuari ACCOUNT UNLOCK;`
:::

**5. Para cambiar la contraseña de un usuario en Oracle usaremos:**

- a) `ALTER USER nomusuari IDENTIFIED BY "12345";`
- b) `ALTER USER nomusuari PASSWORD '12345';`
- c) `ALTER USER nomusuari SET PASSWORD '12345';`
- d) `UPDATE dba_users SET PASSWORD='12345' WHERE USER='nomusuari';`

::: details Ver respuesta
a) `ALTER USER nomusuari IDENTIFIED BY "12345";`
:::

**6. Para quitar un permiso usaremos la sentencia:**

- a) RELEASE
- b) DELETE
- c) DROP
- d) REVOKE

::: details Ver respuesta
d) REVOKE
:::

**7. Para borrar un rol usaremos la sentencia:**

- a) ERASE
- b) DELETE
- c) REVOKE
- d) DROP

::: details Ver respuesta
d) DROP
:::

**8. ¿Cuál de las siguientes operaciones no está permitida en Oracle?**

- a) Quitar un permiso a un rol
- b) Quitar un rol a un usuario
- c) Asignar un rol a otro rol
- d) Copiar los permisos de un usuario a otro usuario

::: details Ver respuesta
d) Copiar los permisos de un usuario a otro usuario
:::

## Oracle: mecanismos de seguridad

**1. ¿Qué tipo de cifrado utilizarías para guardar (solo) el sueldo de la tabla de empleados?**

- a) Cifrado transparente
- b) Las funciones de cifrar/descifrar
- c) Una función HASH
- d) Ninguna de las anteriores

::: details Ver respuesta
b) Las funciones de cifrar/descifrar
:::

**2. ¿Qué función es mejor para guardar contraseñas?**

- a) Función HASH
- b) Cifrado simétrico
- c) Texto plano
- d) Cifrado César

::: details Ver respuesta
a) Función HASH
:::

**3. En Oracle se puede cifrar información con funciones del DDL**

- a) Falso
- b) Cierto

::: details Ver respuesta
a) Falso
:::

**4. Las transacciones son un mecanismo para conseguir la disponibilidad de la información**

- a) Falso
- b) Cierto

::: details Ver respuesta
a) Falso
:::

**5. La aplicación exp de Oracle puede hacer copias totales y/o parciales**

- a) Cierto
- b) Falso

::: details Ver respuesta
a) Cierto
:::

**6. ¿Qué sucede si se produce un interbloqueo entre dos sesiones?**

- a) Las dos sesiones quedan bloqueadas y además afectan al resto de sesiones
- b) Las dos sesiones quedan bloqueadas, pero no afectan al resto de sesiones
- c) La segunda sesión que cogió el bloqueo se queda bloqueada
- d) La primera sesión que cogió el bloqueo se queda bloqueada

::: details Ver respuesta
a) Las dos sesiones quedan bloqueadas y además afectan al resto de sesiones
:::

## PostgreSQL: usuarios y privilegios

**1. En PostgreSQL, ¿qué es un usuario?**

- a) Un esquema dentro de una base de datos
- b) Una entidad que accede a la base de datos
- c) Un tipo de tabla especial
- d) Una conexión activa

::: details Ver respuesta
b) Una entidad que accede a la base de datos
:::

**2. ¿Dónde se configura la autenticación de usuarios en PostgreSQL?**

- a) postgresql.conf
- b) pg_roles
- c) pg_hba.conf
- d) pg_ident.conf

::: details Ver respuesta
c) pg_hba.conf
:::

**3. ¿Qué método de autenticación por contraseña es propio de PostgreSQL?**

- a) scram-sha-256
- b) ldap
- c) gss
- d) peer

::: details Ver respuesta
a) scram-sha-256
:::

**4. ¿Qué usuario predefinido es el administrador en PostgreSQL?**

- a) admin
- b) root
- c) postgres
- d) system

::: details Ver respuesta
c) postgres
:::

**5. ¿Qué privilegio permite crear otros usuarios?**

- a) CREATEDB
- b) CREATEROLE
- c) LOGIN
- d) SUPERUSER

::: details Ver respuesta
b) CREATEROLE
:::

**6. ¿Qué pasa si intentas eliminar un usuario que tiene objetos o sesiones activas?**

- a) Se elimina igualmente
- b) Solo elimina los objetos
- c) Da error y no se puede eliminar
- d) Se desconecta automáticamente

::: details Ver respuesta
c) Da error y no se puede eliminar
:::

**7. ¿Qué función permite finalizar las sesiones de un usuario?**

- a) DROP SESSION
- b) KILL USER
- c) pg_terminate_backend()
- d) END CONNECTION

::: details Ver respuesta
c) pg_terminate_backend()
:::

**8. ¿Qué afirmación es correcta sobre CREATE ROLE?**

- a) Siempre permite login
- b) Solo crea bases de datos
- c) Solo permite login si tiene LOGIN
- d) Es equivalente a DROP USER

::: details Ver respuesta
c) Solo permite login si tiene LOGIN
:::

**9. Por defecto, ¿qué pasa con el permiso CONNECT en una base de datos nueva?**

- a) Solo el propietario puede conectar
- b) Nadie puede conectar
- c) Todos los usuarios (PUBLIC) pueden conectar
- d) Solo los superusuarios pueden conectar

::: details Ver respuesta
c) Todos los usuarios (PUBLIC) pueden conectar
:::

**10. ¿Cuál es una buena práctica con el usuario postgres?**

- a) Usarlo para todas las operaciones
- b) Eliminarlo después de instalar
- c) No usarlo para el día a día
- d) Cambiarle el nombre

::: details Ver respuesta
c) No usarlo para el día a día
:::

**11. Tienes `CREATE ROLE alumne NOLOGIN;` y ejecutas `psql -U alumne -d postgres`. ¿Qué pasa?**

- a) Se conecta correctamente
- b) Error: no puede iniciar sesión
- c) Se conecta como postgres
- d) Crea automáticamente el rol LOGIN

::: details Ver respuesta
b) Error: no puede iniciar sesión
:::

**12. Tienes una BBDD nueva `escola` y no has hecho ningún GRANT. Un usuario ejecuta `psql -U alumne -d escola`. ¿Qué pasa?**

- a) No puede conectarse
- b) Solo si es superusuario
- c) Puede conectarse por defecto
- d) Hay que hacer GRANT CONNECT manualmente

::: details Ver respuesta
c) Puede conectarse por defecto
:::

**13. Ejecutamos `REVOKE CONNECT ON DATABASE escola FROM PUBLIC;`. ¿Qué pasa con los usuarios?**

- a) Todos pueden seguir conectándose
- b) Solo el propietario puede conectar
- c) Borra la base de datos
- d) Solo afecta a los usuarios nuevos

::: details Ver respuesta
b) Solo el propietario puede conectar
:::

**14. usuari2 solo tiene `GRANT UPDATE ON taula1 TO usuari2;` y ejecuta `UPDATE taula1 SET col1=1;`. ¿Qué pasa?**

- a) Error por falta de SELECT
- b) Funciona correctamente
- c) Solo actualiza una fila
- d) Necesita permisos de INSERT

::: details Ver respuesta
b) Funciona correctamente
:::

**15. usuari2 solo tiene `GRANT UPDATE ON taula1 TO usuari2;` y ejecuta `UPDATE taula1 SET col1=1 WHERE col2=2;`. ¿Qué pasa?**

- a) Funciona correctamente
- b) Error, porque necesita SELECT sobre col2
- c) Actualiza todas las filas
- d) Error, porque necesita DELETE

::: details Ver respuesta
b) Error, porque necesita SELECT sobre col2
:::

**16. Ejecutamos `CREATE ROLE app_role;` y después intentamos conectarnos con ese rol. ¿Qué pasa?**

- a) Se conecta sin problemas
- b) Error, porque no tiene LOGIN
- c) Se conecta como postgres
- d) Pide crear una contraseña

::: details Ver respuesta
b) Error, porque no tiene LOGIN
:::

**17. Ejecutamos `DROP USER alumne;` pero el usuario tiene sesiones abiertas. ¿Qué pasa?**

- a) Se elimina igualmente
- b) Error y no se elimina
- c) Se cierran automáticamente las sesiones
- d) Solo elimina los objetos

::: details Ver respuesta
b) Error y no se elimina
:::

**18. Ejecutamos `CREATE ROLE alumne LOGIN PASSWORD '1234';`. ¿Qué puede hacer este usuario?**

- a) Solo crear bases de datos
- b) Conectarse al sistema
- c) Es automáticamente superusuario
- d) Crear roles

::: details Ver respuesta
b) Conectarse al sistema
:::

**19. Ejecutamos `SELECT current_user;`. ¿Qué devuelve?**

- a) La base de datos actual
- b) El nombre del rol activo
- c) El sistema operativo
- d) El schema actual

::: details Ver respuesta
b) El nombre del rol activo
:::

**20. Ejecutamos `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE usename='alumne';`. ¿Qué hace?**

- a) Elimina el usuario
- b) Cierra las sesiones del usuario
- c) Bloquea el usuario
- d) Cambia la contraseña

::: details Ver respuesta
b) Cierra las sesiones del usuario
:::


---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `docs/preguntes/preguntes31.json · preguntes32.json · preguntes31p.json`.</small>
