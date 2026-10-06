---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: conexiones como SYSDBA en Windows"
pageClass: ejercicios-page
---

# 🧭 Guía: conexiones como SYSDBA en Windows

En Windows hay que distinguir entre el administrador (o administradores) de la máquina y el administrador del SGBD Oracle, al que llamaremos **sgbd-admin**: el usuario de Windows que ha instalado Oracle. (El sgbd-admin tiene que ser administrador de Windows para poder instalar Oracle.)

- `sqlplus / as sysdba` (entrar sin usuario ni contraseña) **solo** lo puede utilizar el usuario de Windows que ha hecho la instalación de Oracle.
- No lo puede utilizar otro usuario de Windows, **aunque sea administrador de Windows**.
- Desde un usuario que no es el sgbd-admin (ni desde SQL Developer) no se puede entrar con `/ as sysdba`, pero sí con `sys as sysdba` y su contraseña.

::: tip Nota de la adaptación
Técnicamente, lo que Oracle comprueba es la pertenencia del usuario de Windows al grupo local `ORA_DBA`: el instalador añade a ese grupo al usuario que hace la instalación. Por eso un administrador de Windows que no pertenezca a `ORA_DBA` no puede entrar con `/ as sysdba`.
:::

En los ejemplos siguientes, `asix` es el usuario administrador de la máquina Windows (quien ha instalado el sistema operativo), `oracle` es el sgbd-admin (quien ha instalado Oracle) y `convidat` es un usuario sin privilegios.

## Desde un usuario que no es sgbd-admin ni administrador de Windows

Usuario de Windows: `convidat`.

```txt
C:\Users\convidat> sqlplus

Introduzca el nombre de usuario: /as sysdba
ERROR:
ORA-01017: invalid username/password; logon denied

Introduzca el nombre de usuario: sys as sysdba
Introduzca la contraseña:

Conectado a:
Oracle Database ...
SQL>
```

## Desde el usuario sgbd-admin

Desde un CMD del usuario del sistema operativo que instaló Oracle, `/` entra como `SYS`:

```txt
C:\Users\oracle> sqlplus / as sysdba

SQL> show user
USER es "SYS"
```

De hecho, desde esa sesión **cualquier usuario de Oracle** puede entrar como SYSDBA, y entra como `SYS` también:

```txt
C:\Users\oracle> sqlplus usuari1/1234 as sysdba

SQL> show user
USER es "SYS"
```

Esto ocurre siempre que estemos en la máquina de Oracle, dentro de la sesión del usuario de Windows que ha hecho la instalación.

## Desde otro usuario de Windows, aunque sea administrador

Si estamos en la máquina de Oracle, pero en la sesión de un usuario de Windows que **no** ha hecho la instalación (`asix`), ya no deja conectar con `/` sin contraseña:

```txt
C:\Users\asix> sqlplus / as sysdba

ERROR:
ORA-01017: invalid username/password; logon denied
```

Hay que especificar el usuario y la contraseña. Si indicamos que es `sys` y damos su contraseña, sí deja conectar:

```txt
C:\Users\asix> sqlplus sys/1234 as sysdba

SQL> show user
USER es "SYS"
```

## El usuario SYSTEM

En Oracle 19c, el usuario `system` no tiene los privilegios `SYSDBA` ni `SYSOPER`, así que no puede conectar como tal (si no se le asignan antes).

`SYSTEM` puede conectar como un usuario normal, con sus privilegios:

```txt
C:\Users\asix> sqlplus system/1234

SQL> show user
USER es "SYSTEM"
```

Pero no como `SYS` (SYSDBA), salvo que se configure expresamente:

```txt
C:\Users\asix> sqlplus system/1234 as sysdba

ERROR:
ORA-01017: invalid username/password; logon denied
```

## Dar el privilegio SYSDBA a un usuario

Se puede configurar un usuario para que pueda conectar como `SYS` con el `GRANT` correspondiente:

```sql
grant sysdba to usuari1;
commit;
```

Esto funciona si estamos conectados a una **PDB**. En la CDB no se puede hacer con un usuario local.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD3/ASGBD-UD3.1.1 Usuaris NO admin en W10.pdf`.</small>
