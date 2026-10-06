---
layout: doc
title: "PostgreSQL: clúster, cuentas de administración y arranque"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: clúster, cuentas de administración y arranque

## Configuración de la instancia / clúster

Una instancia/clúster de PostgreSQL es el programa en ejecución del servidor de base de datos junto con todo lo que necesita para funcionar. No es solo la base de datos: es todo el sistema que gestiona las bases de datos

Una instancia de PostgreSQL incluye:

- El proceso del servidor (postgres)
- La memoria que utiliza
- Los ficheros en disco (donde se guardan los datos)
- La configuración (puertos, usuarios, etc.)
- El conjunto de bases de datos

En un mismo ordenador puedes tener 1 instancia (lo más habitual) o varias instancias (para separar entornos: pruebas, producción…). Cada instancia funciona de manera independiente.

### 🔌 ¿Qué es una sesión en PostgreSQL?

Una sesión es la conexión activa entre un cliente (usuario o aplicación) y el servidor de base de datos. Empieza cuando te conectas y acaba cuando te desconectas

Cuando abres una sesión, te conectas con un usuario y trabajas sobre una base de datos concreta.

Puedes ejecutar consultas (SELECT), inserciones (INSERT), actualizaciones (UPDATE), borrados (DELETE), hacer transacciones, etc.

🔄 Cada conexión de un usuario = una sesión. 1 usuario conectado → 1 sesión; 10 usuarios conectados → 10 sesiones; 1 usuario conectado 5 veces → 5 sesiones. PostgreSQL gestiona muchas sesiones a la vez.

✔ Cada sesión tiene su estado, sus variables y sus transacciones.

Las sesiones son independientes entre sí, pero pueden interactuar (bloqueos, concurrencia, etc.)

---

### Volvamos a la instancia...

### Fichero: postgresql.conf

El fichero postgresql.conf es el fichero principal de configuración de una instancia de PostgreSQL. Sirve para decirle al servidor cómo debe funcionar

- Memoria (shared_buffers, work_mem, maintenance_work_mem)
- Conexiones (max_connections)
- WAL (wal_buffers, checkpoint_timeout)
- Logging (log_destination, log_min_duration_statement)
- Planner (random_page_cost, effective_cache_size)

```txt
ejemplo:
shared_buffers = 1GB
work_mem = 16MB
max_connections = 200
```

### Fichero: pg_ident.conf

usuarios del sistema → usuarios de PostgreSQL.

---

### Variables del sistema (GUC - Grand Unified Configuration)

```txt
Sistema operativo
    ↓
Variables de entorno
    ↓
postgresql.conf  pg_hba
    ↓
Variables GUC
    ↓
Sesión
```

PostgreSQL tiene cientos de variables internas configurables (no son variables de entorno, sino parámetros de configuración del servidor). Puedes verlas con:

```sql
SHOW ALL;
```

```sql
O una concreta:
SHOW work_mem;
```

```sql
O mediante una vista del sistema
SELECT name, setting FROM pg_settings;

-- En postgres, para ver las columnas de una tabla se hace:
\d nom_taula
```

- Globales (configuradas en postgresql.conf)
- Por base de datos
- Por usuario
- Por sesión

```sql
Ejemplo: cambiar una variable solo para la sesión
SET work_mem = '64MB';
  Solo afecta a la conexión actual. Se aplica inmediatamente.
```

En este caso, cuando me desconecte y después me vuelva a conectar, el valor "64MB" no estará fijado.

Para hacer que el cambio sea por usuario (persistente) en lugar de solo por sesión, debes utilizar:

```sql
ALTER ROLE nom_usuari SET work_mem = '64MB';
      Se aplica cuando se vuelva a conectar el usuario.
      El cambio se guarda en pg_db_role_setting
```

- Cada vez que el usuario joan se conecte → tendrá work_mem = 64MB
- Es persistente (no se pierde al cerrar la sesión)
- No afecta a otros usuarios

---

Otro nivel más alto de cambio es el de BBDD

```sql
ALTER DATABASE nom_bbdd SET work_mem = '64MB';
    A partir de este momento, tendrá efecto en las nuevas sesiones que se conecten a esa base de datos.
    El cambio se guarda en pg_db_role_setting
```

**Esto hace que:**

- Cualquier usuario que se conecte a la base de datos vendes → tendrá work_mem = 64MB
- Es persistente
- Solo afecta a esa base de datos

El valor se aplica al iniciar la sesión. Si ya estás conectado → debes reconectar para ver el cambio

---

Y el nivel más alto, para todo el clúster

```sql
ALTER SYSTEM SET work_mem = '128MB';
   y después
SELECT pg_reload_conf();
   para aplicar los cambios. Si no haces pg_reload_conf() ni reinicias,
   ... ni siquiera las sesiones nuevas aplicarán el cambio
```

ALTER SYSTEM define el valor global por defecto para toda la instancia, pero puede ser sobrescrito por configuraciones más específicas (usuario, base de datos o sesión).

---

Y al mismo nivel que ALTER SYSTEM estaría modificar el fichero **postgresql.conf**

PostgreSQL tiene una jerarquía de prioridad

```sql
SET (sesión)
ALTER ROLE (usuario)
ALTER DATABASE (bbdd)
ALTER SYSTEM / postgresql.auto.conf
postgresql.conf (global)
hardcoded
```

Cuando se hace "ALTER SYSTEM SET work_mem = '128MB';", PostgreSQL no modifica directamente postgresql.conf. Lo que hace es escribir el cambio en un fichero separado:

```txt
/var/lib/postgresql/16/main/postgresql.auto.conf
```

Este fichero se lee después de postgresql.conf cuando el servidor arranca o cuando haces pg_reload_conf(). Por eso los cambios son persistentes sin tocar manualmente postgresql.conf

En PostgreSQL, muchos parámetros tienen un valor por defecto que está «hardcoded» dentro del código de PostgreSQL: se define en el momento de la compilación / instalación y no está guardado en ningún fichero ni tabla. <br> PostgreSQL los carga automáticamente al iniciar el servidor.

Son los que tienen source = 'default'

```sql
Cómo saber cuáles son:
SELECT name, setting  FROM pg_settings
WHERE source = 'default';
```

---

```sql
# Cómo saber de qué tipo es cada parámetro:
SELECT name, setting, context, vartype, source  FROM pg_settings ORDER BY name;
```

La columna `context` te dice cuándo y cómo se puede modificar el parámetro (variable GUC).

```txt
context     Significado
--------------------------------------------
internal    Solo interno, no modificable
postmaster  Requiere reiniciar el servidor
sighup      Requiere reload (pg_reload_conf())
superuser   Solo superusuario
user        Cualquier usuario puede cambiarlo por sesión
backend        Se puede cambiar al iniciar sesión
```

¿Cómo saber qué variables puede cambiar un usuario dentro de su sesión?

```sql
SELECT name FROM pg_settings WHERE context = 'user';
```

Saber de dónde viene el valor (columna source)

```sql
SELECT name, source FROM pg_settings WHERE name = 'work_mem';
```

```txt
valor de source     Significado
--------------------------------------------
default                Valor por defecto
configuration file  postgresql.conf
override            postgresql.auto.conf
environment         Variable de entorno
session                SET en sesión
database            Definida por base de datos
user                Definida por usuario
```

### Variables por usuario o por base de datos

```sql
PostgreSQL permite configurar parámetros así:
🔹 Por usuario
ALTER ROLE usuari SET work_mem = '32MB';
🔹 Por base de datos
ALTER DATABASE basedades SET work_mem = '64MB';
🔹 Global (por defecto)
ALTER SYSTEM SET work_mem = '128MB';
  Esto escribe en el fichero:  postgresql.auto.conf
     ❗ No se aplica hasta que haces: SELECT pg_reload_conf();  (o reinicias)
```

### Configuración de memoria

### Reinicio de la instancia

Algunos cambios requieren recargar la configuración (en caliente) o reiniciar la instancia

```txt
🔁 pg_reload_conf() → recarga la configuración
🔴 Reiniciar el servicio → para cambios estructurales (shared_buffers)
```

::: tip Nota
Ejercicio: ¿cuántas variables tiene activas tu instalación?
:::

::: tip Nota
Ejercicio: ¿cuánta memoria de trabajo tiene una sesión de tu instalación?
:::

::: tip Nota
Ejercicio: ¿qué valor tiene el "log_destination" de tu instalación?
:::

## Cuentas de administración

### 👤 Cuentas de administración predeterminadas

Cuando se crea una base de datos postgres se genera automáticamente:

#### A nivel de clúster

- Es el superusuario de la base de datos.
- Tiene permisos totales (SUPERUSER)
- Puede crear bases de datos
- Puede crear roles/usuarios
- Puede modificar cualquier objeto
- Puede cambiar la configuración
- Este usuario se crea durante la inicialización con initdb.

⚠️ Importante: normalmente coincide con el usuario del sistema operativo postgres. Es la cuenta equivalente a «SYS» en Oracle

¿Otras cuentas? No se crean más usuarios por defecto. No existen cuentas como root, admin, system, guest...

---

**A nivel de sistema operativo**, cuando instalas PostgreSQL también se crea:

🔹 Usuario del SO: postgres

- Ejecuta el servicio PostgreSQL
- Es propietario del directorio PGDATA
- Se utiliza para administrar el servidor

![Bases de datos del clúster PostgreSQL vistas en pgAdmin #center](/img/contenidos/ut2/bdusers.png)

---

### 📍 Ubicación de las cuentas

Todos los usuarios y roles se encuentran fuera de las bases de datos y a su misma altura. Los usuarios y las bases de datos dependen del clúster. Así, un mismo usuario puede conectar (si tiene permiso) a cualquier BBDD del clúster.

### Cambio de contraseña

## 🔑 Cambio de contraseña del usuario `postgres`

::: warning Atención
🟡 Importante: escoge siempre una contraseña segura. Después de cambiarla, actualiza las conexiones de las aplicaciones que utilizan este usuario.
:::

### 1️⃣ Linux / Mac

1. Acceder al usuario `postgres` del sistema:

   ```bash
   sudo -i -u postgres
   ```

2. Entrar en la consola de PostgreSQL:

   ```txt
   psql
   ```

3. Cambiar la contraseña:

   ```sql
   ALTER USER postgres WITH PASSWORD 'NovaContrasenyaSegura';
   ```

4. Salir de la consola:

   ```sql
   \q
   ```

### 2️⃣ Linux / Mac (comando directo sin entrar en psql)

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'NovaContrasenyaSegura';"
```

### 3️⃣ Windows

1. Abrir el símbolo del sistema (Command Prompt) con permisos de administrador.

2. Acceder al directorio bin de PostgreSQL (ajústalo según tu instalación):

   ```bash
   cd "C:\Program Files\PostgreSQL\16\bin"
   ```

3. Conectar a PostgreSQL:

   ```bash
   psql -U postgres
   ```

4. Cambiar la contraseña:

   ```sql
   ALTER USER postgres WITH PASSWORD 'NovaContrasenyaSegura';
   ```

5. Salir de la consola:

   ```sql
   \q
   ```

::: warning Atención
⚠️ Notas adicionales:

- Si tienes `pg_hba.conf` con autenticación `peer`, solo el usuario del SO `postgres` puede conectarse sin contraseña.
- Cambiar la contraseña no modifica el método de autenticación (`peer`, `md5`, `scram-sha-256`).
:::

En otros SGBD, el usuario administrador varía...

**Comparativa de usuarios administradores**

| Sistema | Usuario administrador | Descripción breve |
| --- | --- | --- |
| Oracle | `SYS` | Superusuario con acceso al diccionario de datos. |
| MySQL | `root` | Superusuario con todos los privilegios sobre el servidor. |
| PostgreSQL | `postgres` | Superusuario creado por defecto durante la instalación. |

## Arranque y parada de la instancia de PostgreSQL

### Arranque del servidor

#### 🐧 En Linux (systemd – lo más habitual)

```bash
sudo systemctl start postgresql
```

O si hay versiones específicas:

```bash
sudo systemctl start postgresql-16
```

Comprobar el estado:

```bash
sudo systemctl status postgresql
```

#### Manualmente con pg_ctl

```bash
pg_ctl -D /ruta/al/PGDATA start
```

Ejemplo:

```bash
pg_ctl -D /var/lib/postgresql/16/main start
```

#### 🖥️ En Windows

PostgreSQL se instala como servicio:

```bash
net start postgresql-x64-16
```

O desde:

```txt
Services → PostgreSQL → Start
```

---

### Parada del servidor

En PostgreSQL no se puede parar el clúster directamente desde dentro de psql con un comando SQL estándar. psql es solo un cliente para ejecutar consultas SQL, y parar el servidor es una operación de administración del sistema, no de SQL.

#### En Linux (systemd)

Es una orden a nivel de sistema, no específica de PostgreSQL. Internamente, systemd acabará llamando a algo similar a pg_ctl, pero según cómo esté definido el servicio. El comportamiento (smart, fast, immediate) depende del fichero de configuración del servicio (postgresql.service).

```bash
sudo systemctl stop postgresql
```

Es más genérico y automatizado. Nivel de sistema operativo

#### Con pg_ctl

pg_ctl es una herramienta propia de PostgreSQL. Para un clúster concreto (el que apunta PGDATA). Tienes control directo sobre cómo se hace la parada con -m. Nivel de clúster: gestión directa de postgres

```bash
pg_ctl -D /ruta/al/PGDATA stop
```

#### ⚠️ Modos de parada (importante)

PostgreSQL permite 3 modos de shutdown:

**🟢 Smart (por defecto)**

Espera a que acaben las conexiones activas.

```bash
pg_ctl stop -m smart
```

**🟡 Fast (el más habitual en producción)**

Cancela las transacciones y hace checkpoint.

```bash
pg_ctl stop -m fast
```

**🔴 Immediate (forzado)**

No hace un checkpoint limpio → recuperación en el próximo inicio.

```bash
pg_ctl stop -m immediate
```

**👉 Normalmente se utiliza fast.**

---

### Reinicio

```bash
sudo systemctl restart postgresql
```

O:

```bash
pg_ctl restart -D /ruta/PGDATA
```

---

### ¿Qué pasa internamente cuando arranca?

Cuando arranca:

- Se crea el proceso principal (postmaster)

- Se crea la shared memory

- Se inician los procesos background:

  - Checkpointer
  - WAL writer
  - Autovacuum
  - Background writer

- Se pone a la escucha en el puerto (5432 por defecto)

---

### ¿Cómo saber si está activo?

Desde el cliente:

```bash
psql -U postgres
```

O desde el sistema operativo:

```txt
pg_isready
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
