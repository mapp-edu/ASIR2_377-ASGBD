---
layout: doc
title: "Oracle: instalación y acceso"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: instalación y acceso

## Instalación de Oracle

### Proceso general de instalación

Instalar un SGBD Oracle y crear una BBDD (CDB + PDB) son procesos diferentes, aunque el mismo asistente puede hacerlo todo a la vez.

### Desde Windows

- Se utiliza un **ejecutable (setup.exe)** que guía la instalación del software.

- Antes de ejecutar `setup.exe`, hay que **crear usuarios en el sistema operativo**:

  - Ejemplo:

    - `admin`: usuario principal (con permisos de administrador)
    - `oracle`: usuario para ejecutar la instalación (también con permisos de administrador)
    - `usuari1`: usuario sin permisos

- Es importante ejecutar el setup con el usuario **oracle** desde CMD con permisos de administrador.

(no hace falta que el usuario instalador se llame **oracle**; puede tener otro nombre)

### Opciones de setup

Durante la ejecución de `setup.exe` se pueden escoger diferentes opciones:

- **Instalación solo del software:** es la opción recomendada. Después se utiliza `dbca` para crear la base de datos.
- **Instalación del software con creación de CDB + PDB:** no es la opción que utilizaremos.

::: warning Atención
⚠️ ¡No ejecutes `setup.exe` más de una vez!
:::

### Creación de la base de datos (CDB + PDB)

- Se hace con la herramienta `dbca` (Database Configuration Assistant).

- Ejecutar desde CMD con permisos de administrador:

  ```bash
  C:\Windows\system32> dbca
  ```

- El usuario que hace la instalación pasa a ser el **usuario instalador del SGBD**.

- Al final del proceso se muestra la **ruta del fichero de log** de la instalación.

Una vez que el SGBD y la CDB están en funcionamiento (instancia), desde el SO se puede verificar con:

#### En Windows

Abre la ventana de servicios (services.msc) y busca: <br> OracleServiceNOMBD → indica si la instancia de la BD está en marcha.

#### 🐧 En Linux

```txt
ps -ef | grep pmon
ps -ef | grep mon
```

¡Y debe mostrarse más de una línea (además de la del propio grep)!

---

### Creación de más PDB

También se hace con `dbca` (desde el sistema operativo), aunque más adelante se verá cómo hacerlo desde dentro del SGBD

- En un CMD con permisos de administrador:

```bash
C:\Windows\system32> dbca
```

También puede ejecutarse como: usuario instalador, o usuario administrador con credenciales de SYS

---

### Instalación / creación del LISTENER ⚠️⚠️

Una vez instalados el software y la BBDD, hay que instalar el LISTENER.

```bash
C:\Windows\system32> netca
```

- ⚠️ El LISTENER se debe instalar con permisos de **administrador**

- Primero, agregar un listener

- Después, configurar los métodos de nomenclatura

  - nomenclatura local
  - nomenclatura de conexión sencilla

Una vez que el LISTENER está en funcionamiento, desde el SO se puede verificar con:

```bash
  C:\Windows\system32> lsnrctl status

o en Linux
  $ lsnrctl status
```

También se puede comprobar abriendo la ventana de servicios (services.msc) y buscando: <br> OracleOraDB...TNSListener → indica si el listener está activo.

**Resumen:**

- Crear los usuarios del SO
- Ejecutar `setup.exe` con el usuario `oracle`
- Seleccionar «Solo instalación del software»
- Después, crear la CDB y la PDB con `dbca`
- Después, crear nuevas PDB con `dbca`, y también borrarlas

### Primera instalación

Una vez que se tienen todos los requisitos preparados, se realiza la primera instalación de Oracle con el usuario designado como usuario instalador, por ejemplo `oracle`.

::: info-box Antes de continuar
Realiza tu primera instalación de Oracle: sigue las [prácticas de la unidad](/ut1/ejercicios/) o la guía [Oracle Database en un contenedor](/ut1/ejercicios/guia-1-oracle-en-contenedor).
:::

## Acceso a Oracle

Una vez terminada la instalación, debemos comprobar que se puede acceder a la instancia.

### Desde Windows (sqlplus)

Abre una ventana de CMD como **usuario instalador** y ejecuta la orden `sqlplus`

```bash
C:\Users\oracle> sqlplus / as SYSDBA
```

Esta orden nos conecta a la CDB principal apuntada por ORACLE_SID. Una vez dentro de SQL\*Plus, se pueden utilizar órdenes útiles:

```sql
show user;
show con_name;             -- Nombre del contenedor activo
select name from v$database;  -- Nombre de la BBDD
select * from v$version;      --Versión de la instalación
show pdbs;                -- Muestra las PDB disponibles
conn system                -- Conecta como SYSTEM
show sga;
disc;                      -- Desconecta
exit;
```

Las órdenes SHOW PDBS y SHOW USER son instrucciones especiales del entorno SQL\*Plus (o de herramientas compatibles como SQLcl); no forman parte del SQL estándar ni de PL/SQL. La orden SELECT sí es una orden SQL

```txt
SQL> show pdbs

    CON_ID CON_NAME              OPEN MODE  RESTRICTED
---------- ------------------------------ ---------- ----------
     2 PDB$SEED              READ ONLY  NO
     3 FREEPDB1              READ WRITE NO
```

```sql
Las órdenes de sqlplus suelen ser ALIAS de consultas SQL.
Por ejemplo, SHOW PDBS se puede hacer con:
SELECT CON_ID, NAME, OPEN_MODE, RESTRICTED FROM V$PDBS;
SELECT * FROM DBA_PDBS;
```

### 🔁 Conexión directa a una PDB

```bash
C:\Users\oracle> sqlplus /@localhost/NOMPDB as SYSDBA

SQL> show user;
SQL> show con_name;
SQL> show pdbs;
SQL> select name, open_mode from v$pdbs;
```

También se puede conectar como SYSTEM con contraseña:

```txt
SQL> conn system/1234@localhost/NOMPDB
SQL> show sga;
SQL> show user;
```

⚠️ SYS y SYSTEM son usuarios diferentes

Para conectar a un SGBD que se encuentra en otra máquina (necesitamos la **ip** o el **nom_dns**):

```txt
SQL> conn system/1234@10.0.2.6/NOMPDB
o
SQL> conn system/1234@altramaquina.com/NOMPDB
SQL> show sga;
SQL> show user;
```

Para conectar a un SGBD que está escuchando en otro puerto (diferente del puerto habitual de Oracle)

```txt
SQL> conn system/1234@10.0.2.6:1525/NOMPDB
o
SQL> conn system/1234@altramaquina.com:1525/NOMPDB
SQL> show sga;
SQL> show user;
```

⚠️ **1521** es el puerto habitual de Oracle

### 🔄 Cambio de contenedor

Una vez conectados al SGBD mediante sqlplus, para pasar de una CDB a una PDB, o viceversa:

```txt
SQL> alter session set container=NOMPDB;
SQL> show con_name;
SQL> alter session set container=CDB$ROOT;
```

### 🐧 Desde Linux con 🐳 contenedor podman

```bash
podman exec -it cont-oracle sqlplus / as sysdba
   -- Para entrar a la CDB y ver las PDB, o crear PDB nuevas

podman exec -it cont-oracle sqlplus sys/1234@FREEPDB1 as sysdba
   -- Para entrar a la PDB llamada FREEPDB1 (la que trae inicialmente)
```

Una vez dentro:

```sql
show con_name
show pdbs
alter session set container=FREEPDB1;
show pdbs
conn system
show pdbs
disc
```

### 🐧 Desde Linux

Desde un terminal con el usuario `oracle`:

```bash
$ . oraenv                  # Carga el entorno Oracle
$ lsnrctl start             # Inicia el listener
$ sqlplus / as SYSDBA       # Conexión como SYS
```

Una vez dentro:

```sql
startup;
show con_name;
show pdbs;
alter session set container=NOM_PDB;
conn system;
disc;
```

### ⚠️ Consideraciones importantes

- Solo el usuario que ha hecho la instalación puede entrar como `SYSDBA` sin contraseña.
- Si las variables de entorno no están cargadas (en Linux, `'. oraenv'`), no se podrá iniciar `sqlplus` correctamente.
- **CON_ID=1** representa la CDB, pero no siempre se muestra con `show pdbs`.

---

### ¿Qué es SQL\*Plus?

Es un cliente de línea de órdenes proporcionado por Oracle que permite ejecutar SQL, PL/SQL y órdenes específicas de sqlplus. Es una de las herramientas más antiguas y utilizadas por administradores y desarrolladores.

- Ideal para hacer pruebas rápidas y administración local
- Permite conectar local o remotamente
- Permite ejecutar scripts

Se pueden abrir múltiples ventanas de `CMD + sqlplus` y cada una tendrá una sesión diferente.

```txt
SQL> help index
SQL> help show
```

### Otras maneras de acceder a la instancia:

- Utilizando SQL Developer
- Utilizando Visual Studio Code + extensión SQL Developer
- Utilizando DBeaver (multi-SGBD, software libre)
- Utilizando TOAD (multi-SGBD, propietario / privativo)
- Utilizando SQLcl
- Utilizando ORDS

En cada solución es posible que las conexiones se preparen de forma diferente. En SQL Developer hay que añadir primero una conexión, configurarla y guardarla; después queda grabada. Cuando se quiere conectar, basta con hacer doble clic sobre ella y se inicia la conexión. En VSCode, DBeaver y TOAD funciona igual

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
