# Notas de la adaptación de los materiales de ASGBD

Este documento no se publica en el sitio: recoge qué se ha adaptado, de dónde sale cada página y qué se ha corregido o ha quedado pendiente.

## Origen y licencia

- Materiales originales: **Enrique Iborra**, <https://github.com/EnriqueIborra/ASGBD> (sitio: <https://enriqueiborra.github.io/ASGBD/>), en valenciano.
- Licencia del sitio original: CC BY-NC-SA 4.0. La adaptación se publica con la misma licencia (pie del sitio en `src/.vitepress/config/project.ts`) y cada página lleva la atribución al final.
- La guía «Cómo hacer un trabajo de clase» indica CC BY-SA 4.0 en el original y así se ha mantenido en su pie.

## Estructura generada

Una unidad por resultado de aprendizaje (`src/ut1` … `src/ut6`), cada una con:

| Ruta | Contenido |
|:---|:---|
| `index.md` | Portada: RA, peso, criterios de evaluación y mapa de la unidad |
| `contenidos/` | Conceptos comunes a los dos motores (y repaso previo en UT2) |
| `contenidos/oracle/` | Teoría en versión Oracle |
| `contenidos/postgresql/` | Teoría en versión PostgreSQL |
| `ejercicios/` | Prácticas con rúbrica, guías de apoyo y cuestionario de autoevaluación |

Total: 60 páginas de teoría, 24 prácticas con rúbrica (13 adaptadas y 11 de elaboración propia), 12 guías de apoyo, 6 cuestionarios, 6 índices de actividades y 6 portadas. Las imágenes están en `src/public/img/contenidos/ut*/`.

### Correspondencia con el original

| Unidad | Páginas HTML de origen (`docs/`) | PDF de origen |
|:---|:---|:---|
| UT1 | `instalacio-sgbd.html`, `instalacio-sgbd_p.html` | `UD1/*` (guías), `PLALOE_EXTR/01`–`07` |
| UT2 | `configuracio-sgbd[_p].html`, `repas-E-R.html`, `repas-sql.html`, `dates-en-oracle.html` | `UD2/*` (guías), `PLALOE_EXTR/08` |
| UT3 | `usuaris-privilegis[_p].html`, `seguretat-mecanismes[_p].html` | `UD3/3.1.1`–`3.1.3`, `PLALOE_EXTR/09`–`10` |
| UT4 | `automatitzacio-tasques[_p].html` | `UD4/4.3`, `4.4`, `PLALOE_EXTR/11`–`12` |
| UT5 | `optimitzacio-sgbd[_p].html` | — |
| UT6 | `disponibilitat-sgbd[_p].html` | — |

Los cuestionarios salen de `docs/preguntes/*.json`.

No se han incluido: las presentaciones en PDF (su contenido es el de las páginas HTML), los resúmenes `z_resumen` y el programa de recuperación (`PLALOE_EXTR/00`).

## Criterios de la adaptación

- Traducción al castellano con tuteo. Los **identificadores del código** (tablas, columnas, variables, usuarios: `alumnes`, `nom`, `usuari1`…) se han dejado como en el original para no romper los ejemplos; sí se han traducido los comentarios y los mensajes de salida.
- Las secciones idénticas en las versiones Oracle y PostgreSQL del original se han unificado en páginas de «Conceptos comunes».
- Las capturas de pantalla de las guías en PDF no se han trasladado: la salida de los terminales se ha transcrito como texto.
- Algunas imágenes del original contienen texto en valenciano o en inglés.
- Las rúbricas de las prácticas usan los criterios de evaluación literales del RA de cada unidad y la escala común 0–4 (0 / 2,5 / 5 / 7,5 / 10; nivel 2 mínimo para superar).

## Prácticas de elaboración propia

El original solo tiene prácticas para las unidades 1 a 4, casi todas sobre Oracle, y deja criterios de evaluación sin cubrir. Para completarlo se han redactado 11 prácticas nuevas, con la misma estructura y la rúbrica común. Su pie indica «Práctica de elaboración propia».

| Unidad | Práctica | CE que cubre |
|:---|:---|:---|
| UT1 | 6. Selección del SGBD | 1.b, **1.c**, 1.d, 1.e |
| UT2 | 2. Selección del motor de almacenamiento (MariaDB) | **2.b**, 2.f, 2.h |
| UT2 | 3. Asegurar las cuentas de administración | **2.c**, 2.e, 2.g, 2.h |
| UT3 | 3. Vistas, sinónimos y roles | **3.a**, **3.b**, 3.d, **3.e**, 3.g, 3.h |
| UT4 | 6. Disparadores | 4.d, **4.e**, **4.f**, 4.g, 4.h |
| UT5 | 1. Monitorización y alertas de rendimiento | 5.a, 5.e, 5.f, 5.g |
| UT5 | 2. Índices y optimización de consultas | 5.b, 5.c, 5.d, 5.f |
| UT5 | 3. Recursos del SGBD y ajustes del sistema operativo | 5.a, 5.e, 5.f, 5.h |
| UT6 | 1. Base de datos distribuida y fragmentación | 6.a, 6.b, 6.c, 6.g |
| UT6 | 2. Integración de bases de datos preexistentes | 6.a, 6.c, 6.d, 6.g |
| UT6 | 3. Replicación maestro-esclavo y en cadena | 6.a, 6.e, 6.f, 6.g |

Con ellas, **todos los criterios de evaluación de los seis RA tienen al menos una práctica**.

Qué se ha comprobado y qué no:

- Los pasos de **PostgreSQL** se han ejecutado en PostgreSQL 16 sobre Ubuntu: replicación con dos esclavos y uno en cadena, parada de cada nodo y promoción; `postgres_fdw` con tabla particionada en tablas externas, `IMPORT FOREIGN SCHEMA` y parada de un nodo; `pg_stat_statements`, índices, vista materializada y `pgbench`; disparadores de fila y de evento; vistas filtradas por `current_user` y roles.
- Las pruebas de motores de **MariaDB** se han ejecutado en MariaDB 10.11.
- Las órdenes de **Oracle** de las orientaciones **no se han podido ejecutar** (no había un servidor Oracle disponible): están escritas a partir de la documentación y conviene probarlas antes de llevarlas al aula.
- La replicación física de Oracle (Data Guard) requiere la edición Enterprise, así que la práctica de replicación es solo de PostgreSQL.
- Las prácticas no incluyen solucionario.

## Erratas del original corregidas

Comunes y Oracle:

- UT1: `dbinit` → `initdb`.
- UT2: `shutdown immeditate` → `shutdown immediate`.
- UT3 (tríada CID): la versión PostgreSQL era una copia de la de Oracle con el nombre cambiado («postgresql RAC», «postgresql Data Guard»…); se ha dejado una sola página común.
- UT4 Oracle: el comodín de un carácter en `LIKE` es `_` (ponía `-`); `INITCAT` → `INITCAP`; `RAISE_APPLICATION_ERROR` es un procedimiento y su tercer parámetro controla la pila de errores; un texto suelto tras `GRANT CREATE ANY JOB` pasa a comentario.
- UT4 (guía AUTHID): `grant exectute` → `grant execute`.
- UT4 (práctica de jobs): estado `'inctiu'` → `'inactiu'` en los datos de ejemplo.
- UT3 (práctica expdp): la definición de la tabla `ALUMNES` decía `CREATE TABLE FESTIUS`.
- UT6: «Aliven» → «Aiven».
- Cuestionarios: UT1 PostgreSQL «plsql» → «psql»; UT3 Oracle `IDENTIFIED BY '12345'` → `"12345"`; se ha quitado una pregunta de UT4 PostgreSQL que daba por cierto que no se puede usar DDL dentro de un procedimiento.

PostgreSQL (los ejemplos marcados con ✔ se han probado en PostgreSQL 16):

- UT3 vistas ✔: el original decía que las vistas usan por defecto los permisos de quien consulta y daba la sintaxis `CREATE VIEW … SECURITY DEFINER AS`, que no existe. En PostgreSQL es al revés: por defecto se usan los permisos del propietario y la opción es `WITH (security_invoker = true)` (desde la versión 15).
- UT3 vistas: se ha quitado la afirmación de que Oracle no tiene seguridad a nivel de fila.
- UT3 copias: la conclusión citaba RMAN y Data Pump → `pg_dump` y `pg_basebackup`.
- UT4 bloques ✔: PL/pgSQL no distingue mayúsculas de minúsculas en los identificadores sin comillas (decía lo contrario y el ejemplo daba error); `\i` ejecuta un fichero; `BOOLEAN` es un tipo SQL normal; PostgreSQL no tiene paquetes.
- UT4 ✔: `RAISE NOTICE 'texto' || variable` no es válido → `RAISE NOTICE 'texto: %', variable`.
- UT4 secuencias ✔: la consulta de columnas identidad usaba `start_value` e `increment_by`, que no existen → `identity_start`, `identity_increment`; en la tabla comparativa, `nom_seq.NEXTVAL` → `nextval('nom_seq')`.
- UT4 excepciones ✔: `my_error EXCEPTION;` no existe en PL/pgSQL → se captura con `WHEN SQLSTATE 'P0001'`.
- UT4 tareas ✔: el procedimiento de ejemplo ejecutaba `VACUUM FULL` con `EXECUTE`, y PostgreSQL no permite `VACUUM` dentro de una función o procedimiento. El ejemplo usa ahora `REINDEX TABLE` y se añade cómo lanzar `VACUUM` con `\gexec`. También se ha corregido el aviso de que el DDL no se puede escribir en un bloque (en PL/pgSQL sí se puede).
- UT4 procedimientos: decía que se llaman «desde DBMS_SCHEDULER» → `pg_cron`.
- UT5 particiones ✔: la clave primaria de una tabla particionada debe incluir la columna de partición.

## Cosas que conviene revisar

- **Reglas de Date (UT6).** El original presenta «D.A.T.E.» como acrónimo (disponibilidad, accesibilidad, tolerancia, escalabilidad). El currículo se refiere a las doce reglas de C. J. Date para SGBD distribuidos. Se ha añadido antes una tabla con las doce reglas y una nota; el apartado original se conserva.
- **Guía didáctica (`src/index.md`).** Solo se han añadido los enlaces a las unidades y el apartado de créditos. El texto sigue diciendo que el motor principal es MariaDB y que Oracle se estudia sin instalarlo, lo que no coincide con estos materiales (Oracle y PostgreSQL; MariaDB solo aparece en las prácticas 2 y 3 de UT1 y en la práctica 2 de UT2).
- En las páginas de PostgreSQL hay bloques de código que mezclan órdenes y texto explicativo, como en el original.
- La página de `pg_cron` contiene dos afirmaciones distintas sobre qué usuarios pueden programar tareas; no se ha tocado.
