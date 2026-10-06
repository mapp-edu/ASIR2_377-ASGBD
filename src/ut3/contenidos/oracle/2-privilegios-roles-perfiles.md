---
layout: doc
title: "Oracle: privilegios, roles y perfiles"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: privilegios, roles y perfiles

## 🗝️ Permisos en Oracle

### ¿Qué son los permisos (privilegios)?

Los **permisos** o **privilegios** son derechos que Oracle otorga a los usuarios para hacer determinadas acciones sobre la base de datos: acceder, modificar, crear, administrar objetos o usuarios.

### Tipos de permisos

- **Privilegios de sistema**: permiten ejecutar acciones globales (crear tablas, abrir sesiones...)
- **Privilegios de objeto**: permiten acceder a objetos concretos o modificarlos (tablas, vistas...)

#### Ejemplos de privilegios de sistema

- `CREATE SESSION` → acceder a Oracle
- `CREATE TABLE` → crear tablas
- `UNLIMITED TABLESPACE` → uso ilimitado de espacio

#### Ejemplos de privilegios de objeto

- `SELECT`, `INSERT`, `UPDATE`, `DELETE` sobre tablas
- `EXECUTE` sobre procedimientos y funciones

### Asignación de privilegios

```sql
-- Sistema
GRANT CREATE SESSION TO joan;
GRANT CREATE TABLE TO joan;

-- Objeto
GRANT SELECT, INSERT ON alumnes TO joan;
```

### ♻️ Revocar permisos

```sql
-- Sistema
REVOKE CREATE SESSION FROM joan;

-- Objeto
REVOKE INSERT ON alumnes FROM joan;
```

### 🌐 Propagación con GRANT OPTION

Permite que un usuario que ha recibido un privilegio «sobre objeto» lo pueda conceder a otro (y también puede conceder el GRANT OPTION):

```sql
GRANT SELECT ON alumnes TO joan WITH GRANT OPTION;
```

::: warning Atención
👉 No se puede usar WITH GRANT OPTION con privilegios de sistema (como CREATE SESSION, CREATE TABLE, CREATE USER, etc.); WITH GRANT OPTION solo se puede usar para privilegios sobre objetos (tablas, vistas, procedimientos, etc.).
:::

#### Los privilegios de sistema se pueden propagar con WITH ADMIN OPTION

```sql
GRANT CREATE SESSION TO joan WITH ADMIN OPTION;
```

Permite que un usuario que ha recibido un privilegio «de sistema» lo pueda conceder a otro (y también puede conceder el ADMIN OPTION):

---

### 👀 Consultas útiles

```sql
-- Privilegios de sistema otorgados
SELECT * FROM dba_sys_privs WHERE grantee = 'JOAN';

-- Privilegios de objeto
SELECT * FROM dba_tab_privs WHERE grantee = 'JOAN';

-- ¿Qué puedo hacer?
SELECT * FROM session_privs;
```

### 🧪 Ejemplo práctico

```sql
-- Crear un usuario y darle acceso básico
CREATE USER marta IDENTIFIED BY 1234;
GRANT CREATE SESSION, CREATE TABLE TO marta;

-- Permitir a marta consultar alumnes
GRANT SELECT ON alumnes TO marta;   -- se da a marta permiso para consultar la tabla alumnes (ejecutado por el usuario propietario de la tabla alumnes)
-- 'o'
GRANT SELECT ON joan.alumnes TO marta;
-- se da a marta permiso para consultar la tabla alumnes del usuario joan
```

---

### Permisos implícitos

Si el usuario «joan» recibe el permiso CREATE TABLE en Oracle y después crea su propia tabla llamada «clients», joan tiene automáticamente permisos totales sobre esa tabla que acaba de crear (INSERT, SELECT, DELETE, UPDATE)

Si un usuario tiene CREATE TABLE, puede crear tablas en su esquema y, por defecto, tiene todos los permisos DML sobre las tablas que él mismo crea

Si quiere acceder a los datos de tablas de otro esquema o manipularlos, hace falta que el otro propietario (o un administrador) le conceda permisos como SELECT, INSERT, UPDATE, DELETE

---

### Acceso a objetos de otro usuario

Si un usuario `'user1'` quiere acceder a un objeto de otro usuario `'user2'`, deberá anteponer al nombre del objeto el nombre del schema del propietario del objeto en el momento de utilizar la sentencia SQL adecuada.

Por ejemplo

```sql
-- Desde user1, suponiendo que user1 tiene permiso sobre table1 de user2...
SELECT * FROM user2.table1;
```

---

### Permisos UPDATE y DELETE

El permiso «update» que se otorga sobre un objeto de Oracle necesita ir emparejado con el permiso «select» (también pasa con el permiso «delete»). <br> ❗ Oracle no lo hace automáticamente ❗

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

Oracle necesita conocer los datos de columna2 para poder realizar la actualización, y para poder conocer esos datos necesita el permiso «select»

Oracle Database necesita leer los datos de la fila para saber cómo modificarla y reflejar los cambios. Si no se tienen los permisos de SELECT, la actualización no se puede llevar a cabo correctamente. Lo mismo les pasa a las sentencias DELETE

---

### Privilegio SYSDBA

**SYSDBA** es el privilegio administrativo más alto que se puede tener en una base de datos Oracle. No es un rol ordinario, sino un *privilegio especial de autenticación* que da control total sobre la instancia de la base de datos.

#### ¿Qué permite hacer `SYSDBA`?

- Arrancar y parar la base de datos (STARTUP / SHUTDOWN).
- Conectarse a la instancia aunque la base de datos esté apagada.
- Acceder como el usuario interno `SYS` (acceso con máximos privilegios).
- Crear, borrar y modificar cualquier objeto de cualquier esquema.
- Realizar copias de seguridad y restauraciones con RMAN.
- Ejecutar tareas críticas de mantenimiento y recuperación.
- Cambiar configuraciones internas de la base de datos.

#### ¿Cómo se usa?

```bash
sqlplus usuari1@ip/freepdb1 as sysdba
```

**SYSDBA tiene poder absoluto:** no tiene las restricciones de seguridad normales. Se debe utilizar solo para administración y tareas críticas. Un usuario con `SYSDBA` equivale prácticamente a ser el usuario `SYS`.

#### Distinción entre `SYSDBA` y `SYSOPER`

- **SYSDBA** → Control total: acceso a todos los datos y a las operaciones administrativas completas.
- **SYSOPER** → Permisos más restringidos: permite operaciones básicas de operación (arrancar/parar, backups básicos), pero no todas las operaciones que puede hacer `SYSDBA`.

---

### Consideraciones importantes

- Los privilegios de sistema son muy potentes: asigna solo los necesarios
- Los privilegios de objeto se pueden dar con más flexibilidad
- No utilices `GRANT ALL` salvo que sea imprescindible
- Revisa y revoca privilegios regularmente

::: warning Atención
sys tiene el privilegio SYSDBA y también el SYSOPER <br> system NO tiene el privilegio SYSDBA <br> system NO tiene el privilegio SYSOPER
:::

### 📘 Buenas prácticas

- Usa roles para agrupar permisos (lo veremos en la siguiente sección)
- Documenta qué recibe cada usuario y por qué
- Monitoriza quién tiene permisos con consultas sobre el diccionario de datos

## 🎭 Roles en Oracle

### ¿Qué es un rol?

Un **rol** es un conjunto de permisos agrupados bajo un nombre. Sirve para simplificar la gestión de privilegios, especialmente en entornos con muchos usuarios.

En lugar de asignar 10 permisos a cada usuario, se crea un rol con esos permisos y se asigna el rol.

### Tipos de roles

- **Predefinidos** (creados por Oracle): `DBA`, `CONNECT`, `RESOURCE`, `SELECT_CATALOG_ROLE`, etc.
- **Definidos por el usuario**: creados por el administrador según las necesidades específicas
- **Roles activos/inactivos**: en una sesión se pueden activar o desactivar roles

### 🛠️ Crear y asignar roles

```sql
-- Crear un nuevo rol
CREATE ROLE gestor_aula;

-- Conceder permisos al rol
GRANT CREATE SESSION, CREATE TABLE TO gestor_aula;

-- Asignar el rol a un usuario
GRANT gestor_aula TO marta;

-- Asignar un rol a otro rol
GRANT altre_rol TO gestor_aula;
```

### Revocar roles

```sql
REVOKE gestor_aula FROM marta;
```

Cuando se añaden privilegios a un rol, todos los usuarios que tienen ese rol adquieren el nuevo privilegio **enseguida**, aunque ya estuvieran conectados o tengan sesiones abiertas desde hace tiempo.

Oracle no necesita cerrar ni reiniciar la sesión para que el privilegio tenga efecto.

Los privilegios no se cargan solo al establecer la sesión, sino que Oracle:

Comprueba los privilegios de acceso dinámicamente cuando se ejecuta el código SQL.

Mira los privilegios disponibles a través de los roles activos en la sesión.

Si el rol ya está activo, el nuevo privilegio del rol pasa a estar disponible al instante.

### 🔍 Consultas útiles

```sql
-- Roles asignados a un usuario
SELECT * FROM dba_role_privs WHERE grantee = 'MARTA';

-- Roles definidos en el sistema
SELECT * FROM dba_roles;

-- Privilegios de un rol
SELECT * FROM role_sys_privs WHERE role = 'GESTOR_AULA';
```

### Ejemplo práctico completo

```sql
CREATE ROLE aplicacio_web;

GRANT CREATE SESSION TO aplicacio_web;
GRANT SELECT, INSERT, UPDATE ON alumnes TO aplicacio_web;

CREATE USER webapp IDENTIFIED BY secret;
GRANT aplicacio_web TO webapp;
```

- Un usuario puede tener múltiples **roles y privilegios**
- Un rol puede tener múltiples **roles y privilegios**

Si a un usuario le asignas varios roles, el usuario recibe la suma de todos los privilegios otorgados por cada uno de esos roles. Y si un mismo privilegio está repetido en varios roles, Oracle simplemente detecta que el privilegio está concedido y el usuario lo tiene. No hay duplicación ni conflicto.

Cuando se asigna un rol a un usuario, el usuario recibe todos los privilegios del rol, y Oracle no permite hacer REVOKE de un privilegio que proviene de un rol.

Los roles son objetos de la base de datos a nivel global, igual que los usuarios. No están dentro de un esquema concreto, sino que existen a nivel de base de datos y cualquier usuario los puede recibir.

### Buenas prácticas

- Agrupa los privilegios en roles según la funcionalidad (p. ej.: lectura, administración, desarrollo)
- Documenta qué hace cada rol y quién lo debe tener
- No añadas `ALL PRIVILEGES` dentro de un rol sin un motivo justificado
- Usa roles en lugar de dar permisos individuales siempre que sea posible

## 📐 Perfiles en Oracle

### ¿Qué es un perfil?

En Oracle, un **perfil** es un conjunto de restricciones y parámetros que se aplican a los usuarios de la base de datos. Estos parámetros permiten controlar el uso de los recursos del sistema (como el número máximo de sesiones, el tiempo conectado, etc.) y establecer políticas de seguridad sobre las contraseñas.

En Oracle hay un perfil predefinido: el perfil llamado **DEFAULT**

Cuando se crea un usuario, se le asigna un perfil por defecto → DEFAULT

::: tip Nota
→ ¿En Oracle 23 hay alguno más?
:::

```txt
SQL> select * from dba_profiles where profile='DEFAULT';
```

Un perfil tiene dos tipos/grupos de parámetros

- Parámetros de recursos
- Parámetros de contraseñas

### Parámetros de recursos

Los parámetros de recursos limitan el uso que puede hacer un usuario del sistema. Algunos de los más comunes son:

- **SESSIONS_PER_USER**: número máximo de sesiones que puede tener un usuario.
- **CONNECT_TIME**: tiempo máximo de conexión por sesión (en minutos).
- **IDLE_TIME**: tiempo máximo que un usuario puede estar inactivo antes de ser desconectado.
- **CPU_PER_SESSION** y **CPU_PER_CALL**: límite de CPU (en centésimas de segundo).
- **LOGICAL_READS_PER_SESSION** y **LOGICAL_READS_PER_CALL**: límite de lecturas lógicas en bloques.

::: tip Nota
→ ¿Cuál es el IDLE_TIME por defecto en Oracle 23?
:::

### Parámetros de contraseña

Los parámetros de contraseña ayudan a reforzar la seguridad de los usuarios, controlando aspectos como:

- **FAILED_LOGIN_ATTEMPTS**: número de intentos fallidos de autenticación antes de bloquear la cuenta.
- **PASSWORD_LIFE_TIME**: duración de la contraseña antes de que expire (en días).
- **PASSWORD_REUSE_TIME**: tiempo mínimo que hay que esperar para reutilizar una contraseña.
- **PASSWORD_REUSE_MAX**: número máximo de veces que se puede reutilizar la contraseña.
- **PASSWORD_LOCK_TIME**: tiempo de bloqueo de la cuenta después de superar los intentos fallidos.
- **PASSWORD_GRACE_TIME**: periodo de gracia en el que el usuario puede cambiar la contraseña después de que haya expirado.
- **PASSWORD_VERIFY_FUNCTION**: función de verificación de contraseñas para aplicar políticas de complejidad.

::: tip Nota
→ ¿Cuál es el PASSWORD_LIFE_TIME por defecto en Oracle 23? <br> ¿Y el PASSWORD_GRACE_TIME?
:::

### Crear y modificar perfiles

Puedes crear un perfil nuevo con la orden `CREATE PROFILE` y modificarlo con `ALTER PROFILE`.

```sql
-- Ejemplo de creación de un perfil con restricciones de recursos y de contraseña
CREATE PROFILE perf-adm LIMIT
  SESSIONS_PER_USER     5
  CONNECT_TIME          120
  IDLE_TIME             30
  FAILED_LOGIN_ATTEMPTS 4
  PASSWORD_LIFE_TIME    165;

-- Modificar un perfil para establecer un tiempo de bloqueo de la contraseña
ALTER PROFILE perf-adm LIMIT PASSWORD_LOCK_TIME 5;
```

### Asignar un perfil a un usuario

Al crear o modificar un usuario, puedes asignarle un perfil para limitar los recursos y aplicar políticas de seguridad:

```sql
-- Crear un usuario con un perfil específico
CREATE USER enric IDENTIFIED BY secret
  DEFAULT TABLESPACE tab_app
  QUOTA UNLIMITED ON tab_app
  PROFILE perf-adm;

-- O actualizar un usuario existente para asignarle un perfil
ALTER USER enric PROFILE perf-adm;
```

### Buenas prácticas

- Asigna perfiles adaptados a la naturaleza de los usuarios (administradores, desarrolladores, operativos, etc.).
- Revisa periódicamente los parámetros de recursos y de contraseña para garantizar un equilibrio entre rendimiento y seguridad.
- Asegúrate de que los usuarios con privilegios elevados tengan políticas de seguridad más estrictas.
- Utiliza el perfil DEFAULT como punto de partida y modifica los parámetros según las necesidades específicas.

### 🔍 Consultas útiles relacionadas con los perfiles

```sql
-- Consultar los perfiles definidos en la base de datos
SELECT * FROM dba_profiles ORDER BY profile;

-- Consultar los parámetros de tipo PASSWORD en el perfil DEFAULT
SELECT * FROM dba_profiles WHERE resource_type = 'PASSWORD';

-- Consultar los usuarios y sus perfiles
SELECT username, profile FROM dba_users;
```

### 🔍 Borrar perfiles

```sql
DROP PROFILE nom_perfil;
     o
DROP PROFILE nom_perfil [CASCADE];
```

Especifica CASCADE para desasignar el perfil de los usuarios que lo tengan asignado. Oracle Database asigna automáticamente el perfil DEFAULT a esos usuarios. Debes especificar esta cláusula para eliminar un perfil que está asignado actualmente a algún usuario

### Resumen

Los perfiles en Oracle son herramientas fundamentales para controlar el uso de los recursos y reforzar la seguridad de las cuentas de usuario. Mediante la creación, modificación y asignación de perfiles, se puede garantizar que los usuarios cumplan las políticas establecidas, asegurando a la vez un rendimiento óptimo y la protección de la base de datos.

- Un usuario puede tener **un único perfil** (y múltiples **roles y privilegios**)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
