---
layout: doc
title: "PL/pgSQL: estructuras de control"
sidebar: true
outline: [2, 3]
aside: true
---

# PL/pgSQL: estructuras de control

## 🔁 Estructuras de control en PL/pgSQL

Las estructuras de control son fundamentales para controlar el flujo de ejecución de un bloque de código PL/pgSQL. Las principales son: condicionales y bucles

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

`ELSE` y `ELSIF` son opcionales

#### Ejemplo IF (🧪 ¡Pruébalo!)

```sql
DO $$
DECLARE
    x int := 3;
BEGIN
    IF x > 5 THEN
        RAISE NOTICE 'x es mayor que 5';
    ELSE
        RAISE NOTICE 'x es menor o igual que 5';
    END IF;
END;
$$ LANGUAGE plpgsql;
```

```sql
 -- Ejemplo con ELSIF
DO $$
DECLARE
    x int := 5;
BEGIN
    IF x > 5 THEN
        RAISE NOTICE 'Mayor que 5';
    ELSIF x = 5 THEN
        RAISE NOTICE 'Igual a 5';
    ELSE
        RAISE NOTICE 'Menor que 5';
    END IF;
END;
$$ LANGUAGE plpgsql;
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
-- CASE con expresiones booleanas
DO $$
DECLARE
    nota int := 7;
BEGIN
    CASE
        WHEN nota >= 9 THEN
            RAISE NOTICE 'Excelente';
        WHEN nota >= 5 THEN
            RAISE NOTICE 'Aprobado';
        ELSE
            RAISE NOTICE 'Suspenso';
    END CASE;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- CASE con valores
DO $$
DECLARE
    dia int := 3;
BEGIN
    CASE dia
        WHEN 1 THEN RAISE NOTICE 'Lunes';
        WHEN 2 THEN RAISE NOTICE 'Martes';
        WHEN 3 THEN RAISE NOTICE 'Miércoles';
        ELSE RAISE NOTICE 'Otro día';
    END CASE;
END;
$$ LANGUAGE plpgsql;
```

---

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
DO $$
DECLARE
    i int := 1;
BEGIN
    LOOP
        RAISE NOTICE 'i = %', i;
        i := i + 1;

        EXIT WHEN i > 5;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

#### LOOP con WHILE

```txt
WHILE condicio LOOP
    instruccions;
END LOOP;
```

#### Ejemplo WHILE (🧪 ¡Pruébalo!)

```sql
DO $$
DECLARE
    i int := 1;
BEGIN
    WHILE i <= 5 LOOP
        RAISE NOTICE 'i = %', i;
        i := i + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

#### LOOP con FOR

```txt
FOR variable IN inici..final LOOP
    instruccions;
END LOOP;
```

#### Ejemplo FOR

```sql
DO $$
DECLARE
    i int;
BEGIN
    FOR i IN 1..5 LOOP
        RAISE NOTICE 'i = %', i;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

```sql
DO $$
DECLARE
    i int;
BEGIN
    FOR i IN REVERSE 5..1 LOOP
        RAISE NOTICE 'i = %', i;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### Notas adicionales

- **EXIT WHEN** → sale de un bucle cuando se cumple una condición
- **EXIT** → sale de un bucle «directamente»
- **EXIT label** → sale de un bucle identificado con una etiqueta. Útil si hay bucles anidados
- **EXIT label WHEN** → sale, cuando se cumple una condición, de un bucle identificado con una etiqueta. Útil si hay bucles anidados
- **&lt;&lt;label&gt;&gt;** → identifica un bucle, para después usar EXIT label
- **CONTINUE** → salta a la siguiente iteración
- Los bucles pueden estar **anidados** y combinarse con IF o CASE

### Buen uso de las estructuras

- Usa `FOR` si sabes cuántas veces quieres repetir
- Usa `WHILE` si dependes de una condición externa
- Usa `IF` para bifurcar el comportamiento del código
- ⚠️ Evita los bucles infinitos; asegura siempre una condición de salida

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
