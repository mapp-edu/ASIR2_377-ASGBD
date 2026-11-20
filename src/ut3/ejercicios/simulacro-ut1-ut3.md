---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Simulacro de examen UT1–UT3"
pageClass: ejercicios-page
---

# 📝 Simulacro de examen UT1–UT3

Unidades 1 (Implantación de SGBD), 2 (Configuración del SGBD) y 3 (Control de acceso). Resultados de aprendizaje **RA1**, **RA2** y **RA3**.

::: tip Simulacro
Este simulacro tiene la misma estructura, duración y criterios que el examen. Hazlo en las mismas condiciones para saber cómo gestionar el tiempo. Después, corrígelo con la [solución del simulacro](./solucion-simulacro-ut1-ut3).
:::

## Instrucciones

| | |
|---|---|
| **Duración** | 2 horas: orientativamente 20 minutos para la parte A y 100 para la parte B. |
| **Parte A · Cuestionario** | 20 preguntas de respuesta única, 0,2 puntos cada una (**4 puntos**). Cada respuesta errónea resta un tercio del valor de la pregunta (0,067). Las preguntas sin contestar no restan. Sin material. |
| **Parte B · Ejercicio práctico** | 4 ejercicios sobre los servidores Oracle y PostgreSQL del aula (**6 puntos**). Puedes consultar la web del módulo y la documentación oficial de Oracle y PostgreSQL. |
| **Prohibido** | Herramientas de inteligencia artificial, mensajería, correo o cualquier comunicación con otras personas. |
| **Calificación** | Nota = A + B, sobre 10. Cada apartado práctico se califica con la rúbrica del módulo (niveles 0–4). |

::: warning Entrega de la parte B
Un único documento PDF llamado `apellidos_nombre_simulacro.pdf` con, para **cada apartado**:

1. las sentencias u órdenes ejecutadas, **como texto** (no como captura);
2. la salida obtenida (texto o captura legible);
3. la justificación que se pide en el apartado (lo que está en *cursiva*).

Sin la justificación, un apartado correcto se queda en el nivel 2 (50 %).
:::

## Parte A · Cuestionario (4 puntos)

Marca una sola respuesta por pregunta.

**1.** En la arquitectura ANSI/SPARC, ¿qué nivel describe cómo se guardan físicamente los datos (ficheros, bloques, índices)? *(0,2 p · RA1.a)*

- a) El nivel de vistas de usuario
- b) El nivel conceptual
- c) El nivel externo
- d) El nivel interno

**2.** ¿Cuál de estos SGBD relacionales se distribuye con una licencia de software libre? *(0,2 p · RA1.b)*

- a) PostgreSQL
- b) IBM Db2 Community Edition
- c) Microsoft SQL Server Express
- d) Oracle Database Free

**3.** En la instalación de Oracle Free con contenedores en Linux Mint se instala el paquete podman-docker. ¿Para qué sirve? *(0,2 p · RA1.d)*

- a) Convierte las imágenes de Docker Hub al formato de Podman
- b) Proporciona una orden docker que en realidad ejecuta Podman, para poder usar la misma sintaxis
- c) Permite ejecutar contenedores sin descargar imágenes
- d) Instala Docker Engine al lado de Podman para usar los dos

**4.** Tras arrancar el contenedor de Oracle, docker ps muestra el estado «Up 2 minutes (starting)». ¿Qué significa? *(0,2 p · RA1.h)*

- a) El contenedor ha fallado y Docker lo está reiniciando
- b) La base de datos ya está abierta y acepta conexiones
- c) Docker todavía está descargando la imagen
- d) El contenedor está en marcha, pero su comprobación de salud aún no ha confirmado que la base de datos esté lista

**5.** ¿Cuáles son los puertos por defecto del listener de Oracle y del servidor PostgreSQL? *(0,2 p · RA1.j)*

- a) Oracle 1521 y PostgreSQL 3306
- b) Oracle 1521 y PostgreSQL 5432
- c) Oracle 1433 y PostgreSQL 5432
- d) Oracle 5432 y PostgreSQL 1521

**6.** Durante el arranque de una instancia Oracle, ¿en qué fase se leen los ficheros de control? *(0,2 p · RA2.a)*

- a) MOUNT
- b) OPEN
- c) NOMOUNT
- d) Al leer el fichero de parámetros (SPFILE)

**7.** En PostgreSQL, si se ejecuta pg_ctl stop sin la opción -m, ¿qué modo de parada se usa? *(0,2 p · RA2.a)*

- a) smart: espera a que se desconecten todos los clientes
- b) normal: igual que SHUTDOWN NORMAL de Oracle
- c) fast: desconecta a los clientes, deshace sus transacciones y para de forma limpia
- d) immediate: aborta sin parada limpia

**8.** ¿Qué permite esta línea de pg_hba.conf?<br>`host  ventas  maria  192.168.10.0/24  scram-sha-256` *(0,2 p · RA2.e)*

- a) Que maria se conecte a ventas solo por el socket local
- b) Que maria se conecte a ventas desde 192.168.10.0/24 sin contraseña
- c) Que maria se conecte a la base de datos ventas por TCP/IP desde la red 192.168.10.0/24 con contraseña (SCRAM)
- d) Que maria se conecte a cualquier base de datos desde cualquier equipo

**9.** Un administrador ejecuta `ALTER SYSTEM SET max_connections = 200;` en PostgreSQL. ¿Qué tiene que hacer para que se aplique? *(0,2 p · RA2.g)*

- a) Cerrar y volver a abrir su sesión
- b) Reiniciar el servidor
- c) Nada: se aplica de inmediato
- d) Ejecutar SELECT pg_reload_conf();

**10.** En la PDB FREEPDB1 se crea un usuario con CREATE USER sin indicar DEFAULT TABLESPACE. ¿Dónde se crearán sus tablas? *(0,2 p · RA2.f)*

- a) En TEMP
- b) En el tablespace por defecto de la base de datos (USERS en FREEPDB1)
- c) En ninguno: Oracle exige indicarlo
- d) En SYSTEM

**11.** Acabas de crear un usuario en Oracle y, al conectarse, obtiene ORA-01045. ¿Qué le falta? *(0,2 p · RA3.c)*

- a) Cuota en algún tablespace
- b) Desbloquear la cuenta con ACCOUNT UNLOCK
- c) El privilegio de sistema CREATE SESSION
- d) El rol RESOURCE

**12.** ¿Qué diferencia hay en Oracle entre WITH ADMIN OPTION y WITH GRANT OPTION? *(0,2 p · RA3.f)*

- a) ADMIN OPTION se usa con privilegios de sistema y roles; GRANT OPTION, con privilegios sobre objetos
- b) Ninguna, son sinónimos
- c) GRANT OPTION se usa con roles; ADMIN OPTION, con privilegios sobre objetos
- d) ADMIN OPTION solo la puede usar SYS; GRANT OPTION, cualquier usuario

**13.** A concede SELECT ON a.t a B WITH GRANT OPTION, y B lo concede a C. Después A revoca el privilegio a B. ¿Qué pasa con C? *(0,2 p · RA3.f)*

- a) La revocación falla porque C depende de B
- b) C conserva el privilegio
- c) C también lo pierde: los privilegios sobre objetos se revocan en cascada
- d) C lo conserva hasta que cierre la sesión

**14.** ¿Qué vista del diccionario de Oracle muestra los privilegios de sistema concedidos directamente al usuario conectado? *(0,2 p · RA3.d)*

- a) DBA_ROLE_PRIVS
- b) USER_SYS_PRIVS
- c) SESSION_PRIVS
- d) USER_TAB_PRIVS

**15.** ¿Qué es una vista horizontal? *(0,2 p · RA3.a)*

- a) La que muestra solo algunas filas, mediante una condición WHERE
- b) La que muestra solo algunas columnas de la tabla
- c) La que guarda físicamente el resultado de la consulta
- d) La que combina varias tablas con JOIN

**16.** ¿Qué consigue WITH CHECK OPTION en una vista? *(0,2 p · RA3.a)*

- a) Que la vista se vuelva a compilar si cambia la tabla
- b) Que Oracle compruebe los privilegios del usuario antes de cada consulta
- c) Que no se puedan insertar ni modificar a través de la vista filas que después no cumplirían su WHERE
- d) Que la vista sea de solo lectura

**17.** Existe el sinónimo público clientes para ventas.clientes. Un usuario sin ningún privilegio sobre esa tabla ejecuta `SELECT * FROM clientes;` ¿Qué ocurre? *(0,2 p · RA3.b)*

- a) Ve la estructura pero no las filas
- b) Ve los datos, porque el sinónimo es público
- c) Ve los datos solo si está en el mismo tablespace
- d) Da error: un sinónimo solo es un nombre alternativo y no concede privilegios

**18.** En PostgreSQL se ejecuta `CREATE ROLE contables; GRANT SELECT ON facturas TO contables; GRANT contables TO luis;` ¿Puede luis consultar facturas? *(0,2 p · RA3.e)*

- a) No, porque contables no tiene LOGIN
- b) Solo si luis vuelve a conectarse
- c) Solo después de ejecutar SET ROLE contables
- d) Sí, sin hacer nada más: por defecto los miembros heredan los privilegios del rol (INHERIT)

**19.** La tabla alumnos de una academia tiene una columna observaciones con valores como «Diabetes tipo 1». Según el RGPD, ¿qué tipo de dato es? *(0,2 p · RA3.h)*

- a) Un dato de categoría especial (datos de salud), con una protección reforzada
- b) Un dato público, porque lo aporta el propio alumno
- c) Un dato económico
- d) Un dato identificativo ordinario

**20.** Un usuario tiene UPDATE sobre una tabla, pero no SELECT. Ejecuta `UPDATE t SET precio = 10 WHERE id = 5;` ¿Qué pasa en PostgreSQL y en Oracle (con el valor por defecto de sql92_security)? *(0,2 p · RA3.f)*

- a) Solo funciona si la tabla tiene clave primaria
- b) Funciona: UPDATE ya incluye la lectura
- c) Funciona, pero no actualiza ninguna fila
- d) Da error: el WHERE lee la columna id y eso exige SELECT

## Parte B · Ejercicio práctico (6 puntos)

### Datos de conexión

Sustituye **NN** por tu número de cuenta (por ejemplo, `ex07`) en todos los nombres. La clave te la da el profesor.

| | Oracle | PostgreSQL |
|---|---|---|
| Servidor | `<10.2.26.84>` | `10.2.26.84` |
| Puerto | `1521` | `5432` |
| Servicio / base de datos | `FREEPDB1` | `exNN` |
| Usuario | `exNN` | `exNN` |

::: info Tu cuenta en los servidores
Todo el grupo trabaja a la vez en los mismos servidores, por eso cada persona tiene su propia cuenta con los datos ya cargados.

- **Oracle**: puedes crear usuarios, roles, perfiles y sinónimos públicos, y conceder `CREATE SESSION`, `CREATE TABLE`, `CREATE VIEW` y `CREATE SYNONYM`. No puedes modificar ni borrar usuarios directamente. Si te equivocas, usa el procedimiento del profesor, que solo actúa sobre objetos con tu prefijo:
  `EXEC examadm.gestionar('BORRAR_USUARIO', 'exNN_xxx')`. Las acciones son `BORRAR_USUARIO`, `DESBLOQUEAR`, `BORRAR_PERFIL` y `BORRAR_SINONIMO`. Los roles los puedes borrar tú con `DROP ROLE`.
- **PostgreSQL**: tienes `CREATEROLE` y eres propietario de tu base de datos `exNN`. Solo puedes gestionar los roles que crees tú.
- No puedes cambiar la configuración de los servidores: en el ejercicio 2 las sentencias de cambio **se escriben, no se ejecutan**.
:::

### Escenario

La **Academia de idiomas Babel** guarda en una base de datos a su profesorado, a su alumnado y las matrículas. La misma base de datos está cargada en los dos servidores del aula: en Oracle, en tu esquema `EXNN`; en PostgreSQL, en el esquema `academia` de tu base de datos `exNN`.

| Tabla | Columnas | Observaciones |
|---|---|---|
| `profesores` | `id_profesor`, `nombre`, `idioma`, `usuario_bd` | `usuario_bd` es el usuario de base de datos de cada docente (en Oracle, en mayúsculas: `EXNN_PROF_ANA`). |
| `alumnos` | `id_alumno`, `nombre`, `dni`, `telefono`, `email`, `observaciones`, `iban`, `id_tutor` | `observaciones` puede contener **datos de salud**. `iban` es la cuenta de cobro. `id_tutor` es el docente que tutoriza al alumno. |
| `matriculas` | `id_matricula`, `id_alumno`, `id_profesor`, `curso`, `fecha`, `importe`, `pagada` | `pagada` vale `S`/`N` en Oracle y `true`/`false` en PostgreSQL. |

La política de acceso de la academia es esta:

- **Secretaría** da de alta y modifica al alumnado y registra matrículas, pero no ve ni el IBAN ni las observaciones.
- **Profesorado**: cada docente ve solo a los alumnos que tutoriza (nombre y datos de contacto) y puede modificar únicamente sus observaciones.
- **Administración** gestiona los cobros: ve las matrículas con su importe, ve el IBAN y marca las matrículas como pagadas, pero no puede cambiar nada más.
- **Dirección** solo ve estadísticas agregadas por idioma y curso, nunca datos personales.

Secretaría y profesorado trabajan con **Oracle**; administración y dirección, con **PostgreSQL**.


### Ejercicio 1. Conexión a los servidores (0,5 p · RA1)

Comprueba que puedes trabajar con los dos SGBD instalados en el servidor del aula.

#### 1.1 Conexión a Oracle · 0,25 p

*Criterios: RA1.j (0,25)*

Conéctate desde tu equipo a la PDB **FREEPDB1** del servidor Oracle con tu usuario `exNN` (con SQL Developer, SQL*Plus, SQLcl o DBeaver). Muestra la cadena o los datos de conexión que has usado y ejecuta una consulta que muestre: el contenedor al que estás conectado, tu usuario, la versión completa de Oracle y el nombre y el estado de la instancia.

*Justifica* por qué te conectas al servicio `FREEPDB1` y no al servicio `FREE`.

#### 1.2 Conexión a PostgreSQL · 0,25 p

*Criterios: RA1.j (0,25)*

Conéctate con `psql` (u otro cliente) a tu base de datos `exNN` del servidor PostgreSQL con el usuario `exNN`. Muestra la orden de conexión y una consulta que muestre la versión del servidor, tu usuario, la base de datos y el puerto. Muestra también la salida de `\conninfo`.

*Justifica* qué pasaría si intentaras conectarte a la base de datos de un compañero (`exMM`).

### Ejercicio 2. Configuración de los SGBD (0,5 p · RA2)

Tu usuario no puede cambiar la configuración del servidor. Consulta los valores actuales y **escribe, sin ejecutarlas**, las sentencias que usaría el administrador, indicando cómo y dónde se aplican.

#### 2.1 Parámetros de conexiones en Oracle · 0,25 p

*Criterios: RA2.g (0,25)*

Consulta en `v$parameter` el valor actual de `processes`, `sessions` y `open_cursors`, y si cada uno se puede modificar en caliente (`issys_modifiable`) y desde la PDB (`ispdb_modifiable`).

La academia prevé llegar a **300 conexiones simultáneas**. Escribe la sentencia para dejar `processes` en 300 e indica desde qué contenedor, con qué usuario y con qué `SCOPE` se debe ejecutar, y si hay que reiniciar. *Justifícalo* con la consulta anterior.

#### 2.2 Acceso por red y tiempos de espera en PostgreSQL · 0,25 p

*Criterios: RA2.e (0,15) · RA2.g (0,1)*

Consulta en `pg_settings` el valor y el contexto (`context`) de `listen_addresses`, `port`, `max_connections` e `idle_session_timeout`.

Después escribe (sin ejecutarlos):

1. La línea de `pg_hba.conf` que permita al usuario `exNN_adm_jordi` (lo crearás en el ejercicio 4) conectarse **solo** a la base de datos `exNN`, **solo** desde la red de administración `10.0.20.0/24` y con contraseña cifrada. Indica en qué posición del fichero la pondrías.
2. La sentencia que cierre las sesiones inactivas (sin transacción abierta) a los 15 minutos.

Indica cómo se aplica cada cambio (recarga o reinicio) y *justifícalo*.

### Ejercicio 3. Control de acceso en Oracle: secretaría y profesorado (2,5 p · RA3)

Trabaja en la PDB `FREEPDB1` con tu usuario `exNN`. Los usuarios, roles, perfiles y sinónimos públicos son **globales**: su nombre debe empezar por `exNN_` (por ejemplo, `ex07_prof_ana`). Las vistas y los sinónimos privados están en un esquema y no necesitan el prefijo.

#### 3.1 Perfil y usuarios · 0,5 p

*Criterios: RA3.c (0,3) · RA3.h (0,2)*

Crea el perfil `exNN_perfil_personal` con estas limitaciones: como máximo **2 sesiones** simultáneas por usuario, desconexión tras **15 minutos** de inactividad, bloqueo de la cuenta tras **3 intentos** fallidos de inicio de sesión y bloqueo durante **1 hora**.

Crea los usuarios `exNN_sec_rosa` (secretaría), `exNN_prof_ana` y `exNN_prof_marc` (profesorado), con el perfil anterior, tablespace por defecto `USERS` y la contraseña que elijas (indícala en la entrega). *Justifica* qué riesgo reduce cada límite del perfil.

#### 3.2 Vistas personalizadas · 0,75 p

*Criterios: RA3.a (0,75)*

Crea en tu esquema estas vistas:

- `v_profesores`: identificador, nombre e idioma de cada docente (para todo el personal).
- `v_sec_alumnos`: todos los alumnos con identificador, nombre, DNI, teléfono, correo y tutor, **sin** IBAN ni observaciones. Secretaría debe poder dar de alta y modificar alumnos **a través de ella**.
- `v_prof_alumnos`: identificador, nombre, teléfono, correo y observaciones **solo de los alumnos que tutoriza el docente conectado**. Debe impedir que, a través de la vista, un alumno quede fuera de ella.

*Justifica* el tipo de cada vista (horizontal, vertical o mixta) y cómo se identifica al docente conectado.

#### 3.3 Roles y privilegios · 0,5 p

*Criterios: RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15)*

Crea estos roles y concédelos:

- `exNN_r_personal`: iniciar sesión y consultar `v_profesores`.
- `exNN_r_secretaria`: incluye `exNN_r_personal`; consultar, insertar y modificar alumnos a través de `v_sec_alumnos`; consultar y registrar matrículas.
- `exNN_r_profesorado`: incluye `exNN_r_personal`; consultar `v_prof_alumnos` y modificar **solo** la columna `observaciones`.

Concede `exNN_r_secretaria` a Rosa y `exNN_r_profesorado` a Ana y a Marc. Ningún usuario debe recibir privilegios directamente salvo lo que pida el apartado 3.4. *Justifica* por qué se usan roles anidados.

#### 3.4 Sinónimos · 0,25 p

*Criterios: RA3.b (0,25)*

1. Crea el sinónimo público `exNN_mis_alumnos` para la vista `v_prof_alumnos`, de modo que cada docente la pueda consultar sin escribir el esquema.
2. Rosa quiere escribir `SELECT * FROM alumnos` para trabajar con `v_sec_alumnos`. Dale **solo** el privilegio que necesita, conéctate como Rosa y crea en su esquema el sinónimo privado `alumnos`.

*Justifica* si un sinónimo concede algún permiso.

#### 3.5 Verificación · 0,5 p

*Criterios: RA3.d (0,3) · RA3.h (0,2)*

Demuestra que la política se cumple. Para ello:

1. Conéctate como **Ana** y prueba: ver tus alumnos (con el sinónimo público), cambiar las observaciones de uno de tus alumnos, cambiar su teléfono, cambiar las observaciones de un alumno de Marc y leer la tabla `alumnos`. Consulta `SESSION_ROLES` y `USER_RESOURCE_LIMITS`.
2. Como `exNN`, **vuelve a conectarte** y consulta en el diccionario los privilegios que has concedido sobre tus objetos (de tabla y de columna) y los privilegios y roles de tus roles.

Presenta un **cuadro de pruebas** (prueba · resultado esperado · resultado obtenido) y *justifica* por qué la política protege los datos de salud y bancarios según el RGPD.

### Ejercicio 4. Control de acceso en PostgreSQL: administración y dirección (2,5 p · RA3)

Trabaja en tu base de datos `exNN` (esquema `academia`) con tu usuario `exNN`, que tiene el atributo `CREATEROLE`. Como en Oracle, los nombres de los roles empiezan por `exNN_`. Recuerda que en tu base de datos nadie tiene `CONNECT` salvo tú.

#### 4.1 Usuarios y rol base · 0,5 p

*Criterios: RA3.c (0,3) · RA3.h (0,2)*

Crea:

- El rol de grupo `exNN_r_base` (sin inicio de sesión) con lo imprescindible para entrar en tu base de datos y usar el esquema `academia`.
- El usuario `exNN_adm_jordi` (administración), con como máximo **2 conexiones** simultáneas.
- El usuario `exNN_dir_elena` (dirección), con como máximo **1 conexión**.

Las dos cuentas deben caducar el **30 de junio de 2027**. *Justifica* cada atributo.

#### 4.2 Vistas · 0,5 p

*Criterios: RA3.a (0,5)*

Crea en el esquema `academia`:

- `v_adm_matriculas`: cada matrícula con su identificador, el **nombre** del alumno, el idioma, el curso, la fecha, el importe y si está pagada.
- `v_adm_cobros`: identificador, nombre, DNI e IBAN de cada alumno.
- `v_dir_estadisticas`: por idioma y curso, el número de matrículas, el importe total y el porcentaje de matrículas pagadas.

*Justifica* si `v_adm_matriculas` es actualizable y cómo podrá administración marcar las matrículas como pagadas.

#### 4.3 Roles y privilegios · 0,5 p

*Criterios: RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15)*

Crea los roles `exNN_r_administracion` y `exNN_r_direccion`, miembros de `exNN_r_base`:

- **Administración**: consultar `v_adm_matriculas` y `v_adm_cobros`, y marcar matrículas como pagadas, sin poder cambiar ninguna otra columna.
- **Dirección**: consultar `v_dir_estadisticas`.

Concede cada rol a su usuario. *Justifica* los privilegios de columna que concedes.

#### 4.4 Ruta de búsqueda · 0,25 p

*Criterios: RA3.b (0,25)*

Haz que Jordi y Elena puedan escribir `SELECT * FROM v_adm_matriculas` (o `v_dir_estadisticas`) sin indicar el esquema cuando se conectan a `exNN`. *Justifica* por qué no basta con configurarlo en los roles de grupo.

#### 4.5 Cambios en la política y verificación · 0,75 p

*Criterios: RA3.f (0,2) · RA3.c (0,15) · RA3.e (0,15) · RA3.d (0,25)*

Conéctate como **Jordi** y comprueba que puede consultar las vistas y marcar el pago de la matrícula 3, pero no cambiar su importe. Después aplica estos cambios:

1. Por una nueva instrucción interna, administración **deja de ver el IBAN**, pero sigue consultando nombre y DNI en `v_adm_cobros`.
2. Elena deja la academia y se **suprime la dirección** en la base de datos: borra su usuario y el rol `exNN_r_direccion`.

Por último, consulta en el catálogo los privilegios de las tablas y vistas de `academia` y la pertenencia a roles, y *justifica* los errores que aparezcan durante los cambios y cómo los resuelves.

## Ponderación

Cada pregunta del test y cada apartado práctico están vinculados a los criterios de evaluación (CE) de los resultados de aprendizaje del módulo.

| Elemento | RA | Criterios (puntos) | Puntos |
|---|---|---|---:|
| Test, preguntas 1–5 | RA1 | RA1.a (0,2) · RA1.b (0,2) · RA1.d (0,2) · RA1.h (0,2) · RA1.j (0,2) | 1 |
| Test, preguntas 6–10 | RA2 | RA2.a (0,4) · RA2.e (0,2) · RA2.g (0,2) · RA2.f (0,2) | 1 |
| Test, preguntas 11–20 | RA3 | RA3.c (0,2) · RA3.f (0,6) · RA3.d (0,2) · RA3.a (0,4) · RA3.b (0,2) · RA3.e (0,2) · RA3.h (0,2) | 2 |
| Práctico 1.1 Conexión a Oracle | RA1 | RA1.j (0,25) | 0,25 |
| Práctico 1.2 Conexión a PostgreSQL | RA1 | RA1.j (0,25) | 0,25 |
| Práctico 2.1 Parámetros de conexiones en Oracle | RA2 | RA2.g (0,25) | 0,25 |
| Práctico 2.2 Acceso por red y tiempos de espera en PostgreSQL | RA2 | RA2.e (0,15) · RA2.g (0,1) | 0,25 |
| Práctico 3.1 Perfil y usuarios | RA3 | RA3.c (0,3) · RA3.h (0,2) | 0,5 |
| Práctico 3.2 Vistas personalizadas | RA3 | RA3.a (0,75) | 0,75 |
| Práctico 3.3 Roles y privilegios | RA3 | RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15) | 0,5 |
| Práctico 3.4 Sinónimos | RA3 | RA3.b (0,25) | 0,25 |
| Práctico 3.5 Verificación | RA3 | RA3.d (0,3) · RA3.h (0,2) | 0,5 |
| Práctico 4.1 Usuarios y rol base | RA3 | RA3.c (0,3) · RA3.h (0,2) | 0,5 |
| Práctico 4.2 Vistas | RA3 | RA3.a (0,5) | 0,5 |
| Práctico 4.3 Roles y privilegios | RA3 | RA3.e (0,2) · RA3.f (0,15) · RA3.g (0,15) | 0,5 |
| Práctico 4.4 Ruta de búsqueda | RA3 | RA3.b (0,25) | 0,25 |
| Práctico 4.5 Cambios en la política y verificación | RA3 | RA3.f (0,2) · RA3.c (0,15) · RA3.e (0,15) · RA3.d (0,25) | 0,75 |

### Resumen por resultado de aprendizaje

| RA | Test | Práctico | Total (sobre 10) | Peso del RA en el módulo |
|---|---:|---:|---:|---:|
| RA1 | 1 | 0,5 | **1,5** | 5 % |
| RA2 | 1 | 0,5 | **1,5** | 5 % |
| RA3 | 2 | 5 | **7** | 25 % |
| **Total** | **4** | **6** | **10** | |

### Rúbrica de los apartados prácticos

Cada apartado se califica de 0 a 4 y se obtiene el porcentaje correspondiente de su valor. El nivel 2 es el mínimo para considerar superado el apartado.

| Nivel | Descripción | Puntos del apartado |
|---|---|---|
| 0 | No entregado o sin relación con lo solicitado. | 0 % |
| 1 | Incompleto o incorrecto. Faltan elementos esenciales. | 25 % |
| 2 | Correcto y completo, pero sin justificar las decisiones. | 50 % |
| 3 | Correcto, completo y justificado. | 75 % |
| 4 | Además, coherente con el resto del ejercicio y bien comunicado. | 100 % |
