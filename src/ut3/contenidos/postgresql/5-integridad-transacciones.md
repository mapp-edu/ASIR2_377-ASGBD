---
layout: doc
title: "PostgreSQL: integridad y transacciones"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: integridad y transacciones

## 🧬 Integridad en bases de datos PostgreSQL

### 📘 ¿Qué es la integridad?

La **integridad** de una base de datos hace referencia al conjunto de normas y restricciones que garantizan que los datos almacenados sean **coherentes, correctos y fiables**. Esta integridad es fundamental para garantizar la **calidad de la información** y el correcto funcionamiento de las aplicaciones que la utilizan.

### Tipos de integridad

- **Integridad de entidad** → cada fila debe ser identificable de forma única (clave primaria)
- **Integridad referencial** → asegura la coherencia entre tablas relacionadas (claves foráneas)
- **Integridad de dominio** → los datos deben cumplir ciertos valores o formatos (tipos de datos, CHECK...)
- **Integridad de usuario** → validaciones de aplicación o de negocio impuestas por el usuario o la aplicación

### Integridad de entidad

Se garantiza mediante el uso de `PRIMARY KEY`, que asegura que cada fila sea única y no nula.

```sql
CREATE TABLE alumnes (
  id NUMBER PRIMARY KEY,
  nom VARCHAR2(50)
);
```

### Integridad referencial

Mantiene la coherencia entre dos tablas relacionadas mediante una `FOREIGN KEY`. Evita que una fila haga referencia a un valor inexistente.

```sql
CREATE TABLE cursos (
  id integer PRIMARY KEY,
  nom VARCHAR(50)
);

CREATE TABLE alumnes (
  id INTEGER PRIMARY KEY,
  nom VARCHAR(50),
  id_curs INTEGER,
  FOREIGN KEY (id_curs) REFERENCES cursos(id)
);
```

Permisos necesarios en PostgreSQL: CREATE y REFERENCES

```sql
GRANT CREATE ON SCHEMA public TO usuari;
GRANT REFERENCES ON cursos TO usuari;
GRANT REFERENCES (id) ON cursos TO usuari;  -- Más restrictivo
```

Con esto, no se puede asignar a un alumno un `id_curs` que no exista en la tabla `cursos`.

### Integridad de dominio

Limita los valores permitidos en una columna. Se puede implementar con tipos de datos y restricciones `NOT NULL`, `CHECK` o `DEFAULT`.

```sql
CREATE TABLE alumnes (
  id INTEGER PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  edat INTEGER CHECK (edat >= 16),
  pais VARCHAR(30) DEFAULT 'España'
);
```

Esto garantiza que `nom` siempre tendrá valor, que `edat` será ≥ 16 y que `pais` tendrá un valor por defecto.

### Integridad de usuario

No se implementa a nivel de base de datos, sino mediante aplicaciones o triggers. Controla normas específicas como:

- Un usuario no puede tener dos reservas activas
- Los horarios de un aula no pueden solaparse

Este tipo de integridad a menudo se basa en `PL/pgSQL` o en lógica de negocio en la aplicación.

### Conclusión

Mantener la integridad de los datos es esencial para garantizar que el sistema sea **fiable, coherente y funcional**. PostgreSQL ofrece múltiples mecanismos para implementar la integridad a nivel físico, lógico y de aplicación.

> 🔐 «La seguridad empieza con la confianza en los datos. Y la confianza se construye con integridad.»

## Transacciones en PostgreSQL

### 📘 ¿Qué es una transacción?

Una **transacción** es una secuencia de operaciones SQL (normalmente de manipulación de datos: `INSERT`, `UPDATE`, `DELETE`) que se tratan como una **unidad indivisible de trabajo**. El objetivo de una transacción es asegurar que los datos se mantengan **coherentes** e **íntegros**.

Una transacción o se hace entera o no se hace nada, pero en ningún caso puede quedar a medias, con una parte hecha y otra no.

Todas las operaciones que forman parte de ella deben completarse correctamente. Si alguna falla, ninguna de las demás debe tener efecto.

Los interbloqueos (**deadlocks**) son un problema que las transacciones y los mecanismos de control de concurrencia intentan evitar o gestionar

Un interbloqueo ocurre cuando dos o más transacciones se bloquean mutuamente, cada una esperando un recurso (normalmente un registro o una tabla) que la otra tiene bloqueado. Como ninguna puede continuar, todas quedan paradas indefinidamente (y además afectan al resto de sesiones)

```txt
Ejemplo sencillo:
    La transacción A tiene bloqueada la fila 1 y quiere la fila 2.
    La transacción B tiene bloqueada la fila 2 y quiere la fila 1.
Ninguna puede continuar → deadlock
```

### Propiedades de una transacción (ACID)

- **Atomicidad:** se ejecutan todas las operaciones o ninguna (todo o nada)
- **Consistencia:** deja la BD en un estado válido después de completarse
- **Aislamiento:** cada transacción se ejecuta como si fuera la única
- **Durabilidad:** una vez hecha la transacción, los cambios son permanentes

### Órdenes básicas de control de transacciones

PostgreSQL es un sistema de base de datos puramente transaccional

```sql
-- Para indicar que empieza una transacción
BEGIN;
```

❓ ¿Qué pasa si NO pones BEGIN? PostgreSQL activa el modo autocommit por defecto → cada sentencia SQL es una transacción implícita...

```sql
-- PostgreSQL hace automáticamente:
BEGIN;
<tu sentencia>
COMMIT;
```

En una transacción, los datos modificados **no son visibles** para el resto de usuarios hasta que se confirma la transacción

#### `COMMIT`

Hace permanentes todos los cambios realizados en la transacción. **No se pueden deshacer después**. En este momento los datos modificados ya son visibles para el resto de usuarios.

```sql
BEGIN;
INSERT INTO alumnes VALUES (10, 'Joan', 20);
COMMIT;
```

Las sentencias de finalización de transacción son COMMIT y ROLLBACK

#### `ROLLBACK`

Deshace todos los cambios realizados desde el último `COMMIT`. Devuelve la BD al estado en que estaba antes.

```sql
BEGIN;
UPDATE alumnes SET edat = 30 WHERE id = 10;
ROLLBACK; -- Anula la actualización
```

#### `SAVEPOINT`

Permite definir puntos intermedios dentro de una transacción para hacer un `ROLLBACK` parcial.

```sql
BEGIN;
SAVEPOINT punt1;
DELETE FROM alumnes WHERE edat < 18;

SAVEPOINT punt2;
UPDATE alumnes SET nom = 'Anónimo' WHERE edat > 25;

ROLLBACK TO punt1; -- deshace solo hasta punt1
```

### Transacciones automáticas y manuales

En PostgreSQL, ninguna sentencia SQL normal (INSERT, UPDATE, CREATE TABLE, etc.) hace ❌ COMMIT implícito dentro de una transacción

```sql
BEGIN;
CREATE TABLE prova (id int);
ROLLBACK;
```

Resultado: la tabla NO existe. El DDL es totalmente transaccional (a diferencia de Oracle)

⚠️ Excepciones (IMPORTANTE): algunas instrucciones NO pueden ir dentro de una transacción, como por ejemplo `CREATE DATABASE test;` y otras como `TABLESPACE, CLUSTER, ALTER SYSTEM`

### Relación con la seguridad

Una gestión cuidadosa de las transacciones garantiza:

- Trazabilidad y reversibilidad en caso de error
- Integridad ante fallos del sistema
- Registro coherente en conjunción con la auditoría

---

PostgreSQL tiene mecanismos para detectar **deadlocks** de manera automática. Cuando detecta que dos transacciones no pueden continuar, aborta una de las dos y devuelve un error:

La transacción que PostgreSQL suele abortar es la que lleva menos trabajo hecho (la que ha modificado menos datos), también conocida como la «victim transaction», para minimizar la pérdida de trabajo.

```txt
ERROR: deadlock detected
```

Así, al menos una puede continuar y el sistema no queda bloqueado.

Cuando PostgreSQL mata una transacción por deadlock, se deshace la parte que llevaba hecha (rollback), manteniendo la coherencia.

### Conclusión

El control de transacciones es una herramienta fundamental para garantizar que el sistema de base de datos sea **seguro, coherente y robusto**. PostgreSQL proporciona instrucciones claras para controlar de forma manual y segura la ejecución de cambios en los datos.

---

### Ejemplo (ver una transacción sin completar)

Abrimos 2 sesiones (en SQL\*Plus) con usuari1 (dos cmd diferentes)

```txt
En la primera sesión (1.er CMD)
postgres=# BEGIN;
postgres=# insert into prueba10 (id, nom) values (1000,'valor1');
1 row created.
```

```txt
En la segunda sesión  (2.º CMD)
postgres=# BEGIN
postgres=# select count(*) from prueba10;
COUNT(*)
----------
0
```

```txt
En la primera sesión (1.er CMD)
postgres=# commit;
```

```txt
En la segunda sesión (2.º CMD)
postgres=# select count(*) from prueba10;
COUNT(*)
----------
1
```

---

#### Ejemplo (de deadlock)

Supongamos que tenemos una tabla:

```sql
CREATE TABLE comptes (
    id INTEGER PRIMARY KEY,
    saldo INTEGER
    );
```

y dos filas

```sql
INSERT INTO comptes VALUES (1, 100);
INSERT INTO comptes VALUES (2, 200);
COMMIT;
```

Abre dos sesiones SQL diferentes, sesión A y sesión B

```sql
Sesión A
  -- Bloquea la fila con id = 1
BEGIN;
UPDATE comptes SET saldo = saldo + 10 WHERE id = 1;

Sesión B
  -- Bloquea la fila con id = 2
BEGIN;
UPDATE comptes SET saldo = saldo + 20 WHERE id = 2;

  -- SESIÓN A intenta coger la fila que tiene B
UPDATE comptes SET saldo = saldo - 5 WHERE id = 2;
  -- → A queda esperando, porque B tiene bloqueada la fila 2.

  -- SESIÓN B intenta coger la fila que tiene A
UPDATE comptes SET saldo = saldo - 5 WHERE id = 1;
  -- → B queda esperando, porque A tiene bloqueada la fila 1.

-- Y aquí es donde PostgreSQL detecta el deadlock
-- PostgreSQL rompe el bloqueo y da error a una de las dos sesiones
-- ¿Cómo decide? Elige la transacción «más barata» de cancelar, normalmente la que ha hecho menos trabajo

ERROR:  se ha detectado un deadlock
DETAIL:  El proceso 19300 espera ShareLock en transacción 794; bloqueado por proceso 14856.
El proceso 14856 espera ShareLock en transacción 795; bloqueado por proceso 19300.
HINT:  Vea el registro del servidor para obtener detalles de las consultas.
CONTEXT:  mientras se actualizaba la tupla (0,1) en la relación «comptes»
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
