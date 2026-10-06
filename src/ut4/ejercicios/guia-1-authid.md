---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: AUTHID en los procedimientos almacenados"
pageClass: ejercicios-page
---

# 🧭 Guía: AUTHID en los procedimientos almacenados

En SQL Developer, prueba el comportamiento de la cláusula `AUTHID` en los procedimientos almacenados:

```txt
[AUTHID current_user | definer]
```

- `AUTHID DEFINER` (opción por defecto): el procedimiento se ejecuta con los privilegios de su **propietario**.
- `AUTHID CURRENT_USER`: el procedimiento se ejecuta con los privilegios del **usuario que lo invoca**.

## Un procedimiento común para todos los usuarios

Queremos hacer un procedimiento común, que estará en el esquema de `system`, y lo ejecutaremos desde cada usuario. Debe listar las tablas **del usuario que llama al procedimiento**.

Desde `system`:

```sql
create procedure llistataules
authid current_user
as
 cursor c is select table_name,tablespace_name from user_tables;
begin
   for x in c loop
      dbms_output.put_line(x.table_name);
   end loop;
end;
```

Le damos permiso a un usuario:

```sql
grant execute on llistataules to usuari1;
```

o a todos:

```sql
grant execute on llistataules to public;
```

Desde `usuari1` (se supone que tiene tablas creadas en su esquema):

```sql
set serveroutput on
execute system.llistataules;
```

## Con un sinónimo público

Desde `sys` o `system` podemos crear un sinónimo:

```sql
create public synonym llistataules for system.llistataules;
```

Y desde `usuari1` u otro usuario (se supone que tiene tablas creadas en su esquema):

```sql
set serveroutput on
execute llistataules;
```

::: info-box Actividad
Vuelve a crear el procedimiento con `authid definer` y ejecútalo desde `usuari1`. ¿Qué tablas lista ahora? Explica la diferencia.
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD4/ASGBD-UD4.3 authid en procedure.pdf`.</small>
