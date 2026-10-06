---
layout: doc
title: "Oracle: tareas automatizables"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: tareas automatizables

## 📅 Tareas automatizables en Oracle

### ¿Qué podemos automatizar?

En un entorno Oracle es habitual automatizar tareas para mejorar la gestión y el rendimiento del sistema. Algunas de las tareas más comunes son:

- Exportaciones y copias de seguridad
- Importaciones de datos
- Ejecución de informes
- Limpieza de logs y archivos antiguos
- Tareas de mantenimiento periódico

### 📄 Scripts SQL y .bat

Puedes crear scripts `.sql` con comandos de Oracle y ejecutarlos desde scripts `.bat` o `.sh` mediante `sqlplus`.

#### Ejemplo: script SQL

```sql
-- archivo: informe.sql
SET ECHO OFF
SET FEEDBACK OFF
SPOOL informe_resultats.txt

SELECT * FROM alumnes;

SPOOL OFF
EXIT;
```

#### 🖥️ Script .bat (Windows)

```bash
-- archivo: llança_informe.bat
sqlplus usuari/contrasenya@XE @informe.sql
pause
```

Una vez creado el fichero .bat, hay que crear una tarea programada: Panel de control → Tareas programadas → Agregar tarea → ...

Consulta alguna guía sobre cómo usar el programador de tareas de Windows: [guía 1](https://www.adslzone.net/esenciales/windows-10/programar-tareas/), [guía 2](https://openwebinars.net/blog/programacion-de-tareas-desde-la-terminal-de-windows/)

#### 🐧 Script .sh (Linux)

```bash
#!/bin/bash
sqlplus usuari/contrasenya@XE @informe.sql
```

En Linux se utiliza CRON / CRONTAB para añadir tareas que se ejecutarán a determinadas horas / días. Consulta alguna guía sobre cómo usar CRON, [guía 1](https://www.redeszone.net/tutoriales/servidores/cron-crontab-linux-programar-tareas/), [guía 2](https://www.arsys.es/blog/cron-jobs-una-guia-completa) o [guía 3](https://www.hostinger.com/mx/tutoriales/sintaxis-crontab), para entender las diferentes opciones de programación horaria.

---

### 📆 Oracle SCHEDULER - JOBS

Oracle incorpora un sistema para programar tareas directamente desde la base de datos: **DBMS_SCHEDULER**.

#### Dar permiso

```sql
-- Un usuario necesita tener permiso para crear jobs (trabajos) y ejecutarlos
GRANT CREATE JOB TO usuari;     -- crear y administrar sus propios jobs
GRANT EXECUTE ON dbms_scheduler TO usuari;   -- solo administrar sus jobs
```

```sql
GRANT CREATE ANY JOB TO usuari;    -- crear jobs de otros usuarios y administrarlos
```

#### Crear una tarea programada

```sql
BEGIN
  DBMS_SCHEDULER.CREATE_JOB (
    job_name        => 'JOB_INFORME',
    job_type        => 'PLSQL_BLOCK',
    job_action      => 'BEGIN informe_alumnes(); END;',
    start_date      => SYSTIMESTAMP,
    repeat_interval => 'FREQ=DAILY; BYHOUR=8',
    enabled         => TRUE
  );
END;
```

#### Ejecutar sin esperar al momento programado

```sql
BEGIN
    DBMS_SCHEDULER.RUN_JOB('JOB_INFORME');
END;
```

#### Habilitar o deshabilitar la programación

```sql
BEGIN
  DBMS_SCHEDULER.DISABLE('JOB_INFORME');
  DBMS_SCHEDULER.ENABLE('JOB_INFORME');
END;
```

#### Modificar una tarea programada

```sql
BEGIN
  dbms_scheduler.set_attribute_null( name=>'nom', attribute=>'a');
  dbms_scheduler.set_attribute(name=>'nom',attribute=>'a',value=>'v');
  -- SE PUEDE CAMBIAR: job_action, repeat_interval, comments, job_type ('PLSQL_BLOCK', 'STORED_PROCEDURE', 'EXECUTABLE')
END;
```

#### Parámetro `repeat_interval`

```txt
FREQ=MONTHLY → Se ejecuta una vez al mes. (Define la repetición mensual)
BYMONTHDAY=1 El día 1 de cada mes
BYDAY=TU → Los martes.  ( abreviaturas MON, TUE, WED, THU, FRI, SAT y SUN ).
BYSETPOS=1 → Solo el primer martes del mes.
BYHOUR=1; BYMINUTE=5 → A la 01:05 AM.
```

FREQ={ DAILY | HOURLY | MINUTELY | WEEKLY | MONTHLY | YEARLY}. A partir de aquí puedes añadir modificadores como BYSECOND, BYMINUTE, BYHOUR, BYDAY, BYMONTH, etc.

FREQ es el parámetro que indica la frecuencia de repetición de la planificación

#### Ejemplos de uso del parámetro

```txt
Cada día a las 8:30 AM
REPEAT_INTERVAL => 'FREQ=DAILY; BYHOUR=8; BYMINUTE=30;'
Cada lunes y miércoles a las 10:00 AM y a las 4:00 PM
REPEAT_INTERVAL => 'FREQ=WEEKLY; BYDAY=MON,WED; BYHOUR=10,16; BYMINUTE=0;'
El primer martes de cada mes a las 09:00 AM
REPEAT_INTERVAL => 'FREQ=MONTHLY; BYDAY=TU; BYSETPOS=1; BYHOUR=9; BYMINUTE=0;'
El último viernes de cada mes a las 18:00
REPEAT_INTERVAL => 'FREQ=MONTHLY; BYDAY=FR; BYSETPOS=-1; BYHOUR=18; BYMINUTE=0;'
Cada 6 horas
REPEAT_INTERVAL => 'FREQ=HOURLY; INTERVAL=6;'
Cada tres meses
REPEAT_INTERVAL => 'FREQ=YEARLY; BYMONTH=JA,AP,JL,OC'
     (abreviaturas de los meses: JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC)
```

::: warning Atención
En Oracle DBMS_SCHEDULER, si no se indica la hora (BYHOUR, BYMINUTE, BYSECOND) en el REPEAT_INTERVAL, se utiliza la hora del START_DATE del job.
:::

Regla general: cuando no se indica un componente temporal en el REPEAT_INTERVAL, Oracle lo toma del START_DATE

→ Documentación oficial de Oracle sobre la [Calendaring Syntax](https://docs.oracle.com/en/database/oracle/oracle-database/21/arpls/DBMS_SCHEDULER.html#GUID-73622B78-EFF4-4D06-92F5-E358AB2D58F3)

#### 📘 Consultar los jobs en el DD

```sql
SELECT job_name, state FROM user_scheduler_jobs;
SELECT * FROM user_scheduler_jobs;
```

#### Parar o eliminar un job

```sql
BEGIN
  DBMS_SCHEDULER.DISABLE('JOB_INFORME');
  DBMS_SCHEDULER.STOP_JOB('JOB_INFORME');
  DBMS_SCHEDULER.DROP_JOB('JOB_INFORME');
END;
```

No es obligatorio hacer los tres pasos antes de eliminar (Oracle no da error), pero sí muy recomendable, para asegurarse de que no quede un job a medio acabar y evitar procesos «fantasma», bloqueos inesperados o resultados incompletos.

```sql
-- Si el job no responde, se puede forzar con
BEGIN
  DBMS_SCHEDULER.STOP_JOB(
    job_name => 'JOB_INFORME',
    force    => TRUE
  );
END;
```

---

### ⏰ Triggers de sistema (a nivel de sesión)

También puedes utilizar **triggers de sistema** para ejecutar código cuando se producen acciones específicas:

```sql
CREATE OR REPLACE TRIGGER t_inici_sessio
AFTER LOGON ON DATABASE
BEGIN
  INSERT INTO log_sessio(usuario, data)
  VALUES (USER, SYSDATE);
END;
```

```txt
Otras acciones que se pueden emplear:
     LOGON, LOGOFF, STARTUP, SHUTDOWN, ERRORLOGON
```

### Ejemplo completo de automatización

- `informe.sql`: genera un informe con SELECT
- `informe.bat`: lo ejecuta desde el sistema
- **DBMS_SCHEDULER**: programa su ejecución cada día a las 8 h

### Buenas prácticas

- Guarda los scripts en carpetas versionadas (p. ej.: Git)
- Documenta las tareas automatizadas
- Revisa los permisos de los usuarios que ejecutan las tareas
- ⚠️ Evita duplicar jobs o crear jobs recurrentes sin control

### SQL dinámico

En algunas tareas de mantenimiento se utilizará el diccionario de datos (con un cursor) y, para cada objeto del DD, se aplicará una sentencia DDL

::: warning Atención
Si esa sentencia es DDL, no se puede ejecutar directamente dentro de un bloque de código
:::

En ese caso se hará uso de la sentencia `execute immediate`

`execute immediate` es una instrucción de PL/SQL que permite ejecutar sentencias SQL dinámicas, es decir, sentencias construidas en tiempo de ejecución como cadenas de texto.

Ejemplo

```sql
create procedure defrag_taules (vuser varchar2(20))
-- Este procedimiento desfragmenta todas las tablas de un usuario/schema
as
cursor c is select table_name,tablespace_name
from dba_tables where user=vuser ;
begin
for x in c loop
  execute immediate ('alter table ' || x.table_name || ' move');
  dbms_output.put_line('Tabla desfragmentada:' || x.table_name);
  end loop;
end;
```

## Otros recursos

- 📅 [Gestión de fechas en Oracle](/ut2/contenidos/oracle/5-fechas-en-oracle)
- 🧭 [Guía: AUTHID en los procedimientos almacenados](/ut4/ejercicios/guia-1-authid)
- 🧭 [Guía: la variable de control en WHILE, FOR y LOOP](/ut4/ejercicios/guia-2-ambito-variables-bucles)
- ✅ [Cuestionario de autoevaluación](/ut4/ejercicios/cuestionario)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
