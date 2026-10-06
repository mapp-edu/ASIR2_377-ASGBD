---
layout: doc
title: "Bases de datos en la nube y clústeres"
sidebar: true
outline: [2, 3]
aside: true
---

# Bases de datos en la nube y clústeres

## ☁️ Bases de datos en la nube

### 📘 ¿Qué es la nube en el contexto del SGBD?

La **nube** representa una de las tecnologías actuales más utilizadas para garantizar la **disponibilidad**, la **escalabilidad** y el **rendimiento** de los sistemas gestores de bases de datos (SGBD). Permite utilizar infraestructuras virtuales que pueden ser:

- Hardware dedicado
- Servicios gestionados por terceros (p. ej.: Oracle Cloud, AWS, Azure)

Aparece el concepto de **DBaaS** (Database as a Service), un modelo de servicio en la nube en el que el proveedor gestiona toda la infraestructura de la base de datos y tú solo utilizas la base de datos

### Ventajas del uso de la nube

- **Coste más eficiente**: pago por uso, sin invertir en infraestructuras propias.
- **Alto rendimiento y escalabilidad**: adaptación automática a los picos de carga.
- **Alta disponibilidad**: sistemas redundantes y con tolerancia a fallos.
- **Alto nivel de seguridad**: cifrado, copias de seguridad, control de acceso.
- **Administración completa**: mantenimiento, actualizaciones y gestión integrados.
- **Compatibilidad** con los SGBD tradicionales (Oracle, MySQL, PostgreSQL…)
- **Ideal para el teletrabajo**: acceso remoto desde cualquier lugar y dispositivo.

### ⚠️ Inconvenientes o riesgos

- **Dependencia de un tercero**: hay que confiar en el proveedor del servicio.
- **Caída de la conexión a internet**: puede dejar la BD inoperativa temporalmente.
- **Riesgos de seguridad**: aunque están protegidos, hay vulnerabilidades potenciales.
- **Falta de control total**: el usuario no gestiona directamente el hardware ni el sistema completo.

### ☁️ Principales proveedores de nube para SGBD

**Proveedores generalistas / globales**

- **Oracle Cloud**: plataforma propia con soporte para multitenant, PDB y Oracle Autonomous Database.
- **AWS** (Amazon Web Services): con servicios como RDS y Aurora, y soporte para Oracle, PostgreSQL, MySQL, etc.
- **Azure** (Microsoft): con bases de datos SQL gestionadas e integración con sistemas híbridos.

**Proveedores especializados (¡muy importantes!)**

- **Supabase**: backend con PostgreSQL (tipo Firebase)
- **Neon**: PostgreSQL serverless
- **Timescale**: PostgreSQL para series temporales
- **Aiven**: PostgreSQL, Kafka, etc. en AWS/GCP/Azure (PostgreSQL multicloud)
- **Render**: PostgreSQL gestionado + hosting; muy simple
- **Railway**: PostgreSQL muy fácil de desplegar; integración con aplicaciones

**Proveedores más sencillos (VPS + BD)**

- **DigitalOcean**: Managed PostgreSQL sencillo; más barato que AWS
- **Linode** (Akamai)
- Vultr
- Hetzner
- y más...

Estas plataformas ofrecen **monitorización en tiempo real**, copias automáticas, sistemas de recuperación ante desastres e integración con herramientas DevOps.

---

### Factores para elegir proveedor

1. Coste
2. Escalabilidad
3. Rendimiento
4. Integración
5. Vendor lock-in

### Postgres Cloud

Postgres Cloud no es un producto único oficial, sino un término general para referirse a PostgreSQL ejecutado como servicio en la nube (DBaaS).

```txt
Local:
Tú gestionas el servidor + PostgreSQL

Cloud:
El proveedor gestiona el servidor → tú solo usas PostgreSQL
```

- Base de datos PostgreSQL lista para usar
- Backups automáticos
- Alta disponibilidad (replicación)
- Escalado automático
- Monitorización
- Seguridad gestionada

### 💬 Resumen

Trabajar con un SGBD en la nube ofrece muchas ventajas en cuanto a rendimiento, flexibilidad y mantenimiento. Aun así, hay que tener en cuenta la dependencia de internet y la confianza depositada en el proveedor. Es una **solución recomendable** para entornos con teletrabajo, proyectos dinámicos y empresas que buscan escalabilidad sin una gran inversión inicial.

## Clúster en sistemas de bases de datos

### 📘 ¿Qué es un clúster?

Un **clúster** es un conjunto de servidores interconectados que funcionan como una **única unidad** para ofrecer servicios, como una base de datos, de manera más robusta y fiable. Esto permite conseguir **alta disponibilidad** y **tolerancia a fallos**.

#### 🎯 Objetivo principal

- **Evitar interrupciones** del servicio ante el fallo de uno de los servidores.
- **Repartir la carga** de trabajo (balanceo de carga) entre diferentes nodos.

### Funcionamiento básico

Todos los nodos del clúster comparten el acceso a la misma base de datos o disco. Cuando un nodo falla, otro puede asumir automáticamente su rol, evitando cortes de servicio.

Ejemplos típicos:

- Oracle RAC (Real Application Clusters)
- MySQL Cluster
- Microsoft SQL Server con AlwaysOn o Failover Cluster
- PostgreSQL con replicación + failover (Patroni, repmgr, pg_auto_failover)

### Componentes típicos de un clúster

- **Nodos**: máquinas físicas o virtuales que forman parte del clúster.
- **Interconexión**: red rápida para la sincronización y el control de estado.
- **Almacenamiento compartido**: discos accesibles para todos los nodos.
- **Software de clúster**: gestiona la monitorización, el failover y los recursos compartidos.

### Beneficios del clúster

- Alta disponibilidad (HA)
- Tolerancia a fallos
- Escalabilidad horizontal (añadir nuevos nodos)
- Continuidad de negocio

### Consideraciones

- Implementación más compleja
- Puede implicar más coste de infraestructura
- Hay que tener control de acceso y seguridad entre nodos

### Ejemplo gráfico (conceptual)

🖥️ Nodo 1 (activo) + 🖥️ Nodo 2 (en espera) → Base de datos común

Si el nodo 1 falla, el nodo 2 se activa automáticamente (failover).

### Conclusión

Los clústeres son una **solución profesional** para entornos críticos que requieren disponibilidad 24/7. Son ampliamente usados en entornos corporativos y servicios en línea con gran demanda.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
