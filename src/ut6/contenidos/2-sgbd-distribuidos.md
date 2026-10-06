---
layout: doc
title: "SGBD distribuidos y reglas de Date"
sidebar: true
outline: [2, 3]
aside: true
---

# SGBD distribuidos y reglas de Date

## SGBDD – Sistemas gestores de bases de datos distribuidas

### 📘 ¿Qué es un SGBDD?

Un **sistema gestor de bases de datos distribuidas (SGBDD)** es un tipo de SGBD que permite gestionar una base de datos que no se encuentra almacenada en un único lugar, sino que está **repartida entre varios ordenadores o nodos** interconectados.

Cada nodo puede estar en una **ubicación geográfica diferente**, pero se presenta al usuario como si fuera una base de datos única y coherente.

### 🎯 Objetivos de un SGBDD

- Ofrecer una **visión unificada** de la información
- Garantizar la **consistencia** y la **integridad** entre los datos repartidos
- Permitir la **disponibilidad continua** en caso de fallo de un nodo
- Optimizar el acceso mediante la **localización de los datos**

### Funcionamiento básico

El SGBDD controla cómo y dónde se hacen las consultas, las actualizaciones y las sincronizaciones entre nodos. Puede hacer réplicas de los datos para garantizar la tolerancia a fallos y mejorar la disponibilidad.

#### Componentes habituales:

- 🖥️ Servidores de datos (nodos)
- Red de comunicación
- Software de coordinación y sincronización

### Ejemplos de SGBDD

- Oracle Distributed Database
- PostgreSQL con BDR (Bi-Directional Replication)
- Microsoft SQL Server Distributed Queries
- Google Spanner, Amazon Aurora Global Databases

### Ventajas

- Redundancia de datos y tolerancia a fallos
- Mejora el rendimiento en entornos globales
- Soporta usuarios de diferentes ubicaciones

### ⚠️ Inconvenientes

- Más complejidad de gestión y sincronización
- Dependencia de la conexión entre nodos
- Gestión más complicada de las transacciones distribuidas

### 💬 Conclusión

Los SGBDD son ideales para empresas con presencia global, grandes volúmenes de datos y necesidad de disponibilidad constante. A pesar de su complejidad, son una herramienta potente para mantener **bases de datos robustas, escalables y resilientes**.

## Las doce reglas de Date

::: warning Nota de la adaptación
El currículo del módulo habla de las **reglas de Date**, que no son un acrónimo: son las doce reglas (más un principio fundamental) que **C. J. Date** enunció en 1987 para caracterizar un SGBD distribuido ideal. El apartado siguiente, tomado del material original, presenta en cambio «D.A.T.E.» como una regla mnemotécnica (disponibilidad, accesibilidad, tolerancia y escalabilidad): es útil para recordar objetivos de diseño, pero no debe confundirse con las reglas de Date.
:::

**Principio fundamental (regla 0):** para el usuario, un sistema distribuido debe verse exactamente igual que un sistema no distribuido.

| N.º | Regla | Idea |
|:---:|:---|:---|
| 1 | Autonomía local | Cada nodo gestiona sus propios datos y funciona por sí mismo. |
| 2 | No dependencia de un sitio central | No hay un nodo del que dependa todo el sistema. |
| 3 | Operación continua | El sistema no se detiene por tareas planificadas (añadir nodos, actualizar, etc.). |
| 4 | Independencia de localización | El usuario no necesita saber dónde están almacenados los datos. |
| 5 | Independencia de fragmentación | El usuario no necesita saber cómo están fragmentados los datos. |
| 6 | Independencia de replicación | El usuario no necesita saber si hay réplicas ni dónde están. |
| 7 | Procesamiento distribuido de consultas | Las consultas se optimizan y se ejecutan teniendo en cuenta todos los nodos. |
| 8 | Gestión distribuida de transacciones | Atomicidad y control de concurrencia entre nodos (confirmación en dos fases). |
| 9 | Independencia del hardware | Funciona sobre máquinas de distintos fabricantes. |
| 10 | Independencia del sistema operativo | Funciona sobre distintos sistemas operativos. |
| 11 | Independencia de la red | Funciona sobre distintas redes y protocolos. |
| 12 | Independencia del SGBD | Los nodos pueden usar SGBD distintos si comparten una interfaz común. |

## Reglas D.A.T.E. para la disponibilidad del SGBD

### 📘 ¿Qué son las reglas D.A.T.E.?

Las **reglas D.A.T.E.** son un conjunto de principios que definen las características esenciales que debe tener un sistema para ser considerado **altamente disponible**. Este acrónimo hace referencia a:

- **D** → **Disponibilidad**
- **A** → **Accesibilidad**
- **T** → **Tolerancia a fallos**
- **E** → **Escalabilidad**

---

### D – Disponibilidad

El sistema debe estar disponible **la mayor parte del tiempo**. Esto implica minimizar los cortes de servicio, tanto previstos (mantenimientos) como imprevistos (errores, fallos de hardware...).

**Ejemplo:** sistemas con un SLA del 99,99 % de disponibilidad anual.

### A – Accesibilidad

Los usuarios autorizados deben poder acceder al sistema cuando lo necesiten, sin bloqueos ni problemas de conexión. Esto implica garantizar una **conectividad estable** y una **infraestructura de red segura**.

**Ejemplo:** configuración redundante de redes y sistemas de control de acceso.

### T – Tolerancia a fallos

El sistema debe seguir funcionando aunque se produzca un **error o fallo** en una parte del sistema. Esto incluye mecanismos como el **failover**, las réplicas, los backups y los sistemas de recuperación automática.

**Ejemplo:** clústeres con conmutación automática (Oracle RAC, SQL AlwaysOn...)

### E – Escalabilidad

El sistema debe poder **crecer y adaptarse** al aumento de datos, de usuarios o de carga de trabajo sin perder rendimiento. Esta escalabilidad puede ser:

- **Vertical**: añadir más recursos a un único servidor (CPU, RAM…)
- **Horizontal**: añadir nuevos servidores (distribución de carga)

**Ejemplo:** bases de datos en la nube con escalado automático.

---

### Conclusión

Seguir las reglas D.A.T.E. es fundamental para diseñar y mantener sistemas de bases de datos **robustos y disponibles**. Estos criterios son especialmente relevantes en entornos de producción crítica, donde la pérdida de acceso a los datos puede tener un gran impacto.

## SGBDD – Funcionamiento y características (2.ª parte)

### 📘 ¿Cómo funciona un SGBDD?

Un **sistema gestor de bases de datos distribuidas (SGBDD)** funciona sobre una colección de bases de datos distribuidas entre varios ordenadores, pero que se presentan a los usuarios como una única base de datos lógica.

### Tipos de distribución

- **Reparto horizontal:** cada servidor almacena diferentes filas de una tabla.
- **Reparto vertical:** cada servidor contiene diferentes columnas de una tabla.
- **Réplica:** se copia total o parcialmente una tabla en diferentes ubicaciones para garantizar la disponibilidad y mejorar el acceso.

### Transparencias en un SGBDD

Un buen SGBDD debe ofrecer diversos niveles de **transparencia** al usuario, como:

- **Transparencia de localización:** el usuario no sabe dónde se encuentran físicamente los datos.
- **Transparencia de fragmentación:** los datos pueden estar divididos entre varios sitios, pero se consultan como si fueran una única unidad.
- **Transparencia de réplica:** el usuario no es consciente de si los datos tienen copias en varios servidores.
- **Transparencia de concurrencia:** múltiples usuarios pueden acceder a los datos simultáneamente sin conflictos.
- **Transparencia de fallos:** en caso de fallo de un nodo, el sistema sigue funcionando.

### Gestión de transacciones

Una transacción distribuida puede implicar a varios nodos. Para garantizar su coherencia se utilizan protocolos como el **2PC (Two-Phase Commit)**:

1. **Fase 1 – Preparación:** cada nodo confirma si puede hacer el commit.
2. **Fase 2 – Confirmación:** si todos los nodos aceptan, se hace el commit; si no, se hace rollback.

### 🔐 Seguridad y consistencia

Es fundamental garantizar que los datos sean **consistentes, seguros y estén sincronizados** entre todas las ubicaciones. Esto puede incluir:

- Copias de seguridad distribuidas
- Sincronización automática de réplicas
- Control de acceso por nodo

### Ejemplos de soluciones SGBDD

- **Oracle Distributed Database**
- **PostgreSQL con BDR**
- **Microsoft SQL Server Linked Servers**
- **Amazon Aurora Global Database**
- **Google Cloud Spanner**

### Ventajas de un SGBDD

- Disponibilidad global
- Reparto de carga entre servidores
- Acceso más rápido según la localización del usuario
- Escalabilidad horizontal
- Continuidad de negocio en caso de fallo de un nodo

### ⚠️ Inconvenientes

- Implementación y mantenimiento más complejos
- Dependencia de una buena infraestructura de red
- Gestión delicada de las transacciones distribuidas

### Conclusión

Los SGBDD son una solución robusta y escalable para entornos distribuidos, especialmente útiles en aplicaciones globales o críticas. Aunque requieren una gestión técnica más avanzada, ofrecen una gran fiabilidad y disponibilidad si se configuran correctamente.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
