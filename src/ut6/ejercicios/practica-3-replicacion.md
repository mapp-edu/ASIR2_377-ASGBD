---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 3: replicación maestro-esclavo y en cadena"
pageClass: ejercicios-page
---

# 📋 Práctica 3: replicación maestro-esclavo y en cadena

## Enunciado

La tienda en línea de la empresa no puede permitirse perder pedidos ni dejar de atender consultas si falla un servidor. La solución es la **replicación**: tener copias de la base de datos que se mantienen al día de forma automática.

Vas a montar un nodo **maestro**, dos **esclavos** que replican directamente de él y un tercer esclavo **en cadena**, que replica de uno de los esclavos. Después provocarás la caída de cada nodo para ver qué sigue funcionando.

```txt
            ┌──────────┐
            │ maestro  │   lectura y escritura
            └────┬─────┘
          ┌──────┴──────┐
     ┌────▼─────┐  ┌────▼─────┐
     │ esclavo1 │  │ esclavo2 │   solo lectura
     └────┬─────┘  └──────────┘
     ┌────▼─────┐
     │ esclavo3 │   solo lectura (réplica en cadena)
     └──────────┘
```

La práctica se plantea con la **replicación por flujo** (*streaming replication*) de PostgreSQL.

::: tip Montaje de los nodos
Puedes usar **una máquina virtual por nodo** (es lo más parecido a la realidad) o **varios clústeres de PostgreSQL en la misma máquina**, cada uno en un puerto distinto. En Debian, Ubuntu y Linux Mint un clúster nuevo se crea con:

```bash
sudo pg_createcluster 16 nombre -p 5441 --start
pg_lsclusters
```

Repasa la página [Acceso y varios clústeres](/ut1/contenidos/postgresql/3-acceso-multicluster). Si usas máquinas distintas, recuerda abrir `listen_addresses` y añadir la regla correspondiente en `pg_hba.conf`.
:::

## Objetivos

- Configurar un nodo maestro y varios esclavos.
- Configurar una réplica en cadena.
- Supervisar el estado y el retraso de la replicación.
- Comprobar el efecto de la parada de cada nodo y promocionar un esclavo.

## Tareas

### Parte 1. El maestro

1. Crea el nodo `maestro` y, en él, la base de datos `tienda` con una tabla `pedidos` y algunas filas.
2. Comprueba los parámetros de los que depende la replicación (`wal_level`, `max_wal_senders`, `hot_standby`) y explica para qué sirve cada uno.
3. Crea un usuario **exclusivo para la replicación** y permite su conexión en `pg_hba.conf`.
4. Crea una **ranura de replicación** para cada esclavo directo. ¿Qué problema evita una ranura? ¿Qué riesgo introduce si un esclavo queda apagado mucho tiempo?

### Parte 2. Dos esclavos

5. Crea `esclavo1` y `esclavo2` a partir de una **copia base** del maestro y arráncalos.
6. Localiza en cada esclavo los ficheros que lo convierten en réplica y explica su contenido.
7. Comprueba en el maestro que los dos esclavos están conectados y en qué estado. Comprueba en un esclavo que está en modo de recuperación.
8. Inserta filas en el maestro y demuestra que aparecen en los dos esclavos.
9. Intenta insertar una fila **en un esclavo**. ¿Qué ocurre?
10. Averigua si la replicación es **síncrona o asíncrona**. Explica la diferencia y qué habría que cambiar para que `esclavo1` fuera síncrono.

### Parte 3. Réplica en cadena

11. Crea `esclavo3` de forma que replique **de `esclavo1`**, no del maestro. ¿Qué has tenido que preparar en `esclavo1`?
12. Demuestra que `esclavo3` recibe los datos desde `esclavo1`: consulta en `esclavo1` qué réplicas tiene conectadas y en `esclavo3` de qué servidor recibe.
13. Inserta filas en el maestro y comprueba que llegan a `esclavo3`.
14. ¿Qué ventaja tiene replicar en cadena en lugar de colgar todos los esclavos del maestro? ¿Y qué inconveniente?

### Parte 4. Parada de nodos

Realiza cada prueba partiendo del sistema completo en marcha y anota los resultados en una tabla: nodo parado, qué nodos siguen recibiendo cambios, qué se puede leer y qué se puede escribir.

15. **Parada de `esclavo2`** (una hoja). Inserta en el maestro. ¿Afecta al resto? Arráncalo y comprueba que se pone al día solo.
16. **Parada de `esclavo1`** (el nodo intermedio). Inserta en el maestro. ¿Qué le ocurre a `esclavo3`? ¿Puede seguir leyéndose? Consulta en el maestro el estado de la ranura de `esclavo1`. Arráncalo y comprueba que los dos se ponen al día.
17. **Parada del maestro.** ¿Qué se puede hacer en los esclavos? ¿Qué aparece en sus ficheros de registro?
18. **Promoción.** Con el maestro parado, promociona `esclavo2` a maestro. Demuestra que ya acepta escrituras. ¿Qué ha pasado con `esclavo1` y `esclavo3`: siguen al nuevo maestro?
19. Explica qué habría que hacer para que `esclavo1` siguiera al nuevo maestro y qué ocurriría si el maestro antiguo volviera a arrancarse sin más (dos nodos aceptando escrituras).

### Parte 5. Conclusiones

20. Con la tabla de resultados, explica qué **disponibilidad** ofrece este montaje para las lecturas y para las escrituras, y qué faltaría para que el cambio de maestro fuera automático.
21. Compara la replicación con la base de datos distribuida de las prácticas anteriores: ¿qué problema resuelve cada una?

## Orientaciones

```sql
-- En el maestro
CREATE ROLE replicador WITH REPLICATION LOGIN PASSWORD '...';
SELECT pg_create_physical_replication_slot('esclavo1');

-- Estado de la replicación
SELECT application_name, client_addr, state, sync_state, replay_lsn FROM pg_stat_replication;  -- en el nodo que envía
SELECT status, sender_host, sender_port FROM pg_stat_wal_receiver;                             -- en el nodo que recibe
SELECT slot_name, active, restart_lsn FROM pg_replication_slots;
SELECT pg_is_in_recovery();
```

```bash
# Crear un esclavo a partir de una copia base (el directorio de datos debe estar vacío)
sudo pg_createcluster 16 esclavo1 -p 5442
sudo rm -rf /var/lib/postgresql/16/esclavo1
sudo -u postgres pg_basebackup -h 127.0.0.1 -p 5441 -U replicador \
     -D /var/lib/postgresql/16/esclavo1 -R -X stream -S esclavo1 -P
sudo pg_ctlcluster 16 esclavo1 start

# Parar, arrancar y promocionar
sudo pg_ctlcluster 16 esclavo1 stop
sudo pg_ctlcluster 16 esclavo2 promote
```

- La opción `-R` de `pg_basebackup` crea el fichero `standby.signal` y escribe la conexión con el origen (`primary_conninfo`) en `postgresql.auto.conf`.
- En `pg_hba.conf`, las conexiones de replicación se autorizan con una línea cuya base de datos es `replication`. En una instalación de Debian o Ubuntu, las conexiones desde `127.0.0.1` ya están permitidas; entre máquinas distintas tendrás que añadir la red.
- Para la réplica en cadena, la copia base se hace **desde `esclavo1`** (su puerto) y la ranura se crea **en `esclavo1`**.
- Cada clúster de Debian tiene su propio `pg_hba.conf` en `/etc/postgresql/16/nombre/`: no se copia con la copia base.
- Los ficheros de registro están en `/var/log/postgresql/`.

::: info ¿Y con Oracle?
La replicación física de Oracle (Data Guard) requiere la edición Enterprise, por lo que no puede hacerse con la edición gratuita. Como ampliación, puedes replicar una tabla entre dos PDB con una **vista materializada** sobre un enlace de base de datos que se refresque de forma periódica, y comparar ese mecanismo con el de esta práctica.
:::

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA6** (*Aplica criterios de disponibilidad analizándolos y ajustando la configuración del sistema gestor.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **6.e** | Se ha configurado un «nodo» maestro y varios «esclavos» para llevar a cabo la replicación del primero. | El maestro y los dos esclavos directos funcionan: los cambios del maestro llegan a los esclavos y estos son de solo lectura. |
| **6.f** | Se ha configurado un sistema de replicación en cadena. | La réplica en cadena funciona y demuestra que recibe los cambios a través del esclavo intermedio. |
| **6.g** | Se ha comprobado el efecto de la parada de determinados nodos sobre los sistemas distribuidos y replicados. | Documenta en una tabla el efecto de parar cada nodo (hoja, intermedio y maestro) y realiza la promoción de un esclavo. |
| **6.a** | Se ha reconocido la utilidad de las bases de datos distribuidas. | Explica qué disponibilidad aporta el montaje y lo compara con la base de datos distribuida. |

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

<small>Práctica de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
