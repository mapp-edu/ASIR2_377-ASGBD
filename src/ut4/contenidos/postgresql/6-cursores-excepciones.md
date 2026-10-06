---
layout: doc
title: "PL/pgSQL: cursores y excepciones"
sidebar: true
outline: [2, 3]
aside: true
---

# PL/pgSQL: cursores y excepciones

## Cursores en PL/pgSQL

### 📘 ¿Qué es un cursor?

![Un cursor apunta a la fila actual del conjunto activo #center](/img/contenidos/ut4/cursor-gen.png)

Un **cursor** es un mecanismo de PL/pgSQL que permite **recorrer múltiples filas** devueltas por una consulta `SELECT`. Un cursor es como un puntero que apunta a un conjunto de resultados de una SQL y permite leerlos uno a uno.

Sirve para trabajar fila a fila con el conjunto de resultados, como un bucle sobre una tabla.

### Tipos de cursores

- **Implícitos:** creados automáticamente por PostgreSQL para sentencias DML (SELECT ... INTO, INSERT, UPDATE...)
- **Explícitos:** definidos manualmente por el usuario para tratar los SELECT que devuelven múltiples filas
- **Cursores FOR:** simplificación del uso explícito

---

### Cursores implícitos

No se declaran, y solo deberían devolver un resultado o fila:

```sql
SELECT DESCRIPCION INTO vdescripcion from PAISES WHERE CO_PAIS = 'ESP';
```

Los cursores implícitos solo pueden devolver una única fila. En caso de que se devuelva más de una fila (o ninguna) se puede producir una **excepción**. Esta **EXCEPCIÓN** se podrá capturar y tratar

Para salvar estas situaciones se puede hacer:

```sql
-- Uso de limit 1
SELECT DESCRIPCION INTO vdescripcion from PAISES WHERE CO_PAIS = 'ESP' limit 1;
  -- Esto evita TOO_MANY_ROWS si hay más de una coincidencia
 -- Pero puede devolver un valor diferente del que se busca, porque hay más de uno
```

O hacer primero un:

```sql
SELECT count(*) INTO vcant from factura WHERE idcli = 'V00923';
```

Y preguntar si vcant es 1

```txt
IF vcant=1 THEN
```

Y después preguntar:

```txt
IF vdescripcion IS NULL THEN
```

### Atributos útiles

- `var is null` → si no se ha encontrado ninguna fila
- `GET DIAGNOSTICS n = ROW_COUNT;` → número de filas tratadas

---

### Uso de un cursor explícito

**Pasos:**

1. Declarar el cursor
2. Abrirlo
3. Leer fila a fila
4. Cerrarlo

### Cursor FOR – simplificado

PostgreSQL gestiona automáticamente la apertura, la lectura y el cierre.

```sql
DO $$
DECLARE
    v_alumne RECORD;
BEGIN
    -- Itera sobre todas las filas de la tabla
    FOR v_alumne IN
        SELECT id, nom FROM alumnes ORDER BY id
    LOOP
        -- Hacer algo con cada fila
        RAISE NOTICE 'Alumno: %, Nombre: %', v_alumne.id, v_alumne.nom;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

#### Ejemplo de cursor completo

```sql
DO $$
DECLARE
    -- Cursor explícito
    c_alumnes CURSOR FOR
        SELECT id, nom FROM alumnes ORDER BY id;

    -- Variable para guardar cada fila
    v_id alumnes.id%TYPE;
    v_nom alumnes.nom%TYPE;
BEGIN
    -- Abrir el cursor
    OPEN c_alumnes;

    LOOP
        -- Coger la siguiente fila
        FETCH c_alumnes INTO v_id, v_nom;

        -- Comprobar si se ha encontrado alguna fila
        EXIT WHEN NOT FOUND;

        -- Hacer algo con los datos
        RAISE NOTICE 'Alumno: %, Nombre: %', v_id, v_nom;
    END LOOP;

    -- Cerrar el cursor
    CLOSE c_alumnes;
END;
$$ LANGUAGE plpgsql;
```

---

### Buenas prácticas

- Cierra siempre los cursores después de usarlos
- Utiliza **cursores FOR** si solo necesitas leer
- Evita los FETCH sin `EXIT WHEN NOT FOUND`

## Gestión de excepciones en PL/pgSQL

### 📘 ¿Qué es una excepción?

Una **excepción** es una situación de error que se produce durante la ejecución de un bloque PL/pgSQL. PostgreSQL permite capturar estas situaciones para gestionarlas de manera controlada y evitar que el bloque falle de manera abrupta.

### Estructura general con excepciones

```sql
DO $$
BEGIN
    -- Código normal
    RAISE NOTICE 'Ejecutando código normal';

    -- Ejemplo: forzar un error
    -- RAISE EXCEPTION 'Error simulado';

EXCEPTION
    WHEN division_by_zero THEN
        RAISE NOTICE 'Se ha detectado una división por cero';
    WHEN others THEN
        RAISE NOTICE 'Se ha producido otra excepción';
END;
$$ LANGUAGE plpgsql;
```

### Tipos de excepciones

#### Excepciones predefinidas

PostgreSQL las reconoce automáticamente.

PostgreSQL tiene muchísimos tipos de excepciones: division_by_zero, unique_violation, foreign_key_violation, etc.

[Se puede consultar la lista completa en la documentación oficial](https://www.postgresql.org/docs/current/errcodes-appendix.html)

Si quieres capturar todos los errores, siempre puedes poner WHEN others THEN ...

RAISE EXCEPTION 'Mensaje' interrumpe el flujo y lanza el error hacia fuera; RAISE NOTICE solo muestra un mensaje sin parar el bloque.

#### Excepciones no predefinidas

PostgreSQL las puede capturar con `SQLSTATE` y `SQLERRM`:

```sql
DO $$
BEGIN
    -- Operación que puede fallar
    RAISE NOTICE 'Intentando dividir por cero...';
    PERFORM 10 / 0;  -- provoca un error
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error %: %', SQLSTATE, SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

#### 🔧 Excepciones personalizadas

Se pueden lanzar con `RAISE EXCEPTION`, indicando un código propio con `USING ERRCODE`:

```sql
DO $$
BEGIN
    -- Lanzar la excepción personalizada
    RAISE EXCEPTION 'Esto es un error personalizado' USING ERRCODE = 'P0001';
EXCEPTION
    WHEN SQLSTATE 'P0001' THEN   -- se captura por su código
        RAISE NOTICE 'Se ha capturado mi excepción personalizada';
    WHEN others THEN
        RAISE NOTICE 'Error desconocido %: %', SQLSTATE, SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

### Claves de uso

- `RAISE EXCEPTION` → provoca una excepción
- `WHEN ... THEN` → captura una excepción
- `WHEN OTHERS THEN` → captura cualquier error no gestionado antes
- `SQLERRM` → muestra el mensaje de error
- `SQLSTATE` → muestra el código del error

### Buenas prácticas

- Captura los errores específicos antes de usar `OTHERS`
- Informa al usuario o registra el error
- No captures `OTHERS` sin mostrar ningún mensaje (silenciar errores es peligroso)
- Usa excepciones personalizadas cuando tengas validaciones propias

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
