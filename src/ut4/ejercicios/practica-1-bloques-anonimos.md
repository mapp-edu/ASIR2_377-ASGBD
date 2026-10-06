---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 1: bloques anónimos en Oracle"
pageClass: ejercicios-page
---

# 📋 Práctica 1: bloques anónimos en Oracle

## Enunciado

La sentencia de **bloque anónimo** de PL/SQL es una sentencia ejecutable que puede contener sentencias de control PL/SQL y sentencias SQL.

Para realizar esta práctica utilizaremos la máquina virtual Windows 10 con Oracle SQL Developer:

- Se puede guardar un script con <kbd>Ctrl</kbd>+<kbd>S</kbd> o con *Archivo → Guardar*.
- Se puede recuperar un script con <kbd>Ctrl</kbd>+<kbd>O</kbd> o con *Archivo → Abrir*.
- Se puede ejecutar un script con <kbd>F5</kbd> o una sentencia con <kbd>F9</kbd>.
- Para activar la salida: `set serveroutput on` (<kbd>F5</kbd>).

Conecta con `SYSTEM` o `SYS` a la primera PDB. Crea el usuario `usuari1`, dale permisos y conecta con él.

## Objetivos

- Reconocer las reglas de declaración de variables y constantes en PL/SQL.
- Interpretar los mensajes de error del compilador y corregirlos.
- Convertir y manipular fechas dentro de un bloque anónimo.

## Tarea 1. Declaraciones

Indica qué declaraciones darían error y por qué. Después, pruébalas en SQL Developer.

```sql
SET SERVEROUTPUT ON
DECLARE
          primera number:=5.0;
          segona number not null;
          fixa constant varchar2(20);
          cadena varchar2;
          valor1 number not null:=4;
          valor2 number:=valor1/2;
          valor3 number:=valor4+valor2;
          valor4 number:= default 5;
          cad varchar2(10);
          proxim valor1%TYPE;
          numero number(4,2):=150.3;
          num1, num2 number;
          CAD varchar2(12);
          cad varchar2(2):='HOLA';
          4num number;
          vdia sysdate;
          v1 varchar2(4) := 4;
          v2 number := '6';
          v3 number := '6.4';
          b1 boolean := TrUe;
BEGIN
          dbms_output.put_line ('La primera variable val ' || primera);
          dbms_output.put_line ('La suma val ' || primera+valor1);
          -- Pon aquí más líneas para probar TODOS los resultados
END;
```

- Muestra en un documento todos los errores emitidos por Oracle y cómo los has arreglado.
- Investiga: ¿cuál es la diferencia entre `CHAR` y `VARCHAR2`?
- Investiga: ¿cuál es la diferencia entre `NUMBER` y `NUMBER(15)`?

## Tarea 2. Conversión de fechas (I)

El tipo de datos `DATE` es muy potente, pero necesita un tratamiento específico.

Escribe un bloque anónimo que pida (además del título, el autor y el precio de un libro) la fecha de publicación con una variable de sustitución (en `CHAR`) e inserte una fila en la tabla `LLIBRES`. Cuidado con los campos `datapub` y `datareg`. Los valores de las cadenas se deben guardar en mayúsculas. Utiliza las funciones necesarias.

Script de creación de la tabla `llibres`:

```sql
drop table llibres;

CREATE TABLE llibres(
titol VARCHAR2(60) NOT NULL,
autor varchar2(30) not null,
datapub DATE,
editorial VARCHAR2(30),
edicio VARCHAR2(12),
isbn VARCHAR2(25),
preu number( 6,2),
datareg date,
CONSTRAINT pk_codi PRIMARY KEY(titol,autor)
);
```

## Tarea 3. Conversión de fechas (II)

Escribe un bloque anónimo que pida una fecha (se pedirá con el tipo `DATE`) y a continuación muestre por pantalla: el año, el mes, el día del mes y el día de la semana en número y en letra.

## Tarea 4. Comparación de fechas

Ejecuta el código siguiente y explica los resultados:

```sql
set serveroutput on
declare
   d1 date; d2 date;
begin
   d1:=sysdate;dbms_session.sleep(1);
   d2:=sysdate;dbms_session.sleep(1);
   dbms_output.put_line('d1 val ' || d1);
   dbms_output.put_line('d2 val ' || d2);
   if (d1=d2) then
        dbms_output.put_line('d1 i d2 son iguals');
   else
        dbms_output.put_line('d1 i d2 NO son iguals');
   end if;
end;
```

::: tip Apoyo
Consulta la página [Fechas en Oracle](/ut2/contenidos/oracle/5-fechas-en-oracle) para las funciones de conversión y formato.
:::

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA4** (*Automatiza tareas de administración del gestor describiéndolas y utilizando guiones de sentencias.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **4.b** | Se han descrito los distintos métodos de ejecución de guiones. | Ejecuta los bloques como script (<kbd>F5</kbd>) y como sentencia (<kbd>F9</kbd>), y guarda y recupera los scripts. |
| **4.c** | Se han identificado las herramientas disponibles para redactar guiones. | Utiliza SQL Developer como herramienta de redacción y prueba de guiones, activando la salida del servidor. |
| **4.d** | Se han definido y utilizado guiones para automatizar tareas. | Escribe los bloques anónimos pedidos y funcionan con los datos de prueba. |
| **4.g** | Se han utilizado estructuras de control de flujo. | Explica el resultado de la comparación de fechas de la tarea 4 y el uso de la estructura condicional. |
| **4.h** | Se han adoptado medidas para mantener la integridad y consistencia de la información. | Explica cada error de declaración (tipos, `NOT NULL`, constantes, conversiones) y cómo lo ha corregido. |

Cada criterio se califica con la **rúbrica común** del módulo:

| Nivel | Descriptor | Puntuación |
|:---:|:---|:---:|
| **0** | No entregado o sin relación con lo solicitado. | 0 |
| **1** | Incompleto o incorrecto. Faltan elementos esenciales. | 2,5 |
| **2** | Correcto y completo, pero sin justificar las decisiones. | 5 |
| **3** | Correcto, completo y justificado. | 7,5 |
| **4** | Además, coherente con el resto del proyecto y bien comunicado. | 10 |

La nota de la práctica es la media de las puntuaciones de sus criterios. El **nivel 2 es el mínimo** para superarla.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/11 automatització_I_procs_i_funcs.pdf (Bloc anònim en Oracle)`.</small>
