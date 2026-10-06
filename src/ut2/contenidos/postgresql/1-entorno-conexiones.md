---
layout: doc
title: "PostgreSQL: entorno y conexiones"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: entorno y conexiones

## Configuración del entorno

En PostgreSQL la configuración se divide en:

```txt
Sistema operativo
    ↓
Variables de entorno
    ↓
postgresql.conf
    ↓
Variables GUC
    ↓
Sesión
```

### Variables de entorno del sistema operativo

Estas no son propias de PostgreSQL, sino del SO. Las más importantes:

- PATH: ruta donde está el binario (**única obligatoria**)
- PGDATA: directorio de datos (servidor)
- PGPORT: puerto (por defecto 5432) (en el cliente)
- PGHOST: host por defecto (en el cliente)
- PGUSER: usuario por defecto (en el cliente)
- PGPASSWORD: contraseña (en el cliente); no recomendada

\*\* PostgreSQL no necesita que estas variables estén definidas para funcionar. Solo facilitan el uso de las herramientas.

Inicialmente, después de la instalación, ninguna variable está definida (excepto PATH). Hay que poner los valores manualmente si se quiere hacer uso de alguna de ellas.

Cómo saber el valor que debería tener PGDATA: conectar a postgres...

```bash
sudo -u postgres psql -c "show data_directory;"
```

También se puede saber mirando el servicio de Windows en `services.msc`: dentro de las propiedades del servicio de postgres, en el comando de inicio del servicio, PGDATA es lo que aparece detrás de -D

### Y cómo establecer el valor o los valores:

### 🐧 En Linux

```bash
Ejemplo en Linux:
export PGDATA=/var/lib/postgresql/16/main
export PGPORT=5432
```

```bash
Para hacer permanentes (para este usuario) los valores de PGDATA, etc.
echo "export PGDATA=/var/lib/postgresql/16/main" >> ~/.bashrc
source ~/.bashrc
```

### 🖥️ En Windows

Puedes modificarlas (el PATH) desde *Propiedades del sistema → Propiedades avanzadas del sistema → Variables de entorno*.

### Dónde se encuentran los binarios (psql)

```bash
which psql
/usr/bin/psql
    ==> /usr/bin
Aunque en este directorio se encuentran los enlaces simbólicos al directorio real:
/usr/lib/postgresql/16/bin/

En Windows:
C:\Program Files\PostgreSQL\18\bin
```

El 16 o el 18 de los ejemplos indican la versión instalada

### Dónde se encuentran los ficheros de configuración

```bash
find / -name postgresql.conf 2>/dev/null
/etc/postgresql/16/main/postgresql.conf

postgres@serverpg:/etc/postgresql/16/main$ ls
conf.d    environment  pg_ctl.conf  pg_hba.conf
pg_ident.conf  postgresql.conf  start.conf

En Windows:
C:\Program Files\PostgreSQL\18\data
```

![Puerto 5432, servicio PostgreSQL #center](/img/contenidos/ut2/5432.png)

## Configuración de las conexiones

PostgreSQL es un servicio (daemon) de base de datos que escucha habitualmente en el puerto TCP 5432. Se puede cambiar editando el fichero postgresql.conf, guardando y reiniciando el servicio (daemon)

```txt
Sistema operativo
    ↓
Variables de entorno
    ↓
postgresql.conf  pg_hba
    ↓
Variables GUC
    ↓
Sesión
```

### Fichero → postgresql.conf

En este fichero se puede cambiar el puerto en el que PostgreSQL escucha...

```txt
port = 5432                             # (change requires restart)
max_connections = 100                   # (change requires restart)
```

### Fichero → pg_hba.conf

Inicialmente no se puede acceder desde otro equipo: hay que configurarlo dando permiso expresamente. Se pueden especificar equipos concretos, redes concretas o a todo el mundo (0.0.0.0/0)

```bash
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE DATABASE USER ADDRESS METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
# IPv6 local connections:
host    all             all             ::1/128                 scram-sha-256
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            scram-sha-256
host    replication     all             ::1/128                 scram-sha-256
```

Para añadir una red desde la que poder acceder... en la sección "# IPv4 local connections:"

```txt
host  all  all  192.168.1.0/24      md5
host  all  all  192.168.1.0/24      scram-sha-256
```

En PostgreSQL, **`md5` y `scram-sha-256`** son métodos de autenticación que se configuran en el fichero `pg_hba.conf`

**MD5**: ¿qué es? Método de autenticación basado en hash MD5. PostgreSQL guarda la contraseña como un hash MD5.

Problemas: MD5 es un algoritmo antiguo (1992). Vulnerable a ataques de colisión. Menos seguro ante ataques modernos. No protege bien contra ataques de fuerza bruta con el hash robado.

**SCRAM-SHA-256**: 🔐 ¿qué es? SCRAM = Salted Challenge Response Authentication Mechanism. Utiliza SHA-256. Introducido en PostgreSQL 10

Configurar SCRAM correctamente en postgresql.conf: `password_encryption = scram-sha-256`

Y después, para regenerar la contraseña...

```sql
ALTER USER usuari WITH PASSWORD 'nova_password';
```

```sql
Mirar cómo se está guardando
SELECT rolname, rolpassword  FROM pg_authid;
```

**Recomendación actual**: en PostgreSQL 14, 15, 16… utiliza siempre scram-sha-256 si los clientes lo soportan. MD5, solo por compatibilidad con sistemas antiguos.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
