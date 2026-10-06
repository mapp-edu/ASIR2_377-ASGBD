---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: tablespaces y datafiles en Oracle"
pageClass: ejercicios-page
---

# 🧭 Guía: tablespaces y datafiles en Oracle

## Conceptos

Un **tablespace** es un almacén lógico de los objetos de la base de datos. Es un concepto: contiene **datafiles** (uno o más).

Los **datafiles**:

- Son ficheros físicos que forman parte de los tablespaces; pertenecen a un tablespace (solo a uno) y a una instancia.
- Cuando se crean ocupan todo el espacio asignado (si no hay suficiente espacio, no se crean).
- Cuando se crean están vacíos, pero ocupan espacio.
- Pueden estar almacenados en discos diferentes.

## Crear tablespaces

Primero, desde el sistema operativo, prepara la carpeta (también se puede utilizar una ya existente):

```bash
mkdir /u01/app/oracle/oradata/curso
```

Después, desde SQL Developer o SQL\*Plus:

```sql
create tablespace curs1 datafile 'D:\oracle\oradata\nombbdd\c01.dbf' size 40M;
create tablespace curs2 datafile 'c02.dbf' size 20M;
create tablespace curs3 datafile size 30M;
```

::: warning Atención
Las comillas simples en la ruta del datafile son obligatorias.
:::

Opción de crecimiento automático, añadida al final de la sentencia:

```sql
... AUTOEXTEND ON NEXT 100M MAXSIZE 10G;
```

## Consultas al DD

```sql
select file_name, blocks, tablespace_name from dba_data_files;
select username, default_tablespace from dba_users;
select tablespace_name, contents from dba_tablespaces;
```

## Tablespaces temporales

```sql
create temporary tablespace curso_temp
  tempfile '/u01/app/oracle/oradata/curso/curso_temp_01.dbf' size 50M;
```

## Asignar tablespaces a un usuario

```sql
alter user prueba default tablespace users temporary tablespace curso_temp;
```

## Cuotas sobre tablespaces

Si un usuario no tiene cuota, no podrá almacenar nada en el tablespace.

```sql
alter user prueba quota 100M on curso;
alter user prueba quota unlimited on curso2;
```

## Crear objetos en otros tablespaces

Para crear objetos en un tablespace que no sea el tablespace por defecto:

```sql
create table t_cursos ( ... ) tablespace curso2;
```

## Redimensionar un tablespace

```sql
alter tablespace curso add datafile '/u01/app/oracle/oradata/curso/curso_02.dbf' size 100M;
alter database datafile '/u01/app/oracle/oradata/curso/curso_01.dbf' resize 200M;
```

## Usar tablespaces

```sql
create table xxxx ( ... ) tablespace curs1;
create index xxx ... tablespace curs1;
create user xxxx identified by "secret" default tablespace appdat;
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD2/ASGBD-UD2.2 Tablespaces i datafiles_simple.pdf`.</small>
