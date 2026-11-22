---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 2: selección del motor de almacenamiento"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 2: selección del motor de almacenamiento

::: tip Solución de referencia
Resolución de referencia de la [Práctica 2](../practica-2-motor-de-almacenamiento), con los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

Todas las salidas de este documento se han obtenido ejecutando las órdenes en **MariaDB 10.11** sobre Ubuntu 24.04 (la misma versión que instala Linux Mint 22). La parte 4 se ha comprobado en **PostgreSQL 16**.

## Parte 1. Motores disponibles

### 1. Motores disponibles y motor por defecto

```sql
SHOW ENGINES;
```

```txt
+--------------------+---------+----------------------------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                                          | Transactions | XA   | Savepoints |
+--------------------+---------+----------------------------------------------------------------------------------+--------------+------+------------+
| CSV                | YES     | Stores tables as CSV files                                                       | NO           | NO   | NO         |
| MRG_MyISAM         | YES     | Collection of identical MyISAM tables                                            | NO           | NO   | NO         |
| MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables                        | NO           | NO   | NO         |
| Aria               | YES     | Crash-safe tables with MyISAM heritage. Used for internal temporary tables ...   | NO           | NO   | NO         |
| MyISAM             | YES     | Non-transactional engine with good performance and small data footprint          | NO           | NO   | NO         |
| SEQUENCE           | YES     | Generated tables filled with sequential values                                   | YES          | NO   | YES        |
| InnoDB             | DEFAULT | Supports transactions, row-level locking, foreign keys and encryption for tables | YES          | YES  | YES        |
| PERFORMANCE_SCHEMA | YES     | Performance Schema                                                               | NO           | NO   | NO         |
+--------------------+---------+----------------------------------------------------------------------------------+--------------+------+------------+
```

- Motor por defecto: **InnoDB** (columna `Support = DEFAULT`).
- Admiten transacciones: **InnoDB** (y `SEQUENCE`, que es un motor especial que genera secuencias, no sirve para guardar datos).
- La lista puede variar según los paquetes instalados (por ejemplo, `ROCKSDB` o `CONNECT` si se han instalado sus *plugins*). Se acepta cualquier lista que coincida con la salida de su servidor.

### 2. Variable del motor por defecto y fichero de configuración

```sql
SHOW VARIABLES LIKE '%storage_engine%';
```

```txt
+----------------------------+--------+
| Variable_name              | Value  |
+----------------------------+--------+
| default_storage_engine     | InnoDB |
| default_tmp_storage_engine |        |
| enforce_storage_engine     |        |
| storage_engine             | InnoDB |
+----------------------------+--------+
```

- La variable es `default_storage_engine` (`storage_engine` es su sinónimo antiguo).
- Se cambia de forma permanente en `/etc/mysql/mariadb.conf.d/50-server.cnf`, sección `[mysqld]`.
- Para nivel 4: `enforce_storage_engine` obliga a usar un motor concreto e impide crear tablas con otro, y `default_tmp_storage_engine` afecta a las tablas `CREATE TEMPORARY TABLE`.

### 3. Base de datos `motores` y tres tablas

```sql
CREATE DATABASE motores;
USE motores;
CREATE TABLE t_innodb (id INT PRIMARY KEY, valor VARCHAR(20)) ENGINE=InnoDB;
CREATE TABLE t_myisam (id INT PRIMARY KEY, valor VARCHAR(20)) ENGINE=MyISAM;
CREATE TABLE t_memory (id INT PRIMARY KEY, valor VARCHAR(20)) ENGINE=MEMORY;
```

### 4. Motor de cada tabla y ficheros en el disco

```sql
SELECT table_name, engine, row_format
FROM   information_schema.tables
WHERE  table_schema = 'motores';
```

```txt
+------------+--------+------------+
| table_name | engine | row_format |
+------------+--------+------------+
| t_innodb   | InnoDB | Dynamic    |
| t_myisam   | MyISAM | Dynamic    |
| t_memory   | MEMORY | Fixed      |
+------------+--------+------------+
```

```bash
sudo ls -l /var/lib/mysql/motores/
```

```txt
-rw-rw---- 1 mysql mysql    67 db.opt
-rw-rw---- 1 mysql mysql  1029 t_innodb.frm
-rw-rw---- 1 mysql mysql 65536 t_innodb.ibd
-rw-rw---- 1 mysql mysql  1029 t_memory.frm
-rw-rw---- 1 mysql mysql     0 t_myisam.MYD
-rw-rw---- 1 mysql mysql  1024 t_myisam.MYI
-rw-rw---- 1 mysql mysql  1029 t_myisam.frm
```

| Extensión | Contenido |
|:---|:---|
| `.frm` | Definición de la tabla (todas, sea cual sea el motor). |
| `.ibd` | Datos e índices de una tabla InnoDB (un fichero por tabla, `innodb_file_per_table = ON`). |
| `.MYD` / `.MYI` | Datos (*MYData*) e índices (*MYIndex*) de una tabla MyISAM. |
| *(nada)* | La tabla MEMORY solo tiene `.frm`: sus datos están en la RAM. |
| `db.opt` | Juego de caracteres y colación por defecto de la base de datos. |

El directorio de datos se confirma con `SELECT @@datadir;` → `/var/lib/mysql/`.

## Parte 2. Pruebas

### 5. Transacciones

```sql
START TRANSACTION;
INSERT INTO t_innodb VALUES (1, 'innodb');
INSERT INTO t_myisam VALUES (1, 'myisam');
ROLLBACK;
SHOW WARNINGS;
```

```txt
+---------+------+---------------------------------------------------------------+
| Level   | Code | Message                                                       |
+---------+------+---------------------------------------------------------------+
| Warning | 1196 | Some non-transactional changed tables couldn't be rolled back |
+---------+------+---------------------------------------------------------------+
```

```sql
SELECT 'innodb' AS tabla, COUNT(*) FROM t_innodb
UNION ALL
SELECT 'myisam', COUNT(*) FROM t_myisam;
```

```txt
+--------+----------+
| tabla  | COUNT(*) |
+--------+----------+
| innodb |        0 |
| myisam |        1 |
+--------+----------+
```

Interpretación: el `ROLLBACK` deshace la fila de InnoDB, pero la de MyISAM ya estaba escrita en el disco en el momento del `INSERT`. MyISAM no sabe qué es una transacción, y el servidor avisa con el código 1196. En una operación que tocara las dos tablas (por ejemplo, un pedido y sus líneas), un fallo a mitad dejaría los datos **incoherentes**.

### 6. Integridad referencial

```sql
CREATE TABLE padre (id INT PRIMARY KEY) ENGINE=InnoDB;
INSERT INTO padre VALUES (1);

CREATE TABLE hija_innodb (
  id INT PRIMARY KEY, padre_id INT,
  FOREIGN KEY (padre_id) REFERENCES padre(id)
) ENGINE=InnoDB;

CREATE TABLE hija_myisam (
  id INT PRIMARY KEY, padre_id INT,
  FOREIGN KEY (padre_id) REFERENCES padre(id)
) ENGINE=MyISAM;
SHOW WARNINGS;        -- vacío: MariaDB acepta la sintaxis sin avisar

INSERT INTO hija_innodb VALUES (1, 99);
INSERT INTO hija_myisam VALUES (1, 99);
```

```txt
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
(`motores`.`hija_innodb`, CONSTRAINT `hija_innodb_ibfk_1` FOREIGN KEY (`padre_id`) REFERENCES `padre` (`id`))

Query OK, 1 row affected        -- hija_myisam: se inserta una fila huérfana
```

La prueba que demuestra la diferencia está en el diccionario de datos:

```sql
SELECT table_name, constraint_name, referenced_table_name
FROM   information_schema.referential_constraints
WHERE  constraint_schema = 'motores';
```

```txt
+-------------+--------------------+-----------------------+
| table_name  | constraint_name    | referenced_table_name |
+-------------+--------------------+-----------------------+
| hija_innodb | hija_innodb_ibfk_1 | padre                 |
+-------------+--------------------+-----------------------+
```

Con MyISAM la cláusula `FOREIGN KEY` se analiza y **se descarta en silencio**: no queda registrada y no se comprueba. Es un error frecuente que el alumnado crea que la clave existe porque la sentencia no dio error.

### 7. Persistencia

```sql
INSERT INTO t_innodb VALUES (1,'a'), (2,'b'), (3,'c');
INSERT INTO t_myisam VALUES (1,'a'), (2,'b'), (3,'c');
INSERT INTO t_memory VALUES (1,'a'), (2,'b'), (3,'c');
```

```bash
sudo systemctl restart mariadb
```

```sql
SELECT 't_innodb' AS tabla, COUNT(*) AS filas FROM t_innodb
UNION ALL SELECT 't_myisam', COUNT(*) FROM t_myisam
UNION ALL SELECT 't_memory', COUNT(*) FROM t_memory;
```

```txt
+----------+-------+
| tabla    | filas |
+----------+-------+
| t_innodb |     3 |
| t_myisam |     3 |
| t_memory |     0 |
+----------+-------+
```

La tabla MEMORY conserva su **estructura** (el `.frm` sigue en el disco), pero pierde los **datos** al reiniciar.

Antes de esta prueba hay que vaciar `t_myisam` (`DELETE FROM t_myisam;`): conserva la fila del paso 5 y el `INSERT` fallaría por clave duplicada (`ERROR 1062`). Es un tropiezo habitual que conviene ver documentado.

Para nivel 4: tras un reinicio **limpio** InnoDB y MyISAM conservan los datos. La diferencia entre ellos aparece ante una **caída** (corte de luz, `kill -9`): InnoDB se recupera con su registro de *redo* (como el WAL de PostgreSQL o el *redo log* de Oracle), mientras que una tabla MyISAM puede quedar marcada como dañada y necesitar `REPAIR TABLE`.

### 8. Bloqueos

**Sesión 1:**

```sql
USE motores;
START TRANSACTION;
UPDATE t_innodb SET valor = 'sesion1' WHERE id = 1;
-- sin COMMIT
```

**Sesión 2:**

```sql
USE motores;
UPDATE t_innodb SET valor = 'sesion2' WHERE id = 2;   -- se ejecuta al instante
UPDATE t_innodb SET valor = 'sesion2' WHERE id = 1;   -- se queda esperando
```

Mientras espera, desde una tercera sesión:

```sql
SELECT requesting_trx_id, blocking_trx_id FROM information_schema.innodb_lock_waits;
SELECT id, state, info FROM information_schema.processlist WHERE db = 'motores';
```

```txt
+-------------------+-----------------+
| requesting_trx_id | blocking_trx_id |
+-------------------+-----------------+
|                79 |              76 |
+-------------------+-----------------+
+----+------------+------------------------------------------------+
| id | state      | info                                           |
+----+------------+------------------------------------------------+
| 37 | Updating   | UPDATE t_innodb SET valor='sesion2' WHERE id=1 |
| 36 | Sleep      |                                                |
+----+------------+------------------------------------------------+
```

Si la sesión 1 no confirma ni deshace, a los 50 segundos (`innodb_lock_wait_timeout`) la sesión 2 recibe:

```txt
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

Si la sesión 1 hace `COMMIT` o `ROLLBACK` antes, la sesión 2 continúa inmediatamente.

Interpretación: InnoDB bloquea **por fila**. Las dos sesiones pueden modificar filas distintas a la vez; solo esperan cuando coinciden en la misma.

**MyISAM** bloquea **la tabla entera**. Se puede comprobar con una consulta larga sobre `t_myisam` en una sesión y un `UPDATE` de cualquier fila en otra:

```sql
-- Sesión 1
SELECT COUNT(*) FROM t_myisam WHERE SLEEP(4) = 0;
-- Sesión 2, a la vez
UPDATE t_myisam SET valor = 'x' WHERE id = 3;
```

```txt
+----+------------------------------+------------------------------------------------+
| id | state                        | info                                           |
+----+------------------------------+------------------------------------------------+
| 41 | Waiting for table level lock | UPDATE t_myisam SET valor='x' WHERE id=3       |
| 40 | User sleep                   | SELECT COUNT(*) FROM t_myisam WHERE SLEEP(4)=0 |
+----+------------------------------+------------------------------------------------+
```

En una tabla con muchas escrituras simultáneas, cada escritura espera a que termine la anterior (y a que terminen las lecturas en curso): las operaciones se ejecutan una detrás de otra y el rendimiento cae con el número de usuarios. El contador `SHOW GLOBAL STATUS LIKE 'Table_locks_waited'` aumenta cada vez que ocurre.

## Parte 3. Selección

### 9. Motor para cada tabla

| Tabla | Motor | Justificación |
|:---|:---|:---|
| `pedidos` | **InnoDB** | Necesita transacciones (paso 5), claves foráneas hacia clientes y productos (paso 6), recuperación ante caídas (paso 7) y bloqueo por fila para muchas escrituras simultáneas (paso 8). |
| `sesiones_web` | **MEMORY** | Datos temporales que se pueden perder y se leen y escriben muchas veces: la RAM es lo más rápido. Limitaciones: tamaño máximo `max_heap_table_size`, no admite `TEXT`/`BLOB` y bloquea la tabla entera. Con muchas escrituras concurrentes o datos grandes, InnoDB es una alternativa razonable. |
| `historico_2015` | **MyISAM** o **Aria** (o InnoDB comprimido) | Solo lectura: no se necesitan transacciones ni bloqueo por fila, y MyISAM ocupa menos. Aria es la evolución de MyISAM en MariaDB y resiste mejor las caídas. También se puede comprimir con `myisampack`. Elegir InnoDB por homogeneidad es igual de válido si se justifica. |
| `codigos_postales` | **InnoDB** | Pequeña y casi sin cambios: el motor apenas influye en el rendimiento y lo importante es que otras tablas (clientes, pedidos) puedan tener claves foráneas hacia ella, lo que exige InnoDB en las dos. |

::: tip Criterio de corrección
No hay una única respuesta correcta para `historico_2015` y `sesiones_web`. Lo que separa el nivel 2 del 3 en **2.b** es que cada elección se justifique con el resultado de **sus propias pruebas** (pasos 5 a 8) y no solo con teoría. Para el nivel 4, que mencione los límites de la opción elegida.
:::

### 10. Cambiar el motor de `t_myisam` sin perder los datos

```sql
SELECT COUNT(*) FROM t_myisam;            -- 3
ALTER TABLE t_myisam ENGINE = InnoDB;
SELECT table_name, engine FROM information_schema.tables
WHERE  table_schema = 'motores' AND table_name = 't_myisam';
SELECT * FROM t_myisam;
CHECK TABLE t_myisam;
```

```txt
+------------+--------+
| table_name | engine |
+------------+--------+
| t_myisam   | InnoDB |
+------------+--------+
+----+-------+
| id | valor |
+----+-------+
|  1 | a     |
|  2 | b     |
|  3 | x     |
+----+-------+
+------------------+-------+----------+----------+
| Table            | Op    | Msg_type | Msg_text |
+------------------+-------+----------+----------+
| motores.t_myisam | check | status   | OK       |
+------------------+-------+----------+----------+
```

En el disco, `t_myisam.MYD` y `t_myisam.MYI` desaparecen y aparece `t_myisam.ibd`. `ALTER TABLE ... ENGINE` copia la tabla al nuevo motor: con tablas grandes tarda y bloquea la tabla, así que en producción se planifica y se hace antes una copia de seguridad.

Para nivel 4: si se intentara convertir `hija_myisam` a InnoDB, la clave foránea **no** aparecería, porque se descartó al crearla; habría que añadirla con `ALTER TABLE ... ADD FOREIGN KEY`, y fallaría por la fila huérfana del paso 6 hasta corregirla.

### 11. Motor por defecto configurado en el servidor

El motor elegido para `pedidos` es InnoDB, que ya es el valor por defecto. La tarea pide **dejarlo configurado**, es decir, que no dependa del valor de compilación:

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

```ini
[mysqld]
default_storage_engine = InnoDB
```

```bash
sudo systemctl restart mariadb
my_print_defaults mysqld | grep engine      # --default_storage_engine=InnoDB
```

```sql
SELECT @@GLOBAL.default_storage_engine;      -- InnoDB
CREATE TABLE sin_motor (id INT PRIMARY KEY);
SHOW CREATE TABLE sin_motor\G
```

```txt
Create Table: CREATE TABLE `sin_motor` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
```

`my_print_defaults` demuestra que el valor sale del fichero y no del valor interno. `SET GLOBAL default_storage_engine = ...` también funciona, pero se pierde al reiniciar: no cumple la tarea.

## Parte 4. ¿Y en Oracle y PostgreSQL?

### 12. Motor de almacenamiento en Oracle y PostgreSQL

Ninguno de los dos permite elegir el motor tabla a tabla como MariaDB: los dos tienen un **único motor transaccional** que siempre ofrece transacciones, integridad referencial y recuperación ante caídas. Lo que se elige es **cómo se organiza o se registra** cada tabla.

**PostgreSQL**

```sql
SELECT amname, amtype FROM pg_am ORDER BY amtype, amname;
```

```txt
 amname | amtype
--------+--------
 brin   | i
 btree  | i
 gin    | i
 gist   | i
 hash   | i
 spgist | i
 heap   | t
```

- `amtype = 't'`: métodos de acceso de **tabla**. De serie solo hay `heap`. Desde la versión 12 se pueden añadir otros con extensiones (`CREATE TABLE ... USING`), por ejemplo almacenamiento por columnas.
- `amtype = 'i'`: métodos de acceso de **índice**, estos sí elegibles en cada `CREATE INDEX ... USING`.
- Tablas **`UNLOGGED`**: no escriben en el WAL. Son más rápidas, pero no se replican y se **vacían tras una caída**. Comprobado en PostgreSQL 16: una tabla `UNLOGGED` con 100 filas mantuvo sus filas tras una parada `fast` y quedó con 0 tras una parada `immediate`. Sería la opción para `sesiones_web`.
- Tablas temporales (`CREATE TEMPORARY TABLE`): solo existen durante la sesión.

**Oracle**

- Tabla normal, organizada en montón (*heap*).
- **Tabla organizada por índice** (`ORGANIZATION INDEX`): los datos se guardan dentro del índice de la clave primaria; útil para tablas que se consultan casi siempre por la clave, como `codigos_postales`.
- Otras organizaciones: **tablas externas** (`ORGANIZATION EXTERNAL`, ficheros de texto leídos como tablas), *clusters*, tablas temporales globales y particionamiento.
- Opciones de almacenamiento por tabla o tablespace: `NOLOGGING`, compresión (`COMPRESS`) y tablespaces de solo lectura (`ALTER TABLESPACE ... READ ONLY`), que encajaría con `historico_2015`.

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **2.b** | Elige motores sin justificar o con errores (por ejemplo, MyISAM para `pedidos`). | Elige un motor adecuado para las cuatro tablas. | Justifica cada elección con el resultado de sus pruebas. | Además, señala los límites de cada opción y la relaciona con Oracle y PostgreSQL. |
| **2.f** | Cambia el motor solo con `SET GLOBAL` o no lo demuestra. | Configura `default_storage_engine` en `50-server.cnf` y crea una tabla sin motor que lo usa. | Explica por qué el cambio es permanente y lo comprueba tras reiniciar. | Además, convierte la tabla MyISAM sin pérdida y comprueba ficheros y diccionario. |
| **2.h** | Faltan pruebas o solo hay capturas sin explicación. | Las cuatro pruebas con órdenes y salida. | Interpreta cada salida (aviso 1196, FK descartada, MEMORY vacía, espera de bloqueo). | Documento claro, con los errores encontrados (fila de prueba que queda en MyISAM, FK que «parece» creada) y la explicación de la diferencia entre reinicio y caída. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
