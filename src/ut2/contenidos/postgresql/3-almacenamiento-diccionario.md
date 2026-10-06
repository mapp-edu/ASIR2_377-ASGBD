---
layout: doc
title: "PostgreSQL: almacenamiento y diccionario de datos"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: almacenamiento y diccionario de datos

## Configuración del almacenamiento

### Arquitectura simplificada de almacenamiento en PostgreSQL

```txt
Disc
 ├── PGDATA
 │    ├── base/
 │    ├── global/
 │    ├── pg_wal/
 │    ├── pg_tblspc/
 │    └── postgresql.conf
```

La configuración del almacenamiento en **PostgreSQL** hace referencia a cómo y dónde se guardan físicamente los datos, el WAL, los índices y los ficheros internos dentro del sistema.

### 📁 Directorio de datos (PGDATA)

Es el directorio principal donde PostgreSQL guarda:

- Bases de datos
- Tablas
- Índices
- WAL
- Ficheros de configuración

Ejemplo típico en Linux:

```txt
/var/lib/postgresql/16/main
```

Este directorio se define con:

```txt
PGDATA
```

O al iniciar con:

```bash
pg_ctl -D /ruta/PGDATA start
```

### Estructura interna del directorio

Dentro de PGDATA encontramos:

| Carpeta | Función |
| --- | --- |
| base/ | Ficheros físicos de las bases de datos |
| global/ | Objetos globales (roles, tablespaces) |
| pg_wal/ | Ficheros WAL (Write Ahead Log) |
| pg_tblspc/ | Enlaces simbólicos a tablespaces |
| pg_stat/ | Estadísticas |

### Almacenamiento físico de las tablas

Cada tabla en PostgreSQL es:

- Uno o varios ficheros físicos
- Identificados por OID
- Almacenados dentro de `base/<OID_database>/`

::: warning Atención
⚠️ No se guarda con el nombre de la tabla, sino con un identificador interno.
:::

PostgreSQL guarda los datos así:

```txt
/var/lib/postgresql/16/main/base/
   ├── 16384/
   │     ├── 1259
   │     ├── 1247
   │     └── ...
```

16384 → es el OID de la base de datos; 1259, 1247, etc. → son ficheros de tablas o índices, identificados por OID. No tienen nombres «humanos» (como clients, comandes, etc.)

**Desde el sistema operativo:**

- ❌ No puedes saber fácilmente qué tabla es cada fichero
- ❌ No puedes leer los datos (están en formato interno binario)
- ❌❌ **Manipularlos directamente puede corromper la base de datos**

### Tablespaces (muy importante)

Permiten distribuir los datos en diferentes discos.

Ejemplo:

```sql
CREATE TABLESPACE dades_fast
LOCATION '/mnt/ssd_postgres';
```

Después puedes crear una tabla en ese espacio:

```sql
CREATE TABLE clients (
   id serial,
   nom text
) TABLESPACE dades_fast;
```

Útil para:

- Separar datos y WAL
- Utilizar SSD para los índices
- Mejorar el rendimiento de E/S

Parámetros importantes en `postgresql.conf`:

```txt
wal_level = replica
checkpoint_timeout = 5min
max_wal_size = 1GB
```

### Parámetros importantes de E/S y almacenamiento

En `postgresql.conf`:

#### Checkpoints

```txt
checkpoint_timeout
max_wal_size
```

#### Sincronización

```txt
synchronous_commit
fsync
```

⚠️ `fsync=off` mejora el rendimiento, pero es peligroso en producción.

## Diccionario de datos

### 📘 ¿Qué es el diccionario de datos?

El diccionario de datos en **PostgreSQL** es el conjunto de tablas y vistas del sistema que almacenan toda la información sobre la estructura de la base de datos.

**📚 El diccionario de datos contiene metadatos (datos sobre los datos).**

#### ¿Qué guarda el diccionario de datos?

Contiene información sobre:

- Bases de datos
- Tablas
- Columnas
- Índices
- Constraints
- Usuarios y roles
- Permisos
- Tablespaces
- Funciones
- Vistas
- Extensiones

### 🗂 ¿Dónde se encuentra?

En PostgreSQL, el «diccionario de datos» no es un único objeto centralizado, sino que está distribuido en diferentes catálogos del sistema.

El diccionario de datos está formado principalmente por:

#### Esquema `pg_catalog`

Cada base de datos tiene sus propios catálogos del sistema (pg_catalog)

Es el esquema interno del sistema.

Contiene tablas como:

| Tabla | Función |
| --- | --- |
| pg_class | Tablas e índices |
| pg_attribute | Columnas |
| pg_type | Tipos de datos |

Ejemplo:

```sql
SELECT * FROM pg_catalog.pg_tables;
```

A nivel de instancia (clúster) hay algunos catálogos globales (almacenados en global/), como: **roles/usuarios (pg_authid), bases de datos (pg_database)** <br> 👉 Estos son compartidos por todas las bases de datos.

| Tabla | Función |
| --- | --- |
| pg_roles | Roles/usuarios |
| pg_authid | Autenticación |
| pg_database | Bases de datos |
| pg_tablespace | Tablespaces |

---

### Information Schema

PostgreSQL también implementa:

```txt
information_schema
```

Es SQL estándar (portable entre SGBD).

Ejemplo:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### 🔎 Ejemplos prácticos

#### 🔹 Listar tablas

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public';
```

#### 🔹 Ver las columnas de una tabla

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'clients';
```

#### 🔹 Ver los índices

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'clients';
```

### 🏗 Diferencia entre pg_catalog e information_schema

| pg_catalog | information_schema |
| --- | --- |
| Interno de PostgreSQL | SQL estándar |
| Más completo | Más portable |
| Puede cambiar entre versiones | Más estable |

### 🔐 También guarda información de seguridad

Ejemplo:

```sql
SELECT * FROM pg_roles;
```

Muestra:

- Quién es superusuario
- Quién puede crear BD
- Quién puede crear roles

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
