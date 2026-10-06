---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: órdenes básicas y primeros errores en Oracle"
pageClass: ejercicios-page
---

# 🧭 Guía: órdenes básicas y primeros errores en Oracle

## Órdenes básicas (conexión, desconexión...)

### En Linux

```bash
dbca
netca
lsnrctl status
lsnrctl start
sqlplus / as sysdba
```

```sql
startup
show con_name
show user
show pdbs
show release
show sga
alter session set container=nompdb;
help index
help show
```

### En Windows

```txt
C:\users\admin> sqlplus / as sysdba
```

Esta orden es la conexión de `sys` y conecta a la CDB que indique `ORACLE_SID`.

```sql
show pdbs
select name from v$database;
show con_name
show user
show release
show sga
```

Si la `pdb1` está cerrada (estado `MOUNTED`), se puede abrir, guardar su estado para los siguientes arranques y entrar en ella:

```sql
alter pluggable database pdb1 open;
alter pluggable database pdb1 save state;
alter session set container=pdb1;
```

La `pdb1` debe estar abierta para poder conectar con cualquier usuario diferente de `sys`:

```sql
conn usu/12345@localhost:1521/pdb1 as sysdba
conn usu/12345@localhost:1521/pdb1
```

o, desde el sistema operativo:

```txt
c:\...> sqlplus usu/12345@localhost:1521/pdb1 as sysdba
c:\...> sqlplus usu/12345@localhost:1521/pdb1
```

Una vez abierta, conectar con `system`:

```sql
conn system
conn system/1234@localhost/pdb1
conn system/1234@localhost/pdb1 as sysdba
```

::: info Para investigar
¿Puede `system` entrar con y sin el privilegio `sysdba`?
:::

## Errores comunes iniciales

### ORA-01034: ORACLE not available

```txt
C:\Users\oracle>sqlplus / as sysdba
Conectado.
SQL> show con_name
ERROR:
ORA-01034: ORACLE not available
```

- **Por qué:** se ha intentado acceder demasiado pronto. Se acaba de iniciar la máquina y la BBDD/instancia todavía no está levantada completamente.
- **Solución:** espera un poco y vuelve a intentarlo (`exit` y volver a conectar).

### Conectado a una instancia inactiva

```txt
C:\Users\oracle>sqlplus / as sysdba
Conectado a una instancia inactiva.
```

- **Por qué:** la BBDD está parada.
- **Solución:** arrancarla con `startup` (tarda un poco).

```txt
SQL> startup
Instancia ORACLE iniciada.
...
Base de datos montada.
Base de datos abierta.
```

::: warning Cuidado
Esto puede pasar (y suele pasar) con las PDB.
:::

### ORA-01017: invalid username/password; logon denied

```txt
C:\Users\oracle>sqlplus /
ERROR:
ORA-01017: invalid username/password; logon denied
```

- **Por qué:** no se puede entrar como `sys` (`/`) sin el rol `sysdba`.

En cambio, estas dos deben funcionar:

```txt
sqlplus system
sqlplus system as sysdba
```

### ORA-01031: privilegios insuficientes

```txt
C:\Users\oracle>sqlplus system
SQL> shutdown immediate
ORA-01031: privilegios insuficientes
```

Desde `system` no podemos parar la BBDD.

- **Por qué:** no se tienen suficientes privilegios.
- **Solución:** salir y entrar con privilegios.

```txt
C:\Users\oracle>sqlplus system as sysdba
SQL> shutdown immediate
Base de datos cerrada.
Base de datos desmontada.
Instancia ORACLE cerrada.
```

### Las PDB aparecen en estado MOUNTED

```txt
SQL> show pdbs
    CON_ID CON_NAME     OPEN MODE  RESTRICTED
---------- ------------ ---------- ----------
         2 PDB$SEED     MOUNTED
         3 PDB_A        MOUNTED
```

Todavía no están las PDB abiertas: hay que esperar a que el SGBD acabe de arrancar. Si esperamos un poco, `PDB$SEED` acaba de abrirse y pasa al estado `READ ONLY`.

- Las PDB que están en estado `MOUNTED` **no** están abiertas para poder trabajar.
- Las que están en estado `READ WRITE` ya están abiertas para poder trabajar.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD1/ASGBD-UD1.3 Ordres basiques i primers errors.pdf`.</small>
