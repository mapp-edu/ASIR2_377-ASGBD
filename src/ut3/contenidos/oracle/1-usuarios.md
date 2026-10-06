---
layout: doc
title: "Oracle: usuarios y seguridad de las cuentas"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: usuarios y seguridad de las cuentas

## 👤 Usuarios en Oracle

Los usuarios permiten configurar el mecanismo de **confidencialidad**: identificando (nombre de usuario), autenticando (con contraseña, por ejemplo) y restringiendo el acceso a los datos no permitidos (con los privilegios)

Un usuario puede hacer y deshacer dentro de su esquema, pero NO puede hacer nada en otro esquema, salvo que se le otorgue algún permiso o privilegio para ello

### ¿Qué es un usuario?

Un **usuario Oracle** identifica una entidad que accede a la base de datos. Puede representar a una persona, una aplicación o un proceso.

![Cada usuario es propietario de un esquema con sus propios objetos #center](/img/contenidos/ut3/schema.png)

Cuando se crea un usuario, también se crea automáticamente su **esquema** (schema), que contiene sus objetos: tablas, vistas, procedimientos, etc.

Si un usuario `'user1'` quiere acceder a un objeto de otro usuario `'user2'`, deberá anteponer al nombre del objeto el nombre del schema del propietario del objeto en el momento de utilizar la sentencia SQL adecuada.

Por ejemplo

```sql
-- Desde user1, suponiendo que user1 tiene permiso sobre table1 de user2...
SELECT * FROM user2.table1;
```

### 🔐 Autenticación de usuarios

- **Local**: usuario con credenciales dentro de la base de datos
- **Externo**: validación por SO, LDAP, Kerberos, Radius
- **Global**: autenticación empresarial o federada (Oracle Enterprise User Security)
- **Schema-only**: no necesita contraseña (solo objetos)

### Tipos de usuarios

- **Predefinidos**: SYS, SYSTEM, SYSBACKUP, etc. (evita su uso directo si no es estrictamente necesario)
- **Comunes**: disponibles en todas las PDB (requieren el prefijo `C##`)
- **Locales**: definidos dentro de una PDB concreta

### Creación, modificación y baja de usuarios

```sql
-- Crear un usuario en una PDB (el caso más usual)
CREATE USER ausias IDENTIFIED BY '1234';

-- Crear un usuario común (en la CDB)
CREATE USER C##admin IDENTIFIED BY 'secure' CONTAINER=ALL;

-- Modificar la contraseña
ALTER USER ausias IDENTIFIED BY 'nova_clau';

-- Eliminar un usuario
DROP USER ausias CASCADE;
-- Borra el usuario y todos los objetos de su schema
DROP USER ausias;
-- Dará error si ausias tiene objetos en su schema
```

### Atributos adicionales en la creación

```sql
CREATE USER omar IDENTIFIED BY secret
DEFAULT TABLESPACE users
TEMPORARY TABLESPACE temp
QUOTA UNLIMITED ON users
PROFILE default;
```

::: warning Atención
\- QUOTA es obligatorio si se quieren insertar datos en las tablas del schema
:::

### 🔑 Dar permisos de conexión

Un usuario no puede conectar si no tiene el privilegio `CREATE SESSION`:

(e inicialmente, cuando se crea el usuario, ¡no tiene el privilegio automáticamente!)

```sql
GRANT CREATE SESSION TO omar;
```

### Estados de las cuentas

- Abierta
- Bloqueada
- Expirada
- Expirada en periodo de gracia
- [y más...](https://docs.oracle.com/en/database/oracle/oracle-database/19/refrn/USER_USERS.html)

#### Ejemplos de gestión:

```sql
ALTER USER omar ACCOUNT LOCK;
ALTER USER omar ACCOUNT UNLOCK;
ALTER USER omar PASSWORD EXPIRE;
```

### 🔍 Consultas útiles

```sql
-- Usuarios existentes
SELECT username, account_status FROM dba_users;

-- Esquema activo
SELECT user FROM dual;

-- Parámetros de los usuarios administrativos
SELECT * FROM v$pwfile_users;
```

### Notas importantes

- No se pueden crear usuarios directamente en `CDB$ROOT` sin permisos especiales
- Lo habitual es crear los usuarios en las PDB (no en la CDB)
- NO HACE FALTA dar cuota de espacio para que un usuario pueda crear objetos (p. ej., tablas)
- SÍ HACE FALTA dar cuota de espacio para que un usuario pueda «llenar» objetos

### Ejemplo completo: usuario operativo

```sql
CREATE USER pepe IDENTIFIED BY secret
DEFAULT TABLESPACE tab_app
QUOTA UNLIMITED ON tab_app
PASSWORD EXPIRE;

GRANT CREATE SESSION, CREATE TABLE TO pepe;
```

### Ejemplo completo MÍNIMO

```sql
CREATE USER pepe IDENTIFIED BY secret QUOTA 10M ON USERS;
GRANT CREATE SESSION, CREATE TABLE TO pepe;
```

### 💬 Autenticación en multitenant (CDB/PDB)

- SYS solo puede acceder con `AS SYSDBA`
- Se recomienda acceder a las PDB con usuarios locales

```bash
-- Conexión como SYSTEM a PDB1
sqlplus system@localhost/pdb1
```

### Vistas relacionadas con los usuarios

- `DBA_USERS`
- `V$PWFILE_USERS`
- `USER_USERS`
- `SESSION_USERS`

### Buenas prácticas

- Cambiar las contraseñas predefinidas
- No usar SYS o SYSTEM para operaciones del día a día
- Crear un tablespace separado para cada aplicación/usuario
- Utilizar roles y perfiles para gestionar permisos y restricciones

## 🔐 Bloquear usuarios y forzar el cambio de contraseña en Oracle

Para bloquear usuarios y forzarlos a cambiar su contraseña en Oracle, se pueden utilizar diversas funcionalidades de gestión de contraseñas y cuentas de usuario.

Un usuario bloqueado NO PUEDE acceder al sistema y no puede cambiar el estado por sí mismo. Lo debe solicitar al DBA

Un usuario con la contraseña expirada (y en periodo de gracia) SÍ puede acceder, siempre que antes cambie la contraseña expirada

Un usuario con la contraseña expirada y fuera del periodo de gracia NO puede acceder. Si quiere acceder, lo debe solicitar al DBA

Usuario con la contraseña a punto de caducar (periodo de gracia inminente): Oracle puede permitir el acceso, pero el sistema puede mostrar una advertencia de que la contraseña caducará en breve. Esto depende de la configuración del perfil.

## 1. Bloquear / desbloquear un usuario en Oracle

### Bloquear un usuario:

```sql
ALTER USER <nom_usuari> ACCOUNT LOCK;
```

Donde &lt;nom_usuari&gt; es el nombre del usuario que quieres bloquear.

### Desbloquear un usuario:

```sql
ALTER USER <nom_usuari> ACCOUNT UNLOCK;
```

## 2. Forzar a un usuario a cambiar la contraseña

Oracle permite forzar que un usuario cambie su contraseña en el próximo inicio de sesión. Para hacerlo, se utiliza la orden siguiente:

```sql
ALTER USER <nom_usuari> PASSWORD EXPIRE;
```

## 3. Combinación de órdenes para bloquear y forzar el cambio de contraseña

Si quieres bloquear un usuario y, además, forzarlo a cambiar la contraseña cuando sea desbloqueado, puedes utilizar estas dos órdenes:

```sql
ALTER USER <nom_usuari> ACCOUNT LOCK;
ALTER USER <nom_usuari> PASSWORD EXPIRE;
```

## 4. Configurar la caducidad automática de las contraseñas

Para configurar que Oracle fuerce el cambio de contraseña automáticamente después de un cierto tiempo (por ejemplo, después de 30 días), puedes configurar la política de contraseñas de la base de datos. Esto se hace mediante el atributo `PASSWORD_LIFE_TIME` del perfil de usuario:

Los perfiles se ven en esta unidad, un poco más adelante...

```sql
ALTER PROFILE <nom_perfil> LIMIT PASSWORD_LIFE_TIME <dies>;
```

### Ejemplo (para 30 días):

```sql
ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME 30;
```

Esto hará que las contraseñas de los usuarios que tengan este perfil caduquen después de 30 días, forzándolos a cambiar la contraseña en el siguiente inicio de sesión.

Estos son los mecanismos básicos para gestionar usuarios en Oracle, bloqueándolos y forzándolos a cambiar las contraseñas cuando sea necesario.

## 5. Cambio de contraseña

### 5.1 Voluntariamente

```sql
-- Desde el usuario 'vicent'
ALTER USER vicent IDENTIFIED BY novapass;
```

#### sql\*plus y SQL Developer

sql\*plus acepta el comando **PASSWORD**, que inicia un script/diálogo para cambiar la contraseña

SQL Developer tiene una opción en el menú desplegable de la conexión llamada «Restablecer Contraseña...»

### 5.2 No voluntariamente (contraseña expirada)

Si el usuario todavía está en periodo de gracia, al entrar, sql\*plus da un error y pide una nueva contraseña

```txt
ERROR:
ORA-28001: the password has expired

Cambiando la contraseña para <nom_usuari>
```

En SQL Developer ocurre igual: nos pide poner una nueva contraseña, pero utilizando la GUI

## 6. Desconectar a un usuario que está conectado

Un usuario puede tener varias conexiones activas (que son las SESIONES)

Hay dos maneras

### Matar una sesión desde SQL\*Plus o cualquier cliente

```sql
SELECT sid, serial#, username, status, machine
FROM v$session
WHERE username = 'NOM_USUARI';   --averigua sid y serial#

ALTER SYSTEM KILL SESSION 'SID,SERIAL#';   -- Desconecta
o
ALTER SYSTEM KILL SESSION 'SID,SERIAL#' IMMEDIATE;
```

Si un usuario ha conectado con el rol SYSDBA, no se visualizará su nombre, sino SYSTEM

#### Matar la sesión directamente desde el sistema operativo

Algunas veces la orden anterior no desconecta del todo (queda como KILLED). Entonces buscas el proceso del SO:

```sql
SELECT s.sid, s.serial#, p.spid
FROM v$session s
JOIN v$process p ON s.paddr = p.addr
WHERE s.username = 'NOM_USUARI';

-- Y en el sistema operativo (Unix/Linux):
kill -9 PID    -- Donde PID = SPID del proceso Oracle.
```

- Necesitas permisos DBA o ALTER SYSTEM.
- Matar sesiones puede afectar a transacciones en curso (rollback largo).
- Solo se recomienda hacerlo si la sesión está bloqueando o colgada.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
