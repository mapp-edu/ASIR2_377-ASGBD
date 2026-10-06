---
layout: doc
title: "La tríada CID"
sidebar: true
outline: [2, 3]
aside: true
---

# La tríada CID

## La tríada CID (confidencialidad, integridad y disponibilidad)

![Tríada CID: confidencialidad, integridad y disponibilidad #center](/img/contenidos/ut3/CID-ciber.png)

La tríada CID (confidencialidad, integridad y disponibilidad) es un modelo de seguridad fundamental para garantizar la protección de la información en cualquier sistema informático, incluido Oracle. Este modelo se utiliza para establecer las bases de las políticas de seguridad, y Oracle, como sistema de gestión de bases de datos (SGBD), tiene diversas características y herramientas que permiten implementarlo eficazmente.

### 1. Confidencialidad (Confidentiality)

La confidencialidad se refiere a la protección de la información para evitar que accedan a ella usuarios no autorizados. En Oracle, esto se puede conseguir mediante:

- **Autenticación y control de acceso**: Oracle utiliza sistemas de autenticación como el usuario/contraseña para garantizar que solo los usuarios autorizados puedan acceder a la base de datos.
- **Privilegios y roles**: los roles y privilegios de Oracle definen los derechos de acceso de cada usuario a los datos. Los privilegios se pueden asignar a roles específicos, y estos roles, a los usuarios.
- **Cifrado de datos (Encryption)**: Oracle permite cifrar tanto los datos en reposo como los datos en tránsito. La función de cifrado de bases de datos de Oracle (TDE - Transparent Data Encryption) cifra los datos almacenados, mientras que el cifrado SSL/TLS se utiliza para proteger los datos durante la transmisión.
- **Auditoría**: Oracle ofrece herramientas para auditar el acceso a la base de datos y registrar las operaciones realizadas. Esto permite detectar accesos no autorizados a datos sensibles.

### 2. Integridad (Integrity)

La integridad de los datos hace referencia a su exactitud, coherencia y fiabilidad a lo largo del tiempo. Para garantizarla en Oracle, se pueden utilizar diversos mecanismos:

- **Restricciones (Constraints)**: Oracle permite definir restricciones para garantizar la coherencia de los datos (por ejemplo, restricciones de clave primaria, clave foránea, unicidad y validez).
- **Comprobación de validez (Validations)**: se pueden utilizar triggers o funciones para validar los datos antes de introducirlos en la base de datos. Esto ayuda a mantener la calidad y la integridad de la información.
- **Control de versiones y copias de seguridad**: las copias de seguridad regulares y el control de versiones ayudan a garantizar que los datos se puedan recuperar de manera fiable en caso de pérdida o corrupción.
- **Control de transacciones (ACID)**: Oracle utiliza el modelo ACID (atomicidad, consistencia, aislamiento, durabilidad) para asegurarse de que las transacciones se procesan correctamente y no alteran la integridad de los datos.

### 3. Disponibilidad (Availability)

La disponibilidad hace referencia a la capacidad de la base de datos para estar accesible y operativa en todo momento. Para asegurar la disponibilidad en Oracle, se pueden utilizar diversos mecanismos y tecnologías:

- **Clústeres y alta disponibilidad**: Oracle soporta diversas soluciones de alta disponibilidad, como Oracle Real Application Clusters (RAC), que permiten que múltiples instancias de bases de datos trabajen en conjunto para garantizar que la base de datos esté siempre disponible, incluso en caso de fallos del sistema.
- **Recuperación ante desastres (Disaster Recovery)**: Oracle ofrece opciones de recuperación ante desastres, como Oracle Data Guard, que permite replicar los datos en un sitio secundario para garantizar que la base de datos esté disponible en caso de incidentes importantes.
- **Copias de seguridad y restauración**: utilizar Oracle Recovery Manager (RMAN) para realizar copias de seguridad y restaurar los datos es esencial para garantizar la disponibilidad de los servicios.
- **Mantenimiento y monitorización**: Oracle proporciona herramientas para monitorizar la salud del sistema (Oracle Enterprise Manager) y para planificar el mantenimiento, evitar paradas no deseadas e identificar de manera proactiva posibles problemas de disponibilidad.

### Resumen

Implementar la tríada CID en Oracle implica la combinación de múltiples mecanismos y herramientas que permiten proteger la información:

- **Confidencialidad**: autenticación, cifrado de datos, control de acceso y auditoría.
- **Integridad**: restricciones de datos, control de transacciones y copias de seguridad.
- **Disponibilidad**: alta disponibilidad, recuperación ante desastres y monitorización activa.

Con estos mecanismos, Oracle permite a los administradores de bases de datos proteger los datos y garantizar que se cumplan las prácticas de seguridad requeridas para una buena gestión de la información.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
