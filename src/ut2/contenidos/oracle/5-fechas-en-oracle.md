---
layout: doc
title: "Oracle: gestión de fechas"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: gestión de fechas

## Tipos de fechas

En PL/SQL de Oracle, los principales tipos de datos relacionados con fechas y tiempo son estos

- DATE: almacena fecha y hora (año, mes, día, hora, minuto y segundo)
- TIMESTAMP: almacena fecha + hora con fracciones de segundo. Precisión: hasta 9 decimales (nanosegundos)
- TIMESTAMP WITH TIME ZONE: incluye la zona horaria
- TIMESTAMP WITH LOCAL TIME ZONE: guarda la fecha en UTC. Se muestra según la zona horaria de la sesión
- INTERVAL YEAR TO MONTH: para representar diferencias de tiempo en años y meses.
- INTERVAL DAY TO SECOND: para diferencias en días, horas, minutos, segundos y fracciones.

![Tipos de fecha y hora de Oracle: DATE, TIMESTAMP y TIMESTAMP WITH TIME ZONE #center](/img/contenidos/ut2/datetime-types.png)

Dependiendo del tipo declarado, se podrá guardar más o menos precisión de información.

```sql
SET SERVEROUTPUT ON
DECLARE
      vd1 DATE;       -- DATE es el TIPO
      vd2 TIMESTAMP;  -- TIMESTAMP es el TIPO
BEGIN
   vd1 := SYSDATE;      -- SYSDATE es una función que devuelve (hasta el segundo)
                        -- la fecha/hora de hoy en el instante en que se ejecuta
   vd2 := SYSTIMESTAMP; -- SYSTIMESTAMP es una función que devuelve la fecha/hora
                        -- de hoy, con precisión, en el instante en que se ejecuta
   dbms_output.put_line(vd1);
   dbms_output.put_line(vd2);

   vd1 := '7/7/26';    -- Asignación directa (¡si el formato coincide!)
   dbms_output.put_line(vd1);
   vd1 := '7/7/2026';    -- También lo convierte bien

END;
```

## Visualización / presentación de fechas

Aunque una fecha esté en un formato concreto, por ejemplo DATE, se puede visualizar de diferentes formas. Una cosa es el valor y otra cómo se muestra.

```sql
select sysdate from dual;
            -- 06/03/26 . Formato de visualización por defecto
            -- (el que esté por defecto en la instalación)
select to_char(sysdate,'dd-mm-yyyy hh:mi:ss') from dual;
                                    -- 06/03/26 10:07:22 Así imponemos el formato de salida
select to_char(sysdate,'dd-mm-yyyy hh:mi:ss am') from dual;
                                    --  06/03/26 10:07:22 PM
select to_char(sysdate,'dd-mm-yyyy hh24:mi:ss am') from dual;
                                    --  06/03/26 22:07:22 PM

alter session set nls_date_format='dd-mm-yyyy hh:mi';
                                    -- Se cambia el formato de visualización
select sysdate from dual;
                                    -- 06/03/26 10:07
```

Poner am o pm en el formato solo indica que se debe mostrar la franja que corresponda al valor mostrado.

También se puede visualizar con DBMS_OUTPUT...

```sql
set SERVEROUTPUT on
begin
   dbms_output.put_line(sysdate);
   dbms_output.put_line(to_char(sysdate,'dd-mm-yyyy hh:mi:ss'));
   dbms_output.put_line(to_char(sysdate,'dd-mm-yyyy hh:mi:ss am'));
   dbms_output.put_line(to_char(sysdate,'dd'));
   dbms_output.put_line(to_char(sysdate,'d'));
   dbms_output.put_line(to_char(sysdate,'ddd'));
   dbms_output.put_line(to_char(sysdate,'day'));
end;
```

Y también se pueden cambiar los caracteres de separación al gusto del programador.

```sql
set SERVEROUTPUT on
begin
   dbms_output.put_line(to_char(sysdate,'dd-mm-yyyy hh:mi:ss'));
   dbms_output.put_line(to_char(sysdate,'dd/mm/yyyy hh:mi:ss'));
   dbms_output.put_line(to_char(sysdate,'dd.mm.yyyy hh:mi:ss'));
   dbms_output.put_line(to_char(sysdate,'dd mm yyyy hh_mi-ss'));
end;
```

## Operaciones sobre fechas

```sql
set SERVEROUTPUT on
alter session set nls_date_format='dd-mm-yyyy hh24:mi:ss';
declare    f1 date:= '31/01/2024';  f2 date;
begin
   f2:=sysdate;
   dbms_output.put_line( f1);
   dbms_output.put_line( f2);
   dbms_output.put_line( f2+1);     -- Suma un día a la fecha f2
   dbms_output.put_line( f2 - f1);  -- Calcula la diferencia en días (con decimales) entre las dos fechas
   if f2>f1 then dbms_output.put_line('hoy es después del '||f1);
   end if;
   dbms_output.put_line( f2 - 1);     -- Resta un día
   dbms_output.put_line( f2 + 2/24);  -- ¡Resta 2 horas!
end;
```

```txt
to_char(valor_data, format)
      --   De una fecha, convierte a un string

to_date (valor_string, format)
      --  Desde un string, convierte a una fecha
```

Algunas conversiones a tener en cuenta...

```sql
set SERVEROUTPUT on
begin
   dbms_output.put_line( 5 + '6' );     -- 11
   dbms_output.put_line( '5' + '6' );   -- 11
   dbms_output.put_line(' ');
   dbms_output.put_line( '3' || 7 );    --  '37'
   dbms_output.put_line( 35 || 8 );     --  '358'
end;
```

## Extracción de información (parcial) de una fecha

```sql
set SERVEROUTPUT on
declare    f1 date:= sysdate;  dia number; mes number;
begin
   dia := to_char(f1,'dd');  mes := to_char(f1,'mm');
   dbms_output.put_line( f1 );
   dbms_output.put_line( dia );   -- 6
   dbms_output.put_line( mes );   -- 3
end;
```

## Composición de fechas

```sql
set SERVEROUTPUT on
alter session set nls_date_format='dd-mm-yyyy hh24:mi:ss';
declare    f1 date;  dia number; mes number; anys number;
begin
   dia := 4 ;   mes := 6 ; anys :=2026;
   f1 := to_date ( dia||'-'||mes||'-'||anys, 'dd-mm-yyyy');
   dbms_output.put_line( f1 );
end;
```

## Funciones de fechas en Oracle

```txt
add_months(data, num ) cuidado con el último día del mes
last_day(data)  el último día del mes al que pertenece la fecha
next_day(data,dia) próximo «dia» después de data (p. ej., dia=lunes)
round(data[,mascara])  ..de data (year, month,
trunc(data[,mascara])  ..de data
extract(part from data)  ..de data
months_between(data1,data2)  número de meses entre 2 fechas
```

### add_months

```sql
set SERVEROUTPUT on
alter session set nls_date_format='dd/mm/yyyy';
begin
   dbms_output.put_line( add_months('15/01/2024',1) );
   dbms_output.put_line( add_months('30/03/2024',1) );
   dbms_output.put_line( add_months('31/03/2024',1) );
   dbms_output.put_line( add_months('28/02/2024',1) );
   dbms_output.put_line( add_months('29/02/2024',1) );
   dbms_output.put_line( add_months('29/02/2024',-1) );
end;
```

#### last_day y otras

```sql
set SERVEROUTPUT on
alter session set nls_date_format='dd/mm/yyyy';
begin
   dbms_output.put_line( last_day('15/01/2024'));
   dbms_output.put_line( next_day('15/01/2024','Lunes') );
   dbms_output.put_line( to_char( sysdate,'dd-mm-yyyy hh24:mi') );
   dbms_output.put_line( round(sysdate) );
   dbms_output.put_line( trunc(sysdate) );
   dbms_output.put_line( months_between( sysdate, '31/3/2023') );
   dbms_output.put_line( extract(day from sysdate) );
end;
```

![Campos disponibles en cada tipo de dato de fecha y hora #center](/img/contenidos/ut2/camps-disponibles.png)

#### round

```sql
set SERVEROUTPUT on
alter session set nls_date_format='dd/mm/yyyy hh24:mi';
begin
      dbms_output.put_line( round( to_date('06/03/2026 11:00')) );       -- 06/03/2026 00:00
      dbms_output.put_line( round( to_date('06/03/2026 14:00')) );       -- 07/03/2026 00:00
      dbms_output.put_line('');
      dbms_output.put_line( round( to_date('06/03/2026'),'month'  ) );   -- 01/03/26 00:00
      dbms_output.put_line( round( to_date('16/03/2026'),'month'  ) );   -- 01/04/26 00:00
      dbms_output.put_line('');
      dbms_output.put_line( round( to_date('06/03/2026'),'year'  ) );    -- 01/01/26 00:00
      dbms_output.put_line( round( to_date('16/07/2026'),'year'  ) );    -- 01/01/27 00:00
end;
```

→ [Modelos de formato para round y trunc](https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/ROUND-and-TRUNC-Date-Functions.html#GUID-8E10AB76-21DA-490F-A389-023B648DDEF8) en la documentación oficial de Oracle

#### localtimestamp

La función `localtimestamp` devuelve la fecha en tipo TIMESTAMP

```sql
set SERVEROUTPUT on
declare
  vd1 date := sysdate;
  vd2 timestamp := localtimestamp;
begin
   dbms_output.put_line( to_char( 'DATE ' || vd1 ));
   dbms_output.put_line( to_char( 'DATE ' || to_char( vd1,'hh24:mi:ss' )));
   dbms_output.put_line( to_char( 'timestamp ' || vd2 ));
   dbms_output.put_line( to_char( 'timestamp ' || to_char (vd2,'hh24:mi:ss.ff6' )));
end;
```

```sql
set SERVEROUTPUT on
alter session set nls_date_format='dd--mm--yyyy';
alter session set nls_timestamp_format='dd-mm-yyyy hh24_mi_ss.ff';
declare
  vd1 date := sysdate;
  vd2 timestamp := localtimestamp;
begin
   dbms_output.put_line( to_char( 'DATE ' || vd1 ));
   dbms_output.put_line( to_char( 'timestamp ' || vd2 ));
end;
```

#### systimestamp

La función `systimestamp` devuelve la fecha en tipo timestamp with time zone

```sql
set SERVEROUTPUT on
alter session set nls_date_format='dd--mm--yyyy';
alter session set nls_timestamp_format='dd-mm-yyyy hh24_mi_ss.ff';
alter session set nls_timestamp_tz_format='dd/-mm/-yyy hh24::mi::ss.ff';
declare
  vd1 date := sysdate;
  vd2 timestamp with time zone:= systimestamp;
begin
   dbms_output.put_line( to_char( 'DATE ' || vd1 ));
   dbms_output.put_line( to_char( 'timestamp ' || vd2 ));
end;
```

![Funciones de fecha y hora de Oracle según el origen de la hora #center](/img/contenidos/ut2/datetime-functions.png)

Otras consideraciones

```txt
SYSDATE
and SYSTIMESTAMP return the system date and time

CURRENT_DATE
and LOCALTIMESTAMP
and CURRENT_TIMESTAMP return the current date and time in the session time zone.

CURRENT_DATE returns a DATE value
LOCALTIMESTAMP returns a TIMESTAMP value
CURRENT_TIMESTAMP returns a TIMESTAMP WITH TIME ZONE value
```

| Función | Tipo devuelto | Precisión | Zona horaria |
| ------------------- | -------------------------- | ----------------- | ------------ |
| `SYSDATE` | `DATE` | Segundos | Servidor |
| `CURRENT_DATE` | `DATE` | Segundos | Sesión |
| `LOCALTIMESTAMP` | `TIMESTAMP` | Hasta 9 decimales | Sesión |
| `SYSTIMESTAMP` | `TIMESTAMP WITH TIME ZONE` | Hasta 9 decimales | Servidor |
| `CURRENT_TIMESTAMP` | `TIMESTAMP WITH TIME ZONE` | Hasta 9 decimales | Sesión |

Si se necesita precisión TIMESTAMP pero sin zona horaria, a partir de la hora del servidor: <br> `SELECT CAST(SYSTIMESTAMP AS TIMESTAMP) FROM dual;`

![Julio César y el papa Gregorio XIII, impulsores de los calendarios juliano y gregoriano #center](/img/contenidos/ut2/gregori.png)

## Calendario JULIANO

Instaurado por Julio César en el año 46 a. C., era otra versión del calendario egipcio, el primer calendario solar conocido

El calendario juliano tenía años bisiestos cada 4 años, **sin excepción** (no como el calendario gregoriano). El año bisiesto tenía 366 días. Los demás años tenían 365 días.

Problema del calendario juliano: el año solar real dura aproximadamente 365,2422 días, pero el calendario juliano asumía 365,25 días. Diferencia: un error de unos 11 minutos y 14 segundos por año. Con el paso de los siglos, esto provocó un desplazamiento gradual de las estaciones (unos 10 días acumulados en el siglo XVI). Solución → el calendario gregoriano

## Calendario GREGORIANO

Este calendario fue diseñado para corregir los errores introducidos por el calendario juliano. El juliano tenía un pequeño error, debido a que establecía la duración del año en 365 días y 6 horas, cuando en realidad era de 365 días, 5 horas, 48 minutos y 45 segundos. De esta manera, cada año la fecha oficial se retrasaba 11 minutos y 15 segundos respecto a la astronómica. La diferencia era mínima, pero acumuló un desfase de casi 10 días en los más de 1.600 años que estuvo vigente.

Este calendario gregoriano está dividido en tres tipos de años: el año común de 365 días, el año bisiesto con 366 días y el año secular, que es un año que cierra siglo.

## Cálculo del año bisiesto con 366 días

```txt
 a es divisible por b si el resto de la división es 0

1. Si el año es divisible por 4, ve al paso 2. En caso contrario, ve al paso 5. (365d)
2. Si el año es divisible por 100, ve al paso 3. En caso contrario, ve al paso 4. (366d)
3. Si el año es divisible por 400, ve al paso 4. (366d)  En caso contrario, ve al paso 5. (365d)
4. El año es un año bisiesto (tiene 366 días).
5. El año no es un año bisiesto (tiene 365 días).
```

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
