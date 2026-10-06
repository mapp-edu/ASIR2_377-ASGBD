---
layout: doc
title: "PostgreSQL: instalación y estructura de carpetas"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: instalación y estructura de carpetas

## 🐘 Instalación de PostgreSQL

📌 PostgreSQL es libre y gratuito.

Se puede encontrar más información en la página oficial [PostgreSQL/Downloads](https://www.postgresql.org/download/)

### 🐧 Instalación en GNU/Linux (la más habitual)

Instalación con gestor de paquetes

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Esto instala el **servidor** PostgreSQL, herramientas básicas, extensiones comunes, etc.

Durante la instalación...

- Se crea un clúster por defecto
- El servicio se inicia (postmaster)
- Escucha por el puerto 5432
- Se crea el usuario del sistema: **postgres**
- Se crea una base de datos: postgres
- y otras cosas...

#### Comprobar que el servidor / servicio funciona

```bash
sudo systemctl status postgresql
```

#### Entrar en PostgreSQL con el cliente psql

El cliente **psql** es una herramienta de línea de comandos que se utiliza para interactuar con bases de datos PostgreSQL. Es, en resumen, el programa que te permite enviar consultas SQL, ver resultados y gestionar la base de datos directamente desde el terminal.

```bash
sudo -u postgres psql
```

**Este comando hace lo siguiente:**

- El sistema cambia al usuario postgres.

- Después arranca **psql** conectándose al clúster predeterminado y a la base de datos con el mismo nombre que el usuario (postgres).

- Acabas en un prompt interactivo como:

- ```txt
  sql (16.13 (Ubuntu 16.13-0ubuntu0.24.04.1))
  Type "help" for help.

  postgres=#
  ```

---

#### Salir de psql

```sql
\q
```

#### 🧰 Herramientas básicas de PostgreSQL

- `psql` Cliente de línea de comandos. Sirve para conectarte al servidor PostgreSQL, ejecutar consultas SQL y administrar bases de datos y roles
- `createdb / dropdb` Crear y eliminar bases de datos desde el terminal
- `createuser / dropuser` Crear y eliminar usuarios (roles)
- `pg_dump` Hacer copias de seguridad (backups)
- `pg_restore` Restaurar copias hechas con pg_dump en formato no textual
- `pg_isready / pg_ctl`

#### Extensiones comunes

- pgcrypto
- pgaudit
- pg_cron
- pgagent
- pgstattuple
- pg_trgm (búsquedas por similitud)
- citext (sin diferenciar mayúsculas y minúsculas)
- unaccent (eliminar acentos)

---

### 🖥️ Instalación en Windows

#### Instalador gráfico

Se descarga un instalador oficial. Durante la instalación eliges la versión, defines la contraseña del usuario postgres, eliges el puerto (5432 por defecto) y se inicializa el clúster. Deja marcada la opción de instalar **Application Stack Builder**. Incluye: pgAdmin (cliente de PostgreSQL), psql (sin PATH), servicios de Windows para postgres (servidor PostgreSQL) y Application Stack Builder (mantenimiento)

El PATH suele ser `c:\Program Files\PostgreSQL\18\bin`, según la versión. Añade esta ruta a tu PATH

### Instalación en macOS

Instalador oficial, Homebrew

```txt
brew install postgresql
brew services start postgresql
```

---

### Logs de instalación

Los paquetes de PostgreSQL gestionados por el sistema dejan logs de instalación en el sistema de paquetes.

```txt
/var/log/apt/history.log       # historial de instalaciones de paquetes
/var/log/apt/term.log          # salida detallada de cada instalación
```

```bash
-- para ver cuándo se instaló PostgreSQL
grep postgresql /var/log/apt/history.log -B 1 -A 1
grep postgresql /var/log/apt/term.log
```

Después de la instalación, el primer arranque del servidor PostgreSQL sí genera logs dentro del directorio del clúster, normalmente:

```txt
/var/log/postgresql/postgresql-16-main.log   # log del servicio PostgreSQL
```

::: info-box Actividad
🧪 Busca la fecha de la instalación de tu clúster

🧪 Busca cuántas veces se ha iniciado el servicio de postgres
:::

## Estructura típica de un servidor PostgreSQL

Puede cambiar según la distribución de Linux, la versión o el sistema operativo...

Para tener una información inicial, podemos ejecutar estos comandos

```bash
psql --version
pg_config --bindir
pg_config --help
```

Estructura

```txt
/etc/postgresql/16/main/          → Configuración
/usr/lib/postgresql/16/bin/       → BINARIOS
/var/lib/postgresql/16/main       → DATA DIRECTORY
/var/lib/postgresql/16/main/pg_wal     → WAL (separado)
/var/lib/postgresql/16/main/pg_tblspc  →  Enlaces simbólicos a tablespaces personalizados
/var/log/postgresql/    → LOGS
/var/run/postgresql/    → SOCKETS
```

### BINARIOS

Contiene los ejecutables de PostgreSQL: psql → cliente; postgres → servidor; initdb → servidor (configuración)

Los puede ver y ejecutar cualquier usuario

#### DATA DIRECTORY

Solo puede acceder el usuario/grupo `postgres`

Es el corazón del clúster. Contiene: bases de datos (ficheros internos), catálogos del sistema, configuración (postgresql.conf, pg_hba.conf) y WAL (si no lo separas)

No es recomendable modificar ficheros directamente dentro del clúster, porque puedes corromper la base de datos. Siempre que quieras hacer operaciones sobre PostgreSQL, es mejor hacerlas con el usuario postgres o mediante las herramientas de PostgreSQL (psql, pg_ctl, etc.).

#### WAL

Registra todas las transacciones antes de escribir los datos. Sirve para la recuperación en caso de fallo y para la replicación

```txt
-- Se configura:
initdb --waldir=/pgdata/cluster01/wal
```

#### Configuración

postgresql.conf, pg_hba.conf

#### LOGS

Contiene los logs del servidor: errores, conexiones, consultas lentas

Importante para: diagnóstico, auditorías, depuración

Siempre mejor separado del DATA

#### TABLESPACES

```sql
Para ver los tablespaces:
\db
```

pg_default y pg_global son los tablespaces predeterminados de PostgreSQL. `\db` no muestra una ubicación específica para ellos porque están dentro del directorio del clúster (/var/lib/postgresql/16/main/), no en un directorio separado.

```txt
/var/lib/postgresql/16/main/
├── base/        🡐 datos de cada base de datos (pg_default)
├── global/      🡐 datos globales (pg_global)
├── pg_tblspc/   🡐 enlaces a tablespaces externos (vacío si no hay ninguno)
```

No existe un lugar por defecto para poner TABLESPACES adicionales; los debe definir el DBA. Permiten guardar datos en otros discos/directorios

```sql
CREATE TABLESPACE ts_dades LOCATION '/.../tablespaces/ts_dades';
```

#### BACKUPS

No existe un lugar por defecto; lo debe definir el DBA. Es donde se guardan las copias de seguridad: dumps (pg_dump), backups físicos

::: info-box Actividad
🧪 Crea un directorio en el SO para guardar los backups <br> 🧪 Crea un directorio en el SO para poner tablespaces adicionales
:::

::: info-box Antes de continuar
- **En una máquina (virtual)**, realiza tu primera instalación de PostgreSQL: tienes los pasos en la [Práctica 2: instalar tres SGBD](/ut1/ejercicios/practica-2-tres-sgbd).
- **En otra máquina**, instala el cliente gráfico **pgAdmin** desde la página oficial de [pgAdmin](https://www.pgadmin.org/download/): consulta la [Práctica 3: instalar los clientes](/ut1/ejercicios/practica-3-clientes).
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
