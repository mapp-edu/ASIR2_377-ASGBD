---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Práctica 4: preparación de la MV Windows 10 Pro"
pageClass: ejercicios-page
---

# 📋 Práctica 4: preparación de la MV Windows 10 Pro

## Enunciado

Prepara una máquina virtual con Windows 10 Pro sobre la que se instalará Oracle Database 21c en la práctica siguiente.

::: warning Importante
Utiliza una MV para cada módulo o práctica (según se indique). **No reutilices MV de otros módulos ni de otros cursos.**
:::

## Objetivos

- Verificar los requisitos de hardware y de sistema operativo para instalar Oracle en Windows.
- Dejar la máquina preparada y estable (sin actualizaciones automáticas) para las prácticas posteriores.

## Requisitos de la máquina virtual

| Recurso | Valor |
|:---|:---|
| Memoria RAM | 4 GB como mínimo (importante) |
| Disco duro | 150 GB |
| Procesadores | 2-4 (importante) |
| Portapapeles compartido | Activado |
| Disquetera | Quitarla |
| Red | Adaptador puente o NAT para instalar; después se cambiará |

## Desarrollo

1. Crea la máquina virtual con los requisitos anteriores.
2. Instala Windows 10 Pro, versión 22H2. Para hacer la práctica no hace falta activar Windows ni poner número de licencia.
3. **No actualices.**
4. Pon como usuario principal tu nombre.
5. Cambia el nombre del equipo a `mOracle-<tu-nombre>` (¡menos de 15 caracteres!).
6. Muy recomendable para prácticas posteriores: instala Chrome.
7. Imprescindible: descarga e instala **7-Zip**.
8. Reinicia (sin actualizar) y apaga.

Después de la instalación:

- Cambia el adaptador de red de la MV a **red interna** (sin salida a internet), para que Windows no se actualice ni pregunte por actualizaciones.
- Muy recomendable: cambia el controlador gráfico para agilizar el funcionamiento de la máquina.
- Haz una **OVA** (con la máquina apagada; unos 6 minutos) y una **instantánea**.
- Opcional: instala las *Guest Additions*, activa el portapapeles bidireccional y reinicia.
- Por último, pausa las actualizaciones de Windows el máximo tiempo posible (repite la pausa cuatro veces).

::: tip Tiempos y espacio
Tiempo estimado de la instalación: 15 minutos. En este momento la MV ocupa unos 12 GB.
:::

## Entregable

Entrega un documento con el proceso realizado:

1. Sigue las indicaciones de [Cómo hacer un trabajo de clase](/ut1/ejercicios/como-hacer-un-trabajo): copia cada enunciado, explica los pasos y acompaña las capturas con una explicación.
2. Documenta los errores o las dificultades que hayas encontrado y la solución adoptada.
3. Entrega el documento en formato PDF firmado electrónicamente, junto con el documento original.

## Criterios de evaluación y rúbrica

Esta práctica aporta evidencias de los siguientes criterios de evaluación del **RA1** (*Implanta sistemas gestores de bases de datos analizando sus características y ajustándose a los requerimientos del sistema.*):

| CE | Criterio de evaluación | Qué se valora en esta práctica |
|:---:|:---|:---|
| **1.d** | Se ha identificado el software necesario para llevar a cabo la instalación. | Identifica el software previo necesario (versión de Windows, 7-Zip, navegador) y lo deja instalado. |
| **1.e** | Se ha verificado el cumplimiento de los requisitos hardware. | Comprueba y justifica que la MV cumple los requisitos de hardware. |
| **1.g** | Se ha documentado el proceso de instalación. | Documenta el proceso de preparación, incluidos la red interna, la OVA y la instantánea. |

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

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Fuente: `UD1/03 instalar w10prof.pdf · PLALOE_EXTR/06 instalar w10prof.pdf`.</small>
