---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Guía: la variable de control en WHILE, FOR y LOOP"
pageClass: ejercicios-page
---

# 🧭 Guía: la variable de control en WHILE, FOR y LOOP

En SQL Developer, prueba los siguientes bloques de código y observa el comportamiento de la variable `x`.

## WHILE

```sql
set serveroutput on
declare
   x number;
begin
   x := 1;
   dbms_output.put_line('x abans del while ' || x);
   dbms_output.put_line('=======');

   while x<4 loop
      dbms_output.put_line(x);
      x:=x+1;
   end loop;

   dbms_output.put_line('=======');
   dbms_output.put_line('x despres del while ' || x);
end;
```

## FOR

::: warning Atención
En este código hay **dos** `x` diferentes.
:::

```sql
set serveroutput on
declare
   x number;
begin
   x := 1;
   dbms_output.put_line('x abans del for ' || x);
   dbms_output.put_line('=======');
   for x in 12..14 loop
      dbms_output.put_line('x dins del for ' ||x);
   end loop;
   dbms_output.put_line('=======');
   dbms_output.put_line('x despres del for ' ||x);
end;
```

## LOOP

```sql
set serveroutput on
declare
  i number(8) := 1;
begin

  loop
    DBMS_OUTPUT.PUT_LINE(i);
    exit when i=10;
    i := i+1;
  end loop;

end;
```

::: info-box Actividad
Anota el valor de `x` antes, dentro y después de cada bucle y explica por qué el `FOR` no modifica la variable declarada en el bloque.
:::

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD4/ASGBD-UD4.4 for en procedure.pdf`.</small>
