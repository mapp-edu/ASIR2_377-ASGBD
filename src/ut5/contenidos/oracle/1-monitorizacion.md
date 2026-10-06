---
layout: doc
title: "Oracle: monitorización del SGBD"
sidebar: true
outline: [2, 3]
aside: true
---

# Oracle: monitorización del SGBD

## Monitorización del sistema gestor de bases de datos (SGBD)

### ¿Qué es la monitorización?

La **monitorización** es el proceso de controlar el funcionamiento del sistema gestor, detectando posibles errores o situaciones que puedan afectar al rendimiento. Debe ser **poco intrusiva**, para no interferir en el funcionamiento normal del sistema.

Hay que procurar que las tareas de monitorización y diagnóstico del sistema sean lo menos intrusivas posible para que no penalicen el rendimiento del sistema gestor, y relegar las tareas que requieran un consumo de recursos medio o elevado a momentos de baja carga

### 🧰 Herramientas principales de monitorización

- **Monitor de rendimiento**: analiza la carga, los procesos y el consumo de recursos.
- **Log de ejecución**: recoge errores, avisos y operaciones importantes.
- **Diccionario de datos (DD)**: permite hacer consultas para monitorizar sesiones, bloqueos, consultas activas, etc.

### Monitor de rendimiento

- Seguimiento de métricas de tiempo de respuesta, concurrencia y escalabilidad.
- Detección de bloqueos y procesos acaparadores.
- Consumo de recursos.
- Configuración de alertas y umbrales.

#### Datos relevantes

- Tiempo de respuesta y transacciones por usuario
- Escalabilidad y concurrencia
- Uso de CPU, memoria y E/S

### 📝 Registro de errores (ficheros de log)

Registra actividades como arranques, paradas, errores, consultas lentas, etc.

- **Error**: problemas graves
- **Warning**: advertencias
- **Debug**: información detallada (en desarrollo)

#### 📁 Ejemplos de ficheros de registro

- `alert.log`
- `trace`
- `incident`
- Ubicación: `ORACLE_BASE/diag` (ADR - Automatic Diagnostic Repository)

### 📚 Diccionario de datos (DD)

Conjunto de vistas como `v$session`, `v$sqlarea`, `v$diag_info`, etc. que permiten:

- Consultar quién está conectado y qué ejecuta
- Detectar consultas pesadas o bloqueos
- Visualizar información de rendimiento

Ejemplo:

```sql
SELECT * FROM v$session;
SELECT * FROM v$sqlarea;
SELECT * FROM v$diag_info;  -- Registro de errores
```

### 🖥️ Monitorización gráfica (SQL Developer, TOAD...)

⚠️ Las herramientas gráficas consumen más recursos que las consultas al DD <br> ⚠️ Las herramientas gráficas requieren más permisos que las consultas al DD

- Historial de consultas (Ver → DBA)
- ASH (Active Session History)
- AWR (Automatic Workload Repository)
- Top SQL, sesiones, tareas de larga duración

También se puede hacer desde `Herramientas → Controlar sesiones` en SQL Developer.

### Práctica recomendada

- Priorizar las consultas al diccionario de datos frente a las herramientas gráficas (consumen menos recursos)
- Hacer la monitorización profunda en horas de baja carga
- Configurar alertas con SCHEDULER o con sistemas externos

### Resumen de buenas prácticas

- Supervisar la actividad del sistema periódicamente
- Detectar y gestionar las sesiones bloqueadas
- Reaccionar a los errores recurrentes de los logs
- Hacer uso de vistas como `v$session`, `v$active_session_history`, etc.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
