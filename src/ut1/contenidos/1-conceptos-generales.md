---
layout: doc
title: "Conceptos generales de un SGBD"
sidebar: true
outline: [2, 3]
aside: true
---

# Conceptos generales de un SGBD

## Definiciones

### Qué es un DBA

La figura del DBA hace referencia a la persona o al equipo de personas responsables de asegurar la disponibilidad de los datos de una organización y el acceso a ellos de manera óptima. Será el responsable de todo el ciclo de vida del sistema de información.

#### Tareas de un DBA

- Configurar el hardware donde se instalará el SGBD
- Configurar el sistema operativo
- Instalar y mantener el SGBD
- Crear y configurar bases de datos
- Control de usuarios y permisos
- Gestión de la seguridad
- Monitorizar y optimizar el rendimiento de las bases de datos
- Realizar tareas de copias de seguridad y recuperación

### Qué es un SGBD

Un SGBD es un conjunto de programas que permiten el almacenamiento, la modificación y la extracción de la información de una base de datos, además de proporcionar herramientas para explotar, administrar y gestionar las bases de datos.

En inglés, DBMS o RDBMS (Data Base Management System).

**Ranking DBMS:** <https://db-engines.com/en/ranking>

Contesta a las preguntas...

::: info-box Actividad
- ¿Cuántos SGBD hay en el ranking?
- De los 5 primeros, ¿cuántos son de código abierto?
- Los dos primeros, ¿a qué empresa pertenecen?
- De los 7 primeros, ¿qué sistemas operativos soportan? (haz una cuadrícula o tabla)
- De los 7 primeros, ¿qué modelos de datos soportan? (haz una cuadrícula o tabla)
:::

---

## Clasificaciones de los SGBD

Las clasificaciones de los Sistemas de Gestión de Bases de Datos (SGBD) pueden organizarse en diversas categorías según su arquitectura, número de usuarios, modelo de datos y su propósito o tipo de carga de trabajo.

### 1. Según el número de usuarios

- **Monousuario**

  - Diseñados para ser utilizados por un único usuario a la vez.
  - Ejemplo: Microsoft Access (en entornos personales o de escritorio).

- **Multiusuario**

  - Permiten que múltiples usuarios accedan y trabajen simultáneamente con la base de datos.
  - Controlan el acceso concurrente y la integridad de los datos.
  - Ejemplos: MySQL, PostgreSQL, Oracle Database, SQL Server.

### 2. Según su arquitectura

- **Centralizados**

  - Toda la base de datos se almacena y gestiona en un único servidor.
  - Los usuarios acceden al SGBD a través de una red, pero todo el procesamiento ocurre en el servidor central.
  - Más fáciles de mantener, pero pueden ser un cuello de botella y un punto único de fallo.

- **Distribuidos**

  - La base de datos está repartida en múltiples nodos (servidores).
  - Los datos pueden estar replicados o fragmentados entre diferentes ubicaciones.
  - Más complejos, pero ofrecen mayor disponibilidad y escalabilidad.

### 3. Según el modelo de datos (o tipo de base de datos)

Estos SGBD se clasifican según la forma en que estructuran y acceden a los datos:

- **Relacionales**

  - Basados en tablas con filas y columnas.
  - Estructura fija (esquema definido).
  - Usan SQL.
  - Ejemplos: MySQL, PostgreSQL, Oracle.

- **Documentales**

  - Almacenan datos en forma de documentos (normalmente JSON, BSON, etc.).
  - Flexibles, ideales para datos semiestructurados.
  - Ejemplos: MongoDB, CouchDB. Forman parte de NoSQL.

- **De grafos**

  - Optimizados para representar relaciones complejas entre datos.
  - Los datos se almacenan como nodos y aristas.
  - Ejemplos: Neo4j, ArangoDB. También considerados NoSQL.

- **In-memory**

  - Almacenan los datos directamente en la memoria RAM para obtener la máxima velocidad.
  - Usados en tiempo real, memorias caché o aplicaciones críticas.
  - Ejemplos: Redis, SAP HANA.

- **De series temporales**

  - Especializados en gestionar datos con marcas temporales (métricas, logs, sensores).
  - Optimizados para insertar, consultar y analizar datos cronológicos.
  - Ejemplos: InfluxDB, TimescaleDB.

- **Espaciales**

  - Diseñados para almacenar y consultar datos geográficos y geométricos.
  - Soportan operaciones como intersección de polígonos, distancias, coordenadas.
  - Ejemplos: PostGIS (extensión de PostgreSQL), Oracle Spatial, MongoDB (soporte geoespacial).

- **Otros modelos clásicos**

  - *Navegacionales*: organizados en árboles o redes jerárquicas.
  - *Orientados a objetos*: almacenan objetos completos.

**Notas importantes:**

- Algunos SGBD combinan múltiples modelos (por ejemplo, ArangoDB combina grafos, documentos y clave-valor).
- Muchos motores relacionales modernos ofrecen extensiones para modelos no relacionales, como PostgreSQL con PostGIS (espacial) o TimescaleDB (series temporales).

### 4. Según el propósito o tipo de carga de trabajo

- **OLTP (Online Transaction Processing) – Transaccionales**

  - Diseñados para gestionar muchas transacciones rápidas y concurrentes.
  - Usados en sistemas operacionales: ventas, bancos, reservas, etc.
  - Requieren alta integridad, concurrencia y recuperación ante fallos.
  - Ejemplos: MySQL, PostgreSQL, Oracle, SQL Server.

- **OLAP (Online Analytical Processing) – Analíticos / Data Warehouse**

  - Optimizados para consultas complejas y análisis de grandes volúmenes de datos.
  - Soportan operaciones como agregación, slicing, dicing, drill-down.
  - Usados en inteligencia de negocio, informes, dashboards.
  - Ejemplos: Amazon Redshift, Snowflake, Google BigQuery, Microsoft Synapse, Teradata.

Algunos SGBD modernos (como PostgreSQL o SQL Server) pueden realizar funciones OLTP y OLAP híbridas, aunque no tan especializadas como las herramientas puras.

---

## Tipos de conexión a una base de datos

### 1. Desde consola (CLI - Command Line Interface)

- **In situ / peer**

  - Conexión local, desde el mismo equipo donde está la base de datos.
  - Ejemplos: <br> `sqlplus / as sysdba` `mysql -u usuari -p` <br> `psql -U usuari -d basedades`

- **Con socket**

  - Conexión a un equipo con IP o URL.
  - Ejemplos: <br> `sqlplus usuari/pass@192.168.10.100/nombasedades` `mysql -h meuserver.com -u usuari -p` <br> `psql -U usuari -d basedades -h 192.168.10.100`

- **Por SSH (Secure Shell)**

  - Conexión remota y segura a través de un túnel SSH al servidor donde está la BD.
  - Útil para mantener la seguridad en entornos productivos.
  - Ejemplos: <br> `ssh usuari@servidor` <br> `mysql -u usuari -p`

### 2. Desde un entorno gráfico (GUI - Graphical User Interface)

Herramientas visuales que permiten gestionar bases de datos de manera amigable:

- Interfaz intuitiva, ideal para usuarios no técnicos o para tareas rápidas.

- Ejemplos:

  - pgAdmin
  - SQL Developer
  - DBeaver
  - phpMyAdmin

### 3. Desde un lenguaje de programación (vía driver o API)

Conexión programada desde una aplicación o script.

- **PDO (PHP Data Objects)**

  - Abstracción de acceso a base de datos en PHP.
  - Soporta múltiples motores (MySQL, SQLite, PostgreSQL, etc.).
  - Ejemplo: <br> `$pdo = new PDO("mysql:host=localhost;dbname=mi_bd", "usuari", "contrasenya");`

- **Otros drivers por lenguaje**

  - JDBC (Java)
  - ODBC (multiplataforma)
  - psycopg2 (Python para PostgreSQL)
  - SQLAlchemy (ORM para Python)
  - etc.

---

## Funciones de un SGBD

- **DDL (Data Definition Language)**: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `COMMENT`, `RENAME`
- **DML (Data Manipulation Language)**: `INSERT`, `DELETE`, `UPDATE`, `SELECT` <br> ↳ **DQL (Data Query Language)**: `SELECT`
- **DCL (Data Control Language)**: `GRANT`, `REVOKE`
- **TCL (Transaction Control Language)**: `COMMIT`, `ROLLBACK`, `SAVEPOINT`
- **Integridad referencial**: garantizar la coherencia entre tablas relacionadas (claves foráneas, dependencias, etc.).
- **Auditoría**: registrar quién accede o modifica datos, y cuándo lo hace.
- **Tiempo de respuesta idóneo**: proporcionar respuestas rápidas y eficientes a consultas y operaciones.
- **Independencia física y lógica**: separar la manera en que se ven los datos de cómo están almacenados internamente.
- **Monitorización del SGBD**: supervisar el rendimiento, el uso de recursos, las sesiones, etc.
- **Conectividad**: permitir el acceso desde diferentes aplicaciones, sistemas operativos y ubicaciones.
- **Copia y recuperación**: hacer copias de seguridad y restaurarlas en caso de fallo o pérdida de datos.

---

## Elementos de un SGBD

Un Sistema Gestor de Bases de Datos (SGBD) está compuesto por diversos elementos o componentes que trabajan conjuntamente para facilitar el almacenamiento, la recuperación, la manipulación y la administración de datos.

### 1. Procesador de consultas

Es el componente encargado de interpretar y ejecutar las consultas realizadas por los usuarios (normalmente en SQL). Sus funciones incluyen:

- Análisis léxico y sintáctico de las consultas.
- Optimización de consultas para mejorar su rendimiento.
- Generación del plan de ejecución.

### 2. Gestor de la base de datos

Es el núcleo del SGBD. Controla el acceso a los datos y garantiza su integridad, seguridad y concurrencia. Sus responsabilidades son:

- Control de transacciones.
- Gestión de la concurrencia (acceso simultáneo).
- Recuperación ante fallos.
- Control de integridad.

### 3. Gestor de archivos

Este componente administra el almacenamiento físico de los datos en disco. Entre sus funciones están:

- Lectura y escritura de bloques de datos.
- Organización y almacenamiento eficiente.
- Mantenimiento de índices y estructuras de almacenamiento.

### 4. Interfaces externas

Son los mecanismos que permiten a los usuarios y aplicaciones comunicarse con el SGBD. Pueden incluir:

- Interfaces gráficas (GUI).
- Interfaces de programación (API).
- Consolas de comandos.
- Conectores para lenguajes de programación.

### 5. Preprocesador del lenguaje de manipulación de datos (DML)

Este componente se encarga de identificar las sentencias DML (como `SELECT`, `INSERT`, `UPDATE`, `DELETE`) dentro del código fuente de una aplicación. Funciones clave:

- Integrar sentencias DML en lenguajes como C, Java, etc.
- Traducirlas a llamadas al procesador de consultas del SGBD.

### 6. Compilador del lenguaje de definición de datos (DDL)

Traduce las sentencias DDL (como `CREATE`, `ALTER`, `DROP`) que definen la estructura de la base de datos. Su función es:

- Procesar las definiciones de esquemas, tablas, índices, vistas, etc.
- Actualizar el diccionario de datos con esta información.

### 7. Gestor del diccionario

El diccionario (o catálogo) de datos es una base de datos interna que almacena metadatos. Este gestor:

- Administra el diccionario de datos.
- Proporciona información sobre las estructuras, restricciones, usuarios y permisos.
- Es consultado por casi todos los demás componentes del SGBD.

---

## Cómo seleccionar un SGBD

Una vez se conocen los elementos de un SGBD, los tipos de SGBD y los conceptos clave, ya se está en posición de poder elegir un SGBD teniendo en cuenta los factores que determinarán la elección.

---

### Factores para la elección del SGBD

- Tipo de datos a tratar

- Volumen de datos

- Número de usuarios y necesidad de concurrencia

- Tipo de consultas

- Coste (compra y mantenimiento), licencias

- Velocidad de lectura/escritura

- Arquitectura y conectividad (escalabilidad)

- Recursos y política de la empresa

- Seguridad (cumplimiento normativo – *compliance*)

- Requisitos del sistema

  - Integración con otras aplicaciones
  - API
  - Migración de datos

- Tipología de la base de datos (relacional, NoSQL, etc.)

- Experiencia del equipo (comunidad, documentación disponible)

- Soporte técnico

- Actualizaciones del producto

---

## Documentación

En cada instalación se deberá elaborar o rellenar una documentación con la información siguiente. Esta documentación **no será pública** y se guardará para consultas técnicas.

- Nombre y contacto de la persona instaladora
- Fecha de la instalación
- Máquina, IP, DNS, puerto(s)
- Características de la máquina
- Cómo acceder a la máquina (física, virtual, nube)
- Sistema operativo / versión
- Usuario administrador del sistema operativo
- Usuario que realiza la instalación
- Producto y versión utilizada del SGBD
- Lugares/carpetas donde se instala el producto
- Lugares/carpetas donde se instala la base de datos
- Lugares/carpetas donde están los ficheros relevantes
- Nombres de las bases de datos (CDB, PDB...)
- ... y cualquier otra información que se considere relevante

---

## Verificar los requisitos de instalación

En cada SGBD habrá unos requisitos que podemos encontrar en la documentación de cada versión del producto concreto: Oracle, PostgreSQL, MySQL, etc.

Antes de empezar la instalación, hay que conseguir y tener disponibles estos documentos.

**Verificar:**

- Requisitos de hardware
- Kernel del sistema operativo adecuado
- Comunicaciones
- Espacio libre (memoria y almacenamiento)
- Existencia de paquetes y versiones
- Variables de entorno
- Usuarios

---

## Registro de la instalación (log de la instalación)

Todos los instaladores de sistemas gestores de bases de datos guardan un registro de las operaciones realizadas durante la instalación. Este registro es útil en caso de que se produzca algún problema, para diagnosticar su motivo.

La estructura y la ubicación del registro de la instalación dependerán del SGBD.

**El DBA debe tener localizado este registro para poder consultarlo en cualquier momento y encontrar incidencias en caso de haberse producido**

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
