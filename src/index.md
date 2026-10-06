# Guía Didáctica ASGBD

## Administración de Sistemas Gestores de Bases de Datos

::: tip Información del Curso

**Profesor:** Miquel Àngel París i Peñaranda

**Ciclo Formativo:** Administración de Sistemas Informáticos en Red (ASIR)

**Familia Profesional:** Informática y Comunicaciones

**Curso:** Segundo

**Horas semanales:** 2 hora (modalidad online)

**Horas totales:** 67 horas (de las 2000 del ciclo formativo)

**Año Académico:** 2026-2027

**Centro:** IES Serpis

<table>
<tr>
<td><img src="/img/logo-centro.png" alt="Logo Centro" width="150"/></td>
<td><img src="/img/logo-gva.png" alt="Logo GVA" width="150"/></td>
</tr>
</table>

:::

::: info Descripción del Curso

El módulo de Administración de Sistemas Gestores de Bases de Datos capacita al alumnado para instalar, configurar, asegurar, automatizar, optimizar y dotar de alta disponibilidad a los sistemas gestores de bases de datos (SGBD) que sustentan la información de las organizaciones. Es una de las competencias más demandadas en el perfil de administrador de sistemas, tanto en departamentos de TI propios como en proveedores de alojamiento y servicios cloud.

El módulo se relaciona con Implantación de Aplicaciones Web (que consume las bases de datos administradas aquí), con Servicios de Red e Internet y con Seguridad y Alta Disponibilidad, y constituye una base directa para el módulo de Formación en Centros de Trabajo, en el que buena parte del alumnado desempeñará tareas de administración de MySQL/MariaDB, PostgreSQL o SQL Server.

  > Aunque las líneas generales se mantendrán durante todo el curso, esta guía es un documento vivo que puede ir actualizándose (básicamente aclaraciones) a lo largo del curso. Todas las modificaciones serán notificadas a través del foro de _Novedades_ del aula del módulo.
:::

## Objetivos de Aprendizaje {.animate-title}

En este módulo trabajarás competencias profesionales y personales que te preparan para tu futura vida laboral.

::: details Objetivos Generales del Curso

Los objetivos generales de este módulo formativo son los siguientes:

 **OG1: Instalación y ajuste de un SGBD corporativo**: 

Implantar sistemas gestores de bases de datos corporativos analizando sus caraterísticas y ajustándose a los requerimientos del sistema.

Configurar el sistema gestor de bases de datos corporativo interpretando las especificaciones técnicas y los requisitos de explotación.

Aplicar criterios de disponibilidad analizándoloes y ajustando la configuración del sistema gestor de bases de datos corporativo

Optimizar el rendimiento del sistema aplicando técnicas de monitoreo y realizando adaptaciones.

---

**OG2: Lenguajes SQL: DCL y extensión procedimental**:

Implantar métodos de control de acceso utilizando asistentes, herramientas gráficas y comandos del lenguaje del sistema gestor de bases de datos corporativo.

Desarrollar procedimientos almacenados evaluando y utilizando las sentencias del lenguaje incorporado en el sistema gestor de bases de datos corporativo.

:::

### Competencias a Desarrollar

El módulo desarrolla las siguientes competencias profesionales y para la empleabilidad del ciclo.

---

### Competencias Técnicas del Módulo

::: details Competencias Técnicas

* Administrar servicios de red (web, mensajería electrónica y transferencia de archivos, entre otros) instalando y configurando el software, en condiciones de calidad.
* Implantar y gestionar bases de datos instalando y administrando el software de gestión en condiciones de calidad, según las características de la explotación.
* Asegurar el sistema y los datos según las necesidades de uso y las condiciones de seguridad establecidas para prevenir fallos y ataques externos.
* Administrar usuarios de acuerdo a las especificaciones de explotación para garantizar los accesos y la disponibilidad de los recursos del sistema.
* Diagnosticar las disfunciones del sistema y adoptar las medidas correctivas para restablecer su funcionalidad.

:::

### Resultados de aprendizaje

Los resultados de aprendizaje y los criterios de evaluación de este módulo son los que fijan en el real decreto del título: **RD 1629/2009**.

::: details RA1 · Implanta sistemas gestores de bases de datos analizando sus características y ajustándose a los requerimientos del sistema.

| CE | Texto literal |
| :---: | :--- |
| a | Se ha reconocido la utilidad y función de cada uno de los elementos de un sistema gestor de bases de datos. |
| b | Se han analizado las características de los principales sistemas gestores de bases de datos. |
| c | Se ha seleccionado el sistema gestor de bases de datos. |
| d | Se ha identificado el software necesario para llevar a cabo la instalación. |
| e | Se ha verificado el cumplimiento de los requisitos hardware. |
| f | Se han instalado sistemas gestores de bases de datos. |
| g | Se ha documentado el proceso de instalación. |
| h | Se ha interpretado la información suministrada por los mensajes de error y ficheros de registro. |
| i | Se han resuelto las incidencias de la instalación. |
| j | Se ha verificado el funcionamiento del sistema gestor de bases de datos. |

:::

::: details RA2 · Configura el sistema gestor de bases de datos interpretando las especificaciones técnicas y los requisitos de explotación.

| CE | Texto literal |
| :---: | :--- |
| a | Se han descrito las condiciones de inicio y parada del sistema gestor. |
| b | Se ha seleccionado el motor de base de datos. |
| c | Se han asegurado las cuentas de administración. |
| d | Se han configurado las herramientas y software cliente del sistema gestor. |
| e | Se ha configurado la conectividad en red del sistema gestor. |
| f | Se han definido las características por defecto de las bases de datos. |
| g | Se han definido los parámetros relativos a las conexiones (tiempos de espera, número máximo de conexiones, entre otros). |
| h | Se ha documentado el proceso de configuración. |

:::

::: details RA3 · Implanta métodos de control de acceso utilizando asistentes, herramientas gráficas y comandos del lenguaje del sistema gestor.

| CE | Texto literal |
| :---: | :--- |
| a | Se han creado vistas personalizadas para cada tipo de usuario. |
| b | Se han creado sinónimos de tablas y vistas. |
| c | Se han definido y eliminado cuentas de usuario. |
| d | Se han identificado los privilegios sobre las bases de datos y sus elementos. |
| e | Se han agrupado y desagrupado privilegios. |
| f | Se han asignado y eliminado privilegios a usuarios. |
| g | Se han asignado y eliminado grupos de privilegios a usuarios. |
| h | Se ha garantizando el cumplimiento de los requisitos de seguridad. |

:::

::: details RA4 · Automatiza tareas de administración del gestor describiéndolas y utilizando guiones de sentencias.

| CE | Texto literal |
| :---: | :--- |
| a | Se ha reconocido la importancia de automatizar tareas administrativas. |
| b | Se han descrito los distintos métodos de ejecución de guiones. |
| c | Se han identificado las herramientas disponibles para redactar guiones. |
| d | Se han definido y utilizado guiones para automatizar tareas. |
| e | Se han identificado los eventos susceptibles de activar disparadores. |
| f | Se han definido disparadores. |
| g | Se han utilizado estructuras de control de flujo. |
| h | Se han adoptado medidas para mantener la integridad y consistencia de la información. |

:::

::: details RA5 · Optimiza el rendimiento del sistema aplicando técnicas de monitorización y realizando adaptaciones.

| CE | Texto literal |
| :---: | :--- |
| a | Se han identificado las herramientas de monitorización disponibles para el sistema gestor. |
| b | Se han descrito las ventajas e inconvenientes de la creación de índices. |
| c | Se han creado índices en tablas y vistas. |
| d | Se ha optimizado la estructura de la base de datos. |
| e | Se han optimizado los recursos del sistema gestor. |
| f | Se ha obtenido información sobre el rendimiento de las consultas para su optimización. |
| g | Se han programado alertas de rendimiento. |
| h | Se han realizado modificaciones en la configuración del sistema operativo para mejorar el rendimiento del gestor. |

:::

::: details RA6 · Aplica criterios de disponibilidad analizándolos y ajustando la configuración del sistema gestor.

| CE | Texto literal |
| :---: | :--- |
| a | Se ha reconocido la utilidad de las bases de datos distribuidas. |
| b | Se han descrito las distintas políticas de fragmentación de la información. |
| c | Se ha implantado una base de datos distribuida homogénea. |
| d | Se ha creado una base de datos distribuida mediante la integración de un conjunto de bases de datos preexistentes. |
| e | Se ha configurado un «nodo» maestro y varios «esclavos» para llevar a cabo la replicación del primero. |
| f | Se ha configurado un sistema de replicación en cadena. |
| g | Se ha comprobado el efecto de la parada de determinados nodos sobre los sistemas distribuidos y replicados. |

:::

## Evaluación {.animate-title}

La evaluación es **continua**.

Lo que se califica son los **resultados de aprendizaje**: lo que debes ser capaz de hacer cuando acabes el módulo.

### Rúbrica común

Todo se califica con la misma escala de niveles, aplicada a lo que se pide en cada pieza.
Esta tabla es la **rúbrica**: dice qué hace falta para llegar a cada nivel.

| Nivel | Descripción |
|:---:|:---|
| **0** | No entregado o sin relación con lo solicitado. |
| **1** | Incompleto o incorrecto. Faltan elementos esenciales. |
| **2** | Correcto y completo, pero sin justificar las decisiones. |
| **3** | Correcto, completo y justificado. |
| **4** | Además, coherente con el resto del proyecto y bien comunicado. |

### De los niveles a la nota

Cada elemento evaluable se puntúa en la escala 0-4. La conversión a puntuación es directa
y proporcional:

| Nivel | 0 | 1 | 2 | 3 | 4 |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Puntuación sobre 10** | 0 | 2,5 | **5** | 7,5 | 10 |

El **nivel 2 es el mínimo para superar** cualquier instrumento.

### Segunda convocatoria

Quien no supere la primera convocatoria, tenga algún módulo pendiente o renuncie a ella, dispone de una **segunda convocatoria**.

Los cuatro instrumentos, sus pesos, sus notas mínimas y la rúbrica son **los mismos** que en la primera convocatoria. 

Puedes partir del trabajo que ya tenías y mejorarlo, pero la calificación se construye entera sobre lo entregado y defendido en la segunda convocatoria.

## Análisis del stack tecnológico del sector {.animate-title}

Se ha realizado un análisis del stack tecnológico que emplean actualmente las empresas dedicadas a la administración de sistemas gestores de bases de datos, con el fin de que las herramientas y prácticas del módulo respondan a la realidad del mercado laboral. A continuación se resume dicho informe.

### Sistemas gestores de bases de datos comerciales

::: details  

* Oracle Database — el SGBD comercial de referencia en grandes corporaciones, banca y administración pública, con funcionalidades avanzadas de alta disponibilidad (RAC, Data Guard).
* Microsoft SQL Server — muy extendido en organizaciones con infraestructura Microsoft, integrado con Windows Server y Active Directory, con SQL Server Management Studio (SSMS) y SQL Server Agent para automatización.
* IBM Db2 — presente en grandes entornos corporativos y mainframe, minoritario en pymes.

:::

### Sistemas gestores de bases de datos libres

::: details

* MySQL / MariaDB — el binomio libre más extendido, base de la mayoría de aplicaciones web y CMS del mercado; MariaDB es el fork por defecto en Debian/Ubuntu tras la adquisición de MySQL por Oracle.
* PostgreSQL — SGBD libre en fuerte expansión, valorado por su cumplimiento del estándar SQL, sus tipos de datos avanzados y su fiabilidad transaccional; cada vez más elegido para nuevos proyectos frente a MySQL.
* SQLite — motor embebido sin servidor, utilizado en aplicaciones locales y de bajo volumen.

Dado que el currículo exige analizar y comparar las características de varios SGBD (CE 1.b) se trabajará con dos motores libres de forma comparada: MariaDB, como motor principal por su presencia mayoritaria en el tejido empresarial valenciano (hosting, pymes, aplicaciones LAMP) y PostgreSQL, como segundo motor para contrastar arquitectura, tipos de datos y mecanismos de replicación. Se estudiarán además, a nivel comparativo y sin instalación, Oracle Database y SQL Server, por su relevancia en grandes organizaciones.

:::

### Herramientas cliente y de administración

::: details

* MySQL Workbench y phpMyAdmin — administración gráfica y por consola web de MySQL/MariaDB.
* pgAdmin — herramienta gráfica de referencia para PostgreSQL.
* DBeaver — cliente universal multi-SGBD muy utilizado en departamentos de sistemas por su compatibilidad con múltiples motores desde una única interfaz.
* SQL Server Management Studio (SSMS) y Azure Data Studio — herramientas de administración de SQL Server.

El módulo utilizará DBeaver como cliente universal para las prácticas comparativas, complementado con phpMyAdmin y pgAdmin para las tareas específicas de cada motor.

:::
### Automatización y scripting de administración

::: details

* Guiones SQL/PL (procedimientos almacenados, funciones y disparadores) ejecutados mediante el propio intérprete del SGBD.
* Programadores de tareas del sistema operativo (cron en Linux, Programador de tareas en Windows) para lanzar guiones de mantenimiento y copias de seguridad.
* SQL Server Agent y pgAgent — planificadores de tareas integrados en SQL Server y PostgreSQL respectivamente.
* Herramientas de infraestructura como código (Ansible, scripts bash) para automatizar despliegues repetibles de SGBD en varios servidores.

:::

### Monitorización y optimización del rendimiento

::: details

* Percona Monitoring and Management (PMM) — suite libre muy utilizada para monitorizar MySQL/MariaDB y PostgreSQL en producción.
* MySQL Enterprise Monitor y Performance Schema — herramientas nativas de MySQL/MariaDB para el análisis de consultas lentas.
* pg_stat_statements y herramientas nativas de PostgreSQL para el análisis del plan de ejecución (EXPLAIN ANALYZE).
* Prometheus + Grafana — pila de monitorización genérica, cada vez más habitual para supervisar SGBD junto con el resto de la infraestructura.

Se trabajarán las herramientas nativas de cada motor (Performance Schema/slow query log en MariaDB, EXPLAIN ANALYZE y pg_stat_statements en PostgreSQL) y se introducirá Grafana como panel de visualización de métricas, por ser el estándar de facto en monitorización de infraestructuras.

:::

### Alta disponibilidad, distribución y replicación

::: details

* Replicación maestro-esclavo (master-slave) y basada en GTID en MySQL/MariaDB, ampliamente utilizada para escalado de lectura y tolerancia a fallos.
* Galera Cluster / MariaDB Cluster — replicación síncrona multi-maestro para alta disponibilidad.
* Streaming replication y logical replication en PostgreSQL.
* Sharding y particionado horizontal en sistemas de gran volumen.
* Servicios de bases de datos gestionadas en la nube (Amazon RDS/Aurora, Azure SQL Database, Google Cloud SQL), que automatizan buena parte de la replicación y las copias de seguridad y son cada vez más utilizados por las empresas en lugar de gestionar el SGBD en servidores propios.

El módulo trabajará la replicación maestro-esclavo y en cadena con MariaDB, por ser la configuración más demandada y la que mejor ilustra los conceptos del currículo (RA6), e introducirá como referencia comparativa la replicación de PostgreSQL y las bases de datos gestionadas en la nube.

:::

### Seguridad y normativa

::: details

* Gestión de cuentas, roles y privilegios mínimos necesarios (principio de mínimo privilegio).
* Cifrado de conexiones (TLS) y de datos en reposo.
* Copias de seguridad automatizadas (mysqldump, mariabackup, pg_dump, pg_basebackup).
* Cumplimiento del Reglamento General de Protección de Datos (RGPD) y de la Ley Orgánica de Protección de Datos y Garantía de los Derechos Digitales (LOPDGDD), de obligada referencia al gestionar datos de carácter personal.

:::

### Síntesis: stack tecnológico de referencia del módulo

::: details
| Ámbito | Tecnología seleccionada para el aula |
|:---|:---|
| Sistema operativo base | Ubuntu Server LTS |
| SGBD principal | MariaDB |
| SGBD comparativo | PostgreSQL |
| SGBD comerciales de referencia (estudio, sin instalación) | Oracle Database, Microsoft SQL Server |
| Herramientas cliente | DBeaver, phpMyAdmin, pgAdmin |
| Automatización | Procedimientos almacenados, disparadores, cron / SQL Server Agent |
| Monitorización | Slow query log, Performance Schema, EXPLAIN ANALYZE, Grafana |
| Alta disponibilidad | Replicación maestro-esclavo y en cadena (MariaDB), streaming replication (PostgreSQL) |
| Seguridad y normativa | TLS, copias de seguridad, RGPD/LOPDGDD |

:::

## Resultados de aprendizaje y su relación con las unidades de trabajo

El módulo se organiza en 6 unidades de trabajo (UT), cada una vinculada a un resultado de aprendizaje (RA) del currículo oficial, de manera que la superación de la unidad implica la evaluación de los criterios asociados a dicho RA.

| UT | Título de la unidad de trabajo | RA | Horas |
|:---:|:---|:---:|:---:|
| [UT1](/ut1/) | [Implantación de sistemas gestores de bases de datos](/ut1/) | RA1 | 10 |
| [UT2](/ut2/) | [Configuración del sistema gestor de bases de datos](/ut2/) | RA2 | 10 |
| [UT3](/ut3/) | [Control de acceso: usuarios, vistas y privilegios](/ut3/) | RA3 | 10 |
| [UT4](/ut4/) | [Automatización de tareas de administración](/ut4/) | RA4 | 14 |
| [UT5](/ut5/) | [Optimización del rendimiento](/ut5/) | RA5 | 13 |
| [UT6](/ut6/) | [Disponibilidad: bases de datos distribuidas y replicadas](/ut6/) | RA6 | 10 |

Cada unidad incluye la teoría en dos versiones paralelas (**Oracle** y **PostgreSQL**), las prácticas con su rúbrica y un cuestionario de autoevaluación.

## Créditos y licencia

Los contenidos y las prácticas de las unidades son una adaptación al castellano y al formato EduPress de los materiales del módulo ASGBD publicados por **Enrique Iborra** (IES Sant Vicent Ferrer, Algemesí) en [enriqueiborra.github.io/ASGBD](https://enriqueiborra.github.io/ASGBD/) ([repositorio](https://github.com/EnriqueIborra/ASGBD)), con licencia [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).

Esta adaptación se comparte con la misma licencia: puedes copiarla y adaptarla sin fines comerciales, citando la autoría y compartiendo el resultado con la misma licencia.
