---
layout: doc
title: "PostgreSQL como SGBD distribuido"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL como SGBD distribuido

## PostgreSQL como SGBDD

PostgreSQL puede funcionar como SGBDD (sistema gestor de bases de datos distribuidas), pero no de forma nativa completa como otros sistemas diseñados desde cero para ser distribuidos. Lo consigue mediante extensiones y herramientas.

### ¿Qué es un SGBDD?

Un SGBD distribuido es un sistema en el que los datos están repartidos en varios nodos, los nodos pueden estar en diferentes máquinas o ubicaciones y el usuario lo ve como una sola base de datos

PostgreSQL no es distribuido «nativo puro», pero puede funcionar como distribuido con extensiones

### Opciones para hacer PostgreSQL distribuido

- Citus
- postgres_fdw
- BDR (Bi-Directional Replication)
- Logical Replication

#### Citus

Divide las tablas en fragmentos (sharding), reparte los datos entre nodos y un nodo coordinador recibe las consultas

PostgreSQL distribuido real. Muy usado en producción

#### postgres_fdw

Permite conectar varias bases de datos PostgreSQL

```sql
SELECT * FROM taula_remota;
```

Los datos están en otro servidor, pero PostgreSQL los trata como si fueran locales

#### BDR (Bi-Directional Replication)

Replicación multimaestro: varios nodos pueden escribir y los datos se sincronizan

#### Logical Replication

Replicación lógica (nativa): copia datos entre nodos y permite distribuir la carga

### Tipos de arquitecturas en PostgreSQL

- Sharding (fragmentación)
- Replicación
- Federación

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
