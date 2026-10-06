---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: usuarios comunes en Oracle"
pageClass: ejercicios-page
---

# 🧭 Guía: usuarios comunes en Oracle

`sys` y `system` son **usuarios comunes**: existen en la CDB y en todas las PDB.

## La contraseña de un usuario común se cambia desde la CDB

No se puede cambiar la contraseña de un usuario común desde una PDB; hay que hacerlo desde la CDB.

Si estamos conectados a una PDB e intentamos cambiar la contraseña de un usuario común, da error:

```txt
SQL> show con_name
PDB_01

SQL> alter user system identified by 123456789;

ORA-65066: Los cambios especificados se deben aplicar a todos los contenedores
```

Si conectamos a la CDB y cambiamos la contraseña desde allí, sí deja; además, se cambia en la CDB **y en todas las PDB**:

```txt
SQL> show con_name
CDB$ROOT

SQL> alter user system identified by 123456789;

Usuario modificado.
```

## Crear un usuario común

Un usuario común se crea desde la CDB y su nombre empieza por `C##`:

```txt
SQL> create user C##usuari identified by 1234;

Usuario creado.
```

Si se le concede el permiso de conexión desde la CDB sin más, **solo tiene permiso para conectar a la CDB**, aunque el usuario esté creado en todas las PDB:

```sql
grant connect to C##usuari;
```

Hay que dar el permiso especificando todos los contenedores:

```sql
grant connect to C##usuari container=ALL;
```

## El usuario PDBADMIN

La primera PDB se crea con una cuenta de usuario administrador **local** de la PDB denominada `PDBADMIN` (no pide nombre; se le asigna `PDBADMIN`). En la creación de las PDB siguientes se pide el nombre del administrador de la PDB, que puede ser igual o diferente.

- La cuenta `PDBADMIN` se configura inicialmente con la misma contraseña de administración que los usuarios `SYS` y `SYSTEM`.
- `PDBADMIN` **no es un usuario común**: es un usuario de la PDB (la primera PDB).
- Se configura inicialmente con privilegios básicos asignados a través de dos roles: `CONNECT` y `PDB_DBA`.
- Para la mayoría de los fines administrativos prácticos hay que asignar privilegios adicionales a la cuenta `PDBADMIN` o al rol `PDB_DBA`.

## Usuarios comunes especiales

Además de `SYS` y `SYSTEM`, existen usuarios comunes especiales, como `SYSBACKUP`, que tiene un privilegio administrativo propio: `SYSBACKUP` es un usuario y también es un privilegio.

Para activar el usuario:

```sql
alter user sysbackup account unlock identified by 1234;
grant connect,sysbackup to sysbackup container=ALL;
```

Para comprobar los privilegios administrativos:

```sql
select * from v$pwfile_users;
```

Para comprobar los privilegios del usuario conectado:

```sql
select * from session_privs;
```

| Privilegio | Uso |
|:---|:---|
| `SYSBACKUP` | Operaciones de copia de seguridad y recuperación con RMAN y SQL\*Plus. |
| `SYSKM` | Administración de la configuración del *wallet*, que se usa con Transparent Data Encryption (TDE). |
| `SYSDG` | Operaciones de Data Guard (orden `DGMGRL`). |
| `SYSASM` | Administración de ASM. (El usuario `SYSASM` no existe.) |
| `SYSRAC` | Administración de Oracle Real Application Clusters (RAC). Lo utiliza el agente de *clusterware* para conectarse a la base de datos al ejecutar órdenes como `SRVCTL`. |

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD3/ASGBD-UD3.1.3 usuaris comuns en oracle.pdf`.</small>
