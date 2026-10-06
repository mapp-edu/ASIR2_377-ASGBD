---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 3: vistas, sinónimos y roles"
pageClass: ejercicios-page
---

# 📋 Práctica 3: vistas, sinónimos y roles

## Enunciado

Una clínica guarda en su base de datos información de pacientes, citas y facturación. No todo el personal debe ver lo mismo: los datos de salud son **datos especialmente protegidos** y solo puede acceder a ellos quien los necesita para su trabajo.

Vas a implantar el control de acceso con **vistas personalizadas** para cada tipo de usuario, **sinónimos** para que no tengan que conocer el esquema propietario y **roles** que agrupen los privilegios.

Haz la práctica con Oracle o con PostgreSQL, según te indique tu profesor o profesora.

## Objetivos

- Crear vistas que muestren a cada tipo de usuario solo las filas y columnas que le corresponden.
- Crear sinónimos de tablas y vistas.
- Agrupar privilegios en roles, asignarlos, retirarlos y eliminarlos.
- Comprobar que se cumple el principio de mínimo privilegio.

## Datos de partida

Crea un usuario propietario `clinica` y, en su esquema, estas tablas (adapta los tipos a tu SGBD) con al menos 6 pacientes, 3 médicos y 10 citas:

```sql
CREATE TABLE medicos (
  id_medico     INT PRIMARY KEY,
  nombre        VARCHAR(50) NOT NULL,
  especialidad  VARCHAR(30) NOT NULL,
  usuario_bd    VARCHAR(30) NOT NULL      -- nombre de su cuenta en la base de datos
);

CREATE TABLE pacientes (
  id_paciente   INT PRIMARY KEY,
  nombre        VARCHAR(50) NOT NULL,
  dni           VARCHAR(9)  NOT NULL,
  telefono      VARCHAR(15),
  diagnostico   VARCHAR(200),
  iban          VARCHAR(34)
);

CREATE TABLE citas (
  id_cita       INT PRIMARY KEY,
  id_paciente   INT NOT NULL REFERENCES pacientes,
  id_medico     INT NOT NULL REFERENCES medicos,
  fecha         DATE NOT NULL,
  importe       DECIMAL(8,2),
  pagada        CHAR(1) DEFAULT 'N'
);
```

## Requisitos de acceso

| Tipo de usuario | Qué necesita |
|:---|:---|
| **Recepción** | Ver nombre y teléfono de los pacientes (nunca el diagnóstico ni el IBAN) y gestionar las citas: consultarlas, crearlas y cambiarles la fecha. |
| **Médico** | Ver los datos de los pacientes, incluido el diagnóstico, y modificar el diagnóstico. **Solo** de los pacientes con los que tiene alguna cita. |
| **Contabilidad** | Ver las citas con su importe y marcarlas como pagadas, y ver el IBAN del paciente. No debe ver diagnósticos ni teléfonos. |
| **Dirección** | Solo estadísticas: número de citas e importe total por médico y mes, sin ningún dato personal de pacientes. |

## Tareas

### Parte 1. Vistas

1. Diseña y crea en el esquema `clinica` **una o varias vistas para cada tipo de usuario** que cumplan los requisitos. Indica de cada una si filtra columnas (vista vertical), filas (vista horizontal) o ambas.
2. La vista del médico debe mostrar a cada médico **solo sus pacientes**, usando el nombre de la cuenta con la que está conectado.
3. Comprueba qué vistas son **actualizables** y cuáles no, y explica por qué. En las que permitan modificaciones, impide que a través de la vista se puedan dejar filas fuera de su propio filtro.
4. Consulta en el diccionario de datos las vistas creadas y su definición.

### Parte 2. Roles

5. Crea un **rol por cada tipo de usuario** y concede a cada rol únicamente los privilegios necesarios **sobre las vistas** (no sobre las tablas).
6. Crea un rol `personal_clinica` con lo que es común a todos (por ejemplo, el permiso para conectarse a la base de datos) y concédeselo a los otros roles. Tendrás así una **jerarquía de roles**.
7. Crea estos usuarios y asígnales su rol: `rec_marta` (recepción), `med_garcia` y `med_lopez` (médicos), `con_pau` (contabilidad) y `dir_elena` (dirección). Ningún usuario debe recibir privilegios directamente.
8. Muestra en el diccionario de datos qué privilegios tiene cada rol y qué roles tiene cada usuario.

### Parte 3. Sinónimos

9. Consigue que los usuarios puedan escribir `SELECT * FROM pacientes;` (sin anteponer `clinica.`) y obtengan **su** vista:
   - **Oracle:** crea sinónimos. Razona en qué casos conviene un sinónimo público y en cuáles uno privado, y crea al menos uno de cada tipo.
   - **PostgreSQL:** no existen los sinónimos. Resuélvelo con la variable `search_path` del rol (o con una vista en un esquema propio) y explica en qué se diferencia de un sinónimo.
10. Explica por qué un sinónimo **no concede ningún privilegio** y demuéstralo con una prueba.

### Parte 4. Comprobación

11. Conéctate con cada usuario y elabora una **tabla de pruebas**: qué intenta, resultado esperado y resultado obtenido. Incluye al menos, para cada usuario, una operación permitida y dos prohibidas (por ejemplo, que recepción intente leer el diagnóstico o acceder directamente a la tabla).
12. Demuestra que `med_garcia` no ve los pacientes de `med_lopez`.

### Parte 5. Cambios en la plantilla

13. `rec_marta` pasa a contabilidad: **retírale** un rol y asígnale el otro. Comprueba el efecto.
14. La clínica decide que recepción ya no puede crear citas, solo consultarlas: **retira** ese privilegio al rol y comprueba que afecta a todos sus miembros.
15. Se elimina el puesto de dirección: **elimina** el usuario y el rol. Indica qué has tenido que hacer antes para poder borrarlos.

## Orientaciones

| | Oracle | PostgreSQL |
|:---|:---|:---|
| Usuario conectado | `USER` | `current_user` |
| Impedir filas fuera del filtro | `WITH CHECK OPTION` | `WITH CHECK OPTION` |
| Vistas | `USER_VIEWS`, `ALL_VIEWS` | `\dv`, `pg_views` |
| Sinónimos | `CREATE [PUBLIC] SYNONYM`, `ALL_SYNONYMS` | no existen: `ALTER ROLE ... SET search_path` |
| Crear rol | `CREATE ROLE rol;` | `CREATE ROLE rol NOLOGIN;` |
| Rol a usuario | `GRANT rol TO usuario;` | `GRANT rol TO usuario;` |
| Privilegios de un rol | `ROLE_TAB_PRIVS`, `ROLE_SYS_PRIVS` | `\dp`, `information_schema.role_table_grants` |
| Roles de un usuario | `DBA_ROLE_PRIVS`, `SESSION_ROLES` | `\du`, `pg_auth_members` |
| Borrar rol | `DROP ROLE rol;` | `DROP OWNED BY rol; DROP ROLE rol;` |

- En Oracle, `USER` devuelve el nombre de la cuenta en mayúsculas: tenlo en cuenta al rellenar la columna `usuario_bd`.
- En PostgreSQL, además del privilegio sobre la vista, el rol necesita `USAGE` sobre el esquema que la contiene y `CONNECT` sobre la base de datos; el atributo `LOGIN` es de cada usuario y no se hereda de un rol.
- Repasa las páginas de vistas ([Oracle](/ut3/contenidos/oracle/3-vistas-sinonimos), [PostgreSQL](/ut3/contenidos/postgresql/3-vistas)) y de roles ([Oracle](/ut3/contenidos/oracle/2-privilegios-roles-perfiles), [PostgreSQL](/ut3/contenidos/postgresql/2-privilegios-roles-perfiles)), y la [normativa de protección de datos](/ut3/contenidos/2-normativa-proteccion-datos).

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA3** (*Implanta métodos de control de acceso utilizando asistentes, herramientas gráficas y comandos del lenguaje del sistema gestor.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **3.a** | Se han creado vistas personalizadas para cada tipo de usuario. | Crea vistas distintas para cada tipo de usuario que muestran exactamente las filas y columnas indicadas, incluida la del médico filtrada por la cuenta conectada. |
| **3.b** | Se han creado sinónimos de tablas y vistas. | Crea sinónimos públicos y privados de tablas y vistas (o la solución equivalente en PostgreSQL) y explica cuándo usar cada uno. |
| **3.d** | Se han identificado los privilegios sobre las bases de datos y sus elementos. | Identifica en el diccionario de datos los privilegios de cada rol y de cada usuario. |
| **3.e** | Se han agrupado y desagrupado privilegios. | Agrupa los privilegios en roles con una jerarquía, y después retira privilegios a un rol y elimina un rol. |
| **3.g** | Se han asignado y eliminado grupos de privilegios a usuarios. | Asigna y retira roles a los usuarios, sin conceder privilegios directos. |
| **3.h** | Se ha garantizado el cumplimiento de los requisitos de seguridad. | La tabla de pruebas demuestra el mínimo privilegio: nadie accede a datos que no necesita y los datos de salud quedan protegidos. |

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
