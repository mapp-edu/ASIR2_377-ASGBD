---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 3: recursos del SGBD y ajustes del sistema operativo"
pageClass: ejercicios-page
---

# 📋 Práctica 3: recursos del SGBD y ajustes del sistema operativo

## Enunciado

Un SGBD recién instalado viene configurado para arrancar en casi cualquier máquina, no para aprovechar la tuya. Lo mismo ocurre con el sistema operativo: sus valores por defecto están pensados para un uso general.

Vas a ajustar los **recursos del SGBD** y la **configuración de Linux** para el servidor de bases de datos, midiendo con una **prueba de carga** antes y después de cada cambio.

La prueba de carga se plantea con `pgbench`, incluido en PostgreSQL. Si trabajas con Oracle, realiza las partes 1, 2 y 4 con las órdenes de las orientaciones y sustituye la prueba de carga por la que te indique tu profesor o profesora.

::: warning Atención
Haz una **instantánea** de la máquina virtual antes de empezar y cambia **un solo parámetro cada vez**: si cambias varios a la vez no sabrás cuál ha producido el efecto.
:::

## Objetivos

- Conocer los recursos de la máquina y cómo los está usando el SGBD.
- Ajustar los parámetros de memoria del SGBD de forma razonada.
- Modificar la configuración del sistema operativo para favorecer al SGBD.
- Medir el efecto de cada cambio y decidir si se mantiene.

## Tareas

### Parte 1. Punto de partida

1. Documenta los **recursos de la máquina**: procesadores, memoria RAM, memoria de intercambio, tipo y tamaño del disco y sistema de ficheros.
2. Documenta los valores actuales de los **parámetros de memoria** del SGBD y explica para qué sirve cada uno.
3. Muestra, con el servidor en reposo, cuánta memoria usa el SGBD según el sistema operativo.

### Parte 2. Prueba de carga de referencia

4. Prepara la base de datos de pruebas y lanza la **prueba de carga** durante al menos 60 segundos con 10 clientes. Anota las transacciones por segundo y la latencia media: es tu **línea base**.
5. Repite la prueba tres veces y anota la variación entre ejecuciones. ¿A partir de qué diferencia considerarás que un cambio es una mejora real?
6. Mientras se ejecuta la prueba, observa el sistema con `top`, `vmstat 1` e `iostat -x 1` (paquete `sysstat`). ¿Qué recurso se agota antes: CPU, memoria o disco?

### Parte 3. Recursos del SGBD

7. Calcula los valores que recomiendan las guías para tu cantidad de memoria RAM y justifica los que eliges.
8. Aplica los cambios **de uno en uno**, indicando en cada caso si requiere reiniciar, y repite la prueba de carga tras cada uno.
9. Aumenta el número de clientes de la prueba hasta superar el máximo de conexiones del servidor. ¿Qué ocurre? Explica por qué subir sin más el máximo de conexiones no es una buena solución y qué alternativa existe.

### Parte 4. Sistema operativo

10. Consulta el valor actual de estos parámetros del núcleo y explica qué efecto tiene cada uno sobre un servidor de bases de datos: `vm.swappiness`, `vm.overcommit_memory`, `vm.dirty_ratio` y `vm.dirty_background_ratio`.
11. Cambia `vm.swappiness` a un valor adecuado para un servidor de bases de datos, primero **en caliente** y después de forma **permanente**. Demuestra que el valor se conserva tras reiniciar.
12. Configura las **páginas grandes** (*huge pages*): calcula cuántas hacen falta para la memoria compartida del SGBD, resérvalas y comprueba que el SGBD las utiliza.
13. Consulta los **límites** del usuario del sistema operativo que ejecuta el SGBD (ficheros abiertos, procesos) y amplíalos de forma permanente.
14. Indica con qué **opciones de montaje** está montado el sistema de ficheros de los datos y qué cambiarías (por ejemplo, `noatime`).
15. Repite la prueba de carga con todos los cambios del sistema operativo aplicados.

### Parte 5. Conclusiones

16. Presenta una **tabla resumen**: parámetro, valor inicial, valor final, transacciones por segundo antes y después, y decisión (se mantiene o se revierte).
17. ¿Qué cambio ha tenido más efecto? ¿Alguno ha empeorado el resultado? Explica por qué los resultados en una máquina virtual de clase pueden no coincidir con los de un servidor real.

## Orientaciones

### Con PostgreSQL

```bash
# Prueba de carga
createdb banco
pgbench -i -s 20 banco            # crea las tablas (unos 300 MB con escala 20)
pgbench -c 10 -j 2 -T 60 banco    # 10 clientes, 2 hilos, 60 segundos
```

```sql
SHOW shared_buffers;
SHOW work_mem;
SHOW maintenance_work_mem;
SHOW effective_cache_size;
SELECT name, setting, unit, context FROM pg_settings WHERE name LIKE '%mem%' OR name = 'huge_pages';
ALTER SYSTEM SET shared_buffers = '512MB';   -- requiere reiniciar
```

- Valores de partida habituales: `shared_buffers` en torno al 25 % de la RAM y `effective_cache_size` entre el 50 % y el 75 %. `work_mem` se asigna **por operación y por sesión**, así que hay que multiplicarlo por las conexiones previstas.
- La columna `context` de `pg_settings` indica si el cambio necesita reinicio (`postmaster`) o basta con recargar (`sighup`).
- `SHOW shared_memory_size_in_huge_pages;` indica cuántas páginas grandes necesita el servidor (PostgreSQL 15 o posterior) y `SHOW huge_pages;` si intentará usarlas.
- La alternativa a subir `max_connections` es un agrupador de conexiones como PgBouncer.

### Con Oracle

```sql
SHOW PARAMETER sga_target
SHOW PARAMETER pga_aggregate_target
SHOW PARAMETER memory_target
SELECT * FROM v$sgainfo;
SELECT sga_size, sga_size_factor, estd_db_time FROM v$sga_target_advice;
SELECT pga_target_for_estimate, estd_pga_cache_hit_percentage FROM v$pga_target_advice;
ALTER SYSTEM SET sga_target = 1G SCOPE = SPFILE;   -- requiere reiniciar la instancia
```

- Ten en cuenta los **límites de la edición gratuita** de Oracle (memoria y procesadores): compruébalos en la documentación de tu versión antes de fijar valores.
- Los requisitos de núcleo que pide el instalador de Oracle (`kernel.shmmax`, `kernel.shmall`, `fs.file-max`...) se fijan igual que el resto, con `sysctl`.
- Si Oracle se ejecuta en un contenedor, los parámetros del núcleo son los de la máquina anfitriona.

### Sistema operativo (Linux)

```bash
sysctl vm.swappiness                      # consultar
sudo sysctl -w vm.swappiness=10           # cambiar en caliente
echo 'vm.swappiness = 10' | sudo tee /etc/sysctl.d/90-sgbd.conf
sudo sysctl --system                      # aplicar los ficheros de configuración

grep -i huge /proc/meminfo                # páginas grandes disponibles y en uso
sudo sysctl -w vm.nr_hugepages=300

sudo -u postgres bash -c 'ulimit -n; ulimit -u'   # límites del usuario del SGBD
findmnt -T /var/lib/postgresql            # opciones de montaje
```

- Los límites permanentes se fijan en `/etc/security/limits.d/` o, si el SGBD arranca como servicio, con las directivas `LimitNOFILE` y `LimitNPROC` de su unidad de `systemd`.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA5** (*Optimiza el rendimiento del sistema aplicando técnicas de monitorización y realizando adaptaciones.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **5.e** | Se han optimizado los recursos del sistema gestor. | Ajusta los parámetros de memoria del SGBD con valores razonados para su máquina y decide con mediciones cuáles mantiene. |
| **5.h** | Se han realizado modificaciones en la configuración del sistema operativo para mejorar el rendimiento del gestor. | Modifica de forma permanente la configuración del sistema operativo (memoria de intercambio, páginas grandes, límites) y comprueba que se aplica. |
| **5.a** | Se han identificado las herramientas de monitorización disponibles para el sistema gestor. | Utiliza las herramientas del sistema operativo y del SGBD para observar el consumo de recursos durante la prueba. |
| **5.f** | Se ha obtenido información sobre el rendimiento de las consultas para su optimización. | Mide el rendimiento con una línea base, repite las pruebas y presenta la tabla comparativa antes y después. |

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

<small>Práctica de elaboración propia para el módulo ASGBD. Completa los materiales adaptados de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
