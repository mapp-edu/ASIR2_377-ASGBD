---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 2: desplegar Oracle, PostgreSQL y MariaDB"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 2: desplegar Oracle, PostgreSQL y MariaDB

::: tip Solución de referencia
Resolución de referencia de la [Práctica 2](../practica-2-tres-sgbd), con los resultados esperados, los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

- **PostgreSQL y MariaDB:** las órdenes y las salidas se han obtenido en Ubuntu 24.04 (base de Linux Mint 22) con PostgreSQL 16 y MariaDB 10.11, las versiones de sus repositorios. La máquina cliente se ha simulado con una segunda dirección, `10.0.0.5`, en la red `10.0.0.0/24`.
- **Oracle:** escrito a partir de la documentación de Oracle y de la imagen oficial; **no se ha podido ejecutar**. Conviene probarlo antes de usarlo como modelo.

## Parte 1. Oracle Database Free sobre podman

### Documentación oficial

Respuestas esperadas a las preguntas previas (página *Get Started* de Oracle Database Free):

- **Plataformas:** contenedor (imagen `container-registry.oracle.com/database/free`), RPM para Oracle Linux y RHEL 8 y 9, instalador para Windows, máquina virtual de VirtualBox y Oracle Cloud.
- **Formas de conectar:** SQL\*Plus, SQLcl, SQL Developer (y su extensión para VS Code) y los *drivers* para aplicaciones (JDBC, Python `oracledb`, Node.js, .NET, etc.).

### Descarga y creación del contenedor

```bash
podman pull container-registry.oracle.com/database/free:latest
podman images
podman run -d --name cont-oracle -p 1521:1521 -e ORACLE_PWD=1234 --restart always \
  container-registry.oracle.com/database/free:latest
podman ps
```

```txt
CONTAINER ID  IMAGE                                              ...  STATUS                    PORTS                   NAMES
3f2a...       container-registry.oracle.com/database/free:latest ...  Up 6 minutes (healthy)    0.0.0.0:1521->1521/tcp  cont-oracle
```

El estado pasa por `(starting)` y, al cabo de unos minutos, `(healthy)`. Mientras tanto se puede seguir la creación de la base de datos:

```bash
podman logs -f cont-oracle      # termina con «DATABASE IS READY TO USE!»
```

Interpretación esperada para **1.h**: `healthy` significa que el *healthcheck* de la imagen (una conexión de prueba a la base de datos) responde; `Up` sin `healthy` solo indica que el proceso del contenedor está en marcha. Si el contenedor queda `unhealthy` o se reinicia en bucle, `podman logs cont-oracle` muestra la causa (falta de memoria o de disco, casi siempre).

::: info Contraseña de `ORACLE_PWD`
La variable del contenedor no cambia, pero la contraseña de `SYS`, `SYSTEM` y `PDBADMIN` sí se puede cambiar con el script de la imagen (`podman exec cont-oracle /opt/oracle/setPassword.sh <nueva>`) o con `ALTER USER`. Se hará en la práctica 3 de la UT2.
:::

### Versión y nombres

```bash
podman exec -it cont-oracle sqlplus sys/1234@FREE as sysdba
```

```sql
SELECT banner_full FROM v$version;
SELECT name, cdb FROM v$database;     -- FREE · YES
SHOW CON_NAME                          -- CDB$ROOT
SHOW PDBS
```

```txt
    CON_ID CON_NAME                       OPEN MODE  RESTRICTED
---------- ------------------------------ ---------- ----------
         2 PDB$SEED                       READ ONLY  NO
         3 FREEPDB1                       READ WRITE NO
```

| Elemento | Valor |
|:---|:---|
| Versión | La de `banner_full`: Oracle Database 23ai o 26ai Free, según la fecha de la imagen `latest` |
| Base de datos (CDB) | `FREE` |
| Contenedor raíz | `CDB$ROOT` |
| PDB | `FREEPDB1` (`PDB$SEED` es la plantilla) |

### Usuario en la PDB

```sql
-- podman exec -it cont-oracle sqlplus sys/1234@FREEPDB1 as sysdba
CREATE USER orauser IDENTIFIED BY "1234";
GRANT CONNECT, RESOURCE TO orauser;
ALTER USER orauser QUOTA UNLIMITED ON users;
```

::: tip Por qué las comillas
Oracle aplica a las contraseñas sin comillas las reglas de los identificadores, que no pueden empezar por un número; por eso el enunciado escribe `"1234"`. Si alguien la escribe sin comillas y obtiene `ORA-00988: missing or invalid password(s)`, documentar el error y su solución es una buena evidencia de 1.h y 1.i.
:::

Comprobación con el nuevo usuario:

```bash
podman exec -it cont-oracle sqlplus orauser/1234@FREEPDB1
```

```sql
SQL> show user
USER is "ORAUSER"
SQL> show con_name
CON_NAME
------------------------------
FREEPDB1
SQL> select sysdate from dual;
SQL> select banner from v$version;
```

`orauser` puede consultar `v$version` porque es una vista con permiso público. Errores frecuentes: crear el usuario en la CDB (conectado a `FREE`: da `ORA-65096: common user or role name must start with prefix C##`) y olvidar la cuota (al crear la primera tabla con datos, `ORA-01950: no privileges on tablespace 'USERS'`).

## Parte 2. PostgreSQL

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib php-pgsql
sudo systemctl enable --now postgresql
systemctl status postgresql          # active (exited): ver nota
pg_lsclusters
```

```txt
Ver Cluster Port Status Owner    Data directory              Log file
16  main    5432 online postgres /var/lib/postgresql/16/main /var/log/postgresql/postgresql-16-main.log
```

En Debian, Ubuntu y Mint, el servicio `postgresql` es un «paraguas» que aparece como `active (exited)`; el servidor real es `postgresql@16-main`. Si alguien lo interpreta como un error y lo investiga, es una evidencia de 1.h.

```sql
-- sudo -i -u postgres ; psql
CREATE USER pguser WITH PASSWORD '1234';
CREATE DATABASE dbpg OWNER pguser;
```

Prueba de conexión:

```bash
psql -h localhost -U pguser -d dbpg -W
```

```sql
dbpg=> \conninfo
You are connected to database "dbpg" as user "pguser" on host "localhost" (address "127.0.0.1") at port "5432".
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
dbpg=> SELECT current_user, current_database(), version();
 current_user | current_database |                         version
--------------+------------------+-----------------------------------------------------------
 pguser       | dbpg             | PostgreSQL 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1) on x86_64...
```

::: tip Por qué `OWNER` y no `GRANT ALL`
Con PostgreSQL 15 o posterior, `GRANT ALL PRIVILEGES ON DATABASE` **no** permite crear tablas: da permiso para conectarse, crear esquemas y crear tablas temporales, pero el esquema `public` pertenece a `pg_database_owner` y los demás usuarios no pueden crear objetos en él. Comprobado en PostgreSQL 16 con la versión anterior del enunciado:

```txt
dbpg=> CREATE TABLE prueba (id int);
ERROR:  permission denied for schema public
```

Con `OWNER pguser`, la misma orden funciona. Si un alumno o alumna usa todavía `GRANT ALL` (por ejemplo, siguiendo un tutorial), detecta el error y lo resuelve con `ALTER DATABASE dbpg OWNER TO pguser;`, es una evidencia de nivel 4 en 1.i. Explicar la diferencia aunque no le haya fallado también se valora (nivel 3–4 en 1.b).
:::

## Parte 3. MariaDB

```bash
sudo apt update && sudo apt install -y mariadb-server mariadb-client
sudo systemctl enable mariadb
sudo mariadb
```

```sql
CREATE DATABASE dbm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'muser'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON dbm.* TO 'muser'@'%';
FLUSH PRIVILEGES;
```

`sudo mariadb` entra como `root` sin contraseña porque `root@localhost` usa el método `unix_socket` (como `peer` en PostgreSQL). `FLUSH PRIVILEGES` no es necesario después de `CREATE USER` y `GRANT`, pero no hace daño.

Prueba de conexión:

```bash
mariadb -u muser -p dbm
```

```sql
SELECT CURRENT_USER(), USER(), DATABASE(), VERSION();
SHOW GRANTS;
```

```txt
+----------------+-----------------+------------+-----------------------------------+
| CURRENT_USER() | USER()          | DATABASE() | VERSION()                         |
+----------------+-----------------+------------+-----------------------------------+
| muser@%        | muser@localhost | dbm        | 10.11.14-MariaDB-0ubuntu0.24.04.1 |
+----------------+-----------------+------------+-----------------------------------+
+------------------------------------------------------------------------------------------------------+
| Grants for muser@%                                                                                   |
+------------------------------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `muser`@`%` IDENTIFIED BY PASSWORD '*A4B6157319038724E3560894F7F932C8886EBFCF' |
| GRANT ALL PRIVILEGES ON `dbm`.* TO `muser`@`%`                                                       |
+------------------------------------------------------------------------------------------------------+
```

`USER()` es desde dónde se ha conectado; `CURRENT_USER()` es la cuenta con la que MariaDB lo ha autenticado (`muser@%`). Explicar la diferencia es una evidencia de nivel 3 en 1.j.

## Parte 4. Resumen y comprobación de puertos

| SGBD | IP | Nombre BD | Puerto | Usuario | Contraseña |
|:---|:---|:---|:---:|:---|:---|
| Oracle | IP del servidor (`ip -4 a`) | freepdb1 | 1521 | orauser | 1234 |
| PostgreSQL | IP del servidor | dbpg | 5432 | pguser | 1234 |
| MariaDB | IP del servidor | dbm | 3306 | muser | 1234 |

Antes de la parte 5, el resultado esperado es:

| Prueba | 1521 (Oracle) | 5432 (PostgreSQL) | 3306 (MariaDB) |
|:---|:---|:---|:---|
| `nc -zv localhost <puerto>` | succeeded | succeeded | succeeded |
| `nc -zv <ip-servidor> <puerto>` (desde el servidor) | succeeded | **refused** | **refused** |
| `nc -zv <ip-servidor> <puerto>` (desde el cliente) | succeeded | **refused** | **refused** |

```txt
Connection to localhost (127.0.0.1) 5432 port [tcp/postgresql] succeeded!
nc: connect to 10.0.0.5 port 3306 (tcp) failed: Connection refused
```

La interpretación es lo que más se valora:

- **Oracle** responde por la IP desde el principio: podman publica el puerto en todas las interfaces (`0.0.0.0:1521`).
- **PostgreSQL y MariaDB** solo escuchan en `127.0.0.1` tras instalarlos. Se ve con `ss -ltn`:

  ```txt
  LISTEN 0  200  127.0.0.1:5432  0.0.0.0:*
  LISTEN 0  80   127.0.0.1:3306  0.0.0.0:*
  ```

- `Connection refused` significa que la máquina responde pero nadie escucha en ese puerto. Si en cambio la orden se queda esperando hasta agotar el tiempo, el paquete se pierde por el camino: cortafuegos o IP equivocada.
- Si desde el cliente falla también el 1521, el problema es de red (adaptadores en redes distintas, NAT de VirtualBox sin reenvío de puertos): para la conexión entre máquinas, las dos MV deben estar en la misma **red NAT** o en **red interna / solo anfitrión**.

## Parte 5. Permitir conexiones desde otra máquina

### PostgreSQL

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf     # listen_addresses = '*'
echo "host    all    all    10.0.0.0/24    md5" | sudo tee -a /etc/postgresql/16/main/pg_hba.conf
sudo systemctl restart postgresql
sudo ufw allow 5432/tcp
ss -ltn | grep 5432          # LISTEN 0.0.0.0:5432
```

Comprobación de las reglas:

```txt
 line_number | type  |   database    | user_name  |  address  |  auth_method  | error
-------------+-------+---------------+------------+-----------+---------------+-------
         118 | local | {all}         | {postgres} |           | peer          |
         123 | local | {all}         | {all}      |           | peer          |
         125 | host  | {all}         | {all}      | 127.0.0.1 | scram-sha-256 |
         ...
         133 | host  | {all}         | {all}      | 10.0.0.0  | md5           |
```

Desde el cliente, **sin** la regla de `pg_hba.conf`:

```txt
psql: error: connection to server at "10.0.0.5", port 5432 failed: FATAL:  no pg_hba.conf entry for host "10.0.0.5", user "pguser", database "dbpg", SSL encryption
```

Y con la regla:

```txt
 current_user | inet_client_addr
--------------+------------------
 pguser       | 10.0.0.5
```

- La secuencia de errores ayuda a localizar el problema: `Connection refused` → `listen_addresses` o servicio parado; `no pg_hba.conf entry` → la conexión llega pero ninguna regla coincide; `password authentication failed` → regla correcta y contraseña o usuario equivocados.
- El método `md5` funciona aunque la contraseña esté guardada con SCRAM: PostgreSQL usa SCRAM en ese caso. Lo recomendable es escribir directamente `scram-sha-256`. Proponerlo es una evidencia de nivel 4.
- La regla `0.0.0.0/0` funciona, pero abre el servidor a cualquier origen: se espera que el alumno o la alumna use su red concreta o que, al menos, justifique por qué no lo hace.

### MariaDB

```bash
sudo sed -i 's/^bind-address.*/bind-address            = 0.0.0.0/' /etc/mysql/mariadb.conf.d/50-server.cnf
sudo systemctl restart mariadb
sudo ufw allow 3306/tcp
ss -ltn | grep 3306          # LISTEN 0.0.0.0:3306
```

Desde el cliente:

```bash
mysql -h <ip-servidor> -u muser -p dbm       # mysql es un enlace a mariadb
```

```txt
+----------------+----------------+
| current_user() | user()         |
+----------------+----------------+
| muser@%        | muser@10.0.0.5 |
+----------------+----------------+
```

Antes de cambiar `bind-address`, el error es `ERROR 2002 (HY000): Can't connect to server on '10.0.0.5' (115)`, donde 115 es *connection refused*.

::: tip Limitar el acceso a una subred
El enunciado crea la cuenta de la subred y borra la general. Es necesario porque en MariaDB una cuenta es la pareja `usuario@host`: si solo se ejecuta `GRANT ALL PRIVILEGES ON dbm.* TO 'muser'@'10.0.0.%' IDENTIFIED BY '1234';` (como proponen muchos tutoriales), se **crea una segunda cuenta**, `muser@10.0.0.%`, y la existente no cambia. Comprobado:

```txt
+-------+----------+
| User  | Host     |
+-------+----------+
| muser | %        |
| muser | 10.0.0.% |
+-------+----------+
```

MariaDB elige la cuenta más específica (`CURRENT_USER()` pasa a ser `muser@10.0.0.%`), pero `muser@%` sigue permitiendo entrar desde cualquier sitio. Por eso hace falta `DROP USER 'muser'@'%';`. Comprobarlo con `SELECT user, host FROM mysql.user` y con una conexión desde fuera de la subred es una evidencia de nivel 4 en 1.i.
:::

### Oracle

No necesita cambios: el listener del contenedor escucha en todas las interfaces y podman publica el puerto 1521. Desde el cliente basta con que el puerto esté abierto en el cortafuegos del servidor (`sudo ufw allow 1521/tcp` si `ufw` está activo).

## Comparación de los tres despliegues

Evidencia de **1.b**. Respuesta de referencia:

| Aspecto | Oracle Database Free | PostgreSQL | MariaDB |
|:---|:---|:---|:---|
| Forma de instalación | Imagen de contenedor (podman) | Paquetes de la distribución (`apt`) | Paquetes de la distribución (`apt`) |
| Tiempo y espacio | Descarga de varios GB y varios minutos hasta `healthy` | Unos segundos, decenas de MB | Unos segundos, decenas de MB |
| Licencia | Gratuita con límites (2 núcleos, 2 GB de RAM, 12 GB de datos) | Libre (licencia PostgreSQL) | Libre (GPLv2) |
| Administrador inicial | `SYS` / `SYSTEM` con la contraseña de `ORACLE_PWD` | `postgres`, sin contraseña, por `peer` | `root`, sin contraseña, por `unix_socket` |
| Unidad de trabajo | Usuario/esquema dentro de una PDB | Base de datos + rol | Base de datos + usuario@host |
| Puerto | 1521 | 5432 | 3306 |
| Acceso remoto tras instalar | Sí (puerto publicado) | No (`listen_addresses`, `pg_hba.conf`) | No (`bind-address`) |
| Arranque | `--restart always` del contenedor | Servicio systemd | Servicio systemd |
| Cliente de terminal | `sqlplus` dentro del contenedor | `psql` | `mariadb` / `mysql` |

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **1.b** | No compara o solo describe uno. | Compara los tres en instalación, puertos y usuarios. | La comparación incluye licencia, administrador inicial y acceso remoto, con su explicación. | Relaciona las diferencias con decisiones de diseño (contenedor frente a paquetes, seguridad por defecto). |
| **1.d** | Falta software o no identifica de dónde sale. | Identifica imagen, paquetes y dependencias de cada SGBD. | Explica la función de cada paquete (`postgresql-contrib`, `mariadb-client`, `podman-docker`). | Detecta dependencias no evidentes (espacio para la imagen, `php-pgsql` solo para PHP). |
| **1.f** | Algún SGBD sin instalar o sin usuario. | Los tres instalados, con base de datos y usuario. | Comprueba el estado de cada servicio o contenedor. | Además, explica la creación del usuario (comillas en Oracle, propietario en PostgreSQL). |
| **1.h** | No muestra errores o no los interpreta. | Interpreta `healthy` y los mensajes de los pasos fallidos. | Usa `podman logs`, `systemctl status`, `pg_hba_file_rules` o `ss` para diagnosticar. | Explica qué significa cada tipo de error de conexión (*refused*, *timeout*, `pg_hba`, autenticación). |
| **1.i** | Incidencias sin resolver. | Resuelve el acceso remoto de PostgreSQL y MariaDB. | Explica la causa de cada incidencia y cómo la ha comprobado. | Explica o resuelve problemas de fondo (permisos en `public`, cuentas `usuario@host` en MariaDB, rango de red) y comprueba que la restricción por subred funciona. |
| **1.j** | No verifica todas las conexiones. | Conexión con cada usuario y `nc` a los tres puertos. | Verifica desde el servidor y desde otra máquina, e interpreta los resultados de `nc`. | Presenta la tabla resumen completa con la IP y los resultados antes y después de la parte 5. |
| **1.g** | Capturas sin explicación. | Todos los resultados pedidos. | Explicaciones de los puntos importantes. | Documento claro y ordenado, con incidencias y soluciones. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD, sobre la práctica adaptada de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
