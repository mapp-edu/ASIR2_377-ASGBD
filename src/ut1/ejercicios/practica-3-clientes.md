---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 3: instalar los clientes de los tres SGBD"
pageClass: ejercicios-page
---

# 📋 Práctica 3: instalar los clientes de los tres SGBD

## Enunciado

Los **clientes de conexión** a bases de datos son las herramientas o programas que permiten a los usuarios o a las aplicaciones conectarse a una base de datos, gestionarla y consultarla. Son importantes porque actúan como puente entre la base de datos y el usuario o el software que la necesita.

Instala los clientes de Oracle, PostgreSQL y MariaDB en una máquina Linux Mint **diferente de la de los servidores** y conéctate con ellos a las bases de datos creadas en la práctica anterior.

## Objetivos

- Reconocer la función del software cliente dentro de un SGBD de dos capas.
- Instalar y configurar clientes gráficos y de terminal.
- Verificar el funcionamiento de los SGBD desde una máquina cliente.

## Clientes para Oracle Database

### Cliente gráfico: SQL Developer

Instala primero el JDK de Java si no está (comprueba que la versión es 17 o superior):

```bash
sudo apt install -y openjdk-17-jdk
java --version
```

Descarga `sqldeveloper.zip` desde la web de Oracle y descomprímelo:

```bash
sudo unzip sqldeveloper-*.zip -d /opt/
```

Ya se puede ejecutar pulsando <kbd>Alt</kbd>+<kbd>F2</kbd> y escribiendo `/opt/sqldeveloper/sqldeveloper.sh`. También puedes crear un lanzador (copia y pega en un terminal):

```bash
sudo tee -a /usr/share/applications/sqldeveloper.desktop > /dev/null <<EOT
[Desktop Entry]
Version=1.0
Name=SQL Developer
Comment=SQL Integrated development environment
Exec=/opt/sqldeveloper/sqldeveloper.sh
Icon=/opt/sqldeveloper/icon.png
Terminal=false
Type=Application
Categories=Application;Development;
Keywords=database;db;sql;query;administration;development;
EOT
```

### Cliente gráfico: VS Code + extensión oficial de SQL Developer

Visita la página de VS Code, descarga el `.deb` e instálalo desde un terminal:

```bash
sudo dpkg -i code_*_amd64.deb
```

### Cliente de terminal: SQL\*Plus

Descarga de la web de Oracle los paquetes de Instant Client versión 23 en formato `.rpm`: **Basic Package (OL8 RPM)** y **SQL\*Plus (OL8 RPM)**. Conviértelos a `.deb` con `alien`, en este orden:

```bash
cd Descargas/
sudo apt install -y alien
sudo alien -i oracle-instantclient-b*.rpm
sudo alien -i oracle-instantclient-s*.rpm
```

### Cliente de terminal: SQLcl

Necesita Java (versión 11 o superior). Descárgalo desde <https://www.oracle.com/database/sqldeveloper/technologies/sqlcl/download/>:

```bash
cd ~/Descargas
unzip sqlcl-*.zip -d ~/sqlcl
nano ~/.bashrc
# añade esta línea al final de .bashrc:
export PATH="$HOME/sqlcl/sqlcl/bin:$PATH"
source ~/.bashrc
sql
```

## Clientes para PostgreSQL

### psql

```bash
sudo apt update && sudo apt install -y postgresql-client
psql --version
psql -h <host> -U <usuario> -d <nombre_db>
```

Para una versión específica: `sudo apt install postgresql-client-14`.

### pgAdmin 4

```bash
sudo curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add -
sudo sh -c '. /etc/upstream-release/lsb-release && echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$DISTRIB_CODENAME pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
sudo apt install -y pgadmin4
```

Arranca pgAdmin 4 desde el menú.

## Clientes para MariaDB

### mariadb / mysql

```bash
sudo apt update && sudo apt install -y mariadb-client
mariadb --version
mariadb -h <host> -u <usuario> -p
```

### phpMyAdmin

Aunque sea un cliente de SGBD, phpMyAdmin se instala **en el servidor**, porque funciona como una aplicación web que necesita un servidor web (Apache o Nginx) y PHP para ejecutarse. Después los usuarios acceden con un navegador desde cualquier equipo cliente, conectándose a la dirección del servidor (por ejemplo, `http://servidor/phpmyadmin`, o `http://localhost/phpmyadmin` desde el propio servidor).

```bash
sudo apt install php php-mysql php-mbstring php-zip php-gd php-json php-curl
sudo apt install phpmyadmin
```

El instalador hace algunas preguntas (responde que sí) y pide una contraseña para el usuario `phpmyadmin`.

```bash
sudo phpenmod mbstring
sudo systemctl restart apache2
sudo ln -s /etc/phpmyadmin/apache.conf /etc/apache2/conf-available/phpmyadmin.conf
sudo a2enconf phpmyadmin
sudo systemctl reload apache2
```

Entrada desde el navegador: `localhost/phpmyadmin/`, con el usuario `phpmyadmin` y la contraseña que hayas indicado.

### MySQL Workbench

En Linux Mint 21 no se puede instalar, pero en Mint 22 sí. Descarga el `.deb` desde <https://dev.mysql.com/downloads/workbench/> (versión para Ubuntu 24.04) e instálalo.

## Clientes universales

### DBeaver

```bash
sudo apt update && sudo apt install -y default-jre
wget https://dbeaver.io/files/dbeaver-ce_latest_amd64.deb
sudo dpkg -i dbeaver-ce_latest_amd64.deb
sudo apt-get install -f
```

### Adminer

```bash
sudo apt install php8.3-cli
wget https://www.adminer.org/latest.php -O adminer.php
php -S localhost:8080 adminer.php
```

Después abre el navegador y ve a `http://localhost:8080`.

## Comprobación

Conéctate desde la máquina cliente a cada una de las bases de datos de la práctica anterior con, al menos, un cliente gráfico y uno de terminal:

| SGBD | IP | Nombre BD | Puerto | Usuario | Contraseña |
|:---|:---|:---|:---:|:---|:---|
| Oracle | | freepdb1 | 1521 | orauser | 1234 |
| PostgreSQL | | dbpg | 5432 | pguser | 1234 |
| MariaDB | | dbm | 3306 | muser | 1234 |

Si alguna conexión falla, comprueba primero si desde el cliente se alcanza el puerto del servidor:

```bash
nc -zv <ip> <puerto>
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
| **1.a** | Se ha reconocido la utilidad y función de cada uno de los elementos de un sistema gestor de bases de datos. | Explica la función del software cliente y lo diferencia del software servidor de cada SGBD. |
| **1.d** | Se ha identificado el software necesario para llevar a cabo la instalación. | Identifica el software necesario para cada cliente (JDK, Instant Client, repositorios, servidor web para phpMyAdmin). |
| **1.f** | Se han instalado sistemas gestores de bases de datos. | Los clientes gráficos y de terminal quedan instalados y operativos en una máquina distinta de la del servidor. |
| **1.i** | Se han resuelto las incidencias de la instalación. | Resuelve las incidencias de instalación y de conexión (versión de Java, conversión de paquetes, puertos). |
| **1.j** | Se ha verificado el funcionamiento del sistema gestor de bases de datos. | Verifica el funcionamiento de los tres SGBD conectando desde la máquina cliente. |
| **1.g** | Se ha documentado el proceso de instalación. | Documenta el proceso y los resultados de cada conexión. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD1/01 instalar 3 clients d sgbds.pdf · PLALOE_EXTR/05 instalar 3 clients d sgbds.pdf`.</small>
