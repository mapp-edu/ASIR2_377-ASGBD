---
layout: doc
title: "Oracle: instancia, arquitectura y OFA"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: instancia, arquitectura y OFA

## Instancia

### ¿Qué es una instancia Oracle?

Una **instancia** de Oracle es el conjunto de procesos en segundo plano (*background processes*) y estructuras de memoria que gestionan el acceso a una base de datos Oracle.

- Cada vez que se inicia una instancia, se crea automáticamente un área de memoria global llamada **SGA** (System Global Area)
- También se lanzan diversos **procesos en background** que gestionan la entrada/salida, la recuperación, el buffer cache, etc.
- Cuando un usuario se conecta, se le asigna un área de memoria personal: la **PGA** (Program Global Area)

### Componentes de memoria

- **SGA** – Área de memoria compartida entre todos los usuarios conectados a la instancia
- **PGA** – Área de memoria privada para cada sesión/usuario

Se pueden consultar con las siguientes órdenes desde SQL\*Plus:

```txt
SQL> show sga;
SQL> show parameter sga;

SQL> show parameter pga;
```

### Relación con la base de datos (BBDD)

Una instancia siempre está asociada a una base de datos (BBDD) concreta. Cuando se inicia la instancia, se carga la información necesaria para gestionar esa BBDD.

- Una instancia ⇄ una base de datos montada (normalmente una CDB)
- ⚠️ Si no se inicia la instancia, no se puede acceder a la base de datos

### Diagrama conceptual

```txt
[ Usuario ] → [ PGA ]
             |
             ↓
[ Instancia Oracle ]
   ├── SGA
   ├── Procesos background (DBWn, LGWR, CKPT, etc.)
   ↓
[ Ficheros de la base de datos (BBDD) ]
```

### Notas técnicas

- Una misma máquina puede tener varias instancias
- Es posible conectarse a una instancia sin abrir la base de datos (para mantenimiento)
- La instancia y la base de datos están ligadas, pero son componentes separados

**Conclusión:** sin instancia, la base de datos no puede operar. Y sin base de datos, la instancia no tiene sentido.

## Arquitectura de Oracle

### Arquitectura tradicional (non-CDB)

![Base de datos Oracle 12c no CDB #center](/img/contenidos/ut1/bdnoncdb.png)

Antes de la versión 12c, Oracle utilizaba una arquitectura tradicional en la que una instancia del SGBD controlaba una única base de datos (una sola estructura de ficheros).

- Cada instancia ↔ una única BBDD
- Sin contenedores ni BBDD «pluggable»
- Más sencilla, pero menos flexible

### Arquitectura multitenant (CDB/PDB)

![Arquitectura multitenant: CDB, contenedor raíz y PDB #center](/img/contenidos/ut1/bdmultit.png)

A partir de Oracle 12c se introdujo la **arquitectura multitenant**:

- **CDB** (Container Database): base de datos contenedora
- **PDB** (Pluggable Database): bases de datos encapsuladas dentro de una CDB

Ejemplo de una estructura multitenant:

```txt
CDB$ROOT       → Contenedor principal
PDB$SEED       → Plantilla de clonación de PDB
PDB1, PDB2...  → Pluggable Databases (las útiles para trabajar)
```

### Arquitectura multitenant (en un SGBD)

![Varias bases de datos contenedoras administradas de forma conjunta #center](/img/contenidos/ut1/variosmultit.png)

- Un SGBD de Oracle puede gestionar varios contenedores (CDB)
- Cada contenedor es una BBDD / **instancia** diferente
- Cada contenedor puede tener dentro diferentes PDB

### Notas importantes sobre multitenant

- Se pueden tener varias PDB funcionando en paralelo dentro de una misma CDB
- Permite mejorar la escalabilidad, la seguridad y el mantenimiento
- ⚠️ A partir de la versión **Oracle 21c**, solo se permite la arquitectura multitenant

### Diferencias entre arquitecturas

| Característica | Tradicional (non-CDB) | Multitenant (CDB/PDB) |
| --- | --- | --- |
| Instancia ↔ BBDD | 1 ↔ 1 | 1 ↔ múltiples PDB |
| Separación lógica | No | Sí (cada PDB es independiente) |
| Compatibilidad con 21c | ❌ | ✅ Obligatoria |

### Beneficios de la arquitectura multitenant

- Mejor gestión de recursos
- Más fácil de clonar, hacer backups y upgrades
- Reducción del coste de mantenimiento
- Ideal para entornos cloud y consolidación

### Resumen

- La arquitectura multitenant es el estándar actual
- Cada PDB es como una base de datos separada, pero comparten instancia con la CDB
- La arquitectura tradicional ya no es válida para las nuevas versiones

## OFA – Oracle Flexible Architecture

### ¿Qué es la OFA?

La **OFA (Oracle Flexible Architecture)** es un estándar de diseño de la estructura de directorios y de la nomenclatura de ficheros en instalaciones Oracle. Está pensada para:

- Organizar eficientemente grandes volúmenes de datos y software
- Facilitar la administración y el mantenimiento
- Mejorar el rendimiento
- Permitir gestionar múltiples bases de datos en un mismo sistema

### 📁 Ejemplos de rutas según el sistema operativo

**🖥️ En Windows:**

```bash
C:\app\oracle\product\21.0.0.0\dbhome_1
```

**🐧 En Unix/Linux:**

```txt
/u01/app/oracle/product/21.0.0.0/dbhome_1
```

Donde:

- `/u01` es el punto de montaje principal
- `oracle` es el nombre del usuario que instala ⚠️
- `product` contiene diferentes versiones del software
- `21.0.0` es la versión instalada

### 👤 El usuario instalador

El directorio `oracle` hace referencia normalmente al usuario del sistema operativo que ejecuta la instalación. Este usuario debe tener permisos de administrador en Windows o pertenecer a los grupos `oinstall` y `dba` en Linux.

### ⚠️ Recomendaciones

- No instales Oracle directamente en `C:\` o `/`. Usa rutas separadas como `/u01` para mantenerlo organizado.
- Usa el mismo esquema para todas las versiones y entornos (dev, test, prod).
- No modifiques la estructura creada automáticamente por Oracle.

### 🔗 Recursos adicionales

Puedes consultar más información sobre OFA en los siguientes enlaces:

- [¿Qué es la OFA? (Orlando Olguin)](https://orlandoolguin.wordpress.com/2010/08/23/que-es-la-ofa/)
- [Documentación oficial de Oracle](https://docs.oracle.com)

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
