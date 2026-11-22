---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 3: instalar los clientes de los tres SGBD"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 3: instalar los clientes de los tres SGBD

::: tip Solución de referencia
Resolución de referencia de la [Práctica 3](../practica-3-clientes), con las comprobaciones que debe contener la entrega, los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

Los clientes de terminal de PostgreSQL y MariaDB y los nombres de los paquetes se han comprobado en Ubuntu 24.04 (base de Linux Mint 22). Los clientes de Oracle, los gráficos y Adminer **no se han podido probar** (no hay acceso a las descargas de Oracle desde el entorno de pruebas): están escritos a partir de su documentación.

## Escenario

| Máquina | Papel | Qué tiene |
|:---|:---|:---|
| Servidor (práctica 2) | Capa de datos | Oracle (contenedor), PostgreSQL, MariaDB y, en esta práctica, **phpMyAdmin** |
| Cliente (nueva MV Linux Mint) | Capa de presentación | SQL Developer, VS Code, SQL\*Plus, SQLcl, psql, pgAdmin, cliente de MariaDB, MySQL Workbench, DBeaver, Adminer |

Las dos máquinas deben estar en la misma red (red NAT o red interna de VirtualBox). La primera comprobación de la entrega debería ser que el cliente llega a los tres puertos:

```bash
nc -zv <ip-servidor> 1521
nc -zv <ip-servidor> 5432
nc -zv <ip-servidor> 3306
```

Si falla el 5432 o el 3306, falta la parte 5 de la práctica 2 (`listen_addresses`, `pg_hba.conf`, `bind-address`).

### Función del software cliente (1.a)

Respuesta esperada: en un SGBD de dos capas, el **servidor** guarda los datos, gestiona la concurrencia, la seguridad y la recuperación, y atiende peticiones por un puerto; el **cliente** no guarda datos: envía sentencias SQL por la red con el protocolo del SGBD (Oracle Net, protocolo de PostgreSQL, protocolo de MySQL) y muestra los resultados. Por eso el cliente necesita una **biblioteca de conexión** (Instant Client, `libpq`, `libmariadb`, o un *driver* JDBC en los clientes Java).

| Cliente | SGBD | Tipo | Cómo conecta | Dónde se instala |
|:---|:---|:---|:---|:---|
| SQL Developer | Oracle (y otros con JDBC) | Gráfico | JDBC *thin* incluido | Cliente |
| VS Code + SQL Developer | Oracle | Gráfico | JDBC incluido en la extensión | Cliente |
| SQL\*Plus | Oracle | Terminal | Instant Client (OCI) | Cliente |
| SQLcl | Oracle | Terminal | JDBC (Java) | Cliente |
| psql | PostgreSQL | Terminal | `libpq` | Cliente |
| pgAdmin 4 | PostgreSQL | Gráfico (aplicación web local) | `libpq` / `psycopg` | Cliente |
| mariadb | MariaDB/MySQL | Terminal | `libmariadb` | Cliente |
| phpMyAdmin | MariaDB/MySQL | Web | PHP `mysqli` | **Servidor** |
| MySQL Workbench | MySQL (y MariaDB con avisos) | Gráfico | Conector de MySQL | Cliente |
| DBeaver | Universal | Gráfico | Descarga el *driver* JDBC de cada SGBD | Cliente |
| Adminer | Universal (MySQL, PostgreSQL, SQLite…) | Web (un único fichero PHP) | Extensiones de PHP | Cliente o servidor |

## Clientes para Oracle

### SQL Developer

```bash
sudo apt install -y openjdk-17-jdk
java --version            # openjdk 17.0.x
sudo unzip sqldeveloper-*-no-jre.zip -d /opt/
/opt/sqldeveloper/sqldeveloper.sh
```

- Se descarga la versión **sin JRE** (*Other Platforms*), que usa el JDK del sistema. Las versiones recientes piden JDK 17 o 21; si al arrancar pide la ruta del JDK, es `/usr/lib/jvm/java-17-openjdk-amd64`.
- Error frecuente: `Permission denied` al ejecutar `sqldeveloper.sh` (falta el permiso de ejecución tras descomprimir con `sudo`): `sudo chmod +x /opt/sqldeveloper/sqldeveloper.sh`.

Conexión:

| Campo | Valor |
|:---|:---|
| Usuario / contraseña | `orauser` / `1234` |
| Host / puerto | IP del servidor / `1521` |
| Tipo | **Nombre del servicio**: `FREEPDB1` |

Con «SID» en lugar de «nombre del servicio» da `ORA-12505` o `ORA-12514`: `FREEPDB1` es un servicio, no un SID.

### VS Code + SQL Developer

```bash
sudo dpkg -i code_*_amd64.deb
```

Extensión **Oracle SQL Developer Extension for VS Code** (editor: Oracle) desde el panel de extensiones. Conexión con los mismos datos. Evidencia: una consulta ejecutada (`SELECT user, sys_context('USERENV','CON_NAME') FROM dual;`) con el resultado en el panel.

### SQL\*Plus (Instant Client)

```bash
cd ~/Descargas
sudo apt install -y alien
sudo alien -i oracle-instantclient-basic-*.rpm
sudo alien -i oracle-instantclient-sqlplus-*.rpm
sudo apt install -y libaio1t64
sudo ln -s /usr/lib/x86_64-linux-gnu/libaio.so.1t64 /usr/lib/x86_64-linux-gnu/libaio.so.1
sudo ldconfig
ldd $(which sqlplus) | grep "not found"     # sin salida
sqlplus orauser/1234@//<ip-servidor>:1521/FREEPDB1
```

```txt
SQL*Plus: Release 23.0.0.0.0 - Production on ...
Connected to:
Oracle Database 23ai Free Release 23.0.0.0.0 - ...      (el texto depende de la versión de la imagen)
SQL> show user
USER is "ORAUSER"
```

- Comprobado en Ubuntu 24.04: el paquete `libaio1t64` instala `/usr/lib/x86_64-linux-gnu/libaio.so.1t64`, por eso hace falta el enlace.
- El orden de `alien` importa: el paquete de SQL\*Plus depende del Basic.
- `alien` tarda (convierte y genera el `.deb`) y muestra avisos sobre los *scripts* del RPM: son normales.
- `//ip:puerto/servicio` es la sintaxis **EZConnect**: no necesita `tnsnames.ora`. Para nivel 4: crear un `tnsnames.ora` con un alias y conectar con `sqlplus orauser/1234@alias` (variable `TNS_ADMIN`).

### SQLcl

```bash
unzip sqlcl-*.zip -d ~/sqlcl
echo 'export PATH="$HOME/sqlcl/sqlcl/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
sql orauser/1234@//<ip-servidor>:1521/FREEPDB1
```

SQLcl usa Java (JDBC), así que **no** necesita Instant Client ni `libaio`. Diferencia que vale la pena que expliquen frente a SQL\*Plus: autocompletado con tabulador, historial, `info`, `ddl`, salida en CSV o JSON (`set sqlformat csv`).

## Clientes para PostgreSQL

### psql

```bash
sudo apt install -y postgresql-client
psql --version            # psql (PostgreSQL) 16.x
psql -h <ip-servidor> -U pguser -d dbpg
```

```txt
dbpg=> \conninfo
You are connected to database "dbpg" as user "pguser" on host "10.0.0.5" at port "5432".
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
```

El paquete `postgresql-client` instala **solo** el cliente: en esta máquina no hay servidor PostgreSQL (`systemctl status postgresql` no encuentra el servicio). Mostrarlo es buena evidencia de 1.a.

### pgAdmin 4

Tras dar de alta el repositorio como indica el enunciado:

```bash
sudo apt install -y pgadmin4
```

- El paquete `pgadmin4` instala los modos escritorio y web. Desde el menú se abre el modo escritorio.
- La orden del repositorio lee `/etc/upstream-release/lsb-release` para obtener el nombre de la versión de **Ubuntu** (`noble`), porque `lsb_release -cs` en Mint devuelve el nombre de Mint (`wilma`, `xia`...) y el repositorio no existe para ese nombre. Error típico si se usa la orden de la web de pgAdmin sin adaptar: `404 Not Found ... /apt/wilma`.
- Conexión: *Register → Server*, pestaña *Connection*: host, puerto 5432, base de datos de mantenimiento `dbpg`, usuario `pguser`.

## Clientes para MariaDB

### mariadb

```bash
sudo apt install -y mariadb-client
mariadb --version
mariadb -h <ip-servidor> -u muser -p dbm
```

```txt
+----------------+----------------+
| current_user() | user()         |
+----------------+----------------+
| muser@%        | muser@10.0.0.5 |
+----------------+----------------+
```

`mysql` es un enlace a `mariadb` (`ls -l /usr/bin/mysql` → `mysql -> mariadb`).

### phpMyAdmin (en el servidor)

```bash
sudo apt install -y php php-mysql php-mbstring php-zip php-gd php-json php-curl
sudo apt install -y phpmyadmin
```

Puntos del instalador que más fallan:

1. **Servidor web**: hay que **marcar** `apache2` con la barra espaciadora antes de pulsar Intro. Si no se marca, no se crea la configuración de Apache y `http://servidor/phpmyadmin` da 404.
2. **dbconfig-common**: responder *Sí*; crea la base de datos `phpmyadmin` y el usuario del mismo nombre.

```bash
sudo phpenmod mbstring
sudo ln -s /etc/phpmyadmin/apache.conf /etc/apache2/conf-available/phpmyadmin.conf
sudo a2enconf phpmyadmin
sudo systemctl reload apache2
```

Si se marcó `apache2` en el instalador, la configuración ya está creada y el `ln -s` da `File exists`: no es un error grave.

Acceso desde el **navegador de la máquina cliente**: `http://<ip-servidor>/phpmyadmin`.

- Con el usuario `phpmyadmin` solo se ve su propia base de datos: es la cuenta interna de la aplicación. Para trabajar con `dbm` hay que entrar como **`muser`**.
- `root` no puede entrar por phpMyAdmin porque se autentica por `unix_socket`, y eso es lo deseable.

### MySQL Workbench

Se descarga el `.deb` para Ubuntu 24.04 y se instala con `sudo apt install ./mysql-workbench-community_*.deb`, que resuelve las dependencias (con `dpkg -i` hay que ejecutar después `sudo apt -f install`). Al conectar a MariaDB muestra un aviso de servidor no soportado: se puede continuar, y explicarlo (Workbench está pensado para MySQL) es una evidencia de nivel 3.

## Clientes universales

### DBeaver

```bash
sudo apt install -y default-jre
wget https://dbeaver.io/files/dbeaver-ce_latest_amd64.deb
sudo dpkg -i dbeaver-ce_latest_amd64.deb
sudo apt-get install -f
```

En la primera conexión a cada SGBD, DBeaver ofrece **descargar el *driver*** (JDBC de Oracle, PostgreSQL, MariaDB). Para Oracle: tipo de conexión *Service Name* = `FREEPDB1`. Los tres SGBD conectados en el mismo panel son la mejor evidencia de 1.j.

### Adminer

```bash
sudo apt install -y php8.3-cli php8.3-pgsql php8.3-mysql
wget https://www.adminer.org/latest.php -O adminer.php
php -S localhost:8080 adminer.php
```

Sin las extensiones `php8.3-pgsql` y `php8.3-mysql`, Adminer no ofrece PostgreSQL ni MySQL en el desplegable de sistemas o avisa de que no hay extensiones disponibles. Es la incidencia más probable de este apartado. Adminer no puede conectar con Oracle sin la extensión `oci8`, que no está en los repositorios: lo razonable es usarlo para PostgreSQL y MariaDB y explicarlo.

## Comprobación

Tabla mínima que debe aparecer en la entrega (al menos un cliente gráfico y uno de terminal por SGBD):

| SGBD | Cliente de terminal | Cliente gráfico | Evidencia |
|:---|:---|:---|:---|
| Oracle | SQL\*Plus o SQLcl | SQL Developer, VS Code o DBeaver | `show user` → `ORAUSER`; `show con_name` → `FREEPDB1` |
| PostgreSQL | psql | pgAdmin o DBeaver | `\conninfo` con la IP del servidor; `SELECT current_user;` → `pguser` |
| MariaDB | mariadb | phpMyAdmin, Workbench o DBeaver | `SELECT current_user(), user();` con la IP del cliente |

La prueba de que la conexión es remota está en la **IP**: `\conninfo` y `user()` muestran la dirección del servidor o del cliente, no `localhost`. Una captura conectando a `localhost` no demuestra nada en esta práctica.

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **1.a** | No explica qué es un cliente. | Explica la función del cliente frente al servidor. | Clasifica los clientes (terminal, gráfico, web, universal) y qué biblioteca usa cada uno. | Explica por qué phpMyAdmin va en el servidor y SQLcl no necesita Instant Client. |
| **1.d** | No identifica requisitos. | Identifica JDK, Instant Client, `libaio`, repositorio de pgAdmin y servidor web para phpMyAdmin. | Justifica cada dependencia y su versión. | Detecta dependencias no indicadas (extensiones de PHP para Adminer, permisos de `sqldeveloper.sh`). |
| **1.f** | Faltan clientes o están en la máquina servidor. | Un cliente gráfico y uno de terminal por SGBD, en la máquina cliente. | Comprueba la versión de cada cliente instalado. | Instala y compara varios clientes por SGBD. |
| **1.i** | Incidencias sin resolver. | Resuelve las incidencias que aparecen. | Explica la causa (versión de Java, `libaio`, nombre de servicio frente a SID, puerto). | Resuelve incidencias no previstas en el enunciado y las documenta. |
| **1.j** | Alguna conexión falla o se hace desde el servidor. | Conecta desde el cliente a los tres SGBD. | Muestra con la IP que la conexión es remota y comprueba los puertos con `nc`. | Tabla final completa con cliente, SGBD y evidencia. |
| **1.g** | Capturas sin explicación. | Proceso completo y resultados de cada conexión. | Explicaciones de cada paso. | Documento claro y ordenado, con incidencias y soluciones. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD, sobre la práctica adaptada de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
