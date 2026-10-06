---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 3: asegurar las cuentas de administración"
pageClass: ejercicios-page
---

# 📋 Práctica 3: asegurar las cuentas de administración

## Enunciado

Las cuentas de administración son el objetivo preferido de cualquier ataque: quien las controla, controla todos los datos. Una instalación recién hecha suele dejarlas en un estado cómodo para trabajar, pero poco seguro.

Vas a **auditar y asegurar** las cuentas de administración de tu servidor y a fijar los **parámetros de conexión**. Haz la práctica con el SGBD que te indique tu profesor o profesora (Oracle o PostgreSQL); las tareas son las mismas y en las orientaciones tienes las órdenes de cada uno.

::: warning Atención
Antes de tocar la autenticación, deja abierta una sesión de administrador en otro terminal. Si te equivocas, podrás deshacer el cambio desde ella sin quedarte fuera del servidor.
:::

## Objetivos

- Identificar las cuentas con privilegios de administración y su estado.
- Aplicarles una política de contraseñas y de bloqueo.
- Restringir desde dónde y cómo puede conectarse un administrador.
- Definir los límites y los tiempos de espera de las conexiones.

## Tareas

### Parte 1. Auditoría inicial

1. Lista **todas las cuentas** del servidor con su estado (abierta, bloqueada, caducada) y marca cuáles tienen privilegios de administración.
2. Averigua **cómo se autentica** hoy el administrador: ¿puede entrar sin contraseña desde el sistema operativo? ¿Puede entrar desde otra máquina?
3. Comprueba con qué algoritmo se guardan las contraseñas.
4. Resume en una tabla los **riesgos** que has encontrado.

### Parte 2. Asegurar las cuentas

5. Cambia la contraseña de las cuentas de administración predeterminadas por una contraseña robusta.
6. **Bloquea** las cuentas predeterminadas que no se utilicen (o comprueba que ya lo están).
7. Crea una cuenta de administración **personal** (con tu nombre) para el trabajo diario, de modo que la cuenta predeterminada quede reservada para emergencias. Dale solo los privilegios que necesite.
8. Aplica a las cuentas de administración una política que incluya: **caducidad** de la contraseña, **bloqueo** tras varios intentos fallidos (o la medida equivalente en tu SGBD) y **número máximo de sesiones** simultáneas.
9. Demuestra que la política funciona: provoca el bloqueo o el rechazo y muestra el mensaje.

### Parte 3. Restringir el acceso en red

10. Configura el servidor para que las cuentas de administración predeterminadas **solo** puedan conectarse desde el propio servidor, y tu cuenta personal también desde la máquina cliente.
11. Comprueba desde la máquina cliente que se rechaza la conexión de la cuenta predeterminada y se acepta la de tu cuenta personal.
12. Localiza en el fichero de registro del servidor los intentos de conexión rechazados.

### Parte 4. Parámetros de conexión

13. Muestra el **número máximo de conexiones** del servidor y cuántas hay abiertas ahora. Cambia el máximo a un valor razonado e indica si el cambio exige reiniciar.
14. Configura un **tiempo máximo de inactividad** para las sesiones y demuestra que una sesión inactiva se cierra.
15. Configura el **tiempo máximo para autenticarse** al abrir una conexión.
16. Recoge en una tabla cada parámetro modificado: valor anterior, valor nuevo, dónde se guarda y si necesita reinicio.

## Orientaciones

### Con PostgreSQL

```sql
-- Cuentas y atributos
\du
SELECT rolname, rolsuper, rolcanlogin, rolconnlimit, rolvaliduntil FROM pg_roles;
SHOW password_encryption;

-- Cuenta personal, caducidad y límite de sesiones
CREATE ROLE admin_ana LOGIN CREATEDB CREATEROLE PASSWORD '...';
ALTER ROLE admin_ana VALID UNTIL '2027-01-01' CONNECTION LIMIT 3;

-- Conexiones y tiempos de espera
SHOW max_connections;
SELECT count(*) FROM pg_stat_activity;
ALTER SYSTEM SET idle_session_timeout = '10min';
ALTER SYSTEM SET authentication_timeout = '30s';
SELECT pg_reload_conf();
```

- El acceso en red se controla en `pg_hba.conf`: las reglas se leen **en orden** y se aplica la primera que coincide. El método `reject` rechaza la conexión; `peer` identifica por el usuario del sistema operativo; `scram-sha-256` pide contraseña.
- PostgreSQL no bloquea una cuenta por intentos fallidos: busca qué alternativas hay (por ejemplo, `fail2ban` sobre el fichero de registro) y explica cuál aplicarías.
- Para ver las conexiones en el registro, activa `log_connections`.

### Con Oracle

```sql
-- Cuentas, estado y perfil
SELECT username, account_status, profile, authentication_type FROM dba_users ORDER BY username;
SELECT * FROM dba_users_with_defpwd;
SELECT * FROM v$pwfile_users;

-- Política para administradores
CREATE PROFILE perfil_admin LIMIT
  FAILED_LOGIN_ATTEMPTS 3
  PASSWORD_LOCK_TIME    1/24
  PASSWORD_LIFE_TIME    90
  SESSIONS_PER_USER     3
  IDLE_TIME             10;
ALTER USER admin_ana PROFILE perfil_admin;
ALTER USER usuario ACCOUNT LOCK;

-- Conexiones
SHOW PARAMETER processes
SHOW PARAMETER sessions
SELECT count(*) FROM v$session;
```

- Recuerda la diferencia entre usuarios comunes y locales: consulta la [guía de usuarios comunes](/ut3/ejercicios/guia-3-usuarios-comunes).
- Quién puede entrar con `/ as sysdba` depende del grupo del sistema operativo: repasa la [guía de conexiones como SYSDBA](/ut3/ejercicios/guia-1-sysdba-en-windows).
- Los tiempos de espera de red se configuran en `sqlnet.ora` y `listener.ora` (parámetros `SQLNET.EXPIRE_TIME` e `INBOUND_CONNECT_TIMEOUT`).

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA2** (*Configura el sistema gestor de bases de datos interpretando las especificaciones técnicas y los requisitos de explotación.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **2.c** | Se han asegurado las cuentas de administración. | Las cuentas de administración quedan con contraseña robusta, política de caducidad y bloqueo, y las que no se usan, bloqueadas; lo demuestra con pruebas. |
| **2.e** | Se ha configurado la conectividad en red del sistema gestor. | Restringe desde qué máquinas puede conectarse cada cuenta de administración y lo comprueba desde el cliente. |
| **2.g** | Se han definido los parámetros relativos a las conexiones (tiempos de espera, número máximo de conexiones, entre otros). | Fija y justifica el número máximo de conexiones, el tiempo de inactividad y el tiempo de autenticación. |
| **2.h** | Se ha documentado el proceso de configuración. | Documenta la auditoría inicial, cada cambio realizado y la tabla final de parámetros. |

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
