---
layout: doc
title: "PostgreSQL: privilegios, roles y perfiles"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: privilegios, roles y perfiles

## 🗝️ Permisos en PostgreSQL

### ¿Qué son los permisos (privilegios)?

Los **permisos** o **privilegios** son derechos que PostgreSQL otorga a los usuarios para hacer determinadas acciones sobre la base de datos: acceder, modificar, crear, administrar objetos o usuarios.

### Tipos de permisos

- **Privilegios de sistema**: permiten ejecutar acciones globales (crear tablas, abrir sesiones...)
- **Privilegios de objeto**: permiten acceder a objetos concretos o modificarlos (tablas, vistas...)

#### Ejemplos de privilegios de sistema

- rolsuper: superusuario (SUPERUSER / NOSUPERUSER)
- rolcreaterole: puede crear roles (CREATEROLE / NOCREATEROLE)
- rolcreatedb: puede crear BD (CREATEDB / NOCREATEDB)
- rolcanlogin: puede conectarse (LOGIN / NOLOGIN)
- rolreplication: replicación (REPLICATION / NOREPLICATION)
- rolbypassrls: ignora la seguridad a nivel de fila (BYPASSRLS / NOBYPASSRLS)
- rolinherit: hereda automáticamente (INHERIT / NOINHERIT)
- rolconnlimit: límite de conexiones
- rolpassword
- rolvaliduntil: caducidad
- rolconfig

#### Ejemplos de privilegios de objeto

- `GRANT SELECT, INSERT, UPDATE, DELETE, ON TABLE taula_client TO pepe;` sobre tablas
- `GRANT TRUNCATE, REFERENCES, TRIGGER ON TABLE taula TO usuari;`
- `GRANT EXECUTE ON FUNCTION calcula_impost(integer) TO pepe;` sobre procedimientos y funciones
- `GRANT USAGE, SELECT, UPDATE ON SEQUENCE seq TO usuari;`
- `GRANT CONNECT, CREATE, TEMP ON DATABASE escola TO alumne;` sobre una BBDD
- `GRANT USAGE ON SCHEMA public TO nom_usuari;` sobre un schema
- `GRANT CREATE ON SCHEMA public TO nom_usuari;` sobre un schema

### ♻️ Revocar permisos

```sql
REVOKE SELECT ON TABLE taula_client FROM pepe;
```

### 🌐 Propagación con GRANT OPTION

Permite que un usuario que ha recibido un privilegio «sobre objeto» lo pueda conceder a otro (y también puede conceder el GRANT OPTION):

```sql
GRANT SELECT ON alumnes TO joan WITH GRANT OPTION;
```

::: warning Atención
Un usuario no puede propagar los privilegios de sistema. Solo el **superuser** puede dar estos privilegios
:::

---

### 👀 Consultas útiles

```sql
  -- Privilegios de sistema otorgados
SELECT rolname,
       rolsuper,
       rolcreaterole,
       rolcreatedb,
       rolcanlogin,
       rolreplication
FROM pg_roles
WHERE rolname = 'joan';

  -- Privilegios de objeto
  SELECT grantee,
       table_schema,
       table_name,
       privilege_type,
       is_grantable
FROM information_schema.role_table_grants
WHERE grantee = 'joan';

  -- ¿Qué puedo hacer?
SELECT current_user, session_user;

SELECT rolname, rolsuper, rolcreaterole, rolcreatedb
FROM pg_roles
WHERE rolname = current_user;

SELECT grantee, table_schema, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = current_user;
```

### 🧪 Ejemplo práctico

```sql
 -- Crear un usuario normal
 CREATE USER alumne WITH PASSWORD '1234';

 -- Crear un usuario que pueda crear BBDD
 CREATE USER profe WITH PASSWORD '1234' CREATEDB;

 -- Crear un usuario que pueda crear otros usuarios
 CREATE USER profe2 WITH PASSWORD '1234' CREATEROLE;

-- Crear un usuario ayudante del DBA
 CREATE USER profe2 WITH PASSWORD '1234' SUPERUSER;

 -- Todos los CREATE USER llevan implícito el LOGIN
```

---

### Permisos implícitos

Si el usuario «joan» recibe el permiso CREATE en PostgreSQL y después crea su propia tabla llamada «clients», joan tiene automáticamente permisos totales sobre esa tabla que acaba de crear (INSERT, SELECT, DELETE, UPDATE)

Si un usuario tiene CREATE, puede crear tablas en su esquema y, por defecto, tiene todos los permisos DML sobre las tablas que él mismo crea

Si quiere acceder a los datos de tablas de otro esquema o manipularlos, hace falta que el otro propietario (o un administrador) le conceda permisos como SELECT, INSERT, UPDATE, DELETE

---

### Permisos UPDATE y DELETE

El permiso «update» que se otorga sobre un objeto de PostgreSQL necesita ir emparejado con el permiso «select» (también pasa con el permiso «delete»). <br> ❗ PostgreSQL no lo hace automáticamente ❗

Supongamos que a un usuario se le otorga (grant) permiso de actualización sobre una tabla que no es suya.

```sql
grant update on usuari1.taula1 to usuari2;
```

y este usuario (usuari2) hace

```sql
update usuari1.taula1 set columna1=valor;
```

la sentencia funcionará. → La actualización se aplica a **toda la tabla**

Pero si intenta hacer

```sql
update usuari1.taula1 set columna1=valor where columna2=valor2;
```

la sentencia **fallará**.

¿Por qué?

PostgreSQL necesita conocer los datos de columna2 para poder realizar la actualización, y para poder conocer esos datos necesita el permiso «select»

```sql
GRANT SELECT (columna2) ON taula1 TO usuari2;
```

PostgreSQL necesita leer los datos de la fila para saber cómo modificarla y reflejar los cambios. Si no se tienen los permisos de SELECT, la actualización no se puede llevar a cabo correctamente. Lo mismo les pasa a las sentencias DELETE

---

### Privilegio superuser

**superuser** es el privilegio administrativo más alto que se puede tener en una base de datos PostgreSQL. No es un rol ordinario, sino un *privilegio especial de autenticación* que da control total sobre la instancia de la base de datos.

#### ¿Qué permite hacer `superuser`?

- Crear / eliminar roles y usuarios (CREATEROLE)
- Crear / eliminar bases de datos (CREATEDB)
- Modificar cualquier objeto
- Acceder a los datos sin restricciones
- Terminar cualquier sesión (pg_terminate_backend)
- Modificar configuraciones globales

```sql
CREATE ROLE admin_superuser LOGIN SUPERUSER PASSWORD 'supersecret';
```

### Comprobar quién es superuser

```sql
SELECT rolname
FROM pg_roles
WHERE rolsuper = TRUE;
```

---

### Consideraciones importantes

- Los privilegios de sistema son muy potentes: asigna solo los necesarios
- Los privilegios de objeto se pueden dar con más flexibilidad
- Revisa y revoca privilegios regularmente

## 🎭 Roles en PostgreSQL

### ¿Qué es un rol?

Un **rol** es un conjunto de permisos agrupados bajo un nombre. Sirve para simplificar la gestión de privilegios, especialmente en entornos con muchos usuarios.

En lugar de asignar 10 permisos a cada usuario, se crea un rol con esos permisos y se asigna el rol. Después, si se cambia algún privilegio del ROL, afecta a todos los usuarios que lo tienen, sin tener que ir uno por uno cambiando el privilegio

### Roles en PostgreSQL

En PostgreSQL no hay diferencia real entre «usuario» y «rol»: todo son roles. La diferencia está en cómo los utilizas

- Roles con LOGIN (usuarios)
- Roles sin LOGIN (grupos)
- Asignar roles a usuarios

```bash
** roles predefinidos en postgres
-- select rolname from pg_roles;
pg_database_owner → propietari BD
pg_read_all_data → puede leer todas las tablas
pg_write_all_data → puede escribir en todas las tablas
pg_monitor → monitorización
pg_read_all_settings
pg_read_all_stats
pg_stat_scan_tables
pg_read_server_files
pg_write_server_files
pg_execute_server_program
pg_signal_backend
pg_checkpoint
pg_use_reserved_connections
pg_create_subscription
postgres
```

### 🛠️ Crear y asignar roles

```sql
  -- Crear un nuevo rol
CREATE ROLE nom_rol;

  -- Crear un rol con privilegios (equivale a crear un usuario con privilegios)
CREATE ROLE rol_admin LOGIN CREATEDB CREATEROLE;

  -- modificar los privilegios de un rol
ALTER ROLE pepe NOCREATEDB;

  -- Conceder permisos al rol
GRANT SELECT, INSERT ON TABLE clients TO nom_rol;

  -- Asignar el rol a un usuario
GRANT nom_rol TO usuari;

  -- Asignar un rol a otro rol
GRANT altre_rol TO gestor_aula;
```

### Revocar roles a usuarios

```sql
REVOKE app_user FROM pepe;
```

⚠️⚠️ Cuando se añaden privilegios a un rol, todos los usuarios que tienen ese rol adquieren el nuevo privilegio **enseguida**, aunque ya estuvieran conectados o tengan sesiones abiertas desde hace tiempo.

PostgreSQL no necesita cerrar ni reiniciar la sesión para que el privilegio tenga efecto.

→ Los privilegios no se cargan solo al establecer la sesión, sino que PostgreSQL comprueba los privilegios de acceso dinámicamente cuando se ejecuta el código SQL.

### 🔍 Consultas útiles

```sql
  -- Roles asignados a un usuario
SELECT r.rolname AS usuari, m.roleid::regrole AS rol
FROM pg_auth_members m   JOIN pg_roles r ON r.oid = m.member
WHERE r.rolname = 'marta';

  -- Roles definidos en el sistema
 SELECT rolname   FROM pg_roles;

  -- Privilegios de un rol
 SELECT rolname, rolsuper, rolcreatedb, rolcreaterole
FROM pg_roles  WHERE rolname = 'gestor_aula';
```

- Un usuario puede tener múltiples **roles y privilegios**
- Un rol puede tener múltiples **roles y privilegios**

Si a un usuario le asignas varios roles, el usuario recibe la suma de todos los privilegios otorgados por cada uno de esos roles. Y si un mismo privilegio está repetido en varios roles, PostgreSQL simplemente detecta que el privilegio está concedido y el usuario lo tiene. No hay duplicación ni conflicto.

Cuando se asigna un rol a un usuario, el usuario recibe todos los privilegios del rol, y PostgreSQL no permite «anular» a un usuario un privilegio que proviene de un rol. Es decir, se puede hacer REVOKE de un privilegio, pero no tendrá efecto si el privilegio llega a través de un rol

Los roles son objetos del clúster a nivel global, igual que los usuarios. No están dentro de un esquema concreto, sino que existen a nivel de clúster y cualquier usuario los puede recibir.

### Buenas prácticas

- Agrupa los privilegios en roles según la funcionalidad (p. ej.: lectura, administración, desarrollo)
- Documenta qué hace cada rol y quién lo debe tener
- Usa roles en lugar de dar permisos individuales siempre que sea posible

## 📐 Perfiles en PostgreSQL

### ¿Qué es un perfil?

Este concepto viene de Oracle. En Oracle, un **perfil** es un conjunto de restricciones y parámetros que se aplican a los usuarios de la base de datos. Estos parámetros permiten controlar el uso de los recursos del sistema (como el número máximo de sesiones, el tiempo conectado, etc.) y establecer políticas de seguridad sobre las contraseñas.

En PostgreSQL no existe este mecanismo, pero hay otros para conseguir estas restricciones

### Parámetros de contraseña

```sql
ALTER ROLE pepe VALID UNTIL '2026-12-31';
```

### Limitación de conexiones

```sql
ALTER ROLE pepe CONNECTION LIMIT 5;
```

### Limitación de recursos a nivel de tablas o esquema

Control de recursos con pg_resource_scheduler o cgroups externos

PostgreSQL no tiene perfiles como Oracle. Los atributos de seguridad y de limitación de recursos se definen directamente en el rol con parámetros como rolconnlimit y rolvaliduntil. No hay un DEFAULT PROFILE; cada usuario debe tener sus atributos asignados al crearlo.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
