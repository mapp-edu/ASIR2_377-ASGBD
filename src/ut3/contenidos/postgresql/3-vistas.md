---
layout: doc
title: "PostgreSQL: vistas como mecanismo de seguridad"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: vistas como mecanismo de seguridad

## 👁️ Vistas como elemento de seguridad en PostgreSQL

Las **vistas (views)** en PostgreSQL pueden ser un elemento muy potente para la seguridad de los datos, ya que permiten controlar qué datos pueden ser accesibles para los usuarios y cómo se presentan esos datos. Las vistas no almacenan datos, sino que son definiciones de consultas SQL que se pueden utilizar como si fueran tablas normales. Esto significa que las vistas permiten al administrador de bases de datos (DBA) establecer un nivel de seguridad y restricción para el acceso a la información a través de consultas personalizadas.

Las vistas (views) son como tablas virtuales: no almacenan datos por sí mismas, sino que muestran el resultado de una consulta sobre una o más tablas

### Vistas como elemento de seguridad en PostgreSQL

A continuación se pueden ver algunas de las principales maneras en que las vistas se pueden utilizar para mejorar la seguridad en PostgreSQL:

#### 1. Restricción de acceso a datos sensibles

**Descripción**: las vistas permiten crear consultas personalizadas que pueden ocultar ciertas columnas o tablas que contienen datos sensibles. En lugar de permitir que un usuario acceda directamente a una tabla, se puede crear una vista que exponga solo una parte de los datos.

```sql
-- Vista horizontal o control de columnas
      CREATE VIEW vista_clients_completa AS
      SELECT nom, adreca, telefon FROM clients;
```

```sql
-- Vista vertical o control de filas
      CREATE VIEW vista_clients_completa AS
      SELECT *  FROM clients where prov=46;
```

```sql
-- Vista mixta
      CREATE VIEW vista_clients_completa AS
      SELECT nom, adreca, telefon FROM clients where prov=46;
```

**Ventaja de seguridad**: limita la exposición de datos sensibles a solo la información necesaria, mejorando la seguridad de la información confidencial.

#### 2. Autenticación de consultas

**Descripción**: se pueden utilizar vistas para garantizar que solo se puedan realizar consultas sobre un conjunto específico de datos según el rol o los permisos de un usuario. Esto se hace mediante el control de permisos sobre las vistas.

```sql
GRANT SELECT ON vista_clients_completa TO usuari_x;
```

**Ventaja de seguridad**: esta técnica permite controlar el acceso a los datos a nivel de usuario, garantizando que solo los usuarios autorizados tengan acceso a las vistas que exponen los datos filtrados o restringidos.

#### 3. Vistas con seguridad basada en roles

**Descripción**: utilizando vistas, puedes aplicar seguridad a nivel de roles, permitiendo que solo ciertos roles de usuario puedan acceder a determinados datos. Por ejemplo, un DBA puede crear una vista para usuarios normales que solo muestre información básica, mientras que un usuario con un rol administrativo podría tener acceso a una vista más detallada.

```sql
CREATE VIEW vista_dades_normals AS
SELECT nom, adreça FROM clients;

CREATE VIEW vista_dades_administrador AS
SELECT * FROM clients;
```

El usuario con un rol normal solo puede ver `vista_dades_normals`, mientras que el usuario con rol de administrador tiene acceso a `vista_dades_administrador`.

**Ventaja de seguridad**: permite controlar el acceso a los datos según los roles de usuario, garantizando que los usuarios solo tengan acceso a la información que necesitan.

**4. Permisos del propietario frente a la opción `security_invoker`**

Por defecto, una vista de PostgreSQL accede a las tablas base con los permisos de **su propietario** (quien la creó). Esto permite dar acceso limitado a usuarios que normalmente no podrían acceder a la tabla base.

```sql
CREATE VIEW vista_secreta AS
SELECT nom, salari
FROM empleats;
```

Ahora un usuario que solo tenga permisos sobre la vista puede ver información que normalmente no podría ver directamente en la tabla.

Desde PostgreSQL 15 se puede pedir lo contrario con la opción `security_invoker`: la vista se ejecuta con los permisos del usuario que hace la consulta.

```sql
CREATE VIEW vista_invocador
WITH (security_invoker = true) AS
SELECT nom, salari
FROM empleats;
```

El comportamiento por defecto es útil para exponer información restringida de forma controlada, mientras que `security_invoker` es más seguro si quieres garantizar que se apliquen siempre los permisos originales de la tabla.

#### 5. Row-Level Security (RLS) y vistas

PostgreSQL incluye una funcionalidad muy potente: Row-Level Security (RLS). Esta característica permite controlar qué filas puede ver o modificar cada usuario.

Cuando hacemos un SELECT a través de una vista, por defecto la vista se ejecuta con los permisos del propietario de la vista. Esto significa que las reglas de RLS no se aplican al usuario que hace la consulta, sino al propietario.

Para que la política RLS se aplique correctamente al usuario que consulta la vista, podemos cambiar el comportamiento de la vista con:

```sql
ALTER VIEW nom_de_la_vista SET (security_invoker = on);
```

Esta opción cambia el comportamiento de una vista existente.

Esto hace que la vista se ejecute con los permisos del usuario que llama a la vista (invoker) y, por tanto, las reglas de RLS se aplicarán como si el usuario accediera directamente a la tabla base.

#### 5. RLS (Row-Level Security) en una tabla

PostgreSQL permite habilitar RLS en una tabla:

```sql
ALTER TABLE empleats ENABLE ROW LEVEL SECURITY;
```

Y después definir políticas de filas según el usuario, el rol, etc. Esto filtra a nivel de fila, lo que es más potente que solo ocultar columnas

```sql
CREATE POLICY veure_propis_empleats
ON empleats
FOR SELECT
USING (user_id = current_user);
```

- USING define qué filas se pueden seleccionar.
- current_user es el usuario que hace la consulta.
- Así, si el usuario alice hace un SELECT, solo verá las filas donde user_id = 'alice'.

- Se puede aplicar a SELECT, INSERT, UPDATE y DELETE.
- Funciona combinado con vistas y SECURITY INVOKER para que el usuario solo vea lo que le corresponde.

#### 6. Materialized views en PostgreSQL

Vista normal: solo es una definición de consulta; los datos no se almacenan, se obtienen cada vez que haces SELECT. Materialized view: guarda físicamente los resultados de la consulta en una tabla.

```sql
CREATE MATERIALIZED VIEW nom_mv AS
SELECT ...
FROM taula_base
[WITH [NO] DATA];
```

Como los datos pueden cambiar en las tablas originales, hay que actualizar la materialized view:

```txt
REFRESH MATERIALIZED VIEW vista_clients_actius;
```

- Los datos no se actualizan automáticamente cuando cambia la tabla base. Hay que hacer REFRESH.
- Ocupa espacio físico en la base de datos.
- Si necesitas datos en tiempo real, es mejor una vista normal.

**Vistas y actualizabilidad**

Una vista es actualizable si es una transformación directa de una sola tabla, sin agregaciones ni DISTINCT.

```sql
CREATE VIEW vista_empleats_simple AS
SELECT id, nom
FROM empleats;
```

**Ejemplos de vistas no actualizables:**

Vistas con GROUP BY, JOIN complejo, DISTINCT, UNION.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
