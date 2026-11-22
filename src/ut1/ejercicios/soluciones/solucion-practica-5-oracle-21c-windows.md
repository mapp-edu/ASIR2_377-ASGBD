---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 5: instalar Oracle 21c en Windows 10 Pro"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 5: instalar Oracle 21c en Windows 10 Pro

::: tip Solución de referencia
Resolución de referencia de la [Práctica 5](../practica-5-oracle-21c-windows), con los resultados esperados, los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

::: info Órdenes no ejecutadas
Esta solución está escrita a partir de la documentación de instalación de Oracle Database 21c para Windows; no se ha podido ejecutar en una máquina Windows. Las rutas son las que propone el instalador por defecto; acepta las del alumno o la alumna si son coherentes con la OFA y las ha comprobado.
:::

## Usuarios de Windows

Antes de empezar:

```powershell
# PowerShell como administrador
New-LocalUser -Name "oracle" -Password (Read-Host -AsSecureString)
Add-LocalGroupMember -Group "Administradores" -Member "oracle"
New-LocalUser -Name "ana" -Password (Read-Host -AsSecureString)     # sin grupo de administradores
```

Por qué se pide así:

- El instalador y DBCA necesitan permisos de administrador (crean servicios, claves de registro y grupos).
- El usuario que instala queda incluido en el grupo **`ORA_DBA`** y por eso puede entrar con `sqlplus / as sysdba` sin contraseña (autenticación del sistema operativo).
- El usuario personal, sin administrador ni `ORA_DBA`, recibe `ORA-01031: insufficient privileges` al intentar `sqlplus / as sysdba`. Comprobarlo y explicarlo es una evidencia excelente de nivel 4 en 1.j o 1.h.

## 1. Requisitos

| Requisito de Oracle 21c para Windows | Comprobación | Valor esperado |
|:---|:---|:---|
| Windows de 64 bits (10 Pro, Enterprise o Education, o Windows Server) | `winver`, `systeminfo` | Windows 10 Pro x64 22H2 |
| Memoria suficiente (4 GB o más para dos bases de datos de prácticas) | `systeminfo` | ~4096 MB |
| Espacio en disco: unos 10 GB para el software y varios GB por base de datos | `Get-PSDrive C` | > 100 GB libres |
| Usuario administrador | `net localgroup Administradores` | `oracle` en el grupo |
| Ruta del instalador sin espacios | — | `C:\app\oracle\product\21c\dbhome_1` |

El instalador también comprueba los requisitos (*Perform Prerequisite Checks*): una captura de esa pantalla sin errores es una buena evidencia de 1.e.

## 2–4. Descarga, descompresión y OFA

- Fichero: `WINDOWS.X64_213000_db_home.zip` (unos 3 GB), desde *oracle.com → Database → Oracle Database 21c → Microsoft Windows x64*. Requiere una cuenta de Oracle.
- Desde la versión 18c, la instalación en Windows es **por imagen**: el contenido del zip **es** el `ORACLE_HOME`. Por eso el enunciado dice que no se mueva ni se borre la carpeta del instalador después de instalar.

Estructura OFA (*Optimal Flexible Architecture*) esperada:

```txt
C:\app\oracle\                              ← ORACLE_BASE
C:\app\oracle\product\21c\dbhome_1\         ← ORACLE_HOME (aquí se descomprime el zip)
C:\app\oracle\oradata\RIBERA\               ← ficheros de datos de cada base de datos (los crea DBCA)
C:\app\oracle\diag\                         ← registros (alert log, trazas)
C:\app\oracle\cfgtoollogs\                  ← registros de DBCA y NETCA
```

Se valora que expliquen la OFA: separar software, datos y registros, con nombres que permitan tener varias versiones y varias bases de datos. Error típico: descomprimir en `Descargas\WINDOWS.X64_213000_db_home\` (ruta larga, dentro del perfil del usuario) o en una carpeta con espacios, que hace fallar el instalador.

## 5. Instalar solo el software

`setup.exe` → clic derecho → *Ejecutar como administrador*:

| Pantalla | Opción |
|:---|:---|
| Configuration Option | **Set Up Software Only** |
| Database Installation Option | Single instance database installation |
| Database Edition | Enterprise Edition (o Standard Edition 2) |
| Oracle Home User | **Use Virtual Account** (recomendada) |
| Oracle Base | `C:\app\oracle` |
| Prerequisite Checks | Sin errores |
| Summary → Install | — |

La cuenta virtual es la opción recomendada por Oracle: los servicios se ejecutan con una cuenta sin contraseña y con los privilegios justos, en lugar de con la cuenta de sistema (*Windows Built-in Account*, que tiene más privilegios de los necesarios).

Separar la instalación del software y la creación de la base de datos es lo que permite, en el paso 16, crear una segunda base de datos con el mismo software.

### Incidencia: el instalador se cierra sin avisar

Es la incidencia más difícil de diagnosticar de la práctica, porque no deja ningún error. Se ha reproducido en una máquina del curso con Windows 10 Pro 22H2 en VirtualBox.

- **Síntoma:** al pulsar **Instalar**, la ventana desaparece. El log de la instalación (`installActions<fecha>.log`) se corta en la fase `setup`, justo después de consultar el nombre del equipo, sin ninguna línea `SEVERE` ni `ERROR`, y en la carpeta del log quedan los ficheros `.lck` (el proceso no se cerró de forma normal). Pasa igual con la cuenta virtual que con la cuenta incorporada de Windows.
- **Pista:** ejecutando `setup.exe -debug` desde un CMD, las primeras líneas son `Mesa: SVGA3D; build: RELEASE;` y `Mesa: mesa-21.3.8`. Java está dibujando la interfaz con el controlador 3D de las *Guest Additions*, y se cae al cambiar a la pantalla de progreso.
- **Causa:** la **aceleración 3D** de VirtualBox está activada.
- **Solución:** apagar la MV, desmarcar *Configuración → Pantalla → Habilitar aceleración 3D* y volver a ejecutar `setup.exe` (solución comprobada). Alternativas no comprobadas: lanzar el instalador con `set _JAVA_OPTIONS=-Dsun.java2d.d3d=false -Dsun.java2d.opengl=false -Dsun.java2d.noddraw=true` en el mismo CMD, o instalar en modo silencioso con el fichero de respuestas que guarda el asistente (`setup.exe -silent -responseFile ...\install\response\db_<fecha>.rsp`).

Una entrega que documente esta secuencia (síntoma, log, prueba con `-debug`, causa y solución) es una evidencia de nivel 4 en 1.h y 1.i.

## 6. Log de la instalación

```txt
C:\Program Files\Oracle\Inventory\logs\InstallActions<fecha>\installActions<fecha>.log
```

Mientras dura la instalación, el log está en una carpeta temporal (`%TEMP%\InstallActions<fecha>\`) y al terminar se copia al **inventario central**. La última pantalla del instalador indica la ruta exacta. Se espera que adjunten el fichero e interpreten algunas líneas: comprobaciones de requisitos (`INFO: ... Check: ... Passed`), avisos y el final (`Successfully Setup Software`).

## 7–8. Primera base de datos: CDB `ribera`, PDB `santvi`

Tras reiniciar, `dbca` desde un CMD como administrador:

| Pantalla | Opción |
|:---|:---|
| Operation | Create a database |
| Creation Mode | Advanced configuration (o Typical, si permite indicar la PDB) |
| Deployment Type | General Purpose or Transaction Processing |
| Database Identification | Global database name `ribera` · SID `ribera` · **Create as Container database** · 1 PDB · PDB name `santvi` |
| Storage | File System, `{ORACLE_BASE}\oradata\{DB_UNIQUE_NAME}` |
| Memory | Automatic Shared Memory Management; con 4 GB y dos bases de datos, unos 1200–1500 MB por base de datos |
| User Credentials | Contraseña para `SYS`, `SYSTEM` y `PDBADMIN` (**anotarla**) |

Si DBCA avisa de que no hay listener, se puede continuar y crearlo en el paso 12, o crearlo antes con `netca`. Cualquiera de los dos órdenes es correcto si se explica.

## 9. Comprobación con SQL\*Plus

```txt
C:\> sqlplus / as sysdba
SQL> show user
USER is "SYS"
SQL> show con_name
CON_NAME
------------------------------
CDB$ROOT

C:\> sqlplus system
Enter password:
SQL> show user
USER is "SYSTEM"
SQL> show con_name
CON_NAME
------------------------------
CDB$ROOT
```

- `/ as sysdba` no pide contraseña: autenticación del sistema operativo (grupo `ORA_DBA`).
- `sqlplus system` sí la pide: `SYSTEM` no tiene privilegio SYSDBA y se autentica con contraseña.
- Los dos entran en `CDB$ROOT` porque se conectan a la instancia indicada por `ORACLE_SID` (en Windows está en el registro, en `HKLM\SOFTWARE\ORACLE\KEY_OraDB21Home1`).

## 10. `show pdbs` antes y después de reiniciar

Justo después de crear la base de datos:

```txt
SQL> show pdbs
    CON_ID CON_NAME                       OPEN MODE  RESTRICTED
---------- ------------------------------ ---------- ----------
         2 PDB$SEED                       READ ONLY  NO
         3 SANTVI                         READ WRITE NO
```

Después de reiniciar Windows hay dos resultados posibles, y los dos son válidos si se explican:

- **`SANTVI` en `MOUNTED`.** El servicio `OracleServiceRIBERA` arranca la instancia y abre la CDB, pero una PDB no se abre sola salvo que se haya guardado su estado. Solución:

  ```sql
  ALTER PLUGGABLE DATABASE santvi OPEN;
  ALTER PLUGGABLE DATABASE santvi SAVE STATE;
  ```

- **`SANTVI` en `READ WRITE`.** El estado ya estaba guardado (lo puede hacer DBCA al crearla). Se comprueba con:

  ```sql
  SELECT con_name, state FROM dba_pdb_saved_states;
  ```

Además, se espera que expliquen **por qué** la CDB arranca sola: el servicio de Windows `OracleServiceRIBERA` es de inicio automático y la clave de registro `ORA_RIBERA_AUTOSTART = TRUE` hace que el servicio arranque también la instancia.

## 11–12. IP fija y listener

En red interna no hay DHCP, así que la MV se queda con una IP 169.254.x.x. IP fija en `ncpa.cpl` → adaptador → IPv4, por ejemplo `192.168.100.10/24`, sin puerta de enlace.

`netca` (CMD como administrador):

1. *Listener configuration → Add* → nombre `LISTENER` → protocolo TCP → puerto estándar **1521**.
2. *Naming Methods configuration* → **Local Naming** y **Easy Connect Naming**.

Al crear el listener, el cortafuegos de Windows pregunta si permite el acceso de `tnslsnr.exe`: hay que permitirlo en redes privadas.

Comprobación:

```txt
C:\> lsnrctl status
...
Listening Endpoints Summary...
  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=mOracle-ana)(PORT=1521)))
Services Summary...
Service "ribera" has 1 instance(s).
Service "santvi" has 1 instance(s).
The command completed successfully
```

Si no aparecen los servicios, la base de datos aún no se ha registrado (tarda hasta un minuto): `ALTER SYSTEM REGISTER;` lo fuerza. Los ficheros generados están en `%ORACLE_HOME%\network\admin\` (`listener.ora`, `sqlnet.ora`).

## 13–15. SQL Developer

Se descarga la versión para Windows **con JDK incluido** y se descomprime (no tiene instalador). Conexiones:

| Conexión | Usuario | Rol | Host · Puerto | Tipo |
|:---|:---|:---|:---|:---|
| CDB · sys | `sys` | **SYSDBA** | `localhost` · 1521 | Nombre del servicio `ribera` (o SID `ribera`) |
| CDB · system | `system` | Por defecto | `localhost` · 1521 | Nombre del servicio `ribera` |
| PDB · sys | `sys` | **SYSDBA** | `localhost` · 1521 | Nombre del servicio **`santvi`** |
| PDB · system | `system` | Por defecto | `localhost` · 1521 | Nombre del servicio **`santvi`** |

- Prueba de cada una: botón *Probar* → *Estado: Correcto*, y en la hoja de trabajo `SELECT sys_context('USERENV', 'CON_NAME') FROM dual;`.
- `system` puede entrar en la PDB porque es un **usuario común**, que existe en todos los contenedores.
- Errores típicos: `ORA-28009` (sys sin rol SYSDBA), `ORA-12514` (servicio no registrado o mal escrito) y `ORA-12541: TNS:no listener` (paso 12 sin hacer). Para la PDB **no** se puede usar SID: la PDB no tiene instancia propia.

## 16–17. Segunda base de datos: CDB `costera`, PDB `simarro`

`dbca` de nuevo, con el mismo software y la misma configuración, cambiando los nombres. Puntos que se valoran:

- **Memoria.** Con dos bases de datos en 4 GB, si cada una usa el valor por defecto que propone DBCA, Windows empieza a paginar. Se reduce la memoria de las dos o se pone el servicio de una de ellas en inicio **manual**.
- **`ORACLE_SID`.** Desde ahora `sqlplus / as sysdba` entra en la base de datos indicada en el registro. Para elegir:

  ```txt
  C:\> set ORACLE_SID=costera
  C:\> sqlplus / as sysdba
  SQL> select name from v$database;      -- COSTERA
  ```

- El listener es el mismo para las dos: `lsnrctl status` muestra ahora los servicios `ribera`, `santvi`, `costera` y `simarro`.

Logs de DBCA (pasos 8 y 17):

```txt
C:\app\oracle\cfgtoollogs\dbca\RIBERA\
C:\app\oracle\cfgtoollogs\dbca\COSTERA\
```

En cada carpeta hay un `trace.log_<fecha>` con el detalle y ficheros con el progreso de cada paso (creación de la CDB, de la PDB, ejecución de scripts). Se espera que localicen la línea final de éxito y algún aviso. El *alert log* de cada instancia, que también registra la creación, está en `C:\app\oracle\diag\rdbms\<db>\<sid>\trace\alert_<sid>.log`.

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **1.d** | Falta software o carpetas sin OFA. | Instalador 21c, 7-Zip y SQL Developer; carpetas según la OFA. | Explica la OFA y por qué el zip es el `ORACLE_HOME`. | Justifica la cuenta virtual y anticipa la memoria necesaria para dos bases de datos. |
| **1.e** | No comprueba los requisitos. | Comprueba sistema, memoria y disco antes de instalar. | Tabla de requisitos con valores obtenidos y comprobación del instalador. | Relaciona los requisitos con las dos bases de datos que se van a crear. |
| **1.f** | Software sin instalar o una sola base de datos. | Software y las dos CDB con sus PDB. | Separa claramente software y bases de datos y explica las opciones elegidas. | Configura la memoria o el inicio de los servicios para que convivan las dos. |
| **1.h** | No localiza los logs. | Localiza y adjunta el log de la instalación y de DBCA, y muestra `show pdbs`. | Interpreta líneas de los logs y explica el resultado de `show pdbs` tras reiniciar. | Usa además el *alert log* o la autenticación del sistema operativo (`ORA-01031` con el usuario personal) para explicar el funcionamiento. |
| **1.i** | Incidencias sin resolver. | Resuelve las incidencias que aparecen. | Explica la causa (rutas, permisos, aceleración 3D, listener, IP, PDB cerrada). | Documenta incidencias no previstas y cómo las ha diagnosticado. |
| **1.j** | Falta alguna comprobación. | SQL\*Plus y las cuatro conexiones de SQL Developer funcionan. | Comprueba en cada conexión el usuario y el contenedor. | Comprueba también `lsnrctl status` y el acceso a las dos bases de datos. |
| **1.g** | Capturas sin explicación. | Proceso completo. | Explicaciones de cada pantalla relevante. | Documento claro y ordenado, con incidencias y soluciones. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD, sobre la práctica adaptada de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
