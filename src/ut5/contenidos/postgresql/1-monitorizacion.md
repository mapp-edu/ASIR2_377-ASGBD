---
layout: doc
title: "PostgreSQL: monitorización del SGBD"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: monitorización del SGBD

## Monitorización del sistema gestor de bases de datos (SGBD)

### ¿Qué es la monitorización?

La **monitorización** es el proceso de controlar el funcionamiento del sistema gestor, detectando posibles errores o situaciones que puedan afectar al rendimiento. Debe ser **poco intrusiva**, para no interferir en el funcionamiento normal del sistema.

Hay que procurar que las tareas de monitorización y diagnóstico del sistema sean lo menos intrusivas posible para que no penalicen el rendimiento del sistema gestor, y relegar las tareas que requieran un consumo de recursos medio o elevado a momentos de baja carga

### 🧰 Herramientas principales de monitorización

**Vistas del sistema**

- Actividad en tiempo real: `pg_stat_activity`
- Estadísticas de tablas: `pg_stat_user_tables`
- Bloqueos: `pg_locks`
- Consultas lentas: `pg_stat_statements` (extensión)

**Extensiones de monitorización**

- pg_stat_statements
- auto_explain
- pgstattuple
- pgaudit

**Herramientas gráficas**

- pgAdmin
- Prometheus + Grafana
- Zabbix / Nagios

**Otras**

- Logs del servidor
- Planes de ejecución

---

### 📝 Registro de errores (ficheros de log)

Registra actividades como arranques, paradas, errores, consultas lentas, etc.

- **Error**: problemas graves
- **Warning**: advertencias
- **Debug**: información detallada (en desarrollo)

---

### 🖥️ Monitorización gráfica

⚠️ Las herramientas gráficas consumen más recursos que las consultas al DD <br> ⚠️ Las herramientas gráficas requieren más permisos que las consultas al DD

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
