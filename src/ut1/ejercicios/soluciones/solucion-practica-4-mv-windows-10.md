---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: "Solución de la práctica 4: preparación de la MV Windows 10 Pro"
pageClass: ejercicios-page
---

# 🔑 Solución de la práctica 4: preparación de la MV Windows 10 Pro

::: tip Solución de referencia
Resolución de referencia de la [Práctica 4](../practica-4-mv-windows-10), con las comprobaciones que debe contener la entrega, los errores más frecuentes y cómo se aplica la rúbrica. Úsala para revisar tu trabajo **después de hacer la práctica**: hay otras soluciones válidas si están justificadas.
:::

Como en la práctica 1, la entrega se valora por las **evidencias** que aporta. Esta solución indica cuáles son y cómo obtenerlas. Las órdenes de Windows no se han podido ejecutar en el entorno de pruebas.

## 1. Crear la máquina virtual

| Ajuste | Valor | Por qué |
|:---|:---|:---|
| Tipo | Microsoft Windows · Windows 10 (64-bit) | Oracle 21c solo existe para 64 bits. |
| Memoria | 4096 MB o más | Oracle crea una SGA y una PGA por base de datos; en la práctica 5 habrá **dos** bases de datos. |
| Procesadores | 2–4 | — |
| Disco | VDI dinámico de 150 GB | El zip de Oracle (unos 3 GB) se descomprime en el `ORACLE_HOME` (unos 8 GB más) y cada base de datos ocupa varios GB. Dinámico: solo ocupa en el anfitrión lo que se usa. |
| Controlador gráfico | VBoxSVGA, **sin aceleración 3D** | VBoxSVGA es el recomendado por VirtualBox para Windows. La aceleración 3D debe quedar desactivada: con ella, el instalador de Oracle y los asistentes Java se cierran sin avisar (ver práctica 5). |
| Red | Adaptador puente o NAT | Solo mientras se instala y se descargan Chrome, 7-Zip y el instalador de Oracle. |

## 2–5. Instalación de Windows 10 Pro 22H2

- **Edición:** Windows 10 **Pro**. Al pedir la clave, *No tengo clave de producto*.
- **Tipo de instalación:** *Personalizada* sobre el disco vacío.
- **Cuenta:** una **cuenta local** con el nombre del alumno o la alumna. Si el instalador insiste en una cuenta de Microsoft, se elige *Unirse a un dominio en su lugar* (en la edición Pro) o se instala con la red desconectada, y aparece la opción de cuenta sin conexión.
- **Privacidad:** se pueden desactivar todas las opciones de diagnóstico.

Nombre del equipo, desde PowerShell como administrador:

```powershell
Rename-Computer -NewName "mOracle-ana" -Restart
```

O en *Configuración → Sistema → Acerca de → Cambiar el nombre de este equipo*. Límite: **15 caracteres** (nombre NetBIOS); con el prefijo `mOracle-` quedan 7. Conviene que no lleve guiones bajos ni caracteres especiales, porque Oracle usa el nombre del equipo en la configuración del listener.

## 6–8. Software previo

| Software | Para qué | Comprobación |
|:---|:---|:---|
| 7-Zip | Descomprimir el zip de Oracle 21c (unos 3 GB) mucho más rápido que el explorador de Windows, y sin los errores de rutas largas que a veces da este. | Menú contextual *7-Zip* en el explorador. |
| Chrome | Descargar de oracle.com (requiere cuenta de Oracle) y SQL Developer. | — |

**No actualizar**: cada actualización acumulativa de Windows 10 ocupa varios GB y puede reiniciar la máquina en mitad de una instalación de Oracle.

## Después de la instalación

| Tarea | Cómo | Evidencia |
|:---|:---|:---|
| Red interna | Configuración de la MV → Red → *Red interna* | Captura de la configuración y `ping 8.8.8.8` fallando |
| Controlador gráfico | Configuración → Pantalla → VBoxSVGA, con *Habilitar aceleración 3D* desmarcada | Captura de la pantalla de configuración |
| OVA e instantánea | Con la máquina **apagada** | Captura del fichero y del árbol de instantáneas |
| Guest Additions | Dispositivos → Insertar imagen de CD → `VBoxWindowsAdditions.exe` → reiniciar | Portapapeles bidireccional funcionando |
| Pausar actualizaciones | *Configuración → Actualización y seguridad → Pausar actualizaciones 7 días más*, repetido | Captura con la fecha de reanudación (unas 5 semanas después) |

La pausa es una segunda barrera: aunque la red interna ya impide descargar actualizaciones, evita que Windows lo intente en cuanto la máquina vuelva a tener salida a internet. Con red interna la máquina se queda sin salida a internet, así que **el instalador de Oracle tiene que estar descargado antes** (o se pasa con una carpeta compartida). Prever esto es una evidencia de nivel 4 en 1.d.

## Comprobación de los requisitos

Evidencia principal de **1.e**. Desde un CMD o PowerShell en la MV:

```powershell
winver                                        # Versión 22H2 (compilación 19045.xxxx)
systeminfo | findstr /B /C:"Nombre del sistema operativo" /C:"Versión del sistema operativo" /C:"Tipo de sistema" /C:"Cantidad total de memoria física"
hostname                                      # mOracle-ana
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfLogicalProcessors
Get-PSDrive C                                 # espacio usado y libre
```

| Requisito | Valor pedido | Comprobación | Valor esperado |
|:---|:---|:---|:---|
| Sistema operativo | Windows 10 Pro 64 bits, 22H2 | `winver`, `systeminfo` | Windows 10 Pro · 10.0.19045 · x64 |
| RAM | ≥ 4 GB | `systeminfo` | ~4096 MB |
| CPU | 2–4 | `Win32_Processor` | 2 |
| Disco | 150 GB | `Get-PSDrive C` | ~149 GB en total |
| Nombre | `mOracle-<nombre>`, < 15 caracteres | `hostname` | `mOracle-ana` |

Para nivel 4: relacionar los requisitos con los de Oracle Database 21c para Windows (sistema de 64 bits, Windows 10 Pro, Enterprise o Education, o Windows Server; memoria y espacio suficientes para dos bases de datos) y señalar que Windows 10 dejó de tener soporte de Microsoft en octubre de 2025: es aceptable para un laboratorio aislado en red interna, pero no para producción.

## Guía de corrección

| CE | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 |
|:---:|:---|:---|:---|:---|
| **1.d** | Falta 7-Zip o la versión de Windows no es la pedida. | Windows 10 Pro 22H2, 7-Zip y navegador instalados. | Explica para qué hace falta cada programa en la práctica 5. | Anticipa lo que hará falta sin internet (instalador de Oracle descargado antes de pasar a red interna). |
| **1.e** | Solo la configuración de VirtualBox. | Comprueba desde Windows versión, RAM, CPU, disco y nombre. | Tabla de requisitos con valor pedido y valor obtenido. | Relaciona los recursos con lo que necesitarán dos bases de datos Oracle y con el soporte de Windows 10. |
| **1.g** | Capturas sueltas. | Todos los pasos, incluidas la red interna, la OVA y la instantánea. | Explicación de cada paso y del orden seguido. | Documento claro, con tiempos, espacio ocupado e incidencias. |

---

<small>Solucionario de elaboración propia para el módulo ASGBD, sobre la práctica adaptada de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).</small>
