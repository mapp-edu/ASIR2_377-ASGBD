---
layout: doc
title: "Oracle: integridad y transacciones"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: integridad y transacciones

## 🧬 Integridad en bases de datos Oracle

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
  id NUMBER PRIMARY KEY,
  nom VARCHAR2(50)
);

CREATE TABLE alumnes (
  id NUMBER PRIMARY KEY,
  nom VARCHAR2(50),
  id_curs NUMBER,
  FOREIGN KEY (id_curs) REFERENCES cursos(id)
);
```

Con esto, no se puede asignar a un alumno un `id_curs` que no exista en la tabla `cursos`.

### Integridad de dominio

Limita los valores permitidos en una columna. Se puede implementar con tipos de datos y restricciones `NOT NULL`, `CHECK` o `DEFAULT`.

```sql
CREATE TABLE alumnes (
  id NUMBER PRIMARY KEY,
  nom VARCHAR2(50) NOT NULL,
  edat NUMBER CHECK (edat >= 16),
  pais VARCHAR2(30) DEFAULT 'España'
);
```

Esto garantiza que `nom` siempre tendrá valor, que `edat` será ≥ 16 y que `pais` tendrá un valor por defecto.

### Integridad de usuario

No se implementa a nivel de base de datos, sino mediante aplicaciones o triggers. Controla normas específicas como:

- Un usuario no puede tener dos reservas activas
- Los horarios de un aula no pueden solaparse

Este tipo de integridad a menudo se basa en `PL/SQL` o en lógica de negocio en la aplicación.

### Conclusión

Mantener la integridad de los datos es esencial para garantizar que el sistema sea **fiable, coherente y funcional**. Oracle ofrece múltiples mecanismos para implementar la integridad a nivel físico, lógico y de aplicación.

> 🔐 «La seguridad empieza con la confianza en los datos. Y la confianza se construye con integridad.»

## Transacciones en Oracle

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

Oracle es un sistema de base de datos puramente transaccional, de tal forma que la instrucción BEGIN TRANSACTION no existe

En una transacción, los datos modificados **no son visibles** para el resto de usuarios hasta que se confirma la transacción

#### `COMMIT`

Hace permanentes todos los cambios realizados en la transacción. No se pueden deshacer después. En este momento los datos modificados ya son visibles para el resto de usuarios.

```sql
INSERT INTO alumnes VALUES (10, 'Joan', 20);
COMMIT;
```

Las sentencias de finalización de transacción son COMMIT y ROLLBACK

#### `ROLLBACK`

Deshace todos los cambios realizados desde el último `COMMIT`. Devuelve la BD al estado en que estaba antes.

```sql
UPDATE alumnes SET edat = 30 WHERE id = 10;
ROLLBACK; -- Anula la actualización
```

#### `SAVEPOINT`

Permite definir puntos intermedios dentro de una transacción para hacer un `ROLLBACK` parcial.

```sql
SAVEPOINT punt1;
DELETE FROM alumnes WHERE edat < 18;

SAVEPOINT punt2;
UPDATE alumnes SET nom = 'Anónimo' WHERE edat > 25;

ROLLBACK TO punt1; -- deshace solo hasta punt1
```

### Transacciones automáticas y manuales

- DDL: Oracle Server **ejecuta** un COMMIT implícito antes y después de cada instrucción DDL
- DCL: Oracle Server **ejecuta** un COMMIT implícito antes y después de cada sentencia DCL
- DML: estas sentencias no ejecutan un COMMIT implícito
- Llamadas a procedimientos o funciones: estas sentencias no ejecutan un COMMIT implícito
- ALTER SESSION y ALTER SYSTEM: estas sentencias no ejecutan un COMMIT implícito
- Los bloques `BEGIN` ... `END` no ejecutan un COMMIT implícito.

### Consejos prácticos

- Haz `COMMIT` solo cuando estés seguro de que la transacción ha ido bien
- Utiliza `SAVEPOINT` para controlar operaciones complejas
- Usa `ROLLBACK` siempre que detectes un error o un cambio involuntario
- En entornos multiusuario, la gestión correcta de las transacciones evita bloqueos e inconsistencias

### Relación con la seguridad

Una gestión cuidadosa de las transacciones garantiza:

- Trazabilidad y reversibilidad en caso de error
- Integridad ante fallos del sistema
- Registro coherente en conjunción con la auditoría

---

Oracle tiene mecanismos para detectar **deadlocks** de manera automática. Cuando detecta que dos transacciones no pueden continuar, aborta una de las dos y devuelve un error:

La transacción que Oracle suele abortar es la que lleva menos trabajo hecho (la que ha modificado menos datos), también conocida como la «victim transaction», para minimizar la pérdida de trabajo.

```txt
ORA-00060: deadlock detected while waiting for resource
```

Así, al menos una puede continuar y el sistema no queda bloqueado.

Cuando Oracle mata una transacción por deadlock, se deshace la parte que llevaba hecha (rollback), manteniendo la coherencia.

### Conclusión

El control de transacciones es una herramienta fundamental para garantizar que el sistema de base de datos sea **seguro, coherente y robusto**. Oracle proporciona instrucciones claras para controlar de forma manual y segura la ejecución de cambios en los datos.

---

### Ejemplo (ver una transacción sin completar)

Abrimos 2 sesiones (en SQL\*Plus) con usuari1 (dos cmd diferentes)

```txt
En la primera sesión (1.er CMD)
SQL> insert into prueba10 (id, nom) values (1000,'valor1');
1 row created.
```

```txt
En la segunda sesión  (2.º CMD)
SQL> select count(*) from prueba10;
COUNT(*)
----------
0
```

```txt
En la primera sesión (1.er CMD)
SQL> commit;
```

```txt
En la segunda sesión (2.º CMD)
SQL> select count(*) from prueba10;
COUNT(*)
----------
1
```

---

#### Ejemplo (de deadlock)

Supongamos que tenemos una tabla:

```sql
CREATE TABLE comptes (
    id NUMBER PRIMARY KEY,
    saldo NUMBER
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
UPDATE comptes SET saldo = saldo + 10 WHERE id = 1;
Sesión B
-- Bloquea la fila con id = 2
UPDATE comptes SET saldo = saldo + 20 WHERE id = 2;

-- SESSION A intenta coger la fila que tiene B
UPDATE comptes SET saldo = saldo - 5 WHERE id = 2;
-- → A queda esperando, porque B tiene bloqueada la fila 2.

SESSION B intenta coger la fila que tiene A
UPDATE comptes SET saldo = saldo - 5 WHERE id = 1;
-- → B queda esperando, porque A tiene bloqueada la fila 1.

-- Y aquí es donde Oracle detecta el deadlock
-- Oracle rompe el bloqueo y da error a una de las dos sesiones (normalmente la segunda que entra en el conflicto)
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
