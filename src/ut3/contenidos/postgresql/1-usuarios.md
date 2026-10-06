---
layout: doc
title: "PostgreSQL: usuarios y seguridad de las cuentas"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: usuarios y seguridad de las cuentas

## 👤 Usuarios en PostgreSQL

Los usuarios permiten configurar el mecanismo de **confidencialidad**: identificando (nombre de usuario), autenticando (con contraseña, por ejemplo) y restringiendo el acceso a los datos no permitidos (con los privilegios)

### ¿Qué es un usuario?

Un **usuario de PostgreSQL** identifica una entidad que accede a la base de datos. Puede representar a una persona, una aplicación o un proceso.

### 🔐 Autenticación de usuarios

Se configura en el fichero `pg_hba.conf`

- Usuario con credenciales dentro de la base de datos: **md5, scram-sha-256**
- **peer, ldap, gss, sspi, pam**: validación por SO, LDAP, Kerberos, Radius

La autenticación se define mediante métodos configurados en el fichero `pg_hba.conf`

### Tipos de usuarios

- **Predefinidos**: postgres, el administrador del SGBD. «Hay que protegerlo e intentar no usarlo»
- **De instancia**: definidos dentro de una instancia

Los usuarios (roles) se crean a nivel de toda la instancia. Un usuario puede conectarse a cualquier base de datos (si tiene permisos)

### Creación, modificación y baja de usuarios

::: tip Nota
Desde el usuario DBA (postgres), o un usuario con el privilegio CREATEROLE
:::

```sql
  -- Crear un usuario normal (el caso más usual)
CREATE USER alumne WITH PASSWORD '1234';

  -- Crear un usuario administrativo
CREATE USER profe  WITH PASSWORD 'abc123'  CREATEDB  CREATEROLE;
  -- CREATEDB → puede crear bases de datos
  -- CREATEROLE → puede crear otros usuarios

  -- Modificar la contraseña (regenera/cifra la contraseña)
ALTER USER ausias WITH PASSWORD 'nova_pass';

  -- Eliminar un usuario
DROP USER ausias;

  -- Borra el usuario y todos los objetos de su schema
DROP USER ausias;
   -- Pero… ¡dará error si ausias tiene objetos o sesiones abiertas!
```

⚠️ Importante: no puedes eliminar un usuario si tiene objetos (tablas, esquemas…) o si tiene sesiones activas

```sql
  -- Hay que hacer primero...
SELECT pg_terminate_backend(pid)  FROM pg_stat_activity
       WHERE usename = 'alumne'    AND pid <> pg_backend_pid();
REASSIGN OWNED BY alumne TO altre_user;
DROP OWNED BY alumne;
DROP USER alumne;
```

---

¡Alerta, spoiler! Un usuario en PostgreSQL es equivalente a un rol con permiso de conexión. Los roles se verán más adelante...

```sql
  -- Equivalente a crear un usuario ==> crear un rol con LOGIN
CREATE ROLE alumne LOGIN PASSWORD '1234';
  -- LOGIN indica que puede iniciar sesión
```

---

### 🔑 Dar permisos de conexión

Dependiendo de cómo se cree, un usuario podrá conectar o no...

```sql
CREATE USER alumne WITH PASSWORD '1234';  -- puede conectar
CREATE ROLE alumne LOGIN PASSWORD '1234';  -- puede conectar, porque tiene el LOGIN
CREATE ROLE app_role NOLOGIN;  -- no puede conectar
GRANT CONNECT ON DATABASE escola TO alumne;  -- Por defecto, no hace falta...
```

Aunque, cuando se crea una base de datos nueva, por defecto se hace un

```sql
GRANT CONNECT ON DATABASE nom_bbdd TO PUBLIC;
```

Esto significa que cualquier usuario puede conectar aunque no se le den permisos explícitos de

`GRANT CONNECT ON DATABASE .. TO ..`

Si se desea que, por defecto, ningún usuario pueda conectar a una BBDD, hay que revocar el permiso después de crearla con

```sql
REVOKE CONNECT ON DATABASE escola FROM PUBLIC;
```

y dar permiso solo a los usuarios concretos con `GRANT CONNECT ON DATABASE escola TO usuari;`

---

### 🔍 Consultas útiles

```sql
  -- Usuarios existentes
SELECT rolname, rolcanlogin, rolvaliduntil FROM pg_roles;
\du

  -- Esquema / usuario activo
SELECT current_user;
\echo :USER
\conninfo
SELECT session_user;

  -- Parámetros de los usuarios administrativos
SELECT rolname FROM pg_roles WHERE rolsuper = TRUE;

-- Base de datos donde está la sesión actual
SELECT current_database();
```

session_user: es el usuario con el que se ha iniciado la conexión. No cambia durante la sesión.

current_user: es el usuario que PostgreSQL está utilizando en ese momento para comprobar los permisos. Puede cambiar durante la sesión

---

### Conexión

```bash
psql -U system -d escola   -- Intenta conectar como peer

psql -U system -h localhost -d escola   --  Como host (con contraseña)
         usuario  equipo      bbdd
```

### Vistas relacionadas con los usuarios

- `pg_roles`

### Buenas prácticas

- Cambiar las contraseñas predefinidas
- No usar el usuario postgres para operaciones del día a día

---

## Schema

En PostgreSQL, todas las tablas deben estar dentro de un esquema, y por defecto los usuarios trabajan en el esquema **PUBLIC**.

Un schema en PostgreSQL (y en muchos otros SGBD) se puede entender como un directorio o carpeta dentro de una base de datos (no en el disco duro ni en el SO, sino dentro de una BBDD). Es un concepto parecido al de ESPACIO DE NOMBRES o namespace. Es como un contenedor lógico dentro de una BBDD

Cuando se crea una BBDD, se crea un **schema** "public", al que el propietario de la BBDD tiene acceso concedido

El propietario del schema public es el mismo usuario que crea la base de datos. Este usuario tiene permisos de CREATE y USAGE dentro del schema, por lo que puede crear tablas inmediatamente.

```sql
  -- Crear un esquema adicional...
CREATE SCHEMA schema1 AUTHORIZATION user1;
```

```sql
-- Crear objetos en el nuevo schema
CREATE TABLE schema1.novataula1 (id int, nom text);
-- Acceso a objetos de un schema
SELECT * FROM schema1.novataula1;

   -- Para evitar poner schema1.
SET search_path TO schema1;
SET search_path TO schema1, schema2, public;

   -- Y después, si se hace...
SELECT * FROM taula;  -- Primero buscará en schema1; si existe taula, ejecuta el SELECT
          -- Si no, buscará en schema2 y, si no existe, buscará en public.

SHOW search_path;    -- Para ver el actual
Por defecto  ==>  "$user", public
```

$user es un placeholder que PostgreSQL sustituye por el nombre del usuario actual de la conexión. Es solo simbólico; no crea automáticamente un schema con ese nombre. Solo si tú creas manualmente un schema con el mismo nombre que el usuario, $user apuntará a ese schema

```txt
Cuando se hace CREATE TABLE nom_taula; sin prefijo de esquema,
   PostgreSQL crea la tabla en el primer esquema del search_path
      en el que el usuario tiene permisos de creación (CREATE).
```

### Por defecto, PostgreSQL hace

```sql
GRANT ALL ON SCHEMA public TO postgres;  -- por defecto al usuario que crea la base de datos
GRANT USAGE ON SCHEMA public TO PUBLIC;
al hacer USAGE, el usuario puede «ver» el esquema con
\dn
\dt
Pero no puede ver lo que hay «dentro» de las tablas (usar SELECT). No tiene permiso.
Puede ver las tablas, pero no puede crear nuevas  ( CREATE TABLE)
Para poder crear nuevas tablas, necesita  GRANT CREATE ON SCHEMA
```

### Buenas prácticas

```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
CREATE SCHEMA pepe AUTHORIZATION pepe;
```

### ¿Qué es PUBLIC?

```txt
PUBLIC no es un usuario real, ni puede iniciar sesión.
Es un rol especial virtual que incluye a todos los usuarios existentes y futuros de la base de datos.
Sirve para dar permisos generales a todo el mundo sin tener que asignarlos uno a uno.
```

Aunque en muchas instalaciones recientes (especialmente en PostgreSQL ≥ 14 y en sistemas Linux con paquetes de distribución) el CREATE sobre public se ha revocado por defecto por seguridad:

### Saber qué permisos tiene PUBLIC

```sql
\dn+
```

### Crear un usuario operativo

```sql
CREATE USER nom_usuari WITH PASSWORD 'contrasenya';  -- Crear el usuario
GRANT CONNECT ON DATABASE nom_bd TO nom_usuari;
     -- Permitir conectar a la BBDD (por defecto no hace falta, pero si hace falta, hay que hacerlo)
\c nom_bd          -- situarse en la BBDD nom_bd (si no estamos ya)
GRANT USAGE ON SCHEMA public TO nom_usuari;    -- Para poder usar, ver y acceder al esquema

GRANT SELECT, INSERT, UPDATE, DELETE  ON ALL TABLES IN SCHEMA public  TO nom_usuari;  -- para las tablas existentes

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nom_usuari;    -- para las tablas futuras en el schema public

ALTER DEFAULT PRIVILEGES
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nom_usuari;    -- para las tablas futuras en todos los schemas

GRANT CREATE ON SCHEMA public TO nom_usuari;        -- Si se quiere que cree tablas nuevas...
```

### Permisos CREATE y USAGE

```sql
-- Dar permiso de usar el schema al usuario
GRANT USAGE ON SCHEMA aula TO pepe;
-- Dar permiso de crear objetos en el schema al usuario
GRANT CREATE ON SCHEMA aula TO pepe;
```

USAGE permite «usar» un objeto, pero no permite modificarlo ni crear dentro de él. Se aplica principalmente a schemas, sequences y tipos.

CREATE permite crear nuevos objetos dentro de un schema: tablas, vistas, funciones, etc.

Para crear objetos dentro de un schema, hay que tener USAGE + CREATE

Solo USAGE → puedes leer/consultar los objetos sobre los que tengas permisos, pero no crear nada

Solo CREATE → no tiene sentido, porque sin USAGE no puede referenciar el schema

## 🔐 Bloquear usuarios en PostgreSQL y… ¿forzar a cambiar la contraseña?

Un usuario bloqueado NO PUEDE acceder al sistema y no puede cambiar el estado por sí mismo. Lo debe solicitar al DBA

## 1. Bloquear / desbloquear un usuario en PostgreSQL

```sql
ALTER ROLE omar NOLOGIN;   -- Bloqueo de la cuenta
ALTER ROLE omar LOGIN;     -- Desbloqueo de la cuenta
```

PostgreSQL no tiene periodo de gracia ni avisos automáticos

## 2. Forzar a un usuario a cambiar la contraseña

PostgreSQL NO permite forzar que un usuario cambie su contraseña en el próximo inicio de sesión, ni antes de que expire su validez.

En PostgreSQL, `ALTER ROLE ... VALID UNTIL 'fecha';` sirve para establecer la caducidad de una contraseña. Si la fecha ha pasado, el usuario no podrá conectarse. PostgreSQL no permite forzar el cambio de contraseña en el siguiente login; eso lo debe hacer un superusuario

```sql
 -- Caducidad de la contraseña
ALTER ROLE omar VALID UNTIL '2020-01-01';
```

### Cómo puede saber un usuario la fecha de caducidad de su contraseña

```sql
SELECT rolname, rolvaliduntil
FROM pg_roles
WHERE rolname = current_user;
```

## 3. Cambio de contraseña

PostgreSQL no da avisos automáticos. Se puede implementar con scripts externos que consulten `(pg_roles.rolvaliduntil)` y avisen al usuario antes de la caducidad.

### Cambio desde psql y pgAdmin

psql acepta el comando **\password**, que inicia un script/diálogo para cambiar la contraseña

Si eres superusuario, «**\password pepe**» inicia un script para cambiar la contraseña del usuario pepe

pgAdmin tiene una opción en las propiedades del usuario, en la pestaña Definition: en el primer campo, password, se pone la nueva contraseña y se pulsa el botón SAVE

## 6. Desconectar a un usuario que está conectado

Un usuario puede tener varias conexiones activas (que son las SESIONES), y se pueden ver con

```sql
SELECT pid, usename, datname, client_addr, state  FROM pg_stat_activity;
```

PostgreSQL ofrece la función **pg_terminate_backend()** para finalizar una sesión:

```sql
-- Ej.: desconectar a un usuario específico
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE usename = 'pepe'
  AND pid <> pg_backend_pid();
  -- pg_terminate_backend(pid) → cierra la sesión correspondiente
  -- pid <> pg_backend_pid() → evita desconectarte a ti mismo
```

Solo un superusuario o el propietario de la sesión puede hacer esto. La sesión se interrumpe inmediatamente, y se hace rollback de cualquier transacción en curso

También existe **pg_cancel_backend(pid)**, que solo cancela la consulta activa, sin cerrar la sesión:

```sql
SELECT pg_cancel_backend(pid)
FROM pg_stat_activity
WHERE usename = 'pepe';
```

## Avisos de caducidad

PostgreSQL no tiene un mecanismo incorporado que avise de esta situación, pero se puede implementar manualmente con:

1. Un script en Bash + psql que se ejecuta cada día con cron y envía correos a los usuarios con la contraseña a punto de caducar.
2. Un script en Python que consulta pg_roles.rolvaliduntil y genera notificaciones.

```bash
  -- Bash
#!/bin/bash

# Consulta los usuarios con la contraseña a punto de caducar en los próximos 7 días
psql -U postgres -d postgres -At -F"," -c "
SELECT rolname, to_char(rolvaliduntil,'YYYY-MM-DD')
FROM pg_roles
WHERE rolvaliduntil IS NOT NULL
  AND rolvaliduntil < current_date + interval '7 days';
" | while IFS="," read -r user date; do
    # Solo enviar si user y date existen
    if [[ -n "$user" && -n "$date" ]]; then
        echo "Usuario $user: la contraseña caducará el $date" | mail -s "Aviso contraseña" "$user@example.com"
    fi
done
```

::: tip Nota
O mejor aún, utilizar rutinas internas de automatización de PostgreSQL para mejorar la seguridad. Se verá en detalle en la unidad de automatización de tareas
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
