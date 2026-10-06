---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 5: instalar Oracle 21c en Windows 10 Pro"
pageClass: ejercicios-page
---

# 📋 Práctica 5: instalar Oracle 21c en Windows 10 Pro

## Enunciado

Partiendo de la MV con Windows 10 Pro de la práctica anterior, instala **Oracle Database 21c**, crea dos bases de datos multitenant y comprueba el acceso con SQL\*Plus y SQL Developer.

Mantén el adaptador de red en **red interna** para evitar que Windows se actualice (ocupa mucho espacio).

::: danger Muy importante
- Crea un usuario llamado `oracle` y dale permisos de administrador. **Utiliza este usuario para realizar toda la práctica.**
- Crea otro usuario con tu nombre. **No le des permisos de administrador.**
:::

## Objetivos

- Verificar los requisitos e identificar el software necesario para la instalación.
- Instalar un SGBD comercial separando la instalación del software de la creación de la base de datos.
- Localizar e interpretar el fichero de registro de la instalación.
- Verificar el funcionamiento del SGBD.

## Requisitos

- 4 GB o más de memoria RAM, 2 o 4 CPU y 100 GB o más de SSD.

## Desarrollo

1. Comprueba los requisitos de hardware y software de la máquina donde se va a instalar. Si falta alguno, ponlo.
2. Descarga de oracle.com el instalador de la versión **21c** (no la versión FREE; es un fichero zip de unos 3 GB).
3. Descomprímelo (con 7-Zip será más rápido).
4. Crea las carpetas de instalación siguiendo la **OFA** y mueve el instalador dentro.
5. Instala **solo el software** del SGBD: ejecuta `setup.exe` como administrador.
6. ¿Dónde está el log de la instalación? Indica el lugar y adjunta una copia del fichero de log al trabajo.

::: warning A partir de aquí
No borres ni muevas la carpeta del instalador de donde está. Si no funciona, comprueba que no hay espacios en el nombre de la carpeta que contiene el instalador.
:::

7. Reinicia la máquina.
8. Crea la primera base de datos multitenant (la arquitectura non-CDB ya no está soportada en Oracle 21c): CDB `ribera` y PDB `santvi`. **Pon y anota la contraseña** de `sys` y `system`.
9. Al acabar, comprueba que funciona con SQL\*Plus desde un CMD:

   ```sql
   -- sqlplus / as sysdba
   show user
   show con_name
   -- sqlplus system
   show user
   show con_name
   ```

10. Ejecuta `show pdbs` conectado con `sqlplus / as sysdba`, reinicia la máquina y vuelve a ejecutarlo. Busca y explica los resultados, antes y después de reiniciar.
11. Si estás en red interna, pon la IP manualmente (en otro caso, deja la IP por DHCP).
12. Desde un CMD ejecutado como administrador, lanza `netca` y añade el **LISTENER** y los métodos de nomenclatura.
13. Descarga e instala SQL Developer (última versión para Windows) y ejecútalo.
14. Crea una conexión para `sys` y otra para `system` a la **CDB** y pruébalas.
15. Crea una conexión para `sys` y otra para `system` a la **PDB** y pruébalas.
16. En la misma máquina, crea otra base de datos multitenant: CDB `costera` y PDB `simarro`.
17. ¿Dónde está el log de esta instalación? Indica el lugar y adjunta una copia del fichero de log al trabajo.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA1** (*Implanta sistemas gestores de bases de datos analizando sus características y ajustándose a los requerimientos del sistema.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **1.d** | Se ha identificado el software necesario para llevar a cabo la instalación. | Identifica y obtiene el software necesario (instalador 21c, 7-Zip, SQL Developer) y prepara las carpetas según la OFA. |
| **1.e** | Se ha verificado el cumplimiento de los requisitos hardware. | Verifica y justifica el cumplimiento de los requisitos de hardware antes de instalar. |
| **1.f** | Se han instalado sistemas gestores de bases de datos. | Instala el software del SGBD y crea las dos bases de datos multitenant con sus PDB. |
| **1.h** | Se ha interpretado la información suministrada por los mensajes de error y ficheros de registro. | Localiza los ficheros de log de las instalaciones, los adjunta e interpreta su contenido y los resultados de `show pdbs`. |
| **1.i** | Se han resuelto las incidencias de la instalación. | Resuelve las incidencias surgidas (rutas con espacios, permisos de administrador, listener, IP). |
| **1.j** | Se ha verificado el funcionamiento del sistema gestor de bases de datos. | Verifica el funcionamiento con SQL\*Plus y con las conexiones de SQL Developer a la CDB y a la PDB. |
| **1.g** | Se ha documentado el proceso de instalación. | Documenta el proceso completo de instalación. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `PLALOE_EXTR/07 instalar oracle 21c en W10prof.pdf`.</small>
