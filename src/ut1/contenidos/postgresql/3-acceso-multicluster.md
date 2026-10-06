---
layout: doc
title: "PostgreSQL: acceso y varios clústeres"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: acceso y varios clústeres

## Acceso a PostgreSQL

Una vez terminada la instalación, debemos comprobar que se puede acceder al clúster.

### Desde un terminal

```txt
🐧 Linux:    sudo -u postgres psql
🖥️ Windows:  psql -U postgres
```

Esta orden nos conecta al clúster principal como usuario DBA principal (postgres).

### Configuración básica después de instalar

Cambiar la contraseña del usuario `postgres` (DBA) 🗝️

```sql
ALTER USER postgres WITH PASSWORD 'nova_contrasenya';
```

### Permitir conexiones remotas (opcional)

Editar postgresql.conf y cambiar: listen_addresses = '\*'. Editar pg_hba.conf y añadir: host all all 0.0.0.0/0 md5. Recargar la configuración:

```sql
SELECT pg_reload_conf();
```

### Crear BBDD y usuario

```sql
CREATE USER alumne WITH PASSWORD '1234';
CREATE DATABASE alumne OWNER alumne;
```

El usuario alumne es el propietario de la base de datos alumne. En PostgreSQL, el propietario tiene permisos totales sobre la base de datos. Un owner de BD puede: conectarse a la base de datos; crear esquemas dentro de la base de datos; crear tablas, vistas, funciones, etc.; dar permisos sobre los objetos que crea (tables, sequences, schemas); borrar los objetos que ha creado (DROP TABLE, DROP SCHEMA, etc.); y modificar la propiedad de objetos con ALTER TABLE/SCHEMA … OWNER TO … <br> Lo que no puede: no tiene permisos globales sobre otras bases de datos y no puede modificar la configuración del servidor (para eso existen roles como SUPERUSER).

### Arrancar y parar ~~BBDD~~ el clúster

```bash
sudo systemctl start postgresql
sudo systemctl stop postgresql
sudo systemctl restart postgresql
```

### Conexión inicial

Por defecto (y si no se indica otra cosa), PostgreSQL se conecta a una base de datos con el mismo nombre que el usuario.

Cuando ejecutas `psql`, PostgreSQL intenta: usuario = usuario del sistema; base de datos = mismo nombre que el usuario

Si la BD no existe, se obtendrá un error: `FATAL: database "nom_usuari" does not exist`

Después de instalar PostgreSQL, siempre existen: `postgres template0 template1`

### Conexión con usuario del SO

En Windows hay que configurar el PATH o hacer un «cd» al directorio de los binarios.

```bash
psql -d nom_ bbdd
```

### Conexión con socket

```bash
psql -U nom_usuari -d nom_ bbdd -h IP.IP.IP.IP
psql -U nom_usuari -d nom_ bbdd -h url
psql -U nom_usuari -d nom_ bbdd -h localhost
psql -U nom_usuari -d nom_ bbdd   -- igual que el anterior
```

### Explorar el clúster

Una vez conectados… cómo ver las otras BBDD en PostgreSQL

```sql
\list
\l+
SELECT datname FROM pg_database;
```

```sql
Cómo saber a qué base de datos estamos conectados…
SELECT current_database();
o
\conninfo    --También muestra el usuario y otra información
o
Normalmente el prompt muestra la base de datos:     testdb=#
```

Y para cambiar (conectar) a otra BBDD (dentro del clúster)

```sql
\c nom_bbdd
\connect nom_bbdd
```

### Otras maneras de acceder a la instancia / clúster

- Utilizando pgAdmin
- Utilizando Visual Studio Code + extensión PostgreSQL o DBCode
- Utilizando DBeaver (multi-SGBD, software libre)
- Utilizando TOAD (multi-SGBD, propietario)

### PgAdmin

![Registro de un servidor nuevo en pgAdmin #center](/img/contenidos/ut1/pgadmin1.png)

Para acceder a un clúster de PostgreSQL se necesita:

- IP o URL
- puerto
- usuario / contraseña

```txt

```

🎓 Con todos estos conocimientos, ya estás preparado/a para empezar la unidad dos: configuración de un SGBD

## (Ampliación ++)

## Instalar más de un clúster en una misma máquina

### Directorios de datos separados

Cada clúster necesita su PGDATA, es decir, el directorio donde se guardan los datos, los logs y las configuraciones.

#### 🐧 Instalación en GNU/Linux

```bash
# Clúster 1
mkdir -p /var/lib/postgresql/cluster1
# Clúster 2
mkdir -p /var/lib/postgresql/cluster2
```

### Inicializar la(s) base(s) de datos

```bash
# Clúster 1
initdb -D /var/lib/postgresql/cluster1

# Clúster 2
initdb -D /var/lib/postgresql/cluster2
```

### Puertos separados

PostgreSQL usa por defecto el puerto 5432. El segundo clúster debe tener otro puerto, por ejemplo 5433.

```bash
# En el postgresql.conf del segundo clúster
port = 5433
```

### Configuración independiente

Cada clúster tiene sus ficheros:

- postgresql.conf → configuración principal
- pg_hba.conf → autenticación y permisos
- pg_ident.conf → mapeo de usuarios

### Ejecutar clústeres separados

Opción A: manual, con diferentes puertos

Rápido y simple. Útil para pruebas, pero no hay un control fácil (stop, restart), no gestiona bien los logs y no se recomienda en producción

```txt
postgres -D /var/lib/postgresql/cluster1 -p 5432 &
postgres -D /var/lib/postgresql/cluster2 -p 5433 &
```

Opción B: como servicios separados (Linux)

Crea servicios systemd independientes que apunten a cada PGDATA y puerto.

```bash
# Ejemplos
pg_ctl -D /var/lib/postgresql/cluster1 -l logfile1 start
pg_ctl -D /var/lib/postgresql/cluster2 -l logfile2 start
```

Integrar con systemctl

```sql
[Unit]
Description=PostgreSQL Cluster 1

[Service]
Type=forking
User=postgres
ExecStart=/usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/cluster1 -l /var/log/postgresql/cluster1.log start
ExecStop=/usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/cluster1 stop

[Install]
WantedBy=multi-user.target
```

El nombre del fichero lo eliges tú, pero debe acabar en `.service`

Hay que ponerlo en `/etc/systemd/system/`

Y después de modificar algún fichero: `systemctl daemon-reload`

```bash
-- Y después se podrá hacer
systemctl start postgresql-cluster1
systemctl stop postgresql-cluster1
systemctl status postgresql-cluster1
```

```bash
-- Activar el servicio
systemctl enable postgresql-cluster1
```

### Conexión a cada clúster

```bash
psql -h localhost -p 5432 -U usuari -d db1   # clúster 1
psql -h localhost -p 5433 -U usuari -d db2   # clúster 2
```

---

### 🖥️ En Windows

#### Crear un directorio de datos nuevo, por ejemplo

```txt
"C:\Program Files\PostgreSQL\15\bin\initdb.exe" -D "C:\pgsql\data2 --encoding=UTF8 --locale=es_ES.UTF-8"
o
"C:\Program Files\PostgreSQL\15\bin\initdb.exe" -D "C:\pgsql\data2"
```

#### Cambiar el puerto de escucha

```txt
-- C:\pgsql\data2\postgresql.conf
port = 5433
```

#### Dar más seguridad

```txt
-- C:\pgsql\data2\pg_hba.conf
local   all   all   scram-sha-256
host    all   all   127.0.0.1/32   scram-sha-256
```

#### Iniciar el servidor manualmente

```txt
-- Iniciar el servidor postgres
pg_ctl.exe -D "C:\pgsql\data2" start
```

#### Crear un servicio nuevo para este clúster

Si queremos que el nuevo clúster arranque al iniciar la máquina

```bash
pg_ctl register -N "postgresql-cluster2" -D "C:\pgsql\data2"
```

#### Arrancar el servicio

```bash
net start postgresql-cluster2
```

#### Probar la conexión

```bash
psql -p 5433 -U postgres
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
