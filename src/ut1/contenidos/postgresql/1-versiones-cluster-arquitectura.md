---
layout: doc
title: "PostgreSQL: versiones, clúster y arquitectura"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: versiones, clúster y arquitectura

## Versiones de PostgreSQL

### 🧾 ¿Qué es una versión?

La **versión** hace referencia a la numeración del software que indica las funcionalidades disponibles, el motor de base de datos y el modelo de arquitectura utilizado. Ejemplos: `9.6`, `10`, `11`, `15`, `16`

Estas son las versiones mayores. Cada versión introduce cambios importantes, tiene 5 años de soporte oficial y requiere dump/restore para actualizar

Hay versiones menores. Ejemplo: 15.2 → 15.3. Estas versiones corrigen bugs, incluyen actualizaciones de seguridad, no rompen la compatibilidad y se actualizan fácilmente.

### ⚠️ Consideraciones importantes

- También es muy importante tener en cuenta el fin de soporte de una versión (EOL, End of Life)

El fin de vida útil, más conocido por su término inglés End Of Life (EOL), hace referencia a la caducidad de un producto de software. Es decir, es el momento en que un software deja de tener mantenimiento y soporte.

---

## Ediciones de PostgreSQL

PostgreSQL NO TIENE EDICIONES del tipo Enterprise, Standard, etc., como hace Oracle.

En PostgreSQL siempre es el mismo motor, sin funciones «capadas» por licencia.

- Extensiones (PostGIS, pg_stat_statements, etc.)
- Distribuciones (EnterpriseDB, Amazon RDS, Azure, etc.)
- Configuración y soporte comercial

## Clúster PostgreSQL (equivalente a una instancia)

Un clúster PostgreSQL es un conjunto de bases de datos, usuarios (roles) y configuración, gestionado por un solo proceso servidor (postmaster / postgres), con un único puerto (normalmente 5432) y un único directorio de datos, PGDATA

En PostgreSQL, las bases de datos dentro de un clúster están aisladas: no se pueden hacer joins directos entre BD. Se comparten los usuarios (roles), las extensiones y la configuración

Si se necesita NO compartir usuarios, extensiones o configuración (es decir, si se quiere otro «entorno»), se creará otro clúster (otro puerto / otro directorio)

En PostgreSQL, la memoria y los parámetros principales se ven y se gestionan sobre todo mediante parámetros de configuración

Se pueden consultar con las siguientes órdenes desde **psql** (se verá cómo acceder más adelante)

```sql
SHOW config_file;
SHOW shared_buffers;
SHOW work_mem;
SHOW max_connections;
```

## Arquitectura de PostgreSQL

La arquitectura de PostgreSQL es cliente-servidor y está basada en procesos (no en hilos, como en otros SGBD).

1️⃣ Modelo cliente-servidor

```txt
Cliente  (psql o aplicación)
   │
   ▼
postmaster (proceso principal)
   │
   ├─ Proceso backend 1 (conexión cliente A, 1 por conexión)
   ├─ Proceso backend 2 (conexión cliente B)
   ├─ Proceso backend ..
   ├─ Proceso backend n
   ├─ Proceso autovacuum
   ├─ Proceso WAL writer
   ├─ Proceso checkpointer
   ├─ Proceso background writer
   └─ Proceso stats collector
```

![Procesos y memoria de la arquitectura de PostgreSQL #center](/img/contenidos/ut1/postgresql-architecture-process.jpg)

Cada conexión = un proceso.

**Flujo de trabajo**

- El cliente se conecta

- El postmaster crea un backend

- El backend:

  - Accede a una base de datos
  - Trabaja dentro de un schema
  - Lee/escribe tablas
  - Usa tablespaces (disco)

**Mientras tanto**

- autovacuum: elimina datos obsoletos y optimiza
- WAL writer: primero se escribe en el WAL y después en los datos
- checkpointer: complementa al WAL
- background writer: complementa al WAL
- stats collector: prepara estadísticas para optimizar consultas

---

### Componentes de un SGBD PostgreSQL

#### Arquitectura lógica (niveles)

```txt
Clúster de PostgreSQL
   │
   ├─ Base de datos A
   │    │
   │    ├─ Schemas
   │    │     │
   │    │     ├─ Tablas
   │    │     ├─ Vistas
   │    │     ├─ Índices
   │    │     └─ Funciones
   │    │
   │    └─ (usa tablespaces)
   │
   ├─ Base de datos B
   │    └─ ...
   │
   ├─ Usuarios / Roles (globales)
   │
   └─ Tablespaces (almacenamiento físico)
```

![Estructura de un clúster de bases de datos PostgreSQL #center](/img/contenidos/ut1/physical-structure-of-postgresql-cluster.png)

- Clúster: es todo el servidor PostgreSQL.
- Base de datos: contenedor lógico independiente dentro del clúster.
- Schemas: son como carpetas dentro de una base de datos.
- Objetos (dentro del schema): tablas → datos; vistas → consultas guardadas; índices → mejoran el rendimiento; funciones → lógica programada
- Usuarios / Roles: son globales al clúster (no de una sola BD).
- Tablespaces: definen dónde se guardan físicamente los datos en el disco.

## Requisitos de instalación

**Sistema operativo**

- GNU/Linux (Ubuntu, Debian, Red Hat, CentOS, AlmaLinux, etc.)
- Windows
- macOS
- Sistemas Unix (FreeBSD, OpenBSD…)

**Hardware mínimo**

- CPU: 1 núcleo
- Memoria RAM: 1 GB (2 GB o más recomendado)
- Disco duro: unos 100 MB para el software. Espacio adicional según los datos y las copias de seguridad

**Software necesario**

- En Linux, gestor de paquetes (apt, dnf, yum, etc.)
- Permisos de administrador (root o sudo) para la instalación
- PostgreSQL crea un usuario propio del sistema: `postgres`
- Conexión de red si habrá conexiones remotas, es decir, si el servidor no será solo local
- Puerto disponible. Puerto por defecto: 5432

**Requisitos recomendados para producción**

- 4–8 GB de RAM o más
- Disco SSD
- Sistema de copias de seguridad
- Conexiones cifradas (SSL)
- Cortafuegos configurado

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
