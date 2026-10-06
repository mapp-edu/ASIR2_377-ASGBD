---
layout: doc
title: "PostgreSQL: disparadores y secuencias"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: disparadores y secuencias

## 🚨 Disparadores (triggers) en PostgreSQL

### 📘 ¿Qué es un trigger?

Un **trigger** es un bloque de código PL/pgSQL que se ejecuta automáticamente cuando se produce un **evento** (como un INSERT, UPDATE o DELETE) sobre una tabla o vista.

Un trigger en PostgreSQL no se puede llamar manualmente como una función o un procedimiento. Siempre se ejecuta automáticamente cuando ocurre un evento.

### El bloque de código del trigger se ejecutará:

- **BEFORE**: antes del evento
- **AFTER**: después del evento

Según el caso, dentro del bloque de código se pueden utilizar los valores de una fila antes o después de la operación. <br> Para ello se usará `NEW.` o `OLD.`

### Niveles de actuación

- **Fila a fila** → actúa por cada fila afectada (se indica poniendo FOR EACH ROW)
- **Por evento** → actúa una sola vez por operación (se indica no poniendo nada)

### Sintaxis básica (fila a fila)

```sql
-- 1. Crear la función del trigger
CREATE OR REPLACE FUNCTION log_alumne_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO log_alumnes(alumne_id, nom, data_insert)
    VALUES (NEW.id, NEW.nom, now());
    RETURN NEW;  -- IMPORTANTE: RETURN NEW para triggers BEFORE/AFTER INSERT
END;
$$;

-- 2. Crear el trigger. Auditoría --
CREATE TRIGGER trg_alumne_insert
AFTER INSERT ON alumnes
FOR EACH ROW
EXECUTE FUNCTION log_alumne_insert();
```

En los triggers BEFORE, si devuelves `RETURN NULL;` 👉 se cancela la operación (no se inserta / no se actualiza / no se elimina)

Hay que devolver: <br> BEFORE DELETE → RETURN OLD; <br> BEFORE INSERT → RETURN NEW; <br> BEFORE UPDATE → RETURN NEW; <br> En el resto no importa; se puede devolver NULL

### Ejemplo: trigger para impedir valores cortos

```sql
CREATE OR REPLACE FUNCTION check_nom_length()
RETURNS TRIGGER AS $$
BEGIN
    IF char_length(NEW.nom) < 3 THEN
        RAISE EXCEPTION 'El nombre debe tener al menos 3 caracteres';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_nom    -- Impide actualizar si no se cumple la condición
BEFORE UPDATE ON alumnes
FOR EACH ROW
EXECUTE FUNCTION check_nom_length();
```

`NEW.` y `OLD.` representan los valores nuevos y antiguos, respectivamente, de cada fila.

---

### 📘 Consultas útiles al DD

```sql
SELECT trigger_name,
       event_manipulation AS event,
       event_object_table AS table_name,
       action_timing AS timing,
       action_statement AS function_call
FROM information_schema.triggers
WHERE trigger_schema = 'public';  -- pon el esquema que te interese
```

### Buenas prácticas

- Usa nombres claros y una descripción funcional
- Documenta el comportamiento del trigger
- Evita código complejo o acciones que modifiquen otras tablas si no es necesario
- Controla el rendimiento: demasiados triggers pueden degradar la eficiencia
- Si hay que registrar acciones, usa una tabla de auditoría

### 🛠️ Activación y desactivación de triggers

```sql
-- Desactivar un trigger concreto
ALTER TABLE nom_taula DISABLE TRIGGER nom_trigger;

-- Activar un trigger concreto
ALTER TABLE nom_taula ENABLE TRIGGER nom_trigger;
```

```sql
-- Desactivar todos los triggers de la tabla
ALTER TABLE alumnes DISABLE TRIGGER ALL;

-- Volver a activar todos los triggers
ALTER TABLE alumnes ENABLE TRIGGER ALL;
```

### 🗑️ Eliminar un trigger

```sql
DROP TRIGGER log_insercio ON nom_taula;
```

La función asociada (log_alumne_insert()) no se borra automáticamente; solo el trigger.

```sql
-- Si quieres eliminar también la función del trigger (por limpieza)
DROP FUNCTION log_alumne_insert();
```

## Secuencias en PostgreSQL

### 📘 ¿Qué es una secuencia?

Una **secuencia** es un objeto de base de datos que genera una serie de valores numéricos consecutivos, normalmente usados para claves primarias, códigos únicos o control de identificadores. Es el equivalente a un *autoincrement* en otros SGBD.

### Crear una secuencia

```sql
-- Dar permiso a un usuario para crear secuencias (crear objetos)
GRANT CREATE ON DATABASE empresa TO usuari;

-- Crear la secuencia
CREATE SEQUENCE seq_alumnes
    START 1        -- valor inicial
    INCREMENT 1    -- incremento
    MINVALUE 1     -- mínimo valor posible
    MAXVALUE 10000 -- máximo valor (opcional)
    CACHE 1;       -- opcional, por rendimiento

-- Borrar la secuencia
DROP SEQUENCE seq_alumnes;
```

### Uso de la secuencia

Para obtener el siguiente valor (se puede usar en los INSERT):

```txt
NEXTVAL('seq_alumnes')
```

Para consultar el valor actual (después de haber hecho NEXTVAL como mínimo una vez):

```txt
CURRVAL('seq_alumnes')
```

#### Ejemplo de uso en una inserción

```sql
INSERT INTO alumnes (id, nom, edat)  VALUES (NEXTVAL('seq_alumnes'), 'Laia', 21);
```

### 📘 Consultar las secuencias existentes

```sql
SELECT sequence_name
FROM information_schema.sequences
WHERE sequence_schema = 'public';  -- pon el esquema deseado
```

```sql
SELECT * FROM pg_sequences WHERE schemaname='public';
```

### 🗑️ Eliminar una secuencia

```sql
DROP SEQUENCE seq_alumnes;
```

### Ejemplo completo

```sql
CREATE SEQUENCE seq_factura START WITH 1000 INCREMENT BY 10 ;
-- Inserción con NEXTVAL
INSERT INTO factures (id, data_emissio) VALUES (NEXTVAL('seq_factura'), now() );
```

---

### Identity column

Una **identity column** es otro mecanismo de PostgreSQL para generar valores enteros secuenciales únicos y asignarlos a campos numéricos; se utilizan generalmente para las claves primarias de las tablas, garantizando que sus valores no se repitan.

```sql
CREATE TABLE alumnes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom TEXT,
  .......);
```

GENERATED ALWAYS AS IDENTITY → PostgreSQL genera automáticamente el valor y no permite insertar manualmente un valor en la columna. GENERATED BY DEFAULT AS IDENTITY → permite sobrescribir manualmente el valor si hace falta.

| Característica | SEQUENCE | IDENTITY Column |
| --- | --- | --- |
| **Definición** | Objeto independiente que genera valores numéricos secuenciales. | Columna de una tabla que genera automáticamente valores únicos. |
| **Uso principal** | Generar claves primarias o valores secuenciales a voluntad. | Generar automáticamente un valor único para cada fila nueva. |
| **Cómo se utiliza** | Hay que llamar a `nextval('nom_seq')` explícitamente en la inserción. | PostgreSQL gestiona el valor automáticamente (con `GENERATED ALWAYS` o `BY DEFAULT`). |
| **Control del valor** | El usuario decide cuándo y cómo consumir el siguiente valor. | El valor se incrementa automáticamente con cada inserción (según la configuración). |
| **Flexibilidad** | Muy flexible: puede ser utilizada por diferentes tablas o procesos. | Está ligada a una sola tabla y columna. |
| **Ejemplo de creación** | `CREATE SEQUENCE seq_client_id START WITH 1 INCREMENT BY 1;` | `id int GENERATED BY DEFAULT AS IDENTITY` |
| **Compartición entre tablas** | Se puede usar en múltiples tablas. | Solo se puede usar en una tabla específica. |

### Consultar información de las identity columns

```sql
SELECT table_name, column_name, identity_generation, identity_start, identity_increment
FROM information_schema.columns
WHERE identity_generation IS NOT NULL;
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
