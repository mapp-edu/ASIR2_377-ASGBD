---
layout: doc
title: "Oracle: entorno y conexiones"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: entorno y conexiones

## Configuración del entorno

### Variables de entorno esenciales

- **ORACLE_HOME**: ruta donde está instalado el software de Oracle (binarios, bibliotecas, scripts...). Suele contener `bin, lib, network, rdbms...`
- **ORACLE_BASE**: ruta raíz donde se guardan datos, configuraciones, logs y más. Suele contener `product, admin, diag, cfgtoollogs...`
- **ORACLE_SID**: identificador de la instancia Oracle con la que se trabajará
- **PATH**: variable del SO para acceder a las órdenes de Oracle desde cualquier ruta (p. ej., `sqlplus`)
- **NLS_LANG**: define idioma, territorio y juego de caracteres (p. ej., `SPANISH_SPAIN.WE8MSWIN1252`)

### 🐧 En Linux

Puedes ver o configurar estas variables con:

```bash
$ echo $ORACLE_SID
$ echo $ORACLE_HOME
$ export ORACLE_SID=orclcdb     # Cambiar el valor de ORACLE_SID
$ echo $ORACLE_BASE
$ env       # Lista todas las variables de entorno
```

### Ejemplo de configuración

```bash
export ORACLE_HOME=/opt/oracle/product/21c/dbhome_1
export ORACLE_BASE=/opt/oracle
export ORACLE_SID=costera
export PATH=$ORACLE_HOME/bin:$PATH
```

O hacer cambios permanentes en bashrc

```bash
vi ~/.bashrc
---   hacer los cambios
---   guardar
---   cargar los cambios sin reiniciar
source ~/.bashrc
```

### 🖥️ En Windows

**Desde cmd con ECHO (el PATH). El resto de configuraciones, desde el registro de Windows (REGEDIT)**

```txt
> echo %PATH%
> set
```

Puedes modificarlas (el PATH) desde *Propiedades del sistema → Variables de entorno*.

![Claves de Oracle en el registro de Windows #center](/img/contenidos/ut2/regedit-captura.png)

Para ver las variables de entorno de Oracle hay que usar REGEDIT y buscar dentro, por ejemplo, ORACLE_HOME

Puedes modificarlas desde el **Registro (regedit)**

### 🔧 Ejercicio práctico sugerido

Comprueba el valor actual de tu `ORACLE_SID` y cámbialo a otra instancia como «`costera`» o «`ribera`». Después abre **regedit** y comprueba adónde apunta `ORACLE_HOME`.

#### Otras variables de entorno interesantes en REGEDIT

`ORA_SID_AUTOSTART ORA_SID_SHUTDOWN ORA_SID_SHUTDOWN_TIMEOUT ORA_SID_SHUTDOWNTYPE`

### Buenas prácticas

- Configura correctamente el entorno antes de ejecutar cualquier herramienta como `sqlplus` o `dbca`
- Cambia el ORACLE_SID según la base de datos con la que quieras trabajar
- Si tienes más de una base de datos, asegúrate de que las variables son correctas para cada sesión
- ORACLE_BASE y ORACLE_HOME son esenciales para el correcto funcionamiento del SGBD

## Configuración de las conexiones

![Puerto 1521, servicio Oracle Database #center](/img/contenidos/ut2/port1521.png)

⚠️⚠️ En Windows, no dejes APIPA activado. Pon la IP manualmente

⚠️⚠️ Permite el puerto 1521 en el firewall 🛡️🧱🔥

### Componentes clave para conectarse a Oracle

Para establecer una conexión entre un cliente y una base de datos Oracle, se necesita:

- Un **listener** activo en el servidor, configurado con el fichero `listener.ora`
- Un fichero **tnsnames.ora** en el cliente (y opcionalmente en el servidor)
- El fichero **sqlnet.ora** para determinar el orden de resolución

### 📁 Ficheros implicados (ubicación típica)

- `$ORACLE_HOME/network/admin/listener.ora`
- `$ORACLE_HOME/network/admin/sqlnet.ora`
- `$ORACLE_HOME/network/admin/tnsnames.ora`

- `%ORACLE_BASE%/homes/%ORACLE_HOME_NAME%/network/admin/listener.ora`
- `%ORACLE_BASE%/homes/%ORACLE_HOME_NAME%/network/admin/sqlnet.ora`
- `%ORACLE_BASE%/homes/%ORACLE_HOME_NAME%/network/admin/tnsnames.ora`

### Fichero tnsnames.ora

¡A quién conectar! Es un fichero de configuración de texto plano que utilizan los clientes de bases de datos Oracle para saber cómo conectarse a una base de datos específica.

Podríamos decir que es como la «lista de contactos» o la agenda telefónica de tu base de datos: tú le das un nombre fácil (un alias) y el fichero le dice al ordenador cuál es la dirección IP, el puerto y el nombre del servicio real.

### Fichero sqlnet.ora

¡Cómo conectar! Es el libro de reglas o el perfil de configuración de la red de Oracle. Se encuentra en el servidor y dice cómo se debe comportar el cliente o el servidor durante la conexión. Define parámetros de seguridad, prioridades y tiempos de espera.

```txt
SQLNET.AUTHENTICATION_SERVICES = (NONE)
NAMES.DIRECTORY_PATH = (TNSNAMES, EZCONNECT)
```

### 🛠️ Herramientas para configurar la red

- **netca**: asistente para crear listeners y servicios ⚠️ Importante: ejecutar como administrador
- **netmgr**: gestión gráfica de conexiones Oracle

#### Ejemplo:

```bash
$ netca     # Inicia el asistente gráfico (en Linux o CMD)
$ netmgr    # (también gráfico)
```

### 🔍 Verificación con tnsping

Permite comprobar si la configuración funciona y si el listener está respondiendo:

**Esta verificación tiene sentido si se hace desde una máquina distinta del servidor**

```bash
$ tnsping orcl
```

Salida esperada:

```txt
Used parameter files:
/opt/oracle/product/21c/dbhome_1/network/admin/sqlnet.ora

Used TNSNAMES adapter to resolve the alias
Attempting to contact (DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))...)
OK (10 msec)
```

### ⚠️ Errores habituales

- Listener no iniciado → `lsnrctl start`
- El servicio no está registrado correctamente → revisar `GLOBAL_DBNAME` o `SERVICE_NAME`
- El cliente no encuentra el tnsnames.ora → revisar la ruta o la variable `TNS_ADMIN`

### ✅ Buenas prácticas

- Hacer `tnsping` antes de probar una conexión completa
- Mantener una copia de seguridad de los ficheros de configuración
- En producción, usar nombres DNS en lugar de IP y restringir puertos en el cortafuegos

### Primera conexión

```bash
$ sqlplus / as sysdba
C:\Users\enric> sqlplus / as sysdba
.............
SQL> show con_name
SQL> select name from v$database;
SQL> show user
SQL> show pdbs
SQL> show sga
```

### Navegar por las PDB

```bash
$ sqlplus / as sysdba
SQL> show con_name
SQL> select name from v$database;
SQL> show user
SQL> show pdbs
SQL> alter session set CONTAINER=PDB1;         -- Entra en PDB1
SQL> show pdbs
SQL> alter session set CONTAINER=PDB2;         -- Entra en PDB2
SQL> show pdbs
SQL> alter session set CONTAINER=cdb$root;     -- Vuelve a la CDB
SQL> show pdbs
```

### 🔧 Ejercicios prácticos sugeridos

✔️ Instalar Oracle Instant Client (sqlplus) en otra máquina de la misma red, configurarlo y hacer `tnsping`.

✔️ Instalar SQL Developer en otra máquina de la misma red, configurar una nueva conexión y probarla.

::: info-box Antes de continuar
Haz un repaso de SQL: empieza por el [repaso del modelo entidad-relación](/ut2/contenidos/repaso-1-modelo-er) y continúa con el [repaso de SQL](/ut2/contenidos/repaso-2-sql-tablas).
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
