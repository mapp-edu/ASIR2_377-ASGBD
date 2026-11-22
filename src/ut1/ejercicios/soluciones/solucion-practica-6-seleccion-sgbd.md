---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 6: selección del SGBD"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 6: selección del SGBD

::: tip Solución de referencia
Propuesta de referencia para la [Práctica 6](../practica-6-seleccion-sgbd), con criterios para valorar otras respuestas y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

Esta práctica **no tiene una única respuesta correcta**. Lo que se evalúa es la coherencia entre los requisitos que el alumno o la alumna identifica y la elección que hace. La propuesta sirve para comprobar que los datos son correctos y para tener una referencia de lo que se considera una respuesta completa.

Los datos de licencias, precios y límites se consultaron en **octubre de 2026** (fuentes al final). Cambian con frecuencia: al corregir, acepta los datos del alumno si cita la fuente y la fecha y son coherentes con ella.

## Parte 1. Estudio de alternativas

### 1. Candidatos y posición en DB-Engines

Ranking general de DB-Engines de octubre de 2026 (puntuación de popularidad):

| Posición | SGBD | Modelo | Puntuación |
|:---:|:---|:---|---:|
| 1 | Oracle | Relacional | 1119 |
| 2 | MySQL | Relacional | 837 |
| 3 | Microsoft SQL Server | Relacional | 694 |
| 4 | PostgreSQL | Relacional | 688 |
| 5 | MongoDB | Documental | 374 |

Elección de referencia: **Oracle Database** y **Microsoft SQL Server** (comerciales), **PostgreSQL** y **MariaDB** (libres) y **MongoDB** (no relacional). MariaDB no está entre los doce primeros del ranking general, pero se incluye porque es el gestor de las prácticas y el que ofrecen la mayoría de los alojamientos web. Para el caso C también es razonable estudiar un SGBD de **series temporales**: en el ranking específico de DB-Engines destacan InfluxDB, Prometheus y TimescaleDB (una extensión de PostgreSQL).

::: tip Criterio de corrección
La puntuación de DB-Engines mide **popularidad** (búsquedas, ofertas de empleo, menciones), no calidad ni idoneidad. Si un alumno o alumna lo señala, es una evidencia de nivel 4 en 1.b.
:::

### 2. Tabla comparativa

| | Oracle AI Database 26ai | SQL Server 2025 | PostgreSQL 18 | MariaDB 11.8 LTS | MongoDB 8 |
|:---|:---|:---|:---|:---|:---|
| **Licencia** | Comercial. | Comercial. | Libre (licencia PostgreSQL, tipo BSD). | Libre (GPLv2). | Community: SSPL. Enterprise Advanced: comercial. |
| **Coste (precio de lista)** | Enterprise Edition: 47 500 $ por procesador o 950 $ por usuario nombrado; las opciones se pagan aparte (RAC: 23 000 $ por procesador). | Enterprise: unos 15 100 $ por cada 2 núcleos. Standard: unos 3 900 $ por cada 2 núcleos, o 989 $ por servidor + 230 $ por CAL. | Gratuito. Soporte opcional de empresas (EDB, Crunchy Data, etc.). | Gratuito. Suscripción opcional de MariaDB plc. | Community gratuita. Atlas (en la nube) de pago por uso. |
| **Modelo de datos** | Relacional multimodelo (JSON, espacial, grafos, vectores). | Relacional (JSON, espacial, grafos). | Objeto-relacional (JSON, extensiones como PostGIS). | Relacional (JSON, motores intercambiables). | Documental (BSON). |
| **Sistemas operativos** | Oracle Linux, RHEL, SUSE, Windows. | Windows y Linux (RHEL, SUSE, Ubuntu). | Linux, Windows, macOS, BSD. | Linux, Windows, macOS. | Linux, Windows, macOS. |
| **Edición gratuita y límites** | **Free**: 2 núcleos, 2 GB de RAM, 12 GB de datos de usuario, una instalación por máquina. | **Express**: 1 socket o 4 núcleos, 1410 MB de *buffer pool*, 50 GB por base de datos. **Developer**: completa, solo para desarrollo. | Sin límites. | Sin límites. | Community sin límites. Atlas M0: 0,5 GB, 100 operaciones/s, 500 conexiones. |
| **Alta disponibilidad** | Data Guard (incluido en EE), Active Data Guard y RAC (opciones de pago). | Grupos de disponibilidad Always On (completos en Enterprise, básicos en Standard), clúster de conmutación por error. | Replicación física y lógica integrada; conmutación automática con herramientas externas (Patroni). | Replicación, Galera Cluster, MaxScale. | Conjuntos de réplicas (*replica sets*) y fragmentación (*sharding*) integrados. |
| **Herramientas de administración** | SQL\*Plus, SQLcl, SQL Developer, Enterprise Manager, RMAN. | SSMS, `sqlcmd`, extensión para VS Code. | `psql`, pgAdmin, `pg_dump`. | `mariadb`, phpMyAdmin, HeidiSQL, `mariadb-backup`. | `mongosh`, Compass, Atlas. |
| **Soporte técnico** | Oracle Support, con contrato. | Microsoft, con contrato o Software Assurance. | Comunidad y empresas especializadas. Cada versión se mantiene 5 años (la 18 hasta noviembre de 2030). | Comunidad y MariaDB plc. | Comunidad y MongoDB Inc. |

## Parte 2. Selección para cada caso

### Caso A. Tienda en línea de una pyme

**3. Requisitos**

| Factor | Requisito |
|:---|:---|
| Tipo y volumen de datos | Estructurados (clientes, productos, pedidos). Volumen pequeño. |
| Usuarios y concurrencia | Clientes web; picos en rebajas. |
| Tipo de consultas | Transaccionales (OLTP): altas de pedidos y consultas de catálogo. |
| Coste | **Presupuesto muy ajustado**: sin licencias. |
| Escalabilidad | Moderada; picos temporales. |
| Seguridad y normativa | Datos personales (RGPD); pagos a través de la pasarela del banco, no en la base de datos. |
| Experiencia del equipo | **Sin personal propio**: mantenimiento por una empresa externa. |
| Soporte | El de la empresa externa o el del alojamiento. |

**4. Volumen**

300 pedidos/día × 365 = **109 500 pedidos al año**. Con unas tres líneas por pedido, unas 330 000 líneas. Con clientes, productos e índices, del orden de **cientos de MB al año**: cualquier SGBD lo gestiona sin problemas. En rebajas, el número de pedidos puede multiplicarse por 5 o por 10 durante unos días, y eso afecta a la concurrencia, no al volumen.

**5–6. Elección**

- **Elección: MariaDB 11.8 LTS (Community)** con InnoDB, en el alojamiento web o en un servidor gestionado.
- **Segunda opción: PostgreSQL.** Técnicamente adecuado y gratuito, pero se descarta porque las plataformas de tienda más habituales (PrestaShop, WooCommerce) funcionan sobre MySQL/MariaDB.
- **Factor decisivo:** coste cero y ecosistema. La tienda se montará casi seguro con una plataforma ya hecha y la mantendrá una empresa externa, que trabajará con lo más habitual en alojamientos.
- **Riesgo:** depender de la empresa externa para las copias de seguridad y las actualizaciones. Hay que exigirlas por contrato.

Se aceptan MySQL (equivalente) y PostgreSQL si el alumno o la alumna lo justifica (por ejemplo, con una aplicación a medida). No es coherente elegir Oracle Enterprise o SQL Server Enterprise por el coste, ni MongoDB para pedidos y pagos sin justificar cómo garantiza las transacciones.

### Caso B. Entidad financiera

**3. Requisitos**

| Factor | Requisito |
|:---|:---|
| Tipo y volumen de datos | Estructurados, críticos. Volumen alto y creciente. |
| Usuarios y concurrencia | 80 oficinas, banca en línea y cajeros: alta concurrencia. |
| Tipo de consultas | OLTP con transacciones estrictas (ACID), más informes y auditorías. |
| Coste | Hay presupuesto para licencias y soporte. |
| Escalabilidad | Alta y sin paradas. |
| Seguridad y normativa | **Ninguna transacción perdida**, **24×7**, auditorías, cifrado, normativa bancaria y RGPD. |
| Experiencia del equipo | Equipo propio de administradores. |
| Soporte | Necesario, con contrato y tiempos de respuesta garantizados. |

**4. Volumen**

El enunciado no da cifras, así que hay que **suponerlas y decirlo**. Ejemplo: 200 000 operaciones al día (ventanilla, tarjetas, transferencias) × 365 = unos **73 millones de operaciones al año**. A 1 KB por operación con índices y auditoría, unos **70 GB al año**, que se conservan durante muchos años por obligación legal.

**5–6. Elección**

- **Elección: Oracle Database Enterprise Edition** sobre Oracle Linux, con **Data Guard** (réplica en otro centro, sin pérdida de datos en modo síncrono) y, si se necesita alta disponibilidad local, la opción **RAC**.
- **Segunda opción: SQL Server Enterprise** con Always On, o PostgreSQL con soporte comercial. Se descartan por la experiencia del sector y del equipo, y por el soporte del fabricante del sistema bancario, aunque los dos podrían cumplir los requisitos técnicos.
- **Factor decisivo:** disponibilidad y no pérdida de datos con soporte del fabricante, más la normativa (cifrado, auditoría).
- **Riesgo:** coste elevado y dependencia del proveedor (*vendor lock-in*), además de la complejidad de licenciar correctamente las opciones.

### Caso C. Red de sensores

**3. Requisitos**

| Factor | Requisito |
|:---|:---|
| Tipo y volumen de datos | Series temporales: sensor, instante y valores. **Volumen muy alto**. Datos de ubicación. |
| Usuarios y concurrencia | Pocas escrituras simultáneas (2000 sensores), muchas inserciones continuas; pocos usuarios de consulta. |
| Tipo de consultas | Por intervalo de fechas y por zona; agregados (medias horarias o diarias); mapa. |
| Coste | Administración pública: preferible software libre o de bajo coste. |
| Escalabilidad | Crecimiento lineal y constante durante 5 años. |
| Seguridad y normativa | Datos ambientales, no personales; posible publicación como datos abiertos. |
| Experiencia del equipo | Desconocida: hay que suponerla. |
| Soporte | Comunidad o contrato de mantenimiento. |

**4. Volumen**

2000 sensores × 1 medida/minuto × 60 × 24 × 365 = **1 051 200 000 filas al año** (unos mil millones), y **5 256 000 000 filas en 5 años**.

Con una fila de unos 60 bytes (identificador del sensor, instante y cinco medidas, más la cabecera de cada fila), unos 60 GB al año sin índices y del orden de **100 GB al año con índices**, unos 500 GB en 5 años. Con compresión por columnas, propia de los SGBD de series temporales, se reduce mucho.

Es el dato que más pesa en la decisión y el que más errores tiene en las entregas: olvidar el factor 60 o el 24.

**5–6. Elección**

- **Elección: PostgreSQL 18 con las extensiones TimescaleDB (Community Edition) y PostGIS.** TimescaleDB divide automáticamente la tabla por intervalos de tiempo (*hypertables*), comprime los datos antiguos en formato de columnas, calcula agregados continuos (medias por hora) y borra los datos de más de 5 años con una política de retención. PostGIS resuelve las consultas «por zona» y alimenta el mapa. Todo con SQL estándar.
- **Segunda opción: InfluxDB**, diseñado para series temporales. Se descarta porque las consultas por zona y la integración con un mapa son más sencillas con PostGIS y SQL.
- **Factor decisivo:** el volumen (mil millones de filas al año) junto con las consultas por tiempo y espacio.
- **Riesgo:** la licencia. Las funciones de compresión, agregados continuos y retención de TimescaleDB están en la Community Edition, que se distribuye con la licencia propia de Tiger Data (TSL): es gratuita para uso propio, pero no permite ofrecerla como servicio a terceros. Si el ayuntamiento lo contrata a un proveedor de nube, hay que comprobarlo.

Se acepta PostgreSQL sin TimescaleDB con particionado nativo por mes, si se justifica cómo se gestiona el volumen. No es coherente elegir Oracle Free o SQL Server Express sin advertir que superan sus límites (12 GB y 50 GB) en pocas semanas o meses.

## Parte 3. Qué hace falta para instalarlo

Referencia para el **caso B (Oracle Database Enterprise Edition)**:

**7. Requisitos de hardware y comparación con la MV de clase**

| Requisito (guía de instalación de Oracle AI Database 26ai para Linux) | Valor oficial | MV de clase (práctica 1) | ¿Cumple? |
|:---|:---|:---|:---:|
| Memoria RAM | Al menos 1 GB; 2 GB recomendados | 4 GB | ✅ |
| Pantalla para el instalador gráfico | 1024 × 768 | Sí | ✅ |
| Red | Servidor conectado a la red | Sí | ✅ |
| Sistema operativo | Oracle Linux 8/9/10, RHEL 8/9/10 o SUSE 15 SP5 | Linux Mint 22 | ❌ |

Conclusión esperada: por memoria la MV serviría para pruebas, pero **Linux Mint no es un sistema operativo certificado** para Oracle Database. Habría que crear una MV con Oracle Linux 9 o usar un contenedor, que en clase solo existe para la edición Free. Para producción, el dimensionado lo marcarían la carga y el volumen calculados en la parte 2, no los mínimos de la guía.

Si el alumno o la alumna elige PostgreSQL o MariaDB, debe advertir que su documentación **no fija requisitos mínimos de hardware**: tendrá que justificar el dimensionado a partir del volumen y la concurrencia, o usar como referencia los requisitos de su distribución o de un proveedor. Señalarlo es una evidencia de nivel 3–4 en 1.e.

**8. Software necesario**

| Elemento | Detalle |
|:---|:---|
| Sistema operativo | Oracle Linux 9 (64 bits) con el núcleo UEK recomendado. |
| Dependencias | Paquete de preinstalación de Oracle para esa versión (`oracle-database-preinstall-…` en Oracle Linux), que crea el usuario `oracle`, los grupos e instala los paquetes y parámetros del núcleo. |
| Software del SGBD | Instalador de Oracle Database Enterprise Edition, de Oracle Software Delivery Cloud (con licencia) u oracle.com. |
| Alta disponibilidad | Data Guard (incluido); RAC necesita además Grid Infrastructure. |

**9. Clientes y conectores**

- **Administradores:** SQL\*Plus o SQLcl, SQL Developer, Enterprise Manager y RMAN para las copias de seguridad.
- **Aplicación:** el conector según el lenguaje: JDBC (`ojdbc`) para Java, ODP.NET para .NET, `python-oracledb` para Python. Todos usan Oracle Net (puerto 1521).

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **1.b** | Menos de cinco SGBD o datos incorrectos o sin fuente. | Tabla completa con los campos pedidos y datos correctos. | Datos actuales, con fuente y fecha de consulta para cada uno. | Además, interpreta el ranking (popularidad no es idoneidad) y señala diferencias relevantes entre ediciones. |
| **1.c** | Elige sin requisitos o con elecciones incoherentes. | Requisitos, volumen, elección y segunda opción para los tres casos. | Cada elección se justifica con los requisitos y el factor decisivo es coherente. | Identifica riesgos reales (licencias, límites de ediciones, dependencia del proveedor) y hace explícitas las suposiciones. |
| **1.d** | No identifica el software. | Sistema operativo, dependencias, clientes y conector. | Indica versiones y de dónde se descarga cada elemento. | Distingue el software para producción del de pruebas (contenedor, edición Free). |
| **1.e** | No compara requisitos. | Compara los requisitos oficiales con la MV y concluye. | La conclusión tiene en cuenta todos los requisitos, incluido el sistema operativo. | Relaciona el dimensionado con el volumen calculado en la parte 2. |

## Fuentes

Consultadas en octubre de 2026:

- [DB-Engines Ranking, octubre de 2026 (réplica en HelloGitHub)](https://hellogithub.com/en/report/db-engines) y [ranking de SGBD de series temporales](https://db-engines.com/en/ranking/time+series+dbms).
- [Oracle AI Database Free: restricciones de la licencia](https://docs.oracle.com/en/database/oracle/oracle-database/26/xeinw/licensing-restrictions.html).
- [Oracle AI Database 26ai: requisitos de hardware en Linux](https://docs.oracle.com/en/database/oracle/oracle-database/26/ladbi/server-hardware-checklist-for-oracle-database-installation.html) y [sistemas operativos certificados](https://docs.oracle.com/en/database/oracle/oracle-database/26/ladbi/operating-system-checklist-for-oracle-database-installation-on-linux.html).
- [Precios de lista de Oracle Database, edición de septiembre de 2026 (análisis de Redress Compliance)](https://redresscompliance.com/oracle-price-list-2026-key-changes-and-analysis.html).
- [Ediciones y límites de SQL Server 2025](https://learn.microsoft.com/en-us/sql/sql-server/editions-and-components-of-sql-server-2025) y [precios estimados de SQL Server 2025](https://www.licensingschool.co.uk/wp-content/uploads/2025/11/SQL-Server-2025-Pricing-Datasheet.pdf).
- [Límites del clúster gratuito de MongoDB Atlas](https://mongodb.com/docs/atlas/reference/free-shared-limitations/).
- [Ediciones y licencias de TimescaleDB](https://www.tigerdata.com/docs/get-started/choose-your-path/timescaledb-editions).
- [Ciclo de vida de PostgreSQL 18](https://endoflife.ai/postgresql/18).

---

<small>Solucionario de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
