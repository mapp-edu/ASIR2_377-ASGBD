---
layout: doc
title: "PostgreSQL: copias de seguridad y recuperación"
sidebar: true
outline: [2, 3]
aside: true
---

# PostgreSQL: copias de seguridad y recuperación

## 💾 Recuperación y copias de seguridad en PostgreSQL

### ¿Por qué hay que hacer copias de seguridad?

Las copias de seguridad son esenciales para garantizar la **continuidad del servicio** y la **protección de la información**. En caso de fallo del sistema, error humano, corrupción de datos o ataques, una buena estrategia de backup permite recuperar la base de datos sin pérdidas.

La cuestión de hacer las copias de seguridad desde dentro de PostgreSQL (usando herramientas como **pg_dump**) frente a hacerlas desde fuera (copiando ficheros del sistema operativo) es muy importante porque afecta a la consistencia y a la recuperabilidad de la base de datos

Hacer las copias de seguridad desde dentro de PostgreSQL es crítico porque asegura que la base de datos se pueda recuperar correctamente y sin pérdida de datos, incluso si está en funcionamiento. Hacerlo desde el sistema operativo solo es seguro si la base de datos está apagada, algo poco práctico en entornos de producción

Problemas si se hacen desde fuera del SGBD: inconsistencia, recuperación complicada, no se registran las transacciones

Ventajas si se hacen desde dentro del SGBD: consistencia de datos, recuperación puntual, gestión automática de logs, copias en caliente, automatización y verificación

### 🎯 Objetivos de una copia de seguridad

- Restaurar los datos después de un error
- Permitir la recuperación puntual o total
- Facilitar entornos de prueba o migraciones
- Cumplir normativas legales (protección de datos)

### Tipos de copias de seguridad

- **Físicas**: copias de los ficheros físicos
- **Lógicas**: exportación de datos (a partir de SQL)

---

- **Totales**: una BBDD entera o un clúster entero
- **Parciales**: parte de una BBDD, una tabla concreta, un índice, etc. (SQL)

---

- **Online**: también se llama copia de seguridad en caliente. Se hace mientras la base de datos sigue activa y los usuarios trabajan.
- **Offline**: también se llama copia de seguridad en frío. Se realiza cuando la base de datos está completamente parada

---

### Estrategias de backup

- **Completa:** copia total de la BD
- **Incremental:** solo los datos modificados desde el último backup
- **Diferencial:** todas las modificaciones desde el último backup completo
- **Continua:** con logs (WAL)

### Mecanismos de PostgreSQL

- **pg_dump:** la copia lógica
- **pg_basebackup:** la copia física
- WAL (Write Ahead Log)

pg_dump y pg_basebackup guardan la copia en el sistema donde se ejecuta el comando, aunque habitualmente pg_dump se ejecuta en el cliente y pg_basebackup en un sistema remoto para obtener una copia física.

---

### Herramientas principales de backup en PostgreSQL

### 1. 📤 pg_dump

pg_dump genera una copia **lógica** en un fichero. Exporta la BD en forma de sentencias SQL. Contiene CREATE TABLE, INSERT, etc.

```bash
pg_dump empresa > backup.sql
```

**ONLINE**: 👉 funciona mientras la BD está en uso, no hace falta parar el servidor y hace una copia consistente gracias a MVCC (snapshots)

- ✔️ Selectivo (puedes elegir tablas)
- ✔️ Portable (sirve entre versiones)
- ✔️ Editable (es texto)
- ❌ Lento en BD grandes
- ❌ No incluye la configuración interna
- ❌ No sirve para PITR

```bash
-- Restauración:
psql empresa < backup.sql
```

### 2. 📤 pg_basebackup

pg_basebackup genera una copia **física** en un directorio con la estructura interna de PostgreSQL.

```bash
pg_basebackup -D /backup
```

Incluye datos, índices, configuración... todo

**ONLINE**: copia los ficheros mientras la BD está activa. Se basa en el WAL (Write-Ahead Log) y en la consistencia interna

```txt
backup/
 ├── base/
 ├── global/
 ├── pg_wal/
 └── ...
```

- ✔️ Rápido para BD grandes
- ✔️ Base para PITR
- ✔️ Copia exacta
- ❌ No selectivo
- ❌ No editable
- ❌ Depende de la versión/arquitectura

```bash
--Restauración:
cp -r /backup/* /var/lib/postgresql/data/
```

---

### Ejemplo típico de uso

**🔹 pg_dump**

- migraciones
- copias pequeñas
- export/import

**🔹 pg_basebackup**

- replicación
- backups completos
- recuperación (PITR)

#### Detalle importante

pg_dump → puedes copiar el fichero a cualquier sitio (USB, cloud…); pg_basebackup → mejor en un disco/servidor compatible con PostgreSQL

---

### 3. 📤 pg_backup_start()

```sql
SELECT pg_backup_start('backup');
SELECT pg_backup_stop();
SELECT pg_switch_wal();
```

Estas funciones NO hacen el backup, sino que preparan PostgreSQL para que TÚ puedas hacer una copia física consistente

Qué hace: marca el inicio de un backup físico, fuerza que todo esté consistente en el disco y empieza a registrar información especial en los WAL

Después hay que hacer la copia con **pg_basebackup**

---

### Escenarios de recuperación

#### PITR (Point-In-Time Recovery) = copia base + WAL

Restaurar la copia y aplicar el WAL hasta el momento deseado. 👉 No solo recuperas un backup, 👉 recuperas hasta un momento concreto

Para usar PITR hace falta: archive_mode = on y archive_command configurado

```bash
--  Preparar el WAL
mkdir -p /var/lib/postgresql/wal_archive
-- Edita postgresql.conf:
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f'
--Reinicia postgres
pg_ctl restart
```

```bash
--Ejemplo de PITR
-- Parar postgres
pg_ctl stop
-- Borra los datos actuales y restaura:
rm -rf /var/lib/postgresql/data/*
tar -xzf /backup/base/base.tar -C /var/lib/postgresql/data
-- Configurar la recuperación (PITR)
touch /var/lib/postgresql/data/recovery.signal
-- Edita postgresql.conf:
restore_command = 'cp /var/lib/postgresql/wal_archive/%f %p'
recovery_target_time = '2026-03-20 10:59:59'
--  Arrancar PostgreSQL
pg_ctl start
--  👉 PostgreSQL:
--    carga el backup
--    aplica el WAL
--    se detiene en el momento indicado
```

### Buenas prácticas de seguridad

- Programar backups regulares
- Mantener copias en ubicaciones externas
- Hacer pruebas periódicas de recuperación
- Documentar el procedimiento de recuperación

### Conclusión

Disponer de un plan de copias de seguridad fiable y efectivo es **fundamental para garantizar la seguridad y la continuidad** de cualquier sistema basado en PostgreSQL. Herramientas como pg_dump y pg_basebackup permiten adaptarse a múltiples escenarios, y una buena estrategia de backup debe ir acompañada de una política de recuperación clara.

---

<small>Adaptación al castellano de los materiales de [Enrique Iborra](https://enriqueiborra.github.io/ASGBD/) para el módulo ASGBD · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)</small>
