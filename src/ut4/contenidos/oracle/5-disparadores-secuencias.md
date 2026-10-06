---
layout: doc
title: "Oracle: disparadores y secuencias"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: disparadores y secuencias

## 🚨 Disparadores (triggers) en Oracle

### 📘 ¿Qué es un trigger?

Un **trigger** es un bloque de código PL/SQL que se ejecuta automáticamente cuando se produce un **evento** (como un INSERT, UPDATE o DELETE) sobre una tabla o vista.

### El bloque de código del trigger se ejecutará:

- **BEFORE**: antes del evento
- **AFTER**: después del evento
- **INSTEAD OF**: para vistas; sustituye a la acción

Según el caso, se pueden utilizar los valores de una fila antes o después de la operación. Para ello se usará `:NEW` o `:OLD`

### Niveles de actuación

- **Fila a fila** → actúa por cada fila afectada (se indica poniendo FOR EACH ROW)
- **Por evento** → actúa una sola vez por operación (se indica no poniendo nada)

### Sintaxis básica (fila a fila)

```sql
CREATE OR REPLACE TRIGGER nom_trigger
BEFORE INSERT OR UPDATE OR DELETE
ON nom_taula
FOR EACH ROW
BEGIN
   -- acciones con :NEW y :OLD
END;
```

### 🧪 Ejemplo: trigger de control de INSERT

```sql
CREATE OR REPLACE TRIGGER log_insercio
AFTER INSERT ON alumnes
FOR EACH ROW
BEGIN
   DBMS_OUTPUT.PUT_LINE('Nuevo registro añadido: ' || :NEW.nom);
END;
```

`:NEW` y `:OLD` representan los valores nuevos y antiguos, respectivamente, de cada fila.

### Ejemplo: trigger para impedir valores negativos

```sql
CREATE OR REPLACE TRIGGER evitar_negatius
BEFORE INSERT OR UPDATE ON productes
FOR EACH ROW
BEGIN
   IF :NEW.preu < 0 THEN
      RAISE_APPLICATION_ERROR(-20001, 'El precio no puede ser negativo');
   END IF;
END;
```

- RAISE_APPLICATION_ERROR es un procedimiento de PL/SQL que sirve para lanzar un error personalizado dentro de una aplicación o procedimiento. Cuando se quiere detener la ejecución y mostrar un mensaje de error claro y específico en tu código, se utiliza `RAISE_APPLICATION_ERROR`. Es muy útil para validar datos o controlar condiciones especiales

  ```txt
  RAISE_APPLICATION_ERROR(error_number, message[, {TRUE | FALSE}]);
  ```

  - error_number → un número de error entre -20000 y -20999 (Oracle reserva estos códigos para errores definidos por el usuario).
  - message → el mensaje que quieres mostrar cuando ocurre el error.
  - TRUE / FALSE → opcional; indica si el error se añade a la pila de errores anteriores.

### Ejemplo: trigger de auditoría

Crear una tabla de auditoría:

```sql
CREATE TABLE aud_alumnes (
   usuari   VARCHAR2(30),
   data_op  DATE,
   accio    VARCHAR2(10)
);
```

Trigger que añade el registro:

```sql
CREATE OR REPLACE TRIGGER audita_alumnes
AFTER INSERT OR DELETE ON alumnes
FOR EACH ROW
BEGIN
   INSERT INTO aud_alumnes VALUES (
      USER,
      SYSDATE,
      CASE
         WHEN INSERTING THEN 'INSERT'
         WHEN DELETING THEN 'DELETE'
      END
   );
END;
```

### 📘 Consultas útiles al DD

```sql
-- Ver los triggers del usuario actual
SELECT trigger_name, table_name, triggering_event, status
FROM user_triggers;

-- Consultar el código de un trigger
SELECT trigger_body FROM user_triggers WHERE trigger_name = 'LOG_INSERCIO';
```

### Buenas prácticas

- Usa nombres claros y una descripción funcional
- Documenta el comportamiento del trigger
- Evita código complejo o acciones que modifiquen otras tablas si no es necesario
- Controla el rendimiento: demasiados triggers pueden degradar la eficiencia
- Si hay que registrar acciones, usa una tabla de auditoría

### 🛠️ Activación y desactivación de triggers

```sql
-- Desactivar
ALTER TRIGGER log_insercio DISABLE;

-- Activar
ALTER TRIGGER log_insercio ENABLE;
```

### 🗑️ Eliminar un trigger

```sql
DROP TRIGGER log_insercio;
```

## Secuencias en Oracle

### 📘 ¿Qué es una secuencia?

Una **secuencia** es un objeto de base de datos que genera una serie de valores numéricos consecutivos, normalmente usados para claves primarias, códigos únicos o control de identificadores. Es el equivalente a un *autoincrement* en otros SGBD.

### Crear una secuencia

```sql
-- Dar permiso
GRANT CREATE SEQUENCE TO usuari;
-- Crear la secuencia
CREATE SEQUENCE seq_alumnes START WITH 1 INCREMENT BY 1
-- Borrar la secuencia
DROP SEQUENCE seq_alumnes;
```

### Uso de la secuencia

Para obtener el siguiente valor (se puede usar en los INSERT):

```txt
seq_alumnes.NEXTVAL
```

Para consultar el valor actual (después de haber hecho NEXTVAL como mínimo una vez):

```txt
seq_alumnes.CURRVAL
```

#### Ejemplo de uso en una inserción

```sql
INSERT INTO alumnes (id, nom, edat)  VALUES (seq_alumnes.NEXTVAL, 'Laia', 21);
```

### 📘 Consultar las secuencias existentes

```sql
-- Secuencias del usuario
SELECT sequence_name, min_value, max_value, increment_by
FROM user_sequences;
```

### ⚙️ Modificar una secuencia

```sql
ALTER SEQUENCE seq_alumnes  INCREMENT BY 5 ;
```

### 🗑️ Eliminar una secuencia

```sql
DROP SEQUENCE seq_alumnes;
```

### Buenas prácticas

- Usa `NOCYCLE` para evitar duplicados si no quieres que vuelva a empezar
- Usa `CACHE` para mejorar el rendimiento en entornos grandes (p. ej.: `CACHE 20`)
- No uses `CURRVAL` antes de haber llamado a `NEXTVAL` en la sesión
- Da nombres claros y relacionados con la tabla (p. ej.: `SEQ_FACTURES`)

### Ejemplo completo

```sql
CREATE SEQUENCE seq_factura START WITH 1000 INCREMENT BY 10 ;
-- Inserción con NEXTVAL
INSERT INTO factures (id, data_emissio) VALUES (seq_factura.NEXTVAL, SYSDATE);
```

### Identity column

Una **identity column** es otro mecanismo de Oracle para generar valores enteros secuenciales únicos y asignarlos a campos numéricos; se utilizan generalmente para las claves primarias de las tablas, garantizando que sus valores no se repitan.

```sql
CREATE TABLE empleados (
  id NUMBER GENERATED BY DEFAULT AS IDENTITY
  PRIMARY KEY,
  .......);
```

| Característica | SEQUENCE | IDENTITY Column |
| --- | --- | --- |
| **Definición** | Objeto independiente que genera valores numéricos secuenciales. | Columna de una tabla que genera automáticamente valores únicos. |
| **Uso principal** | Generar claves primarias o valores secuenciales a voluntad. | Generar automáticamente un valor único para cada fila nueva. |
| **Cómo se utiliza** | Hay que llamar a `nom_seq.NEXTVAL` explícitamente en la inserción. | Oracle gestiona el valor automáticamente (con `GENERATED ALWAYS` o `BY DEFAULT`). |
| **Control del valor** | El usuario decide cuándo y cómo consumir el siguiente valor. | El valor se incrementa automáticamente con cada inserción (según la configuración). |
| **Flexibilidad** | Muy flexible: puede ser utilizada por diferentes tablas o procesos. | Está ligada a una sola tabla y columna. |
| **Ejemplo de creación** | `CREATE SEQUENCE seq_client_id START WITH 1 INCREMENT BY 1;` | `id NUMBER GENERATED BY DEFAULT AS IDENTITY` |
| **Compartición entre tablas** | Se puede usar en múltiples tablas. | Solo se puede usar en una tabla específica. |

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
