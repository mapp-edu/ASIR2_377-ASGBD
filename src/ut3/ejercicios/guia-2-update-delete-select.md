---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: permisos UPDATE y DELETE en Oracle"
pageClass: ejercicios-page
---

# 🧭 Guía: permisos UPDATE y DELETE en Oracle

El permiso `UPDATE` que se concede sobre un objeto de Oracle necesita ir emparejado con el permiso `SELECT`. Lo mismo ocurre con el permiso `DELETE`. **Oracle no lo hace automáticamente.**

## Explicación

Supongamos que a un usuario se le concede (`GRANT`) permiso de actualización sobre una tabla que no es suya:

```sql
grant update on usuari1.taula1 to usuari2;
```

Si este usuario (`usuari2`) ejecuta:

```sql
update usuari1.taula1 set columna1=valor;
```

la sentencia **funcionará**: la actualización se aplica a toda la tabla.

Pero si intenta ejecutar:

```sql
update usuari1.taula1 set columna1=valor where columna2=valor2;
```

la sentencia **fallará**.

¿Por qué? Oracle necesita conocer los datos de `columna2` para poder realizar la actualización, y para conocer esos datos necesita el permiso `SELECT`. Oracle Database necesita leer los datos de la fila para saber cómo modificarla; si no se tienen los permisos de `SELECT`, la actualización no se puede llevar a cabo correctamente. Lo mismo les ocurre a las sentencias `DELETE`.

Así pues:

- `UPDATE` + `SELECT`
- `DELETE` + `SELECT`

## Comprobación paso a paso

Reproduce la prueba y comprueba que obtienes los mismos resultados.

**1.** Desde el usuario `SYSTEM`, se crea `usuari2` y se le concede el permiso `UPDATE` sobre una tabla de `usuari1` (la tabla `llibre` ya tiene datos):

```sql
create user usuari2 identified by 1234;
grant connect, resource to usuari2;
alter user usuari2 quota 10M on users;
grant update on usuari1.llibre to usuari2;
```

**2.** Desde `usuari2`, se ejecuta el `UPDATE` **sin** cláusula `WHERE`. Sí deja hacerlo:

```txt
SQL> update usuari1.llibre set editorial = 'ra-ma';

5 filas actualizadas.
```

**3.** Pero si se ejecuta el `UPDATE` **con** cláusula `WHERE`, no deja realizar la operación por falta de privilegios:

```txt
SQL> update usuari1.llibre set editorial = 'ra-ma' where codi=1;

ORA-01031: privilegios insuficientes
```

**4.** Desde el usuario `SYSTEM`, ahora se le concede el privilegio `SELECT`:

```sql
grant select on usuari1.llibre to usuari2;
```

**5.** Y se ejecuta de nuevo el `UPDATE` desde `usuari2`, con la cláusula `WHERE`. Ahora sí deja realizarlo:

```txt
SQL> update usuari1.llibre set editorial = 'ra-ma' where codi=1;

1 fila actualizada.
```

::: info-box Actividad
Repite la prueba con el permiso `DELETE`: concédelo sin `SELECT`, intenta borrar con y sin `WHERE`, y explica el resultado.
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD3/ASGBD-UD3.1.2 Update i select en oracle.pdf`.</small>
