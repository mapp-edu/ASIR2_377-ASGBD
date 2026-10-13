---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 1: preparación de la MV Linux Mint"
pageClass: ejercicios-page
---

# 📋 Práctica 1: preparación de la MV Linux Mint

## Enunciado

Prepara la máquina virtual Linux Mint sobre la que se desplegarán los sistemas gestores de bases de datos del módulo.

::: warning Importante
Utiliza una MV para cada módulo o práctica (según se indique). **No reutilices MV de otros módulos ni de otros cursos.**
:::

## Objetivos

- Verificar que el equipo cumple los requisitos de hardware necesarios para el SGBD.
- Dejar preparado el software base (sistema operativo y motor de contenedores).
- Documentar el proceso de preparación del entorno.

## Requisitos de la máquina virtual

| Recurso | Valor |
|:---|:---|
| Memoria RAM | 4 GB como mínimo (importante) |
| Disco duro | 25 GB |
| Procesadores | 2-4 (importante) |
| Virtualización anidada | Activada (VT-x/AMD-V anidado) |
| Portapapeles compartido | Activado |
| Disquetera | Quitarla |
| Red | NAT (de momento) |

## Desarrollo

1. Crea la máquina virtual con los requisitos anteriores.
2. Descarga la ISO de Linux Mint 22 (última versión, unos 2,8 GB) e instálala en la máquina creada: idioma, teclado, códecs, «borrar disco e instalar» y zona horaria.
3. Pon como usuario principal **tu nombre**.
4. Cambia el nombre del equipo a `cliente-<tu-nombre>` (¡menos de 15 caracteres!).
5. Deja que termine la instalación y reinicia.
6. Actualiza el sistema (`apt update`).
7. Instala el motor de contenedores:

   ```bash
   sudo apt install -y podman-docker
   ```

8. Apaga la máquina.

::: tip Tiempos y espacio
Tiempo estimado de la instalación: 10 minutos. En este momento la MV ocupa unos 10 GB.
:::

Después de la instalación:

- Haz una **OVA** (apaga antes la máquina; unos 6 minutos).
- Haz una **instantánea** (snapshot).
- Instala las *Guest Additions*, activa el portapapeles bidireccional y reinicia. Comprueba que funcionan.
- Apaga la máquina.

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA1** (*Implanta sistemas gestores de bases de datos analizando sus características y ajustándose a los requerimientos del sistema.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **1.d** | Se ha identificado el software necesario para llevar a cabo la instalación. | Identifica y deja instalado el software base necesario (sistema operativo, podman-docker, Guest Additions). |
| **1.e** | Se ha verificado el cumplimiento de los requisitos hardware. | Comprueba y justifica que la MV cumple los requisitos de RAM, CPU, disco y virtualización anidada. |
| **1.g** | Se ha documentado el proceso de instalación. | Documenta el proceso de creación de la MV, incluidas la OVA y la instantánea. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD1/00 instalar linux mint.pdf · PLALOE_EXTR/03 instalar linux mint.pdf`.</small>
