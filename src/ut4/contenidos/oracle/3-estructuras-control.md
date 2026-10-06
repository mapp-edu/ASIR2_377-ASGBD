---
layout: doc
title: "PL/SQL: estructuras de control"
sidebar: true
outline: [2, 3]
aside: true
---

# PL/SQL: estructuras de control

## 🔁 Estructuras de control en PL/SQL

Las estructuras de control son fundamentales para controlar el flujo de ejecución de un bloque de código PL/SQL. Oracle soporta las siguientes:

### Condicionales

#### Estructura IF

```txt
IF condicio THEN
    instruccions;
ELSIF altra_condicio THEN
    instruccions;
ELSE
    instruccions;
END IF;
```

#### Ejemplo IF (🧪 ¡Pruébalo!)

```sql
SET SERVEROUTPUT ON;

DECLARE
    edat NUMBER := &dismeedat;
BEGIN
    IF edat >= 18 THEN
      DBMS_OUTPUT.PUT_LINE('Eres mayor de edad');
    ELSE
      DBMS_OUTPUT.PUT_LINE('Eres menor');
    END IF;
END;
```

#### Estructura CASE

```txt
CASE expressio
    WHEN valor1 THEN instruccions;
    WHEN valor2 THEN instruccions;
    ELSE instruccions;
END CASE;
```

#### Ejemplo CASE (🧪 ¡Pruébalo!)

```sql
DECLARE
    nota NUMBER := &dismeNota;
BEGIN
    CASE
      WHEN nota >= 9 THEN DBMS_OUTPUT.PUT_LINE('Excelente');
      WHEN nota >= 5 THEN DBMS_OUTPUT.PUT_LINE('Aprobado');
      ELSE DBMS_OUTPUT.PUT_LINE('Suspenso');
    END CASE;
END;
```

### 🔁 Bucles

#### 🔄 LOOP básico (con salida manual)

```txt
LOOP
    instruccions;
    EXIT WHEN condicio;
END LOOP;
```

#### Ejemplo LOOP (🧪 ¡Pruébalo!)

```sql
DECLARE
    i NUMBER := &dismeVoltes;
BEGIN
    LOOP
      DBMS_OUTPUT.PUT_LINE('Iteración: ' || i);
      i := i + 1;
      EXIT WHEN i > 5;
    END LOOP;
END;
```

#### WHILE LOOP

```txt
WHILE condicio LOOP
    instruccions;
END LOOP;
```

#### Ejemplo WHILE (🧪 ¡Pruébalo!)

```sql
DECLARE
    i NUMBER := &dismeVoltes;
BEGIN
    WHILE i <= 3 LOOP
      DBMS_OUTPUT.PUT_LINE('Valor: ' || i);
      i := i + 1;
    END LOOP;
END;
```

#### FOR LOOP

```txt
FOR variable IN inici..final LOOP
    instruccions;
END LOOP;
```

#### Ejemplo FOR

```sql
BEGIN
    FOR i IN 1..4 LOOP
      DBMS_OUTPUT.PUT_LINE('Posición: ' || i);
    END LOOP;
END;
```

### Notas adicionales

- **EXIT WHEN** → sale de un bucle cuando se cumple una condición
- **CONTINUE** → salta a la siguiente iteración (a partir de Oracle 11g)
- Los bucles pueden estar **anidados** y combinarse con IF o CASE

### Buen uso de las estructuras

- Usa `FOR` si sabes cuántas veces quieres repetir
- Usa `WHILE` si dependes de una condición externa
- Usa `IF` para bifurcar el comportamiento del código
- ⚠️ Evita los bucles infinitos; asegura siempre una condición de salida

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
