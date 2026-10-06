---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: Oracle Database Free en un contenedor"
pageClass: ejercicios-page
---

# 🧭 Guía: Oracle Database Free en un contenedor

Primer contacto con Oracle Database: despliegue de **Oracle Database 23ai Free** sobre docker/podman en Linux Mint, a partir de la [documentación oficial de Oracle](https://www.oracle.com/es/database/free/get-started/).

## Requisitos

MV con Debian o Linux Mint, virtualización anidada, 4 GB de RAM, 2 CPU y 250 GB de disco (unos 25 GB + 5 GB por contenedor).

## Instalar podman y descargar la imagen

```bash
# Adquirir privilegios
sudo su
apt update && apt install -y podman-docker

# Descargar la imagen (tarda un poco); elige una
podman pull container-registry.oracle.com/database/free:23.4.0.0
podman pull container-registry.oracle.com/database/free:latest-lite

# Comprobar la imagen
podman images
```

## Crear el contenedor

```bash
podman run -d --name <nom-cont-oracle-db> -p 1521:1521 -e ORACLE_PWD=1234 --restart always container-registry.oracle.com/database/free:23.4.0.0-lite
```

- `--restart always`: cuando se apague la máquina principal, al volver a arrancar los contenedores arrancan automáticamente.
- `-e ORACLE_PWD=1234`: contraseña inicial de los usuarios `sys` y `system`. Como se establece mediante una variable de entorno, después **no** se podrá cambiar.

```bash
# Ver los contenedores en funcionamiento
podman ps
podman ps -a
podman ps -a -q
```

Espera hasta que el contenedor entre en estado **healthy**.

## Entrar en el contenedor y conectar

```bash
# «Entrar» en el contenedor
podman exec -it <oracle-db> /bin/bash
podman exec -it <oracle-db> sh

# Conectar con sqlplus
podman exec -it <oracle-db> sqlplus sys/1234@FREE as sysdba
podman exec -it <oracle-db> sqlplus system/1234@FREE
podman exec -it <oracle-db> sqlplus pdbadmin/1234@FREEPDB1
```

## Parar y eliminar

```bash
# Detener todos los contenedores en funcionamiento
podman stop $(podman ps -a -q)
podman stop -a

# Eliminar todos los contenedores
podman rm $(podman ps -a -q)

# Eliminar imágenes
podman rmi <id-imagen> <id-imagen> ...
podman rmi $(podman images -q)
```

## Comprobar la conectividad

Para comprobar si desde una máquina se puede alcanzar un puerto de otra:

```bash
nc -zv <ip> <puerto>
nc -zv <url> <puerto>
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD1/desplegar ORACLEdb23 sobre Docker_simplif.pdf`.</small>
