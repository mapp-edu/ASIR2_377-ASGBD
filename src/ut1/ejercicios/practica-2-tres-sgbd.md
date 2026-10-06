---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 2: desplegar Oracle, PostgreSQL y MariaDB"
pageClass: ejercicios-page
---

# 📋 Práctica 2: desplegar Oracle, PostgreSQL y MariaDB

## Enunciado

En la máquina virtual Linux Mint de la práctica anterior, despliega tres sistemas gestores de bases de datos —**Oracle Database Free** (en contenedor), **PostgreSQL** y **MariaDB**—, crea en cada uno una base de datos y un usuario de trabajo, y configúralos para que acepten conexiones desde otra máquina.

## Objetivos

- Instalar varios SGBD y comparar su proceso de instalación.
- Verificar el funcionamiento de cada SGBD.
- Interpretar los mensajes de error y resolver las incidencias de la instalación.

## Requisitos

- MV con Debian o Linux Mint: virtualización anidada, 4 GB de RAM, 2 CPU y 250 GB de disco (calcula unos 25 GB + 5 GB por contenedor).
- Conexión a internet para descargar imágenes y paquetes.

## Parte 1. Oracle Database Free sobre podman

Revisa primero la [documentación oficial de Oracle](https://www.oracle.com/es/database/free/get-started/): ¿qué plataformas hay disponibles?, ¿qué formas de conectar ofrece?

```bash
# Adquirir privilegios
sudo su
apt update && apt install -y podman-docker

# Descargar la imagen (tarda un poco)
podman pull container-registry.oracle.com/database/free:latest

# Comprobar la imagen
podman images

# Crear el contenedor de Oracle Database (unos 4 GB)
podman run -d --name cont-oracle -p 1521:1521 -e ORACLE_PWD=1234 --restart always container-registry.oracle.com/database/free:latest
```

- `--restart always`: cuando se apague la máquina principal, al volver a arrancar los contenedores arrancan automáticamente.
- `-e ORACLE_PWD=1234`: contraseña inicial de los usuarios `sys` y `system`. Como se establece mediante una variable de entorno, **después no se podrá cambiar**.

```bash
# Ver los contenedores en funcionamiento
podman ps
podman ps -a
podman ps -a -q
```

Espera hasta que el contenedor entre en estado **healthy**.

```bash
# «Entrar» en el contenedor
podman exec -it cont-oracle /bin/bash

# Conectar con sqlplus
podman exec -it cont-oracle sqlplus sys/1234@FREE as sysdba
```

Muestra la versión instalada y el nombre de la BBDD, de la CDB y de la PDB. Después crea un usuario en la PDB:

```sql
-- podman exec -it cont-oracle sqlplus sys/1234@FREEPDB1 as sysdba
create user orauser identified by 1234;
grant connect,resource to orauser;
alter user orauser quota unlimited on users;
exit
```

Comprueba el nuevo usuario y **muestra los resultados**:

```bash
podman exec -it cont-oracle sqlplus orauser/1234@FREEPDB1
```

```sql
show user
show con_name
select sysdate from dual;
select banner from v$version;
exit
```

## Parte 2. PostgreSQL

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib php-pgsql
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -i -u postgres
psql
```

```sql
-- Crear la base de datos
CREATE DATABASE dbpg;
-- Crear el usuario con contraseña
CREATE USER pguser WITH PASSWORD '1234';
-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE dbpg TO pguser;
\q
```

Sal del usuario `postgres` con `exit` y prueba la conexión (**muestra los resultados**):

```bash
psql -h localhost -U pguser -d dbpg -W
```

## Parte 3. MariaDB

```bash
sudo apt update && sudo apt install -y mariadb-server mariadb-client
sudo systemctl enable mariadb
sudo mariadb
```

No hace falta asegurar la instalación para esta práctica.

```sql
CREATE DATABASE dbm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'muser'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON dbm.* TO 'muser'@'%';
FLUSH PRIVILEGES;
EXIT;
```

Prueba la conexión con el usuario creado y **muestra los resultados**.

## Parte 4. Resumen y comprobación de puertos

Completa la tabla con la IP de tu servidor:

| SGBD | IP | Nombre BD | Puerto | Usuario | Contraseña |
|:---|:---|:---|:---:|:---|:---|
| Oracle | | freepdb1 | 1521 | orauser | 1234 |
| PostgreSQL | | dbpg | 5432 | pguser | 1234 |
| MariaDB | | dbm | 3306 | muser | 1234 |

Comprueba si se puede alcanzar cada puerto (1521, 5432, 3306) y **muestra los resultados**:

```bash
# Desde la propia máquina
nc -zv localhost <puerto>
# Desde la propia máquina, pero usando su IP
nc -zv <ip-de-mi-maquina> <puerto>
# Desde la máquina cliente, con la IP de la máquina servidor
nc -zv <ip-del-servidor> <puerto>
```

## Parte 5. Permitir conexiones desde otra máquina

Algunos SGBD se instalan con una configuración que no deja conectar si no se está en la propia máquina (`localhost`). Si se necesita conectar desde otra máquina, hay que cambiar la configuración.

### PostgreSQL

Edita `postgresql.conf` (normalmente en `/etc/postgresql/XX/main/postgresql.conf`, donde `XX` es la versión). Busca la línea:

```ini
#listen_addresses = 'localhost'
```

y cámbiala por:

```ini
listen_addresses = '*'
```

Esto permite que PostgreSQL escuche conexiones externas.

Edita también `pg_hba.conf` (en el mismo directorio), que controla quién puede conectarse y cómo. Añade al final una línea como esta para permitir las conexiones desde la subred `192.168.1.0/24` (ajusta el rango a tu red):

```txt
host    all             all             192.168.1.0/24          md5
```

o esta otra para permitir a todos:

```txt
host    all             all             0.0.0.0/0               md5
```

Después de hacer los cambios:

```bash
sudo systemctl restart postgresql
# Si el cortafuegos está activado, permite el puerto 5432
sudo ufw allow 5432/tcp
```

Prueba desde otra máquina:

```bash
psql -h 192.168.1.100 -U nom_usuari -d nom_BBDD
```

### MariaDB

Edita el fichero de configuración. Su ubicación típica depende de la distribución:

- `/etc/mysql/my.cnf`, o
- `/etc/mysql/mariadb.conf.d/50-server.cnf`

Busca la sección `[mysqld]` y cambia la línea `bind-address = 127.0.0.1` por:

```ini
bind-address = 0.0.0.0
```

Esto permite que MariaDB escuche conexiones desde cualquier IP. Además, el usuario debe tener permiso para conectar remotamente (ya lo hemos hecho antes al crearlo con `'%'`). Para limitarlo a una subred concreta:

```sql
-- sudo mariadb -u root -p
GRANT ALL PRIVILEGES ON nom_base_de_dades.* TO 'nom_usuari'@'192.168.1.%' IDENTIFIED BY 'contrasenya';
```

Reinicia MariaDB y abre el cortafuegos:

```bash
sudo systemctl restart mariadb
sudo ufw allow 3306/tcp
```

Prueba desde otra máquina:

```bash
mysql -h 192.168.1.100 -u nom_usuari -p nom_BBDD
```

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA1** (*Implanta sistemas gestores de bases de datos analizando sus características y ajustándose a los requerimientos del sistema.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **1.b** | Se han analizado las características de los principales sistemas gestores de bases de datos. | Compara las características y el proceso de instalación de los tres SGBD desplegados (contenedor frente a paquetes, puertos, usuarios, herramientas). |
| **1.d** | Se ha identificado el software necesario para llevar a cabo la instalación. | Identifica el software necesario en cada caso: imagen de contenedor, paquetes del sistema y dependencias. |
| **1.f** | Se han instalado sistemas gestores de bases de datos. | Los tres SGBD quedan instalados, con su base de datos y su usuario de trabajo. |
| **1.h** | Se ha interpretado la información suministrada por los mensajes de error y ficheros de registro. | Interpreta los mensajes de error y el estado de los servicios y contenedores (por ejemplo, el estado *healthy*). |
| **1.i** | Se han resuelto las incidencias de la instalación. | Resuelve las incidencias de instalación y de conexión remota (escucha en red, `pg_hba.conf`, `bind-address`, cortafuegos). |
| **1.j** | Se ha verificado el funcionamiento del sistema gestor de bases de datos. | Verifica el funcionamiento conectando con cada usuario y comprobando los puertos con `nc`. |
| **1.g** | Se ha documentado el proceso de instalación. | Documenta el proceso explicando los puntos más importantes y mostrando los resultados pedidos. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD1/00 instalar 3 sgbds.pdf · PLALOE_EXTR/04 instalar 3 sgbds.pdf`.</small>
