---
layout: doc
title: "Fragmentación y replicación"
sidebar: true
outline: [2, 3]
aside: true
---

# Fragmentación y replicación

## Fragmentación en SGBDD

### 📘 ¿Qué es la fragmentación?

La **fragmentación** es una técnica empleada en los sistemas gestores de bases de datos distribuidas (SGBDD) que consiste en **dividir una base de datos en partes más pequeñas**, llamadas **fragmentos**, que se pueden almacenar en diferentes lugares (nodos).

Esta estrategia permite:

- Mejorar el rendimiento
- Acercar los datos a los usuarios finales
- Repartir la carga
- Facilitar la escalabilidad y el mantenimiento

---

### Tipos de fragmentación

#### 1. Fragmentación horizontal

Consiste en dividir las **filas** de una tabla en grupos. Cada fragmento contiene un subconjunto de registros con la misma estructura.

**Ejemplo:** una tabla de alumnos dividida por campus:

- `alumnes_campusA` → alumnos del campus A
- `alumnes_campusB` → alumnos del campus B

#### 2. Fragmentación vertical

Consiste en dividir las **columnas** de una tabla. Cada fragmento contiene solo algunas columnas de la tabla original, pero incluye la clave primaria para poder unirlas.

**Ejemplo:**

- `alumnes_dades_personals`: id, nom, cognoms
- `alumnes_dades_academiques`: id, curs, nota

#### 3. Fragmentación híbrida (mixta)

Combina la fragmentación horizontal y la vertical. Se puede dividir primero por filas y después por columnas, o viceversa.

**Ejemplo:** alumnos del campus A (fragmentación horizontal), con los datos separados en dos tablas (vertical).

---

### Ventajas de la fragmentación

- Proximidad de los datos al usuario
- Mejor reparto de la carga
- Mejor mantenimiento y seguridad
- Escalabilidad y rendimiento optimizados

### ⚠️ Consideraciones y desventajas

- Puede aumentar la complejidad de las consultas
- Hay que sincronizar la información si se replican fragmentos
- Hay que garantizar la consistencia en las operaciones distribuidas

### Conclusión

La fragmentación es una técnica esencial en los sistemas distribuidos para mejorar la eficiencia y adaptar el sistema a escenarios globales o complejos. Una buena estrategia de fragmentación **puede reducir los tiempos de respuesta y mejorar la experiencia de usuario**.

## Replicación de datos en SGBDD

### 📘 ¿Qué es la replicación?

La **replicación** es el proceso mediante el cual se crean y mantienen **copias sincronizadas** de una base de datos o de un subconjunto de sus datos en varios nodos de un **sistema distribuido**.

Esta técnica se utiliza para garantizar una mayor **disponibilidad**, **redundancia** y **tolerancia a fallos**.

### 🎯 Objetivos de la replicación

- Permitir el acceso a los datos desde diferentes ubicaciones
- Garantizar la continuidad del servicio en caso de fallo de un nodo
- Repartir la carga de consultas entre diferentes servidores
- Mejorar el rendimiento y reducir la latencia

### Tipos de replicación

#### 1. Replicación síncrona

Los datos se replican en tiempo real entre nodos. Toda escritura o actualización se debe completar en todos los nodos antes de considerarse finalizada.

**Ventaja:** máxima coherencia. <br> **Inconveniente:** puede ralentizar las operaciones si algún nodo es lento o falla.

#### 2. Replicación asíncrona

Los datos se replican con cierto retardo (retardo controlado). Las escrituras se hacen primero en un nodo principal y se propagan después a los demás.

**Ventaja:** más rápida y tolerante a la latencia. <br> **Inconveniente:** puede haber inconsistencias temporales.

### Modelos de replicación

- **Maestro-esclavo (master-slave):** solo el nodo maestro puede escribir; los esclavos solo leen.
- **Maestro-maestro (master-master):** todos los nodos pueden leer y escribir, con sincronización entre ellos.

### Ejemplos de replicación

- Oracle Data Guard (síncrona y asíncrona)
- PostgreSQL Streaming Replication
- MySQL Group Replication
- Amazon Aurora Global Databases

### Ventajas

- Redundancia y tolerancia a fallos
- Acceso más rápido según la ubicación geográfica
- Recuperación ante desastres (disaster recovery)
- Escalabilidad de lectura

### ⚠️ Inconvenientes

- Complejidad de configuración y mantenimiento
- Posibles inconsistencias (especialmente en la replicación asíncrona)
- Dependencia de la estabilidad de la red entre nodos

### Conclusión

La replicación es una **estrategia clave** para mejorar la disponibilidad y la resiliencia de las bases de datos, especialmente en entornos distribuidos o con altos requisitos de servicio. Su correcta implementación permite garantizar la **continuidad operativa y el rendimiento**.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
