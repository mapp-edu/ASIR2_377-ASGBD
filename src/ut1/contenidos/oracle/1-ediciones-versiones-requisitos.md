---
layout: doc
title: "Oracle: ediciones, versiones y requisitos"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: ediciones, versiones y requisitos

## Ediciones de Oracle Database

### 🧾 ¿Qué es una edición?

Una **edición** de Oracle Database hace referencia a un conjunto de características y capacidades disponibles según el perfil del usuario (empresa, educación, desarrollador...). Cada edición tiene un coste, unas limitaciones y unos usos recomendados.

### Ediciones disponibles

- **Enterprise Edition (EE)** – Completa y orientada a empresas grandes. Incluye todas las funcionalidades.
- **Standard Edition (SE)** – Para pequeñas y medianas empresas. Algunas funcionalidades limitadas.
- **Standard Edition One (SE1)** – Versión anterior simplificada de SE (ya descontinuada).
- **Standard Edition 2 (SE2)** – Sustituta de SE1. Limitada a 2 sockets y 16 hilos de CPU.
- **Express Edition (XE)** – ✅ ¡Gratuita! Limitada en recursos (1 CPU, 2 GB de RAM, 12 GB de espacio).
- **Personal Edition (PE)** – Orientada a desarrolladores, solo disponible en Windows.
- **Lite Edition (LE)** – Edición ligera para dispositivos móviles (muy poco utilizada).
- **Oracle Database 23ai/26ai Free** – ✅ Versión moderna gratuita para educación y pruebas, sucesora de XE.

### ☁️ Ediciones Cloud

Oracle ofrece también las ediciones anteriores como servicios en la nube (Oracle Cloud Infrastructure) con diversos niveles de rendimiento y precio:

- **Cloud Service SE**
- **Cloud Service EE**
- **Cloud Service EE – High Performance**
- **Cloud Service EE – Extreme Performance**
- **Exadata Cloud Service**

### ⚙️ Tipos de instalación (uso)

Además de la edición, Oracle se puede desplegar con diferentes arquitecturas de instalación:

- **Standalone** – Instalación simple en un solo host (la más común)
- **Grid Infrastructure** – Para dar soporte a Oracle ASM y RAC
- **Oracle RAC (Real Application Cluster)** – Para entornos de clúster con alta disponibilidad
- **Oracle Autonomous Database** – BD en la nube de Oracle que utiliza inteligencia artificial y aprendizaje automático para autogestionarse

### Recomendaciones prácticas

- Para entornos de formación y desarrollo: **Express Edition (XE)** u **Oracle Free 23ai**
- Para empresas medianas: **Standard Edition 2 (SE2)**
- Para empresas grandes con requisitos avanzados: **Enterprise Edition (EE)**
- Para escalar y automatizar: considera **OCI Cloud Services** con RAC o Exadata

### 🔗 Recursos

- [Comparación entre ediciones (SoyUnDBA)](https://soyundba.com/2021/05/19/diferencias-entre-enterprise-standard-standard-one-personal-y-express/)
- [Oracle Free 23ai (oficial)](https://www.oracle.com/database/free/)
- [Express Edition (21c XE)](https://www.oracle.com/es/database/technologies/appdev/xe.html)

::: tip Nota
(Práctica 🧪) [Primer contacto con Oracle Database](/ut1/ejercicios/guia-1-oracle-en-contenedor)
:::

## Versiones de Oracle Database

### 🧾 ¿Qué es una versión?

La **versión** de Oracle hace referencia a la numeración del software que indica las funcionalidades disponibles, el motor de base de datos y el modelo de arquitectura utilizado. Ejemplos: `11g`, `12c`, `18c`, `19c`, `21c`, `23ai`

### 📋 Lista de versiones populares

- **Oracle 11g** – Última versión no multitenant (aún usada en entornos legacy)
- **Oracle 12c** – Introducción de la arquitectura multitenant (CDB + PDB)
- **Oracle 18c** – Versión basada en la nube (Oracle Autonomous)
- **Oracle 19c** – Versión LTS (Long Term Support), muy estable y actual
- **Oracle 21c** – Exclusivamente multitenant (no se permite el modelo tradicional)
- **Oracle 23ai** – Orientada a IA y machine learning; la versión más moderna y gratuita, disponible como «Oracle Free»
- **Oracle 26ai** – Absorbe a la 23ai, con mejoras en «Oracle Free» y soporte a largo plazo (Long Term Support) hasta 2031.

### 📦 Tipos de uso (instalación)

Además de la versión y la edición, Oracle se puede instalar con diferentes modalidades de funcionamiento:

- **Standalone** – Instalación típica en una sola máquina
- **Grid Infrastructure** – Para dar soporte a RAC (Real Application Cluster)
- **RAC** – Clúster de múltiples nodos para alta disponibilidad y escalabilidad

### ⚠️ Consideraciones importantes

- A partir de Oracle **21c**, solo se permite el modelo multitenant (CDB/PDB)

- Es importante elegir la versión según:

  - Compatibilidad con la arquitectura del sistema
  - Soporte a largo plazo (LTS)
  - Requisitos de seguridad, escalabilidad y disponibilidad

- También es muy importante tener en cuenta el fin de soporte de una versión (EOL, End of Life)

El fin de vida útil, más conocido por su término inglés End Of Life (EOL), hace referencia a la caducidad de un producto de software. Es decir, es el momento en que un software deja de tener mantenimiento y soporte.

### Resumen

- La versión define la tecnología y las características disponibles
- A partir de 12c se recomienda trabajar con CDB y PDB
- 19c es la versión estable más utilizada en producción (hasta hoy)
- 23ai es una nueva versión gratuita orientada a la innovación

::: info-box Actividad
¿Cuál es la última versión que soporta non-CDB? ¿Qué versiones están dentro de su ciclo de vida?
:::

## Requisitos de instalación

### Requisitos teóricos

Estos son los requisitos oficiales mínimos especificados por Oracle para instalar la base de datos:

#### En Windows:

- Mínimo 1 GB de memoria RAM
- 1 GB de espacio en la carpeta temporal
- 8 GB para el SGBD
- Espacio adicional para las BBDD
- Resolución gráfica de 1024x768 con 256 colores
- Conexión a Internet

#### En Linux:

- Kernel compatible
- Swap igual al tamaño de la RAM
- Requisitos similares a Windows en cuanto a espacio y conexión

*Fuentes oficiales:*

- [Checklist Windows](https://docs.oracle.com/en/database/oracle/oracle-database/19/ntdbi/operating-system-checklist-oracle-database-installation-microsoft-windows.html)
- [Checklist Linux](https://docs.oracle.com/en/database/oracle/oracle-database/19/ladbi/operating-system-checklist-for-oracle-database-installation-on-linux.html)

### Requisitos realistas

Para una instalación funcional y estable, es recomendable:

- Al menos 2 GB de RAM
- 2 procesadores (CPU)
- 50 GB disponibles para el sistema operativo, Oracle y una BBDD
- Swap = 2 × RAM (en Linux)
- Resolución mínima: 1024x768 con 256 colores
- Ejecutar siempre como administrador desde CMD

### Herramientas y componentes importantes

Durante la instalación se incluyen diversos componentes:

- `setup` – Instalador principal del software

- `dbca` – Asistente para crear la BBDD (CDB/PDB)

- `netca` – Configuración del listener de red

- `netmgr` – Gestor de conexiones

- `RMAN` – Herramienta para copias de seguridad

- Clientes de acceso:

  - SQL\*Plus
  - SQL Developer
  - SQLcl
  - DBeaver
  - Enterprise Manager (obsoleto)

### Resumen final

- Los requisitos oficiales son suficientes para probar, pero no recomendables para producción
- Es esencial tener los componentes básicos preparados antes de la instalación
- ⚠️ La falta de swap o de permisos de administrador puede impedir una instalación correcta

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
