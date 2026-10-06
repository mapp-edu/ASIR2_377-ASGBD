---
layout: doc
title: "Oracle: vistas y sinónimos"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: vistas y sinónimos

## 👁️ Vistas como elemento de seguridad en Oracle

Las **vistas (views)** en Oracle pueden ser un elemento muy potente para la seguridad de los datos, ya que permiten controlar qué datos pueden ser accesibles para los usuarios y cómo se presentan esos datos. Las vistas no almacenan datos, sino que son definiciones de consultas SQL que se pueden utilizar como si fueran tablas normales. Esto significa que las vistas permiten al administrador de bases de datos (DBA) establecer un nivel de seguridad y restricción para el acceso a la información a través de consultas personalizadas.

### Vistas como elemento de seguridad en Oracle

A continuación se pueden ver algunas de las principales maneras en que las vistas se pueden utilizar para mejorar la seguridad en Oracle:

#### 1. Restricción de acceso a datos sensibles

**Descripción**: las vistas permiten crear consultas personalizadas que pueden ocultar ciertas columnas o tablas que contienen datos sensibles. En lugar de permitir que un usuario acceda directamente a una tabla, se puede crear una vista que exponga solo una parte de los datos.

```sql
CREATE VIEW vista_clients_completa AS
SELECT nom, adreca, telefon
FROM clients;
```

**Ventaja de seguridad**: limita la exposición de datos sensibles a solo la información necesaria, mejorando la seguridad de la información confidencial.

#### 2. Autenticación de consultas

**Descripción**: puedes utilizar vistas para garantizar que solo se puedan realizar consultas sobre un conjunto específico de datos según el rol o los permisos de un usuario. Esto se hace mediante el control de permisos sobre las vistas.

```sql
GRANT SELECT ON vista_clients_completa TO usuari_x;
```

**Ventaja de seguridad**: esta técnica permite controlar el acceso a los datos a nivel de usuario, garantizando que solo los usuarios autorizados tengan acceso a las vistas que exponen los datos filtrados o restringidos.

#### 3. Control de columnas

**Descripción**: las vistas permiten ocultar columnas enteras de una tabla, lo que es útil para esconder datos que no se deberían mostrar. Esto es especialmente útil cuando las tablas contienen datos sensibles, como contraseñas, números de la seguridad social, etc.

```sql
CREATE VIEW vista_usuaris AS
SELECT id, nom, correu
FROM usuaris;
```

**Ventaja de seguridad**: permite esconder datos sensibles y garantizar que solo sea accesible la información necesaria.

#### 4. Control de las consultas realizadas

**Descripción**: mediante la creación de vistas, se puede controlar exactamente qué consultas están permitidas y cómo se realizan. Esto permite a los administradores establecer reglas de consulta que limiten el acceso a determinados conjuntos de datos.

```sql
CREATE VIEW vista_transaccions_usuaris AS
SELECT transaccio_id, data, import
FROM transaccions
WHERE usuari_id = :usuari_id;
```

**Ventaja de seguridad**: puede restringir el alcance de los datos consultados y garantizar que los usuarios solo obtengan información relevante y personalizada.

#### 5. Vistas con seguridad basada en roles

**Descripción**: utilizando vistas, puedes aplicar seguridad a nivel de roles, permitiendo que solo ciertos roles de usuario puedan acceder a determinados datos. Por ejemplo, un DBA puede crear una vista para usuarios normales que solo muestre información básica, mientras que un usuario con un rol administrativo podría tener acceso a una vista más detallada.

```sql
CREATE VIEW vista_dades_normals AS
SELECT nom, adreça FROM clients;

CREATE VIEW vista_dades_administrador AS
SELECT * FROM clients;
```

El usuario con un rol normal solo puede ver `vista_dades_normals`, mientras que el usuario con rol de administrador tiene acceso a `vista_dades_administrador`.

**Ventaja de seguridad**: permite controlar el acceso a los datos según los roles de usuario, garantizando que los usuarios solo tengan acceso a la información que necesitan.

#### 6. Auditoría y monitorización de consultas

**Descripción**: las vistas también pueden ser útiles para auditar y monitorizar las consultas. Por ejemplo, puedes crear una vista que permita al usuario visualizar solo los cambios realizados en la tabla de transacciones en un periodo de tiempo determinado.

```sql
CREATE VIEW vista_transaccions_audit AS
SELECT transaccio_id, data, import, operacio
FROM transaccions_audit
WHERE data > '2024-01-01';
```

**Ventaja de seguridad**: esto permite monitorizar la actividad de la base de datos y detectar posibles accesos no autorizados o actividades sospechosas.

### Conclusiones

Las **vistas en Oracle** son una herramienta muy potente para mejorar la seguridad de los datos en una base de datos. Algunas de las maneras en que se pueden utilizar como elemento de seguridad son:

- **Restricción de acceso a datos sensibles**
- **Autenticación de consultas** mediante la asignación de permisos sobre las vistas.
- **Control de columnas** para esconder datos sensibles.
- **Control de consultas** para limitar el alcance de los datos consultados.
- **Seguridad basada en roles** para restringir el acceso a vistas específicas según los permisos de usuario.
- **Auditoría y monitorización** para hacer el seguimiento de las operaciones en la base de datos.

Las vistas permiten personalizar el acceso a la información y garantizar que solo los usuarios autorizados tengan acceso a los datos críticos.

## 👯‍♀️ Uso de sinónimos (synonyms) en Oracle

Un **synonym** (sinónimo) en Oracle es un alias o nombre alternativo para un objeto de base de datos como una tabla, vista, secuencia, procedimiento, función, paquete u otro objeto. Los sinónimos se utilizan para simplificar el acceso a los objetos y mejorar la seguridad.

### Tipos de sinónimos

- **Public synonym:** visible para todos los usuarios de la base de datos.
- **Private synonym:** solo visible para el usuario que lo crea.

### Beneficios de seguridad y usabilidad

- Oculta el nombre real o el esquema del objeto.
- Permite controlar mejor los accesos a los objetos a través de permisos sobre el sinónimo.
- Facilita la migración o el cambio de esquema sin afectar al código SQL que utiliza el sinónimo.

### Ejemplos de uso

#### 1. Crear un sinónimo privado

```sql
CREATE SYNONYM emp FOR empresa.empleats;
```

Ahora, en lugar de usar `empresa.empleats`, el usuario puede usar simplemente `emp`.

#### 2. Crear un sinónimo público

```sql
CREATE PUBLIC SYNONYM emp FOR empresa.empleats;
```

Todos los usuarios pueden acceder a la tabla `empleats` como `emp`, siempre que tengan permisos.

#### 3. Eliminar un sinónimo

```sql
DROP SYNONYM emp;
DROP PUBLIC SYNONYM emp;
```

### Consideraciones de seguridad

- No otorga automáticamente permisos sobre el objeto. Hay que hacer un `GRANT` por separado.
- Pueden ser útiles para limitar la exposición de esquemas y estructuras internas.
- Los sinónimos públicos se deben usar con precaución para evitar conflictos y la exposición de objetos no deseados.

### Conclusión

Los **sinónimos** en Oracle son útiles para simplificar nombres de objetos y ocultar detalles internos. Utilizados correctamente, pueden mejorar la organización, la seguridad y la flexibilidad de las aplicaciones que acceden a la base de datos.

## Otros recursos

- 🧭 [Guía: conexiones como SYSDBA en Windows](/ut3/ejercicios/guia-1-sysdba-en-windows)
- 🧭 [Guía: permisos UPDATE y DELETE en Oracle](/ut3/ejercicios/guia-2-update-delete-select)
- 🧭 [Guía: usuarios comunes en Oracle](/ut3/ejercicios/guia-3-usuarios-comunes)
- ✅ [Cuestionario de autoevaluación](/ut3/ejercicios/cuestionario)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
