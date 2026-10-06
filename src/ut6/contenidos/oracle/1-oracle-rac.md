---
layout: doc
title: "Oracle: clúster Oracle RAC"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: clúster Oracle RAC

## Clúster de Oracle – Oracle RAC

### 📘 ¿Qué es Oracle RAC?

**Oracle RAC (Real Application Clusters)** es una solución de Oracle que permite a varios servidores acceder simultáneamente a una **base de datos compartida**. Está diseñada para proporcionar **alta disponibilidad, escalabilidad y tolerancia a fallos**.

### Características clave

- **Acceso concurrente** a la misma base de datos por parte de varios nodos (servidores)
- **Almacenamiento compartido** entre los nodos
- **Failover automático**: si un nodo cae, otro sigue dando servicio
- **Distribución de la carga** entre nodos
- **Escalabilidad horizontal** (se pueden añadir más nodos según las necesidades)

### Componentes de un entorno RAC

- Dos o más nodos con Oracle instalado
- Red de interconexión (para sincronizar memoria y procesos entre nodos)
- Sistema de almacenamiento compartido (SAN, NAS, ASM...)
- Oracle Clusterware para gestionar el clúster y los recursos

### Alta disponibilidad y failover

Oracle RAC garantiza que, si un nodo falla, otro nodo **asume automáticamente la carga**, sin necesidad de reiniciar la base de datos ni de perder conexiones. Esta funcionalidad es esencial para sistemas 24/7.

### Escalabilidad

A medida que crece el volumen de datos o de consultas, se pueden añadir nuevos nodos al clúster sin necesidad de parar el sistema. Esto permite adaptarse a las necesidades de rendimiento en tiempo real.

### Ventajas de Oracle RAC

- Continuidad del servicio
- Failover y recuperación rápida
- Escalabilidad dinámica
- Mejor uso de los recursos del sistema

### ⚠️ Inconvenientes o requisitos

- Coste elevado (licencias e infraestructuras)
- Configuración y mantenimiento complejos
- Requiere una infraestructura de red y de almacenamiento robusta

### Alternativas similares

- Microsoft SQL Server AlwaysOn
- MySQL Group Replication
- PostgreSQL con Patroni o Citus

### Conclusión

**Oracle RAC** es una de las soluciones más potentes para entornos empresariales que requieren **alta disponibilidad y tolerancia a fallos**. A pesar de su coste y complejidad, ofrece una plataforma estable para aplicaciones críticas que no pueden permitirse caídas de servicio.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
