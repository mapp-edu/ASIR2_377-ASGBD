---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 3: asegurar las cuentas de administración"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 3: asegurar las cuentas de administración

::: tip Solución de referencia
Resolución de referencia de la [Práctica 3](../practica-3-cuentas-de-administracion), con los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

La práctica se puede hacer con PostgreSQL o con Oracle. La solución tiene una parte para cada uno:

- **[PostgreSQL](#solucion-con-postgresql):** todas las órdenes y salidas se han obtenido en **PostgreSQL 16** sobre Ubuntu 24.04 (paquetes de la distribución, como en Linux Mint), en un clúster recién creado (`16/p3`, puerto 5433, para no tocar el principal: por eso algunas salidas muestran ese puerto y esa ruta; en el aula será `16/main` y el puerto 5432). La máquina cliente se ha simulado con una segunda dirección, `10.0.0.5`, en la red `10.0.0.0/24`; en el aula será la red de las máquinas virtuales.
- **[Oracle](#solucion-con-oracle):** escrita a partir de la documentación de Oracle; **no se ha podido ejecutar** en un servidor Oracle. Conviene probarla antes de usarla como modelo.

Cuentas y contraseñas de la solución:

| Cuenta | Uso | Contraseña de ejemplo |
|:---|:---|:---|
| `postgres` | Cuenta predeterminada de PostgreSQL, solo para emergencias | `Pg#Adm1n-2026!Costera` |
| `SYS`, `SYSTEM` | Cuentas predeterminadas de Oracle, solo para emergencias | `Ora#Adm1n-2026!Costera` |
| `admin_ana` | Cuenta de administración personal | `Ana.Adm1n#2026-ASGBD` |

## Solución con PostgreSQL

### Parte 1. Auditoría inicial

#### 1. Cuentas y estado

```bash
sudo -u postgres psql
```

```sql
\du
```

```txt
                             List of roles
 Role name |                         Attributes
-----------+------------------------------------------------------------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

`\du` solo muestra los roles creados por el usuario. Para verlos todos, con su estado:

```sql
SELECT rolname, rolsuper, rolcanlogin, rolconnlimit, rolvaliduntil,
       rolpassword IS NOT NULL AS tiene_pwd
FROM   pg_authid
ORDER  BY rolcanlogin DESC, rolname;
```

```txt
          rolname           | rolsuper | rolcanlogin | rolconnlimit | rolvaliduntil | tiene_pwd
----------------------------+----------+-------------+--------------+---------------+-----------
 postgres                   | t        | t           |           -1 |               | f
 pg_checkpoint              | f        | f           |           -1 |               | f
 pg_monitor                 | f        | f           |           -1 |               | f
 pg_read_all_data           | f        | f           |           -1 |               | f
 ...                          (resto de roles pg_*)
```

- PostgreSQL no tiene un campo «estado» como Oracle: una cuenta está **abierta** si tiene `rolcanlogin = t`, **caducada** si `rolvaliduntil` es una fecha pasada, y no hay estado «bloqueada» (se consigue con `NOLOGIN`).
- Privilegios de administración: `postgres` (`rolsuper = t`). Los roles `pg_*` son **roles predefinidos** que agrupan privilegios (`pg_monitor`, `pg_read_all_data`...); son `NOLOGIN` y no se puede entrar con ellos.
- Se usa `pg_authid` (solo superusuarios) porque `pg_roles` oculta la contraseña: la columna `tiene_pwd` revela que `postgres` **no tiene contraseña**.

#### 2. Autenticación del administrador

```bash
grep -v '^#' /etc/postgresql/16/main/pg_hba.conf | grep -v '^$'
```

```txt
local   all             postgres                                peer
local   all             all                                     peer
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            scram-sha-256
host    replication     all             ::1/128                 scram-sha-256
```

```sql
SHOW listen_addresses;     -- localhost
```

| Prueba | Resultado | Explicación |
|:---|:---|:---|
| `sudo -u postgres psql` | Entra **sin contraseña** | Regla `local ... postgres peer`: basta con ser el usuario `postgres` del sistema operativo. |
| `psql -U postgres` siendo otro usuario del sistema | `FATAL: Peer authentication failed for user "postgres"` | `peer` compara el usuario del sistema con el de la base de datos. |
| `psql -h 127.0.0.1 -U postgres` | `FATAL: password authentication failed for user "postgres"` | La regla `host` pide contraseña y `postgres` no tiene. |
| `psql -h <ip-servidor> -U postgres` desde otra máquina | `Connection refused` | `listen_addresses = localhost`: el servidor no escucha en la red. |

Conclusión: en la instalación inicial el administrador **solo** entra desde el propio servidor, sin contraseña, siendo el usuario `postgres` del sistema (o `root` mediante `sudo`). Es seguro, pero hace que la seguridad de la base de datos dependa de quién puede usar `sudo`.

#### 3. Algoritmo de las contraseñas

```sql
SHOW password_encryption;    -- scram-sha-256
```

Después de asignar una contraseña (paso 5) se puede ver cómo se guarda:

```sql
SELECT rolname, left(rolpassword, 30) AS hash FROM pg_authid WHERE rolname = 'postgres';
```

```txt
 rolname  |              hash
----------+--------------------------------
 postgres | SCRAM-SHA-256$4096:Vj0J8jvx/5U
```

`SCRAM-SHA-256` con 4096 iteraciones y *salt*. El antiguo `md5` se considera inseguro: si aparece algún hash que empiece por `md5`, hay que volver a asignar esa contraseña.

#### 4. Riesgos encontrados

| Riesgo | Gravedad | Medida (paso) |
|:---|:---|:---|
| `postgres` no tiene contraseña: cualquiera con `sudo` es superusuario de la base de datos. | Media | Contraseña robusta (5) y cuenta personal para el trabajo diario (7). |
| Se trabaja a diario con el superusuario. | Alta | Cuenta personal sin `SUPERUSER` (7). |
| No hay caducidad, límite de sesiones ni protección frente a intentos repetidos. | Media | Política (8). |
| Cuando se abra el servidor a la red, la regla `host all all` dejará entrar a `postgres` desde cualquier máquina permitida. | Alta | Reglas específicas en `pg_hba.conf` (10). |
| No se registran las conexiones. | Media | `log_connections` (12). |
| `max_connections = 100` y sin tiempos de espera. | Baja | Parámetros de conexión (13–15). |

### Parte 2. Asegurar las cuentas

#### 5. Contraseña robusta

```sql
\password postgres
```

`\password` pide la contraseña dos veces y envía al servidor el hash ya calculado, de modo que la contraseña no queda en el historial de `psql` ni en el registro del servidor. `ALTER ROLE postgres PASSWORD '...'` también funciona, pero deja la contraseña en claro en `~/.psql_history` y, si se registran las sentencias, en el log.

Se valora que la contraseña sea larga (12 caracteres o más), combine tipos de caracteres y no sea `1234` ni el nombre del servidor. Para que el servidor rechace contraseñas débiles existe la extensión `passwordcheck` (solo funciona cuando la contraseña llega en claro, no con `\password`).

#### 6. Cuentas predeterminadas que no se usan

```sql
SELECT rolname FROM pg_roles WHERE rolname LIKE 'pg\_%' AND rolcanlogin;
-- 0 filas: todos los roles predefinidos son NOLOGIN
```

La única cuenta predeterminada con la que se puede entrar es `postgres`, y **no** debe bloquearse con `NOLOGIN`: es la cuenta de emergencia, la que usan los scripts de mantenimiento del paquete y la que permite arreglar un error. Se protege restringiendo desde dónde entra (paso 10). Para bloquear cualquier otra cuenta que no se use: `ALTER ROLE nombre NOLOGIN;`.

#### 7. Cuenta de administración personal

```sql
CREATE ROLE admin_ana LOGIN CREATEDB CREATEROLE
  PASSWORD 'Ana.Adm1n#2026-ASGBD';          -- o \password admin_ana después
GRANT pg_monitor, pg_signal_backend TO admin_ana;
```

| Privilegio | Para qué |
|:---|:---|
| `CREATEDB` | Crear bases de datos. |
| `CREATEROLE` | Crear usuarios y roles. Desde PostgreSQL 16 solo puede gestionar los roles que él mismo crea. |
| `pg_monitor` | Consultar las vistas de monitorización (`pg_stat_activity` de todos, `pg_settings`...). |
| `pg_signal_backend` | Cancelar o terminar sesiones de otros usuarios (`pg_terminate_backend`). |

**No** se le da `SUPERUSER`: el superusuario se salta todas las comprobaciones de permisos (y, como se verá en el paso 9, también el límite de conexiones). Las tareas que lo necesiten (cambiar parámetros con `ALTER SYSTEM`, instalar extensiones) se hacen con `postgres`. Para nivel 4 se puede dar acceso selectivo, por ejemplo `GRANT ALTER SYSTEM ON PARAMETER idle_session_timeout TO admin_ana;` (desde PostgreSQL 15).

#### 8. Política de cuentas

```sql
ALTER ROLE admin_ana VALID UNTIL '2027-01-31' CONNECTION LIMIT 3;
ALTER ROLE postgres CONNECTION LIMIT 2;
\du
```

```txt
                             List of roles
 Role name |                         Attributes
-----------+------------------------------------------------------------
 admin_ana | Create role, Create DB                                    +
           | 3 connections                                             +
           | Password valid until 2027-01-31 00:00:00+01
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS+
           | 2 connections
```

**Bloqueo tras intentos fallidos.** PostgreSQL no bloquea cuentas por intentos fallidos. Las alternativas son:

- **`auth_delay`**: módulo incluido en PostgreSQL que espera un tiempo antes de responder a cada autenticación fallida. Hace muy lentos los ataques de fuerza bruta. Necesita cargarse al arrancar:

  ```sql
  ALTER SYSTEM SET shared_preload_libraries = 'auth_delay';
  -- reiniciar el servidor, y después:
  ALTER SYSTEM SET auth_delay.milliseconds = 3000;
  SELECT pg_reload_conf();
  ```

  Si se intenta fijar `auth_delay.milliseconds` antes de reiniciar, da `ERROR: unrecognized configuration parameter "auth_delay.milliseconds"`, porque el módulo aún no está cargado.

- **`fail2ban`**: lee el log del servidor y, tras varios fallos desde una misma IP, la bloquea en el cortafuegos. Se configura con un filtro que busque `password authentication failed for user`. Es lo más parecido al bloqueo de Oracle, pero bloquea la **máquina**, no la cuenta.

- **Bloqueo manual**: `ALTER ROLE nombre NOLOGIN;` cuando se detecten intentos.

Se espera que el alumno o la alumna aplique `auth_delay` o explique de forma razonada cómo aplicaría `fail2ban`.

#### 9. Demostración

**Límite de sesiones.** Con tres sesiones de `admin_ana` abiertas, la cuarta:

```txt
psql: error: connection to server at "127.0.0.1", port 5433 failed: FATAL:  too many connections for role "admin_ana"
```

**El límite no se aplica al superusuario.** Con `CONNECTION LIMIT 2`, `postgres` llegó a tener cinco sesiones abiertas a la vez sin ningún error: PostgreSQL no aplica `CONNECTION LIMIT` a los superusuarios. Es una conclusión importante que el alumnado debería descubrir (o, al menos, documentar) al hacer la prueba: el límite protege a `admin_ana`, no a `postgres`.

**Caducidad.** Con `VALID UNTIL` en una fecha pasada:

```txt
psql: error: connection to server at "127.0.0.1", port 5433 failed: FATAL:  password authentication failed for user "admin_ana"
```

El cliente recibe el mismo mensaje que con una contraseña errónea (para no dar pistas a un atacante); el motivo real está en el log:

```txt
2026-10-20 18:45:55.654 CEST [3382] admin_ana@postgres FATAL:  password authentication failed for user "admin_ana"
2026-10-20 18:45:55.654 CEST [3382] admin_ana@postgres DETAIL:  User "admin_ana" has an expired password.
	Connection matched file "/etc/postgresql/16/p3/pg_hba.conf" line 125: "host    all             all             127.0.0.1/32            scram-sha-256"
```

`VALID UNTIL` solo afecta a la autenticación **por contraseña**: con `postgres` caducado, `sudo -u postgres psql` (método `peer`) sigue entrando. Es la puerta de emergencia, y conviene que esté documentada.

**`auth_delay`.** Un intento con contraseña errónea tarda 6 segundos en vez de unos milisegundos (3 s por intento; `psql` lo intenta dos veces, con y sin SSL):

```txt
psql: error: connection to server at "10.0.0.5", port 5433 failed: FATAL:  password authentication failed for user "admin_ana"

real	0m6.071s
```

En el log se ve el retraso entre la conexión y el rechazo:

```txt
18:46:15.281 CEST [3441] [unknown]@[unknown] LOG:  connection received: host=10.0.0.5 port=49898
18:46:18.298 CEST [3441] admin_ana@postgres FATAL:  password authentication failed for user "admin_ana"
```

### Parte 3. Restringir el acceso en red

#### 10. `postgres` solo desde el servidor y `admin_ana` también desde el cliente

Primero, que el servidor escuche en la red (necesita reiniciar):

```sql
ALTER SYSTEM SET listen_addresses = '*';
```

Después, `pg_hba.conf`. Las reglas se leen **en orden** y se aplica la primera que coincide, así que las específicas van **antes** de las generales:

```txt
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
host    all             postgres        127.0.0.1/32            scram-sha-256
host    all             postgres        ::1/128                 scram-sha-256
host    all             postgres        all                     reject
host    all             admin_ana       10.0.0.0/24             scram-sha-256

local   all             all                                     peer
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

```bash
sudo systemctl restart postgresql
```

Comprobación de que el fichero se ha leído bien:

```sql
SELECT line_number, type, user_name, address, auth_method, error FROM pg_hba_file_rules;
```

```txt
 line_number | type  |  user_name  |  address  |  auth_method  | error
-------------+-------+-------------+-----------+---------------+-------
         118 | local | {postgres}  |           | peer          |
         119 | host  | {postgres}  | 127.0.0.1 | scram-sha-256 |
         120 | host  | {postgres}  | ::1       | scram-sha-256 |
         121 | host  | {postgres}  | all       | reject        |
         122 | host  | {admin_ana} | 10.0.0.0  | scram-sha-256 |
         127 | local | {all}       |           | peer          |
         ...
```

- La línea `reject` es la que garantiza que `postgres` no entre desde fuera, aunque más adelante alguien añada una regla general para la red.
- Si la línea de `admin_ana` se pusiera **después** de una regla `reject` general o de una que no la incluya, no se aplicaría nunca. Es el error más frecuente.
- Abrir también el puerto en el cortafuegos del servidor: `sudo ufw allow from 10.0.0.0/24 to any port 5432 proto tcp`.

#### 11. Comprobación desde el cliente

```bash
psql -h <ip-servidor> -U postgres
```

```txt
psql: error: connection to server at "10.0.0.5", port 5433 failed: FATAL:  pg_hba.conf rejects connection for host "10.0.0.5", user "postgres", database "postgres", SSL encryption
connection to server at "10.0.0.5", port 5433 failed: FATAL:  pg_hba.conf rejects connection for host "10.0.0.5", user "postgres", database "postgres", no encryption
```

```bash
psql -h <ip-servidor> -U admin_ana -d postgres -c 'SELECT current_user, inet_client_addr()'
```

```txt
 current_user | inet_client_addr
--------------+------------------
 admin_ana    | 10.0.0.5
```

`postgres` se rechaza **aunque la contraseña sea correcta**, sin llegar a pedirla.

#### 12. Intentos rechazados en el log

```sql
ALTER SYSTEM SET log_connections = on;
SELECT pg_reload_conf();
```

```bash
sudo grep -E "rejects|authentication failed|authorized" /var/log/postgresql/postgresql-16-main.log
```

```txt
... [3435] postgres@postgres FATAL:  pg_hba.conf rejects connection for host "10.0.0.5", user "postgres", database "postgres", no encryption
... [3437] admin_ana@postgres LOG:  connection authorized: user=admin_ana database=postgres application_name=psql SSL enabled (protocol=TLSv1.3, ...)
... [3441] admin_ana@postgres FATAL:  password authentication failed for user "admin_ana"
```

Los rechazos aparecen siempre (son errores `FATAL`); `log_connections` añade además las conexiones recibidas y las aceptadas, que permiten ver desde qué IP llegan los intentos.

### Parte 4. Parámetros de conexión

#### 13. Número máximo de conexiones

```sql
SHOW max_connections;                     -- 100
SHOW superuser_reserved_connections;      -- 3
SELECT backend_type, count(*) FROM pg_stat_activity GROUP BY 1 ORDER BY 2 DESC;
```

```txt
         backend_type         | count
------------------------------+-------
 client backend               |     1
 walwriter                    |     1
 autovacuum launcher          |     1
 logical replication launcher |     1
 background writer            |     1
 checkpointer                 |     1
```

Las conexiones de clientes son las `client backend`; el resto son procesos internos que también aparecen en `pg_stat_activity`. Un `count(*)` sin filtrar da un resultado engañoso.

```sql
ALTER SYSTEM SET max_connections = 50;
SELECT pg_reload_conf();
SELECT name, setting, pending_restart FROM pg_settings WHERE name = 'max_connections';
```

```txt
      name       | setting | pending_restart
-----------------+---------+-----------------
 max_connections | 100     | t
```

`pending_restart = t`: el parámetro es de contexto `postmaster` y solo cambia al **reiniciar**. Tras `sudo systemctl restart postgresql`, `SHOW max_connections` devuelve 50.

Justificación esperada del valor: cada conexión es un proceso con su memoria (`work_mem` por cada operación de ordenación), así que el máximo depende de la RAM y del uso previsto. En un servidor de prácticas con pocos usuarios, 50 es suficiente; de ellas, 3 quedan reservadas para superusuarios, para poder entrar a resolver problemas aunque el resto estén ocupadas. Si una aplicación necesita muchas conexiones, lo adecuado es un *pool* de conexiones (PgBouncer) y no subir mucho `max_connections`.

#### 14. Tiempo máximo de inactividad

```sql
ALTER SYSTEM SET idle_session_timeout = '10min';
ALTER SYSTEM SET idle_in_transaction_session_timeout = '5min';
SELECT pg_reload_conf();
```

- `idle_session_timeout` (desde PostgreSQL 14): cierra las sesiones inactivas **fuera** de una transacción.
- `idle_in_transaction_session_timeout`: cierra las que se quedan con una transacción abierta sin hacer nada. Son las más peligrosas, porque mantienen bloqueos.

Para demostrarlo sin esperar diez minutos, se baja el valor solo para la cuenta de prueba:

```sql
ALTER ROLE admin_ana SET idle_session_timeout = '15s';
```

```txt
 idle_session_timeout
----------------------
 15s
(1 row)

-- 17 segundos sin hacer nada...
FATAL:  terminating connection due to idle-session timeout
SSL connection has been closed unexpectedly
connection to server was lost
```

Y en el log:

```txt
... [3485] admin_ana@postgres FATAL:  terminating connection due to idle-session timeout
```

Al terminar, `ALTER ROLE admin_ana RESET idle_session_timeout;`. Este ejemplo muestra también la jerarquía de niveles de la unidad: el valor del rol prevalece sobre el de `ALTER SYSTEM`.

::: tip Criterio de corrección
`idle_session_timeout` también cierra las conexiones inactivas de un *pool* de conexiones o de una aplicación, que después darán error. Mencionarlo es una evidencia de nivel 4.
:::

#### 15. Tiempo máximo para autenticarse

```sql
ALTER SYSTEM SET authentication_timeout = '20s';
SELECT pg_reload_conf();
```

Contexto `sighup`: basta con recargar. Prueba con un valor de 5 s: se abre la conexión TCP sin enviar nada y el servidor la cierra al agotarse el tiempo:

```bash
time nc <ip-servidor> 5432
```

```txt
real    0m5.010s
```

Este caso no deja rastro en el log, porque el cliente no ha llegado a enviar ningún dato. Protege frente a clientes que abren conexiones y se quedan sin autenticarse, consumiendo procesos.

#### 16. Tabla de parámetros

```sql
SELECT name, setting, unit, context, sourcefile
FROM   pg_settings
WHERE  name IN ('max_connections', 'idle_session_timeout', 'idle_in_transaction_session_timeout',
                'authentication_timeout', 'listen_addresses', 'log_connections',
                'shared_preload_libraries', 'auth_delay.milliseconds');
```

| Parámetro | Valor anterior | Valor nuevo | Dónde se guarda | ¿Reinicio? |
|:---|:---|:---|:---|:---|
| `listen_addresses` | `localhost` | `*` | `postgresql.auto.conf` | Sí (`postmaster`) |
| `max_connections` | `100` | `50` | `postgresql.auto.conf` | Sí (`postmaster`) |
| `shared_preload_libraries` | *(vacío)* | `auth_delay` | `postgresql.auto.conf` | Sí (`postmaster`) |
| `auth_delay.milliseconds` | `0` | `3000` | `postgresql.auto.conf` | No, recarga (`sighup`) |
| `authentication_timeout` | `1min` | `20s` | `postgresql.auto.conf` | No, recarga (`sighup`) |
| `idle_session_timeout` | `0` (desactivado) | `10min` | `postgresql.auto.conf` | No (`user`) |
| `idle_in_transaction_session_timeout` | `0` (desactivado) | `5min` | `postgresql.auto.conf` | No (`user`) |
| `log_connections` | `off` | `on` | `postgresql.auto.conf` | No (afecta a las conexiones nuevas) |
| Reglas de acceso | Sin reglas para la red | Reglas del paso 10 | `pg_hba.conf` | No, recarga |
| `admin_ana`: `CONNECTION LIMIT`, `VALID UNTIL` | — | `3`, `2027-01-31` | Catálogo (`pg_authid`) | No |

Si los cambios se han hecho editando `postgresql.conf` en lugar de `ALTER SYSTEM`, también es correcto: lo que se valora es que la columna «Dónde se guarda» coincida con lo que se ha hecho (y que `sourcefile` lo confirme).

## Solución con Oracle

::: info Órdenes no ejecutadas
Esta parte no se ha podido probar en un servidor Oracle. Los nombres de cuentas y los mensajes son los de la documentación de Oracle Database 23ai; pueden variar ligeramente según la imagen del contenedor.
:::

Se trabaja en la PDB `FREEPDB1`, salvo para las cuentas comunes y los parámetros de la instancia, que se gestionan en `CDB$ROOT`.

### Parte 1. Auditoría inicial

#### 1. Cuentas y estado

```sql
SELECT username, account_status, authentication_type, profile, common, oracle_maintained
FROM   dba_users
ORDER  BY oracle_maintained, username;
```

- La mayoría de las cuentas internas (`DBSNMP`, `XDB`, `OUTLN`, `AUDSYS`...) aparecen como `LOCKED` y con `authentication_type = NONE`: son **esquemas sin contraseña**, con los que no se puede entrar.
- Abiertas: `SYS`, `SYSTEM` y, en la PDB, `PDBADMIN`.

Cuentas con privilegios de administración:

```sql
SELECT grantee, granted_role FROM dba_role_privs WHERE granted_role IN ('DBA', 'PDB_DBA');
SELECT username, sysdba, sysoper, sysbackup, sysdg, syskm FROM v$pwfile_users;
SELECT * FROM dba_users_with_defpwd;      -- cuentas con la contraseña por defecto de Oracle
```

#### 2. Autenticación del administrador

- `sqlplus / as sysdba` dentro del contenedor entra **sin contraseña**: autenticación del sistema operativo, porque el usuario `oracle` pertenece al grupo `dba`.
- Desde otra máquina, `SYS` entra con contraseña y rol SYSDBA gracias al **fichero de contraseñas** (`orapwFREE`): `SHOW PARAMETER remote_login_passwordfile` → `EXCLUSIVE`.
- `SYSTEM` y `PDBADMIN` entran desde cualquier máquina que llegue al puerto 1521.

#### 3. Algoritmo de las contraseñas

```sql
SELECT username, password_versions FROM dba_users WHERE account_status = 'OPEN';
```

`12C` indica el verificador basado en SHA-2 (PBKDF2 con SHA-512). Si aparece `10G` u `11G`, son verificadores antiguos. `SQLNET.ALLOWED_LOGON_VERSION_SERVER` en `sqlnet.ora` fija la versión mínima admitida.

#### 4. Riesgos

| Riesgo | Medida |
|:---|:---|
| `SYS`, `SYSTEM` y `PDBADMIN` comparten la contraseña `1234` del `podman run`. | Cambiarlas (5). |
| `SYSTEM` y `PDBADMIN` abiertas y sin uso diario previsto. | Bloquear las que no se usen (6). |
| Se trabaja con `SYS`. | Cuenta personal (7). |
| Perfil `DEFAULT` sin límites de sesiones ni de inactividad. | Perfil propio (8). |
| `SYS` puede entrar como SYSDBA desde cualquier máquina. | Restricción de red (10). |

### Parte 2. Asegurar las cuentas

#### 5. Contraseñas

En el contenedor, la forma prevista es el script de la imagen, que cambia `SYS`, `SYSTEM` y `PDBADMIN` a la vez:

```bash
podman exec cont-oracle /opt/oracle/setPassword.sh 'Ora#Adm1n-2026!Costera'
```

O desde SQL\*Plus, en `CDB$ROOT` (`SYS` y `SYSTEM` son comunes):

```sql
ALTER USER sys    IDENTIFIED BY "Ora#Adm1n-2026!Costera" CONTAINER = ALL;
ALTER USER system IDENTIFIED BY "Ora#Adm1n-2026!Costera" CONTAINER = ALL;
```

El cambio de `SYS` actualiza también el fichero de contraseñas. La variable `ORACLE_PWD` del contenedor no cambia, pero la contraseña de las cuentas sí.

#### 6. Bloquear las que no se usen

```sql
ALTER SESSION SET CONTAINER = freepdb1;
ALTER USER pdbadmin ACCOUNT LOCK;
SELECT username, account_status FROM dba_users WHERE username IN ('PDBADMIN', 'SYSTEM', 'SYS');
```

`SYSTEM` puede bloquearse si la cuenta personal la sustituye; `SYS` no se bloquea: es la cuenta de emergencia y se protege por otras vías (paso 10).

#### 7. Cuenta personal

Usuario **local** de la PDB, con los privilegios del rol `PDB_DBA` o, mejor, solo los necesarios:

```sql
ALTER SESSION SET CONTAINER = freepdb1;
CREATE USER admin_ana IDENTIFIED BY "Ana.Adm1n#2026-ASGBD"
  DEFAULT TABLESPACE users QUOTA 100M ON users;
GRANT CREATE SESSION, CREATE USER, ALTER USER, DROP USER,
      CREATE TABLESPACE, ALTER TABLESPACE,
      SELECT_CATALOG_ROLE TO admin_ana;
```

Si tiene que administrar todas las PDB, se crea como usuario **común** desde `CDB$ROOT` con el prefijo `C##` (`CREATE USER c##admin_ana ... CONTAINER = ALL`). No se le da `SYSDBA` ni el rol `DBA` completo salvo que se justifique.

#### 8. Perfil

```sql
CREATE PROFILE perfil_admin LIMIT
  FAILED_LOGIN_ATTEMPTS 3
  PASSWORD_LOCK_TIME    1/24        -- 1 hora
  PASSWORD_LIFE_TIME    90
  PASSWORD_GRACE_TIME   7
  SESSIONS_PER_USER     3
  IDLE_TIME             10;         -- minutos

ALTER USER admin_ana PROFILE perfil_admin;
ALTER USER system    PROFILE perfil_admin;   -- si no se ha bloqueado
SHOW PARAMETER resource_limit                 -- TRUE: necesario para SESSIONS_PER_USER e IDLE_TIME
```

Para exigir contraseñas robustas, se añade `PASSWORD_VERIFY_FUNCTION ora12c_strong_verify_function` (función que crea el script `?/rdbms/admin/utlpwdmg.sql`).

#### 9. Demostración

| Prueba | Mensaje esperado |
|:---|:---|
| Tres contraseñas erróneas y una correcta | `ORA-01017: invalid credential or not authorized; logon denied` las tres primeras veces y `ORA-28000: The account is locked.` la cuarta. |
| Cuarta sesión simultánea | `ORA-02391: exceeded simultaneous SESSIONS_PER_USER limit` |
| Sesión inactiva más de `IDLE_TIME` | Al ejecutar algo: `ORA-02396: exceeded maximum idle time, please connect again` |

Desbloqueo: `ALTER USER admin_ana ACCOUNT UNLOCK;`.

### Parte 3. Restringir el acceso en red

Oracle no tiene un fichero equivalente a `pg_hba.conf` con reglas por usuario, así que se combinan varias medidas:

1. **`SYS` solo desde el servidor.** Se desactiva el fichero de contraseñas para conexiones remotas: así solo queda la autenticación del sistema operativo, que es local.

   ```sql
   ALTER SYSTEM SET remote_login_passwordfile = NONE SCOPE = SPFILE;
   SHUTDOWN IMMEDIATE
   STARTUP
   ```

   Consecuencia: ya no se puede conectar como SYSDBA desde SQL Developer en la máquina cliente.

2. **Máquinas permitidas.** En `sqlnet.ora` del servidor:

   ```ini
   TCP.VALIDNODE_CHECKING = YES
   TCP.INVITED_NODES = (localhost, 127.0.0.1, 192.168.56.0/24)
   ```

   Después, `lsnrctl reload`. Limita **qué máquinas** llegan al listener, no qué usuarios.

3. **`SYSTEM` solo desde el servidor.** Si no se ha bloqueado, se puede usar un disparador de inicio de sesión que compruebe la IP. Ojo: los errores de un disparador `AFTER LOGON` **no impiden** la entrada a usuarios con el privilegio `ADMINISTER DATABASE TRIGGER`, que `SYSTEM` tiene por el rol `DBA`. Por eso, para `SYSTEM` la medida eficaz es bloquearla (paso 6) y trabajar con `admin_ana`.

Se valora que el alumno o la alumna detecte esta diferencia con PostgreSQL y la explique: es una evidencia de nivel 3–4 en 2.e.

#### 11 y 12. Comprobación y registro

- Desde el cliente, `sqlplus sys/...@<ip-servidor>/FREEPDB1 as sysdba` → `ORA-01017` (sin fichero de contraseñas, no hay forma de autenticar a `SYS` en remoto); `sqlplus admin_ana/...@<ip-servidor>/FREEPDB1` → conecta.
- Una máquina no incluida en `TCP.INVITED_NODES` recibe `ORA-12537: TNS:connection closed` y el *listener log* registra el rechazo de la conexión entrante.
- Los inicios de sesión fallidos se registran en la auditoría unificada (la política `ORA_LOGON_FAILURES` está activada por defecto):

  ```sql
  SELECT event_timestamp, dbusername, userhost, return_code
  FROM   unified_audit_trail
  WHERE  action_name = 'LOGON' AND return_code <> 0
  ORDER  BY event_timestamp DESC;
  ```

  `return_code = 1017` corresponde a credenciales incorrectas y `28000` a cuenta bloqueada.

### Parte 4. Parámetros de conexión

```sql
-- En CDB$ROOT
SHOW PARAMETER processes
SHOW PARAMETER sessions
SELECT count(*) FROM v$session WHERE type = 'USER';

ALTER SYSTEM SET processes = 150 SCOPE = SPFILE;     -- estático: necesita reinicio
ALTER SYSTEM SET max_idle_time = 10 SCOPE = BOTH;    -- minutos; dinámico
```

En `sqlnet.ora` (servidor) y `listener.ora`:

```ini
SQLNET.INBOUND_CONNECT_TIMEOUT = 20      # segundos para completar la autenticación
SQLNET.EXPIRE_TIME = 10                  # minutos: detección de conexiones muertas
INBOUND_CONNECT_TIMEOUT_LISTENER = 10    # en listener.ora
```

- `SQLNET.EXPIRE_TIME` **no** es un tiempo de inactividad: comprueba si el cliente sigue vivo para limpiar conexiones rotas. El tiempo de inactividad se fija con `IDLE_TIME` en el perfil o con el parámetro `MAX_IDLE_TIME` para toda la instancia. Confundirlos es el error más frecuente.
- `processes` limita los procesos del sistema operativo y, de él, Oracle calcula `sessions`.

| Parámetro | Antes | Después | Dónde | ¿Reinicio? |
|:---|:---|:---|:---|:---|
| `processes` | (el de su servidor) | `150` | SPFILE | Sí |
| `max_idle_time` | `0` | `10` | SPFILE y memoria | No |
| `IDLE_TIME`, `SESSIONS_PER_USER`, `FAILED_LOGIN_ATTEMPTS` | `UNLIMITED` / `10` | `10`, `3`, `3` | Perfil `perfil_admin` (diccionario) | No |
| `remote_login_passwordfile` | `EXCLUSIVE` | `NONE` | SPFILE | Sí |
| `SQLNET.INBOUND_CONNECT_TIMEOUT` | `60` | `20` | `sqlnet.ora` | No (conexiones nuevas) |
| `INBOUND_CONNECT_TIMEOUT_LISTENER` | `60` | `10` | `listener.ora` | `lsnrctl reload` |
| `TCP.INVITED_NODES` | — | red del aula | `sqlnet.ora` | `lsnrctl reload` |

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **2.c** | Cambia alguna contraseña, sin política ni pruebas. | Contraseñas cambiadas, cuenta personal y política aplicada. | Demuestra cada medida con el mensaje de error y justifica los privilegios de la cuenta personal. | Detecta los límites del SGBD (en PostgreSQL, `CONNECTION LIMIT` y `VALID UNTIL` no frenan al superusuario por `peer`; en Oracle, el disparador no frena a `SYSTEM`) y los resuelve. |
| **2.e** | Abre el servidor a la red sin restringir. | Reglas que impiden la entrada remota de la cuenta predeterminada y permiten la personal. | Explica el orden de las reglas y lo comprueba desde el cliente con los dos resultados. | Además, cortafuegos, registro de los rechazos y explicación de por qué el orden importa. |
| **2.g** | Cambia un parámetro sin comprobarlo. | Máximo de conexiones, inactividad y autenticación configurados. | Justifica los valores, distingue recarga y reinicio y demuestra el cierre por inactividad. | Distingue conexiones de clientes y procesos internos, y conoce los efectos secundarios (pool, `superuser_reserved_connections`, `SQLNET.EXPIRE_TIME`). |
| **2.h** | Faltan partes o capturas sin explicar. | Auditoría, cambios y tabla final completos. | La tabla de riesgos y la de parámetros son coherentes con lo hecho. | Documento claro, con un plan de vuelta atrás (sesión de administrador abierta) y los errores encontrados. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
